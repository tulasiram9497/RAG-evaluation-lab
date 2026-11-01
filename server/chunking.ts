import { Chunk, ChunkingStrategy } from './types.js';

export interface ChunkingOptions {
  strategy?: ChunkingStrategy;
  chunkSize?: number; // estimated tokens (1 token ≈ 4 chars)
  chunkOverlap?: number; // estimated tokens
  charsPerToken?: number;
}

const DEFAULT_CHARS_PER_TOKEN = 4;

/**
 * Estimate token count from text using standard whitespace and punctuation heuristic (~4 chars/token).
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Fast and stable token estimator
  const words = text.trim().split(/\s+/).filter(Boolean);
  const charBased = Math.ceil(text.length / DEFAULT_CHARS_PER_TOKEN);
  const wordBased = Math.ceil(words.length * 1.3);
  return Math.max(1, Math.round((charBased + wordBased) / 2));
}

/**
 * Clean extracted text from raw files
 */
export function cleanText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\t\f\v]/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Fixed-size chunking with exact character windows
 */
export function fixedSizeChunking(
  text: string,
  chunkTokenSize: number = 250,
  charsPerToken: number = DEFAULT_CHARS_PER_TOKEN
): string[] {
  const charLimit = Math.max(50, chunkTokenSize * charsPerToken);
  const chunks: string[] = [];
  let index = 0;

  while (index < text.length) {
    const slice = text.slice(index, index + charLimit).trim();
    if (slice.length > 0) {
      chunks.push(slice);
    }
    index += charLimit;
  }

  return chunks;
}

/**
 * Overlapping chunking with stride
 */
export function overlappingChunking(
  text: string,
  chunkTokenSize: number = 250,
  overlapTokenSize: number = 50,
  charsPerToken: number = DEFAULT_CHARS_PER_TOKEN
): string[] {
  const charLimit = Math.max(50, chunkTokenSize * charsPerToken);
  const overlapChars = Math.min(charLimit - 20, Math.max(0, overlapTokenSize * charsPerToken));
  const step = Math.max(20, charLimit - overlapChars);
  const chunks: string[] = [];
  let index = 0;

  while (index < text.length) {
    const slice = text.slice(index, index + charLimit).trim();
    if (slice.length > 0) {
      chunks.push(slice);
    }
    index += step;
    if (index >= text.length && chunks.length > 0) {
      break;
    }
  }

  return chunks;
}

/**
 * Recursive chunking: attempts to split on structural boundaries
 * 1. Double newlines (paragraphs)
 * 2. Single newlines (lines / lists)
 * 3. Sentence boundaries (. ! ?)
 * 4. Word boundaries (spaces)
 */
export function recursiveChunking(
  text: string,
  targetTokenSize: number = 250,
  overlapTokenSize: number = 50,
  charsPerToken: number = DEFAULT_CHARS_PER_TOKEN
): string[] {
  const maxChars = Math.max(50, targetTokenSize * charsPerToken);
  const overlapChars = Math.min(maxChars - 20, Math.max(0, overlapTokenSize * charsPerToken));

  const splitSeparators = ['\n\n', '\n', '. ', '? ', '! ', '; ', ', ', ' '];

  function splitRecursively(content: string, separatorIndex: number): string[] {
    if (content.length <= maxChars) {
      return [content.trim()];
    }

    if (separatorIndex >= splitSeparators.length) {
      // Hard split fallback
      const hardChunks: string[] = [];
      for (let i = 0; i < content.length; i += maxChars) {
        hardChunks.push(content.slice(i, i + maxChars).trim());
      }
      return hardChunks.filter(Boolean);
    }

    const sep = splitSeparators[separatorIndex];
    const rawParts = content.split(sep);
    const combined: string[] = [];
    let current = '';

    for (const part of rawParts) {
      const piece = current ? current + sep + part : part;
      if (piece.length <= maxChars) {
        current = piece;
      } else {
        if (current) {
          combined.push(current.trim());
        }
        if (part.length > maxChars) {
          const subParts = splitRecursively(part, separatorIndex + 1);
          combined.push(...subParts);
          current = '';
        } else {
          current = part;
        }
      }
    }

    if (current) {
      combined.push(current.trim());
    }

    return combined.filter(Boolean);
  }

  const baseChunks = splitRecursively(text, 0);

  // Apply overlap if requested
  if (overlapChars <= 0 || baseChunks.length <= 1) {
    return baseChunks;
  }

  const chunksWithOverlap: string[] = [];
  for (let i = 0; i < baseChunks.length; i++) {
    let chunk = baseChunks[i];
    if (i > 0 && overlapChars > 0) {
      const prevChunk = baseChunks[i - 1];
      const overlapText = prevChunk.slice(-overlapChars).trim();
      if (overlapText && !chunk.startsWith(overlapText)) {
        chunk = `${overlapText} [...] ${chunk}`;
      }
    }
    chunksWithOverlap.push(chunk);
  }

  return chunksWithOverlap;
}

/**
 * Semantic chunking: detects semantic sections, Markdown headers, or topic breaks
 */
export function semanticChunking(
  text: string,
  targetTokenSize: number = 250,
  charsPerToken: number = DEFAULT_CHARS_PER_TOKEN
): string[] {
  const maxChars = Math.max(100, targetTokenSize * charsPerToken);
  
  // Split on markdown headers (#, ##, ###), bold sections, or double-line breaks
  const sectionPattern = /(?=^#{1,4}\s+)|(?=\n#{1,4}\s+)|(?=\n[A-Z0-9\s_-]{3,30}:)|(?=\n\d+\.\s+[A-Z])/m;
  const sections = text.split(sectionPattern).map(s => s.trim()).filter(Boolean);

  const chunks: string[] = [];

  for (const section of sections) {
    if (section.length <= maxChars) {
      chunks.push(section);
    } else {
      // Defer to recursive chunker for long semantic sections
      const subChunks = recursiveChunking(section, targetTokenSize, 30, charsPerToken);
      chunks.push(...subChunks);
    }
  }

  return chunks;
}

/**
 * Main chunking dispatcher
 */
export function chunkDocument(
  documentId: string,
  documentName: string,
  text: string,
  options: ChunkingOptions = {}
): Chunk[] {
  const strategy = options.strategy || 'recursive';
  const chunkSize = options.chunkSize || 250;
  const chunkOverlap = options.chunkOverlap !== undefined ? options.chunkOverlap : 50;

  const cleaned = cleanText(text);
  let textChunks: string[] = [];

  switch (strategy) {
    case 'fixed':
      textChunks = fixedSizeChunking(cleaned, chunkSize);
      break;
    case 'overlapping':
      textChunks = overlappingChunking(cleaned, chunkSize, chunkOverlap);
      break;
    case 'semantic':
      textChunks = semanticChunking(cleaned, chunkSize);
      break;
    case 'recursive':
    default:
      textChunks = recursiveChunking(cleaned, chunkSize, chunkOverlap);
      break;
  }

  return textChunks.map((chunkText, idx) => {
    // Extract heading if chunk starts with one
    const headingMatch = chunkText.match(/^(?:#{1,4}\s+)?([^\n]+)/);
    const sectionHeading = headingMatch ? headingMatch[1].slice(0, 80).trim() : undefined;
    
    // Estimate page number roughly if long document (approx 500 tokens per page)
    const pageNumber = Math.max(1, Math.floor((idx * chunkSize) / 500) + 1);

    return {
      id: `${documentId}_chunk_${idx}`,
      documentId,
      documentName,
      chunkIndex: idx,
      text: chunkText,
      tokenCount: estimateTokenCount(chunkText),
      pageNumber,
      sectionHeading,
      metadata: {
        strategy,
        charLength: chunkText.length,
        tokenCount: estimateTokenCount(chunkText),
        pageNumber,
      },
    };
  });
}
