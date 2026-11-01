import pytest
from app.schemas.rag import ChunkSchema
from app.retrieval.engine import reciprocal_rank_fusion

def test_rrf_fusion_logic():
    c1 = ChunkSchema(id="c1", document_id="d1", document_name="d1.md", chunk_index=0, text="Text 1", token_count=5)
    c2 = ChunkSchema(id="c2", document_id="d2", document_name="d2.md", chunk_index=0, text="Text 2", token_count=5)
    c3 = ChunkSchema(id="c3", document_id="d3", document_name="d3.md", chunk_index=0, text="Text 3", token_count=5)

    vec_results = [(c1, 0.95, 1), (c2, 0.85, 2)]
    bm25_results = [(c2, 0.90, 1), (c3, 0.70, 2)]

    fused = reciprocal_rank_fusion(vec_results, bm25_results, k=60, top_k=3)
    assert len(fused) == 3
    # c2 appeared in both ranks (rank 2 in vec, rank 1 in bm25) => should have highest fused score!
    assert fused[0][0].id == "c2"
    assert fused[0][1] > fused[1][1]
