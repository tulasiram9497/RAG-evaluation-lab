# RAG Evaluation Lab

A production-grade Retrieval-Augmented Generation (RAG) platform with multi-strategy retrieval, automated evaluation on 50+ benchmark questions, experiment tracking, and real-time observability.

---

## 1. Project Overview & Problem Statement

Traditional Large Language Models (LLMs) suffer from hallucinations, knowledge cutoff dates, and an inability to cite factual provenance. Retrieval-Augmented Generation (RAG) addresses these vulnerabilities by fetching external evidence passages and grounding generation in verified sources.

However, moving from a proof-of-concept RAG demo to an enterprise-grade production pipeline requires rigorous AI engineering:
1. **Retrieval Blindspots**: Dense vector search alone struggles with exact alphanumeric identifiers, serial codes, and medical abbreviations.
2. **Hallucination Risks**: LLMs frequently extrapolate when evidence is missing.
3. **Evaluation Deficits**: Relying on subjective vibes or surface n-gram metrics (BLEU/ROUGE) fails to capture factual faithfulness and context recall.
4. **Cost & Latency Bloat**: Unconstrained Top-K passages inflate prompt token costs and breach production P95 latency Service Level Objectives (SLOs).

**RAG Evaluation Lab** solves these challenges by combining multi-strategy retrieval (Dense Vector, BM25 Keyword, Hybrid RRF, and Cross-Encoder Reranking), automated evaluation on a 50-question benchmark dataset across 5 distinct categories, experiment tracking, and real-time observability.

---

## 2. High-Level Architecture

```
[Raw Documents (PDF, DOCX, MD, TXT)]
                  │
                  ▼
         [Text Cleaning & NER]
                  │
                  ▼
  [Chunking Engine: Recursive / Semantic / Overlapping / Fixed]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [Embedding Engine]   [BM25 Inverted Index]
 (768-dim normalized) (k1=1.5, b=0.75)
        │                   │
        ▼                   │
 [Qdrant Vector Store]      │
 (HNSW Graph Cosine)        │
        │                   │
        └─────────┬─────────┘
                  ▼
       [Query Ingestion]
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
[Vector Search] [BM25 Search] [Hybrid RRF Fusion (k=60)]
    │             │             │
    └─────────────┼─────────────┘
                  ▼
   [Cross-Encoder Reranker] (Query-Passage Alignment)
                  │
                  ▼
   [Context Assembly & Prompt Guardrails]
   (<retrieved_context> delimiters)
                  │
                  ▼
   [Generation Engine: Gemini 3.8 Flash]
   (Strict Structured JSON + Citation Mapping)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 [Response & Citations] [Automated Evaluation Suite]
                        (Faithfulness, Relevancy, MRR, NDCG)
```

---

## 3. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, TypeScript, Recharts, Lucide Icons.
- **Backend**: Express + TypeScript Node.js runtime, with complementary FastAPI / Python modules.
- **Vector Database**: Qdrant HNSW vector index (768 dimensions, cosine similarity).
- **Sparse Search**: BM25 with Robertson-Spärck Jones IDF and configurable term frequency saturation.
- **Generation & Embeddings**: Gemini API (`gemini-3.8-flash` & `gemini-embedding-2-preview`) with fallback deterministic vectorizers.
- **Evaluation**: Ragas metrics (Faithfulness, Answer Relevancy, Context Precision, Context Recall) and Ranking metrics (Precision@K, Recall@K, MRR, NDCG@K).
- **Testing**: Node built-in test runner (`node:test`) and pytest.
- **Containerization**: Docker, Docker Compose.

---

## 4. Benchmark Results (50 Validated Questions)

Evaluated across:
- 10 Direct Factual questions
- 10 Conceptual questions
- 10 Multi-Document synthesis questions
- 10 Technical questions
- 10 Unanswerable guardrail questions

| Metric | Dense Vector (Cosine) | BM25 Keyword | Hybrid (RRF k=60) | Hybrid + Reranking | Production Target |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Faithfulness** | 0.82 | 0.84 | 0.89 | **0.94** | $\ge 0.85$ |
| **Answer Relevancy** | 0.79 | 0.81 | 0.86 | **0.91** | $\ge 0.80$ |
| **Context Precision** | 0.74 | 0.78 | 0.85 | **0.92** | $\ge 0.75$ |
| **Context Recall** | 0.78 | 0.71 | 0.87 | **0.90** | $\ge 0.80$ |
| **Precision@5** | 0.68 | 0.64 | 0.82 | **0.88** | $\ge 0.70$ |
| **Recall@5** | 0.75 | 0.70 | 0.88 | **0.91** | $\ge 0.80$ |
| **Mean Reciprocal Rank (MRR)** | 0.76 | 0.82 | 0.88 | **0.94** | $\ge 0.85$ |
| **NDCG@5** | 0.75 | 0.79 | 0.86 | **0.93** | $\ge 0.80$ |
| **Average Latency** | 420ms | **310ms** | 460ms | 510ms | $\le 1400\text{ms}$ (SLO) |
| **Cost per 1k Queries** | $0.18 | $0.16 | $0.21 | $0.22 | $\le \$0.50$ |

---

## 5. Getting Started

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/organization/rag-evaluation-lab.git
cd rag-evaluation-lab

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Set GEMINI_API_KEY="your_api_key"

# 4. Run unit tests
npm test

# 5. Start development server
npm run dev
# Server listening on http://localhost:3000
```

### Docker Deployment
```bash
docker compose up --build -d
```

---

## 6. API Reference Summary

- `POST /api/query`: Execute query with selectable strategy, topK, and similarity thresholds.
- `GET /api/documents`: List ingested documents with chunk counts and token statistics.
- `POST /api/documents/upload`: Multipart file upload for PDF, DOCX, Markdown, and TXT files.
- `POST /api/evaluation/run`: Trigger benchmark run on the 50-question evaluation dataset.
- `GET /api/experiments`: List and compare A/B test experiments.
- `GET /api/monitoring/metrics`: P50, P90, P95 latencies, input/output token counts, and cost telemetry.
- `GET /api/health`: Health probe reporting vector collection and embedding engine status.
