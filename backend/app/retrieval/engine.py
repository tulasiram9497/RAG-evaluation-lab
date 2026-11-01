import math
from typing import List, Dict, Any, Tuple
from ..schemas.rag import RetrievalStrategy, ChunkSchema

def reciprocal_rank_fusion(
    vector_results: List[Tuple[ChunkSchema, float, int]],
    bm25_results: List[Tuple[ChunkSchema, float, int]],
    k: int = 60,
    w_vec: float = 1.0,
    w_bm25: float = 1.0,
    top_k: int = 5
) -> List[Tuple[ChunkSchema, float]]:
    """
    Reciprocal Rank Fusion algorithm:
    RRF(d) = sum_{m in M} w_m / (k + rank_m(d))
    """
    fusion_scores: Dict[str, Dict[str, Any]] = {}

    for chunk, score, rank in vector_results:
        cid = chunk.id
        rrf = w_vec / (k + rank)
        fusion_scores[cid] = {
            "chunk": chunk,
            "rrf": rrf,
            "vector_score": score
        }

    for chunk, score, rank in bm25_results:
        cid = chunk.id
        rrf = w_bm25 / (k + rank)
        if cid in fusion_scores:
            fusion_scores[cid]["rrf"] += rrf
            fusion_scores[cid]["bm25_score"] = score
        else:
            fusion_scores[cid] = {
                "chunk": chunk,
                "rrf": rrf,
                "bm25_score": score
            }

    sorted_results = sorted(fusion_scores.values(), key=lambda x: x["rrf"], reverse=True)
    return [(item["chunk"], item["rrf"]) for item in sorted_results[:top_k]]
