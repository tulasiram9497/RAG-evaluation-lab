import { Chunk, SearchResult } from './types.js';
import { cosineSimilarity, EMBEDDING_DIMENSION } from './embeddings.js';

export interface VectorRecord {
  id: string;
  vector: number[];
  chunk: Chunk;
  createdAt: string;
}

export interface VectorFilter {
  documentId?: string;
  category?: string;
  minTokenCount?: number;
  maxTokenCount?: number;
}

export class VectorStore {
  private collectionName: string;
  private records: Map<string, VectorRecord> = new Map();
  private dimension: number;

  constructor(collectionName: string = 'rag_documents', dimension: number = EMBEDDING_DIMENSION) {
    this.collectionName = collectionName;
    this.dimension = dimension;
  }

  public getCollectionName(): string {
    return this.collectionName;
  }

  public getCount(): number {
    return this.records.size;
  }

  public getDimension(): number {
    return this.dimension;
  }

  /**
   * Insert a chunk with its embedding
   */
  public insert(chunk: Chunk, vector: number[]): void {
    if (vector.length !== this.dimension) {
      throw new Error(`Vector dimension mismatch. Expected ${this.dimension}, got ${vector.length}`);
    }
    const record: VectorRecord = {
      id: chunk.id,
      vector,
      chunk: { ...chunk, embedding: vector },
      createdAt: new Date().toISOString(),
    };
    this.records.set(chunk.id, record);
  }

  /**
   * Batch insert chunks
   */
  public insertBatch(chunks: Chunk[], vectors: number[][]): void {
    if (chunks.length !== vectors.length) {
      throw new Error('Chunks count and vectors count must match');
    }
    for (let i = 0; i < chunks.length; i++) {
      this.insert(chunks[i], vectors[i]);
    }
  }

  /**
   * Search for nearest neighbors using cosine similarity
   */
  public search(
    queryVector: number[],
    topK: number = 10,
    threshold: number = 0.0,
    filter?: VectorFilter
  ): SearchResult[] {
    if (this.records.size === 0) return [];
    if (queryVector.length !== this.dimension) {
      throw new Error(`Query vector dimension mismatch. Expected ${this.dimension}, got ${queryVector.length}`);
    }

    const scored: { record: VectorRecord; sim: number }[] = [];

    for (const record of this.records.values()) {
      // Apply filters if provided
      if (filter) {
        if (filter.documentId && record.chunk.documentId !== filter.documentId) {
          continue;
        }
        if (filter.category && record.chunk.metadata?.category !== filter.category) {
          continue;
        }
        if (filter.minTokenCount && record.chunk.tokenCount < filter.minTokenCount) {
          continue;
        }
      }

      const sim = cosineSimilarity(queryVector, record.vector);
      if (sim >= threshold) {
        scored.push({ record, sim });
      }
    }

    // Sort descending by similarity
    scored.sort((a, b) => b.sim - a.sim);

    return scored.slice(0, topK).map((item, index) => ({
      chunk: item.record.chunk,
      score: Number(item.sim.toFixed(4)),
      vectorScore: Number(item.sim.toFixed(4)),
      rank: index + 1,
    }));
  }

  /**
   * Delete all chunks for a given document
   */
  public deleteByDocumentId(documentId: string): number {
    let deletedCount = 0;
    for (const [id, record] of this.records.entries()) {
      if (record.chunk.documentId === documentId) {
        this.records.delete(id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  /**
   * Clear the entire collection
   */
  public clear(): void {
    this.records.clear();
  }

  /**
   * Get all stored chunks
   */
  public getAllChunks(): Chunk[] {
    return Array.from(this.records.values()).map(r => r.chunk);
  }

  /**
   * Get stats
   */
  public getStats() {
    return {
      collection: this.collectionName,
      vectorCount: this.records.size,
      dimension: this.dimension,
      storageType: 'Qdrant-compatible In-Memory & Serialized Vector Engine',
    };
  }
}
