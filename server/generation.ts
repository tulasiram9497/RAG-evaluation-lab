import { GoogleGenAI } from '@google/genai';
import { Citation, QueryResponse, RetrievalStrategy, SearchResult } from './types.js';
import { estimateTokenCount } from './chunking.js';

export interface GenerationConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export const DEFAULT_GENERATION_MODEL = 'gemini-3.8-flash';

// Gemini 3.8 Flash approximate pricing: $0.075 / 1M input, $0.30 / 1M output
const COST_PER_INPUT_TOKEN = 0.075 / 1_000_000;
const COST_PER_OUTPUT_TOKEN = 0.30 / 1_000_000;

export class GenerationEngine {
  private client: GoogleGenAI | null = null;
  private hasApiKey: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
      try {
        this.client = new GoogleGenAI();
        this.hasApiKey = true;
      } catch (err) {
        console.warn('GoogleGenAI generation init failed:', err);
      }
    }
  }

  public isUsingRealApi(): boolean {
    return this.hasApiKey && this.client !== null;
  }

  /**
   * Assemble context from retrieved chunks with token budgeting
   */
  public assembleContext(chunks: SearchResult[], maxTokenBudget: number = 3000): { contextText: string; usedChunks: SearchResult[] } {
    let accumulatedTokens = 0;
    const usedChunks: SearchResult[] = [];
    const contextLines: string[] = [];

    for (const item of chunks) {
      const chunkTokens = item.chunk.tokenCount || estimateTokenCount(item.chunk.text);
      if (accumulatedTokens + chunkTokens > maxTokenBudget && usedChunks.length > 0) {
        break;
      }

      usedChunks.push(item);
      accumulatedTokens += chunkTokens;
      contextLines.push(
        `[Source ID: ${item.chunk.id} | Document: ${item.chunk.documentName} | Score: ${item.score.toFixed(3)}]\n${item.chunk.text}\n`
      );
    }

    return {
      contextText: contextLines.join('\n---\n'),
      usedChunks,
    };
  }

  /**
   * Deterministic evidence-backed synthesis for test/offline environments
   */
  public synthesizeLocalResponse(
    query: string,
    chunks: SearchResult[],
    retrievalLatencyMs: number,
    strategy: RetrievalStrategy
  ): QueryResponse {
    const startTime = Date.now();
    const cleanQ = query.toLowerCase().trim();

    // Check if we have any valid chunks
    if (chunks.length === 0 || (chunks.length === 1 && chunks[0].score < 0.15)) {
      const latency = Date.now() - startTime;
      return {
        id: `query_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        query,
        answer: 'I cannot answer this question based on the provided documents. The retrieved context does not contain sufficient evidence to answer accurately.',
        citations: [],
        retrievedChunks: chunks,
        hasSufficientEvidence: false,
        strategy,
        metrics: {
          retrievalLatencyMs,
          generationLatencyMs: latency,
          totalLatencyMs: retrievalLatencyMs + latency,
          inputTokens: estimateTokenCount(query),
          outputTokens: 35,
          estimatedCostUsd: 0.00001,
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Identify which chunks directly support the query
    const supportedCitations: Citation[] = [];
    const answerPoints: string[] = [];
    const matchedSentences: string[] = [];

    for (const res of chunks) {
      const text = res.chunk.text;
      const sentences = text.split(/(?<=[.?!])\s+/);
      const queryWords = cleanQ.split(/\s+/).filter(w => w.length > 3);

      for (const sent of sentences) {
        const sentLower = sent.toLowerCase();
        let matchCount = 0;
        for (const w of queryWords) {
          if (sentLower.includes(w)) matchCount++;
        }
        if (matchCount > 0 && sent.length > 20) {
          matchedSentences.push(sent.trim());
          supportedCitations.push({
            chunkId: res.chunk.id,
            documentName: res.chunk.documentName,
            chunkIndex: res.chunk.chunkIndex,
            snippet: sent.trim().slice(0, 180),
            score: res.score,
          });
        }
      }
    }

    const hasSufficientEvidence = supportedCitations.length > 0;
    let answerText = '';

    if (!hasSufficientEvidence) {
      answerText = 'The uploaded documents discuss related topics, but do not contain explicit evidence to definitively address this question. To avoid hallucinations, no speculative conclusions are drawn.';
    } else {
      const uniquePoints = Array.from(new Set(matchedSentences)).slice(0, 4);
      answerText = `Based on the retrieved documentation from ${chunks[0].chunk.documentName}, ${uniquePoints.join(' ')}`;
    }

    const genLatency = Date.now() - startTime + 12;
    const inputToks = estimateTokenCount(query + chunks.map(c => c.chunk.text).join(' '));
    const outputToks = estimateTokenCount(answerText);

    return {
      id: `query_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      query,
      answer: answerText,
      citations: supportedCitations.slice(0, 5),
      retrievedChunks: chunks,
      hasSufficientEvidence,
      strategy,
      metrics: {
        retrievalLatencyMs,
        generationLatencyMs: genLatency,
        totalLatencyMs: retrievalLatencyMs + genLatency,
        inputTokens: inputToks,
        outputTokens: outputToks,
        estimatedCostUsd: Number((inputToks * COST_PER_INPUT_TOKEN + outputToks * COST_PER_OUTPUT_TOKEN).toFixed(6)),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate answer using Gemini with strict citation mapping and evidence bounds
   */
  public async generateAnswer(
    query: string,
    chunks: SearchResult[],
    retrievalLatencyMs: number,
    strategy: RetrievalStrategy,
    config: GenerationConfig = {}
  ): Promise<QueryResponse> {
    const startTime = Date.now();
    const modelName = config.model || DEFAULT_GENERATION_MODEL;

    // Fall back to local synthesis if no API key or empty chunks
    if (!this.isUsingRealApi() || !this.client) {
      return this.synthesizeLocalResponse(query, chunks, retrievalLatencyMs, strategy);
    }

    const { contextText, usedChunks } = this.assembleContext(chunks);

    const systemInstruction = config.systemPrompt || `
You are the Generation Engine of a production-grade RAG Evaluation Lab.
Your task is to answer the user query STRICTLY based on the provided retrieved passages.

CRITICAL RULES:
1. Ground every claim directly in the provided passages. Do not invent facts, citations, or external assumptions.
2. If the context does not contain sufficient information to answer the question, state clearly: "I cannot answer this question based on the provided documents as there is insufficient evidence." Set hasSufficientEvidence to false.
3. Every cited claim must reference the exact Source ID from the context.
4. Output MUST be valid JSON adhering to this schema:
{
  "answer": "string",
  "hasSufficientEvidence": boolean,
  "citations": [
    {
      "chunkId": "string (matching Source ID)",
      "documentName": "string",
      "snippet": "exact supporting sentence from context",
      "score": number
    }
  ]
}
`;

    const userPrompt = `
RETRIEVED CONTEXT:
${contextText}

USER QUESTION:
${query}

Respond in strictly valid JSON:
`;

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Generation timeout after 7000ms')), 7000)
      );
      const response = await Promise.race([
        this.client.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: config.temperature ?? 0.1,
          },
        }),
        timeoutPromise,
      ]);

      const genLatency = Date.now() - startTime;
      const responseText = response.text || '{}';
      
      let parsed: {
        answer?: string;
        hasSufficientEvidence?: boolean;
        citations?: Array<{ chunkId: string; documentName: string; snippet: string; score?: number }>;
      } = {};

      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        parsed = {
          answer: responseText,
          hasSufficientEvidence: true,
          citations: [],
        };
      }

      // Format and validate citations
      const citations: Citation[] = (parsed.citations || []).map(c => {
        const matchingChunk = usedChunks.find(u => u.chunk.id === c.chunkId);
        return {
          chunkId: c.chunkId || (matchingChunk ? matchingChunk.chunk.id : 'unknown'),
          documentName: c.documentName || (matchingChunk ? matchingChunk.chunk.documentName : 'document'),
          chunkIndex: matchingChunk ? matchingChunk.chunk.chunkIndex : 0,
          snippet: c.snippet || '',
          score: c.score ?? (matchingChunk ? matchingChunk.score : 0.8),
        };
      });

      const inputTokens = estimateTokenCount(systemInstruction + userPrompt);
      const outputTokens = estimateTokenCount(responseText);
      const cost = inputTokens * COST_PER_INPUT_TOKEN + outputTokens * COST_PER_OUTPUT_TOKEN;

      return {
        id: `query_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        query,
        answer: parsed.answer || 'No answer generated.',
        citations,
        retrievedChunks: usedChunks,
        hasSufficientEvidence: parsed.hasSufficientEvidence ?? (citations.length > 0),
        strategy,
        metrics: {
          retrievalLatencyMs,
          generationLatencyMs: genLatency,
          totalLatencyMs: retrievalLatencyMs + genLatency,
          inputTokens,
          outputTokens,
          estimatedCostUsd: Number(cost.toFixed(6)),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('Gemini API generation failed, using local synthesis:', (error as Error).message);
      return this.synthesizeLocalResponse(query, chunks, retrievalLatencyMs, strategy);
    }
  }
}
