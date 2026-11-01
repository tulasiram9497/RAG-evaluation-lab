from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RetrievalStrategy(str, Enum):
    VECTOR = "vector"
    BM25 = "bm25"
    HYBRID = "hybrid"
    HYBRID_RERANK = "hybrid_rerank"

class ChunkingStrategy(str, Enum):
    FIXED = "fixed"
    OVERLAPPING = "overlapping"
    RECURSIVE = "recursive"
    SEMANTIC = "semantic"

class ChunkSchema(BaseModel):
    id: str
    document_id: str
    document_name: str
    chunk_index: int
    text: str
    token_count: int
    page_number: Optional[int] = 1
    section_heading: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class CitationSchema(BaseModel):
    chunk_id: str
    document_name: str
    chunk_index: int
    snippet: str
    score: float

class QueryRequest(BaseModel):
    query: str
    strategy: RetrievalStrategy = RetrievalStrategy.HYBRID_RERANK
    top_k: int = 5
    similarity_threshold: float = 0.15
    rrf_k: int = 60
    vector_weight: float = 1.0
    bm25_weight: float = 1.0
    rerank_candidate_count: int = 15
    system_prompt: Optional[str] = None
    temperature: float = 0.1
    model: str = "gemini-3.8-flash"

class QueryResponse(BaseModel):
    id: str
    query: str
    answer: str
    citations: List[CitationSchema]
    retrieved_chunks_count: int
    has_sufficient_evidence: bool
    strategy: RetrievalStrategy
    retrieval_latency_ms: float
    generation_latency_ms: float
    total_latency_ms: float
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float
    timestamp: str

class DocumentMetadataSchema(BaseModel):
    id: str
    filename: str
    file_type: str
    size_bytes: int
    hash: str
    uploaded_at: str
    total_tokens: int
    total_chunks: int
    category: Optional[str] = "General"

class EvaluationRunSchema(BaseModel):
    id: str
    name: str
    timestamp: str
    strategy: RetrievalStrategy
    top_k: int
    total_questions: int
    faithfulness: float
    answer_relevancy: float
    context_precision: float
    context_recall: float
    precision_at_k: float
    recall_at_k: float
    mrr: float
    ndcg_at_k: float
    pass_rate: float
    average_latency_ms: float
