import test from 'node:test';
import assert from 'node:assert/strict';
import { fixedSizeChunking, overlappingChunking, recursiveChunking, semanticChunking, cleanText, estimateTokenCount } from './chunking.js';
import { BM25Index, tokenize } from './bm25.js';
import { cosineSimilarity, generateLocalEmbedding } from './embeddings.js';
import { VectorStore } from './vectorStore.js';
import { RetrievalEngine } from './retrieval.js';
import { calculatePrecisionAtK, calculateRecallAtK, calculateMRR, calculateNDCGAtK, calculateContextPrecision } from './evaluationEngine.js';
import { Chunk } from './types.js';

test('Text cleaning and token estimation', () => {
  const dirty = '  This is a   test\r\n\r\nwith multiple   spaces and \ttabs.\n\n\n\nEnd.  ';
  const cleaned = cleanText(dirty);
  assert.ok(!cleaned.includes('\t'));
  assert.ok(!cleaned.includes('   '));
  assert.ok(!cleaned.includes('\r'));
  assert.equal(cleaned.endsWith('End.'), true);

  const tokens = estimateTokenCount('This is a simple sentence with eight words.');
  assert.ok(tokens >= 6 && tokens <= 12);
});

test('Chunking strategies produce non-empty valid chunks', () => {
  const sampleText = `# Header 1
This is the first paragraph with important context. It has multiple sentences to test chunking logic.

## Section 2
This is the second section discussing distributed vector databases and indexing strategies.
Hierarchical Navigable Small World graphs enable fast search.

### Section 3
Conclusions and final remarks regarding RAG evaluation.`;

  // 1. Fixed chunking
  const fixed = fixedSizeChunking(sampleText, 20);
  assert.ok(fixed.length >= 2);

  // 2. Overlapping chunking
  const overlapping = overlappingChunking(sampleText, 25, 10);
  assert.ok(overlapping.length >= 2);

  // 3. Recursive chunking
  const recursive = recursiveChunking(sampleText, 30, 10);
  assert.ok(recursive.length >= 2);

  // 4. Semantic chunking
  const semantic = semanticChunking(sampleText, 30);
  assert.ok(semantic.length >= 2);
  assert.ok(semantic[0].includes('Header 1'));
});

test('BM25 indexing and search', () => {
  const bm25 = new BM25Index();
  const chunks: Chunk[] = [
    {
      id: 'c1',
      documentId: 'd1',
      documentName: 'doc1.md',
      chunkIndex: 0,
      text: 'Reciprocal Rank Fusion RRF fuses dense vector search and BM25 keywords.',
      tokenCount: 12,
      metadata: {},
    },
    {
      id: 'c2',
      documentId: 'd2',
      documentName: 'doc2.md',
      chunkIndex: 0,
      text: 'Qdrant vector database is implemented in Rust with HNSW indexing.',
      tokenCount: 10,
      metadata: {},
    },
    {
      id: 'c3',
      documentId: 'd3',
      documentName: 'doc3.md',
      chunkIndex: 0,
      text: 'HIPAA Safe Harbor mandates removal of 18 specific identifiers.',
      tokenCount: 9,
      metadata: {},
    },
  ];

  bm25.build(chunks);
  const stats = bm25.getStats();
  assert.equal(stats.indexedChunks, 3);
  assert.ok(stats.uniqueTerms > 5);

  const searchQdrant = bm25.search('Qdrant Rust', 2);
  assert.ok(searchQdrant.length > 0);
  assert.equal(searchQdrant[0].chunk.id, 'c2');

  const searchHipaa = bm25.search('HIPAA 18 identifiers', 2);
  assert.ok(searchHipaa.length > 0);
  assert.equal(searchHipaa[0].chunk.id, 'c3');
});

test('Embedding generation and Cosine Similarity', () => {
  const textA = 'Artificial intelligence and neural network architecture';
  const textB = 'Artificial intelligence and deep learning networks';
  const textC = 'Sourdough bread recipe with sourdough starter';

  const vecA = generateLocalEmbedding(textA, 768);
  const vecB = generateLocalEmbedding(textB, 768);
  const vecC = generateLocalEmbedding(textC, 768);

  assert.equal(vecA.length, 768);
  assert.equal(vecB.length, 768);

  const simAB = cosineSimilarity(vecA, vecB);
  const simAC = cosineSimilarity(vecA, vecC);

  assert.ok(simAB > simAC, `Semantic similarity between AI texts (${simAB}) should exceed AI vs Bread (${simAC})`);
  assert.ok(simAB <= 1.0);
  assert.ok(simAB >= 0.0);
});

test('VectorStore operations: insert, search, filter, delete', () => {
  const store = new VectorStore('test_coll', 768);
  const chunk1: Chunk = {
    id: 'c1',
    documentId: 'doc_alpha',
    documentName: 'alpha.txt',
    chunkIndex: 0,
    text: 'Alpha document text',
    tokenCount: 5,
    metadata: { category: 'Tech' },
  };
  const chunk2: Chunk = {
    id: 'c2',
    documentId: 'doc_beta',
    documentName: 'beta.txt',
    chunkIndex: 0,
    text: 'Beta document text',
    tokenCount: 5,
    metadata: { category: 'Finance' },
  };

  const vec1 = generateLocalEmbedding(chunk1.text, 768);
  const vec2 = generateLocalEmbedding(chunk2.text, 768);

  store.insert(chunk1, vec1);
  store.insert(chunk2, vec2);
  assert.equal(store.getCount(), 2);

  // Search
  const results = store.search(vec1, 2);
  assert.equal(results.length, 2);
  assert.equal(results[0].chunk.id, 'c1');

  // Filter
  const filtered = store.search(vec1, 2, 0.0, { documentId: 'doc_beta' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].chunk.id, 'c2');

  // Delete
  const deleted = store.deleteByDocumentId('doc_alpha');
  assert.equal(deleted, 1);
  assert.equal(store.getCount(), 1);
});

test('Evaluation metrics math: Precision@K, Recall@K, MRR, NDCG', () => {
  const dummyResults = [
    { chunk: { documentId: 'doc_A' } as any, score: 0.9, rank: 1 },
    { chunk: { documentId: 'doc_B' } as any, score: 0.8, rank: 2 },
    { chunk: { documentId: 'doc_C' } as any, score: 0.7, rank: 3 },
  ];

  const relevant = ['doc_A', 'doc_D'];

  const pAt3 = calculatePrecisionAtK(dummyResults, relevant);
  assert.equal(pAt3, 0.3333); // 1 out of 3

  const rAt3 = calculateRecallAtK(dummyResults, relevant);
  assert.equal(rAt3, 0.5); // 1 out of 2 found

  const mrr = calculateMRR(dummyResults, relevant);
  assert.equal(mrr, 1.0); // doc_A is rank 1 => 1/1 = 1.0

  const ndcg = calculateNDCGAtK(dummyResults, relevant);
  assert.ok(ndcg > 0.5 && ndcg <= 1.0);

  const cPrec = calculateContextPrecision(dummyResults, relevant);
  assert.ok(cPrec > 0.5);
});
