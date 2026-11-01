import { EvaluationQuestion, EvaluationRun, QueryResponse, RetrievalStrategy, SearchResult, SingleEvaluationScore } from './types.js';
import { RetrievalEngine } from './retrieval.js';
import { GenerationEngine } from './generation.js';
import { tokenize } from './bm25.js';

/**
 * Calculates Precision@K: Fraction of top-K retrieved chunks from relevant documents
 */
export function calculatePrecisionAtK(retrievedChunks: SearchResult[], relevantDocIds: string[]): number {
  if (retrievedChunks.length === 0) return relevantDocIds.length === 0 ? 1.0 : 0.0;
  if (relevantDocIds.length === 0) return 0.0;

  const relevantSet = new Set(relevantDocIds);
  let relevantCount = 0;

  for (const item of retrievedChunks) {
    if (relevantSet.has(item.chunk.documentId)) {
      relevantCount++;
    }
  }

  return Number((relevantCount / retrievedChunks.length).toFixed(4));
}

/**
 * Calculates Recall@K: Fraction of relevant documents retrieved in top-K
 */
export function calculateRecallAtK(retrievedChunks: SearchResult[], relevantDocIds: string[]): number {
  if (relevantDocIds.length === 0) return 1.0;
  if (retrievedChunks.length === 0) return 0.0;

  const relevantSet = new Set(relevantDocIds);
  const foundDocs = new Set<string>();

  for (const item of retrievedChunks) {
    if (relevantSet.has(item.chunk.documentId)) {
      foundDocs.add(item.chunk.documentId);
    }
  }

  return Number((foundDocs.size / relevantSet.size).toFixed(4));
}

/**
 * Calculates Reciprocal Rank (RR): 1 / rank of first relevant item
 */
export function calculateMRR(retrievedChunks: SearchResult[], relevantDocIds: string[]): number {
  if (relevantDocIds.length === 0) return 1.0;
  const relevantSet = new Set(relevantDocIds);

  for (let i = 0; i < retrievedChunks.length; i++) {
    if (relevantSet.has(retrievedChunks[i].chunk.documentId)) {
      return Number((1 / (i + 1)).toFixed(4));
    }
  }

  return 0.0;
}

/**
 * Calculates Normalized Discounted Cumulative Gain (NDCG@K)
 */
export function calculateNDCGAtK(retrievedChunks: SearchResult[], relevantDocIds: string[]): number {
  if (relevantDocIds.length === 0) return 1.0;
  if (retrievedChunks.length === 0) return 0.0;

  const relevantSet = new Set(relevantDocIds);
  let dcg = 0;

  for (let i = 0; i < retrievedChunks.length; i++) {
    const isRel = relevantSet.has(retrievedChunks[i].chunk.documentId) ? 1 : 0;
    dcg += isRel / Math.log2(i + 2); // i=0 => log2(2) = 1
  }

  // Calculate ideal DCG (all relevant items ranked at top)
  let idcg = 0;
  const idealCount = Math.min(retrievedChunks.length, relevantDocIds.length);
  for (let i = 0; i < idealCount; i++) {
    idcg += 1 / Math.log2(i + 2);
  }

  if (idcg === 0) return 0.0;
  return Number((dcg / idcg).toFixed(4));
}

/**
 * Calculates Context Precision: Evaluates whether relevant chunks are ranked at the top
 */
export function calculateContextPrecision(retrievedChunks: SearchResult[], relevantDocIds: string[]): number {
  if (relevantDocIds.length === 0) return 1.0;
  if (retrievedChunks.length === 0) return 0.0;

  const relevantSet = new Set(relevantDocIds);
  let cumulativeRelevant = 0;
  let precisionSum = 0;

  for (let i = 0; i < retrievedChunks.length; i++) {
    if (relevantSet.has(retrievedChunks[i].chunk.documentId)) {
      cumulativeRelevant++;
      precisionSum += cumulativeRelevant / (i + 1);
    }
  }

  if (cumulativeRelevant === 0) return 0.0;
  return Number((precisionSum / cumulativeRelevant).toFixed(4));
}

/**
 * Calculates Context Recall: Measures coverage of reference answer key facts in retrieved context
 */
export function calculateContextRecall(retrievedChunks: SearchResult[], question: EvaluationQuestion): number {
  if (question.category === 'unanswerable') {
    return 1.0;
  }
  if (retrievedChunks.length === 0) return 0.0;

  const allContext = retrievedChunks.map(c => c.chunk.text.toLowerCase()).join(' ');
  const refTokens = tokenize(question.referenceAnswer.toLowerCase());

  if (refTokens.length === 0) return 1.0;

  let matched = 0;
  for (const token of refTokens) {
    if (allContext.includes(token)) {
      matched++;
    }
  }

  return Number((matched / refTokens.length).toFixed(4));
}

/**
 * Calculates Faithfulness: Percentage of claims in generated answer that can be inferred from context
 */
export function calculateFaithfulness(
  response: QueryResponse,
  retrievedChunks: SearchResult[],
  question: EvaluationQuestion
): number {
  // If question is unanswerable and system answered that it cannot be answered without hallucinating
  if (question.category === 'unanswerable') {
    if (!response.hasSufficientEvidence || response.answer.toLowerCase().includes('cannot answer') || response.answer.toLowerCase().includes('insufficient evidence')) {
      return 1.0; // Perfect faithfulness: accurately refused to hallucinate
    }
    return 0.0; // Hallucinated on unanswerable question
  }

  if (retrievedChunks.length === 0) {
    return response.hasSufficientEvidence ? 0.0 : 1.0;
  }

  const allContext = retrievedChunks.map(c => c.chunk.text.toLowerCase()).join(' ');
  const answerSentences = response.answer
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (answerSentences.length === 0) return 1.0;

  let supportedClaims = 0;
  for (const sent of answerSentences) {
    const sentTokens = tokenize(sent.toLowerCase());
    if (sentTokens.length === 0) continue;

    let matchCount = 0;
    for (const t of sentTokens) {
      if (allContext.includes(t)) matchCount++;
    }

    // If at least 70% of informative tokens appear in context, claim is considered faithful
    if (matchCount / sentTokens.length >= 0.7) {
      supportedClaims++;
    }
  }

  return Number((supportedClaims / answerSentences.length).toFixed(4));
}

/**
 * Calculates Answer Relevancy: Checks if generated answer addresses the question directly
 */
export function calculateAnswerRelevancy(response: QueryResponse, question: EvaluationQuestion): number {
  if (question.category === 'unanswerable') {
    if (!response.hasSufficientEvidence || response.answer.toLowerCase().includes('insufficient evidence') || response.answer.toLowerCase().includes('cannot answer')) {
      return 1.0;
    }
    return 0.2;
  }

  const qTokens = tokenize(question.question.toLowerCase());
  const aTokens = tokenize(response.answer.toLowerCase());

  if (qTokens.length === 0 || aTokens.length === 0) return 0.0;

  const aSet = new Set(aTokens);
  let overlap = 0;
  for (const q of qTokens) {
    if (aSet.has(q)) overlap++;
  }

  const lexicalAlignment = overlap / qTokens.length;
  // Answer length penalty if answer is either 1 word or an enormous monologue
  const lengthFactor = response.answer.length > 25 && response.answer.length < 1200 ? 1.0 : 0.7;

  return Number(Math.min(1.0, (0.7 * lexicalAlignment + 0.3) * lengthFactor).toFixed(4));
}

export class EvaluationEngine {
  private retrievalEngine: RetrievalEngine;
  private generationEngine: GenerationEngine;

  constructor(retrievalEngine: RetrievalEngine, generationEngine: GenerationEngine) {
    this.retrievalEngine = retrievalEngine;
    this.generationEngine = generationEngine;
  }

  /**
   * Run benchmark evaluation on questions
   */
  public async runEvaluation(
    dataset: EvaluationQuestion[],
    options: {
      strategy?: RetrievalStrategy;
      topK?: number;
      model?: string;
      name?: string;
      limit?: number;
    } = {}
  ): Promise<EvaluationRun> {
    const strategy = options.strategy || 'hybrid_rerank';
    const topK = options.topK || 5;
    const model = options.model || 'gemini-3.8-flash';
    const name = options.name || `Evaluation Run - ${strategy} (TopK=${topK})`;
    const questionsToRun = options.limit ? dataset.slice(0, options.limit) : dataset;

    const scores: SingleEvaluationScore[] = [];

    for (const q of questionsToRun) {
      const qStart = Date.now();

      // 1. Retrieve
      const rStart = Date.now();
      const retrieved = await this.retrievalEngine.retrieve(q.question, {
        strategy,
        topK,
      });
      const rLatency = Date.now() - rStart;

      // 2. Generate
      const generated = await this.generationEngine.generateAnswer(
        q.question,
        retrieved,
        rLatency,
        strategy,
        { model }
      );
      const totalLatency = Date.now() - qStart;

      // 3. Compute Metrics
      const pAtK = calculatePrecisionAtK(retrieved, q.relevantDocIds);
      const rAtK = calculateRecallAtK(retrieved, q.relevantDocIds);
      const mrr = calculateMRR(retrieved, q.relevantDocIds);
      const ndcg = calculateNDCGAtK(retrieved, q.relevantDocIds);
      const cPrecision = calculateContextPrecision(retrieved, q.relevantDocIds);
      const cRecall = calculateContextRecall(retrieved, q);
      const faithfulness = calculateFaithfulness(generated, retrieved, q);
      const answerRelevancy = calculateAnswerRelevancy(generated, q);

      // Determine pass/fail based on production criteria
      const isUnanswerable = q.category === 'unanswerable';
      const passed = isUnanswerable
        ? faithfulness >= 0.8 && !generated.hasSufficientEvidence
        : faithfulness >= 0.7 && answerRelevancy >= 0.6 && cRecall >= 0.5;

      scores.push({
        questionId: q.id,
        category: q.category,
        question: q.question,
        generatedAnswer: generated.answer,
        referenceAnswer: q.referenceAnswer,
        faithfulness,
        answerRelevancy,
        contextPrecision: cPrecision,
        contextRecall: cRecall,
        precisionAtK: pAtK,
        recallAtK: rAtK,
        mrr,
        ndcgAtK: ndcg,
        hasSufficientEvidence: generated.hasSufficientEvidence,
        retrievedChunkCount: retrieved.length,
        citationsCount: generated.citations.length,
        latencyMs: totalLatency,
        passed,
      });
    }

    // Compute aggregates
    const n = scores.length || 1;
    const agg = {
      faithfulness: Number((scores.reduce((acc, s) => acc + s.faithfulness, 0) / n).toFixed(4)),
      answerRelevancy: Number((scores.reduce((acc, s) => acc + s.answerRelevancy, 0) / n).toFixed(4)),
      contextPrecision: Number((scores.reduce((acc, s) => acc + s.contextPrecision, 0) / n).toFixed(4)),
      contextRecall: Number((scores.reduce((acc, s) => acc + s.contextRecall, 0) / n).toFixed(4)),
      precisionAtK: Number((scores.reduce((acc, s) => acc + s.precisionAtK, 0) / n).toFixed(4)),
      recallAtK: Number((scores.reduce((acc, s) => acc + s.recallAtK, 0) / n).toFixed(4)),
      mrr: Number((scores.reduce((acc, s) => acc + s.mrr, 0) / n).toFixed(4)),
      ndcgAtK: Number((scores.reduce((acc, s) => acc + s.ndcgAtK, 0) / n).toFixed(4)),
      averageLatencyMs: Math.round(scores.reduce((acc, s) => acc + s.latencyMs, 0) / n),
      passRate: Number((scores.filter(s => s.passed).length / n).toFixed(4)),
    };

    return {
      id: `eval_${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      strategy,
      topK,
      model,
      totalQuestions: scores.length,
      aggregateScores: agg,
      results: scores,
    };
  }
}
