import { EvaluationQuestion } from './types.js';

export const EVALUATION_DATASET_50: EvaluationQuestion[] = [
  // ==========================================
  // Category 1: 10 Direct Factual Questions
  // ==========================================
  {
    id: 'fact_01',
    category: 'factual',
    question: 'What is the default value of the smoothing constant k in Reciprocal Rank Fusion (RRF)?',
    referenceAnswer: 'The smoothing constant k in Reciprocal Rank Fusion (RRF) is typically set to 60.',
    referenceEvidence: 'Score(d) = sum(w_m / (k + rank_m(d))) where k is a smoothing constant typically set to 60',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['reciprocal rank fusion', 'rrf', 'smoothing constant', '60']
  },
  {
    id: 'fact_02',
    category: 'factual',
    question: 'In what programming language is Qdrant written?',
    referenceAnswer: 'Qdrant is written in Rust.',
    referenceEvidence: 'Qdrant is an open-source vector database written in Rust, engineered for high concurrency and low search latency.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['qdrant', 'rust', 'concurrency']
  },
  {
    id: 'fact_03',
    category: 'factual',
    question: 'How much RAM reduction does Scalar Quantization (SQ) provide in Qdrant?',
    referenceAnswer: 'Scalar Quantization (SQ) yields a 4x reduction in RAM usage with less than 1% drop in recall by compressing FP32 to INT8.',
    referenceEvidence: 'Scalar Quantization (SQ): Compresses 32-bit floating point numbers (FP32) into 8-bit integers (INT8), yielding a 4x reduction in RAM usage with less than 1% drop in recall.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['scalar quantization', 'sq', '4x', 'ram']
  },
  {
    id: 'fact_04',
    category: 'factual',
    question: 'What is the per-million token input price for Gemini 3.8 Flash?',
    referenceAnswer: 'For Gemini 3.8 Flash, the input token cost is $0.075 per 1,000,000 tokens.',
    referenceEvidence: 'Input token cost is $0.075 per 1,000,000 tokens.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['gemini 3.8 flash', '$0.075', 'input token']
  },
  {
    id: 'fact_05',
    category: 'factual',
    question: 'What was the total annual cloud infrastructure spend in the FinTech FY 2026 report?',
    referenceAnswer: 'The total annual infrastructure expenditure reached $14.2M across global multi-region deployments.',
    referenceEvidence: 'Total annual infrastructure expenditure across the FinTech global multi-region deployment reached $14.2M',
    relevantDocIds: ['doc_fintech_cloud'],
    expectedRetrievalTerms: ['14.2m', 'expenditure', 'spend', 'infrastructure']
  },
  {
    id: 'fact_06',
    category: 'factual',
    question: 'How many specific identifiers must be removed under the HIPAA Safe Harbor de-identification method?',
    referenceAnswer: 'The Safe Harbor method requires the removal of 18 specific identifiers.',
    referenceEvidence: 'Safe Harbor method requires removal of 18 specific identifiers including patient names, geographic subdivisions smaller than state, dates, and medical record numbers.',
    relevantDocIds: ['doc_clinical_ai'],
    expectedRetrievalTerms: ['safe harbor', '18 identifiers', 'hipaa']
  },
  {
    id: 'fact_07',
    category: 'factual',
    question: 'What is the target Faithfulness score threshold specified for clinical benchmark validation?',
    referenceAnswer: 'Faithfulness must reach at least 0.98 in clinical benchmark validation.',
    referenceEvidence: 'Faithfulness must reach at least 0.98 in clinical benchmark validation.',
    relevantDocIds: ['doc_clinical_ai'],
    expectedRetrievalTerms: ['faithfulness', '0.98', 'clinical benchmark']
  },
  {
    id: 'fact_08',
    category: 'factual',
    question: 'What is the average search complexity of Qdrant HNSW indexing?',
    referenceAnswer: 'The average search complexity of Qdrant HNSW indexing is O(log N).',
    referenceEvidence: 'Average search complexity is O(log N), allowing sub-10ms query latency over millions of vectors.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['hnsw', 'search complexity', 'o(log n)']
  },
  {
    id: 'fact_09',
    category: 'factual',
    question: 'How much money did vector embedding caching save annually in the FinTech infrastructure?',
    referenceAnswer: 'Vector embedding caching saved $380,000 annually by reducing monthly embedding API calls by 42%.',
    referenceEvidence: 'Implementing an intelligent caching tier for vector embeddings reduced monthly embedding API calls by 42%, saving $380,000 annually.',
    relevantDocIds: ['doc_fintech_cloud'],
    expectedRetrievalTerms: ['caching tier', '$380,000', '42%']
  },
  {
    id: 'fact_10',
    category: 'factual',
    question: 'What production P95 latency Service Level Objective is enforced for the FinTech platform?',
    referenceAnswer: 'The production P95 total latency SLO is less than or equal to 1400ms.',
    referenceEvidence: 'P95 Total Latency: <= 1400ms.',
    relevantDocIds: ['doc_fintech_cloud'],
    expectedRetrievalTerms: ['p95', 'latency', '1400ms', 'slo']
  },

  // ==========================================
  // Category 2: 10 Conceptual Questions
  // ==========================================
  {
    id: 'concept_01',
    category: 'conceptual',
    question: 'Why does traditional dense vector search sometimes fail when retrieving serial numbers or exact codes?',
    referenceAnswer: 'Dense vector search maps text into continuous semantic space, excelling at synonyms and high-level conceptual similarity, but it lacks exact lexical hashing, causing it to confuse or miss alphanumeric codes, acronyms, and serial numbers.',
    referenceEvidence: 'Dense Vector Search excels at semantic similarity, synonyms, and paraphrased intent, but often fails on exact keyword matching, serial numbers, product codes, or acronyms.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['dense vector', 'semantic similarity', 'exact keyword', 'serial numbers']
  },
  {
    id: 'concept_02',
    category: 'conceptual',
    question: 'What is the conceptual difference between Faithfulness and Answer Relevance in RAG evaluation?',
    referenceAnswer: 'Faithfulness measures whether the claims in the generated response can be directly inferred from the retrieved context (checking for hallucination), whereas Answer Relevance measures whether the response directly addresses the user query without irrelevant or tangential filler.',
    referenceEvidence: 'Faithfulness: Measures the percentage of claims in the generated response that can be directly inferred from the retrieved context... Answer Relevance: Evaluates whether the generated response directly addresses the user question without superfluous or tangential filler.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['faithfulness', 'answer relevance', 'claims', 'retrieved context']
  },
  {
    id: 'concept_03',
    category: 'conceptual',
    question: 'How does recursive chunking preserve document structure better than fixed-size chunking?',
    referenceAnswer: 'Recursive chunking applies a hierarchical cascade of structural boundaries (paragraphs, single lines, sentences, words), keeping related sections together, unlike fixed-size chunking which cuts text at rigid token offsets and splits sentences mid-phrase.',
    referenceEvidence: 'Fixed-size chunking partitions raw text into rigid token windows... splits sentences mid-phrase, losing semantic coherence. Recursive chunking applies a hierarchical cascade of separators: double newlines (paragraphs), single newlines, punctuation, and whitespace, guaranteeing structural integrity.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['recursive chunking', 'fixed-size', 'structural boundaries', 'paragraphs']
  },
  {
    id: 'concept_04',
    category: 'conceptual',
    question: 'Why is pre-retrieval filtering mandated over post-retrieval filtering for role-based access control?',
    referenceAnswer: 'Pre-retrieval filtering enforces tenant and clearance boundaries before similarity scoring occurs, preventing metadata presence leaks and ensuring the retrieved Top K results are not diminished by discarded unauthorized items.',
    referenceEvidence: 'Pre-retrieval filtering: The vector database filter query must enforce tenantId == session.tenantId AND clearanceLevel <= session.clearanceLevel before similarity scoring occurs. Post-retrieval filtering is strictly prohibited as it leaks presence information and distorts Top K ranking.',
    relevantDocIds: ['doc_security_governance'],
    expectedRetrievalTerms: ['pre-retrieval filtering', 'post-retrieval', 'top k', 'presence information']
  },
  {
    id: 'concept_05',
    category: 'conceptual',
    question: 'What is an indirect prompt injection attack in the context of retrieval pipelines?',
    referenceAnswer: 'An indirect prompt injection occurs when an attacker places hostile instructions inside external documents that get indexed into the knowledge base; when retrieved, the LLM processes and executes the untrusted instructions instead of answering the query.',
    referenceEvidence: 'Indirect Prompt Injection: An attacker embeds malicious instructions inside an external document... When the RAG pipeline retrieves this chunk, the LLM may execute the embedded directive.',
    relevantDocIds: ['doc_security_governance'],
    expectedRetrievalTerms: ['indirect prompt injection', 'malicious instructions', 'untrusted', 'directive']
  },
  {
    id: 'concept_06',
    category: 'conceptual',
    question: 'How does Qdrant HNSW graph topology achieve sub-10ms search over millions of vectors?',
    referenceAnswer: 'HNSW builds a multi-layer hierarchical graph where top layers contain long-range skip connections for fast global navigation, and bottom layers contain dense local connections for fine-grained nearest neighbor refinement, yielding logarithmic search time.',
    referenceEvidence: 'Multi-layer graph topology where top layers have long-range skip connections and bottom layers have dense local connections. Average search complexity is O(log N), allowing sub-10ms query latency over millions of vectors.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['hnsw', 'multi-layer', 'skip connections', 'o(log n)']
  },
  {
    id: 'concept_07',
    category: 'conceptual',
    question: 'Why are legacy NLP metrics like BLEU and ROUGE unsuitable for evaluating RAG generation quality?',
    referenceAnswer: 'BLEU and ROUGE measure surface n-gram overlap against a single reference phrasing; in RAG, an answer can be 100% faithful and correct using completely different vocabulary and syntactic structures.',
    referenceEvidence: 'RAG systems cannot be evaluated using legacy NLP metrics like BLEU or ROUGE because reference answers can be phrased in infinitely diverse ways.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['bleu', 'rouge', 'n-gram', 'reference answers']
  },
  {
    id: 'concept_08',
    category: 'conceptual',
    question: 'What is the role of payload-based boolean filtering in vector databases?',
    referenceAnswer: 'Payload filtering enables arbitrary JSON metadata (such as timestamps, tenants, and clearance levels) to be evaluated directly during vector graph traversal without separate post-filtering performance degradation.',
    referenceEvidence: 'Payloads in Qdrant allow arbitrary JSON metadata to be indexed alongside vectors, enabling payload-based boolean filtering during graph traversal without post-filtering performance degradation.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['payload', 'boolean filtering', 'graph traversal', 'metadata']
  },
  {
    id: 'concept_09',
    category: 'conceptual',
    question: 'How does demographic subgroup auditing prevent disparity in healthcare RAG retrieval?',
    referenceAnswer: 'It evaluates Context Recall across stratified patient cohorts (age, sex, ethnicity) to ensure that the disparity ratio does not exceed 1.05, preventing medical guidelines for underrepresented populations from being missed.',
    referenceEvidence: 'Evaluation datasets must include stratified patient cohorts across age, biological sex, ethnicity, and co-morbidities. Disparity ratio in Context Recall across subgroups must not exceed 1.05 to prevent systematic under-representation in retrieval.',
    relevantDocIds: ['doc_clinical_ai'],
    expectedRetrievalTerms: ['demographic subgroup', 'disparity ratio', 'context recall', 'underrepresented']
  },
  {
    id: 'concept_10',
    category: 'conceptual',
    question: 'What is the Insufficient Evidence Protocol in clinical decision support RAG systems?',
    referenceAnswer: 'When retrieved guidelines or clinical records lack conclusive evidence, the system must explicitly decline to speculate and declare insufficient evidence rather than risk patient safety with an extrapolated guess.',
    referenceEvidence: 'Insufficient Evidence Protocol: When clinical guidelines or patient records lack sufficient clarity, the model MUST explicitly declare "Insufficient clinical documentation to confirm diagnosis" rather than extrapolating or guessing.',
    relevantDocIds: ['doc_clinical_ai'],
    expectedRetrievalTerms: ['insufficient evidence protocol', 'clinical documentation', 'extrapolating', 'guessing']
  },

  // ==========================================
  // Category 3: 10 Multi-Document Questions
  // ==========================================
  {
    id: 'multi_01',
    category: 'multi_document',
    question: 'How do chunking choices discussed in the RAG architecture document impact the cloud spend and latency reported in the FinTech infrastructure report?',
    referenceAnswer: 'The RAG architecture document explains that restricting Top K and avoiding oversized chunks slashes context bloat and latency; the FinTech report demonstrates this empirically by migrating from 512 fixed tokens to 250 recursive tokens, reducing prompt tokens from 2,800 to 1,150, saving $64,000 monthly, and maintaining P95 latency under 1400ms.',
    referenceEvidence: 'doc_rag_arch: Restricting Top K to 3-5 highly relevant chunks reduces context bloat by 65% and slashes P95 response latency. doc_fintech_cloud: Upgrading chunking from 512 fixed tokens to 250 recursive tokens reduced average prompt token count from 2,800 to 1,150 tokens per query, saving $64,000 per month.',
    relevantDocIds: ['doc_rag_arch', 'doc_fintech_cloud'],
    expectedRetrievalTerms: ['chunking', 'prompt token', 'fintech', 'latency', 'savings']
  },
  {
    id: 'multi_02',
    category: 'multi_document',
    question: 'How do Qdrant payload filters connect with the Role-Based Access Control requirements described in the AI Governance document?',
    referenceAnswer: 'The AI Governance document mandates pre-retrieval filtering where tenantId and clearanceLevel are enforced before similarity scoring; Qdrant fulfills this requirement by supporting payload-based boolean filtering directly during HNSW graph traversal.',
    referenceEvidence: 'doc_security_governance: Pre-retrieval filtering: The vector database filter query must enforce tenantId == session.tenantId AND clearanceLevel <= session.clearanceLevel before similarity scoring occurs. doc_vector_db: Payloads in Qdrant allow arbitrary JSON metadata to be indexed alongside vectors, enabling payload-based boolean filtering during graph traversal.',
    relevantDocIds: ['doc_vector_db', 'doc_security_governance'],
    expectedRetrievalTerms: ['payload', 'pre-retrieval filtering', 'rbac', 'tenantid', 'clearancelevel']
  },
  {
    id: 'multi_03',
    category: 'multi_document',
    question: 'Compare the target Faithfulness threshold required for clinical AI systems against the general Ragas benchmark target.',
    referenceAnswer: 'The general Ragas framework in the RAG architecture document recommends a Faithfulness target of >= 0.85, whereas the Clinical AI protocol specifies a much stricter zero-tolerance threshold of at least 0.98 due to patient safety requirements.',
    referenceEvidence: 'doc_rag_arch: Faithfulness: Measures the percentage of claims in the generated response that can be directly inferred from the retrieved context. Target >= 0.85. doc_clinical_ai: In clinical decision support, the tolerance for hallucination is zero: Faithfulness must reach at least 0.98 in clinical benchmark validation.',
    relevantDocIds: ['doc_rag_arch', 'doc_clinical_ai'],
    expectedRetrievalTerms: ['faithfulness', '0.85', '0.98', 'target', 'clinical']
  },
  {
    id: 'multi_04',
    category: 'multi_document',
    question: 'How does structured JSON output validation mitigate prompt injection as described in the security document and maintain citation precision in RAG architecture?',
    referenceAnswer: 'Structured JSON validation forces the LLM into a rigid output schema, preventing attackers from injecting arbitrary scripts or command directives, while simultaneously guaranteeing that source IDs and exact quotes are mapped systematically for citation precision.',
    referenceEvidence: 'doc_security_governance: Structured JSON Output: Enforcing rigid JSON schema validation ensures the LLM cannot return freeform malicious scripts or URLs. doc_rag_arch: A production RAG pipeline decouples knowledge indexing from linguistic generation, feeding contextual evidence directly into LLM prompts with citations.',
    relevantDocIds: ['doc_security_governance', 'doc_rag_arch'],
    expectedRetrievalTerms: ['structured json', 'prompt injection', 'citation', 'schema validation']
  },
  {
    id: 'multi_05',
    category: 'multi_document',
    question: 'What hardware memory sizing is required for 1 million 768-dimensional vectors in Qdrant, and how much did the FinTech company spend on their search cluster?',
    referenceAnswer: 'Qdrant requires approximately 3.07 GB for raw FP32 vectors plus 1.5 GB to 2.0 GB of HNSW graph overhead (around 4.6 to 5.1 GB total RAM); the FinTech company spent $2.4M (16.9% of their budget) on their vector database and search cluster.',
    referenceEvidence: 'doc_vector_db: For a 1-million vector collection with 768 dimensions (FP32): Raw memory required: ~3.07 GB. HNSW graph index overhead adds approximately 1.5 GB to 2 GB. doc_fintech_cloud: Vector Database and Search Cluster (Qdrant & Elasticsearch): $2.4M (16.9%).',
    relevantDocIds: ['doc_vector_db', 'doc_fintech_cloud'],
    expectedRetrievalTerms: ['3.07 gb', 'hnsw overhead', '$2.4m', 'search cluster']
  },
  {
    id: 'multi_06',
    category: 'multi_document',
    question: 'How do HIPAA de-identification requirements in the clinical document affect metadata tagging before chunks are stored in Qdrant?',
    referenceAnswer: 'HIPAA Safe Harbor mandates scrubbing 18 specific identifiers using NER prior to chunking and storage, ensuring that private personal data never enters Qdrant vector payloads or embedding text.',
    referenceEvidence: 'doc_clinical_ai: All Protected Health Information (PHI) must be scrubbed using automated Named Entity Recognition (NER) prior to chunking and vector storage. Safe Harbor method requires removal of 18 specific identifiers. doc_vector_db: Payloads in Qdrant allow arbitrary JSON metadata to be indexed alongside vectors.',
    relevantDocIds: ['doc_clinical_ai', 'doc_vector_db'],
    expectedRetrievalTerms: ['hipaa', 'safe harbor', 'phi', 'ner', 'payload']
  },
  {
    id: 'multi_07',
    category: 'multi_document',
    question: 'Synthesize how hybrid retrieval combines sparse search, dense vector indexing, and the cross-encoder reranking described in the RAG architecture document.',
    referenceAnswer: 'Hybrid retrieval uses BM25 to score term matching and Qdrant vector search to score semantic similarity; candidates are fused via Reciprocal Rank Fusion (k=60), after which a cross-encoder evaluates token interactions across top candidates to produce calibrated final rankings.',
    referenceEvidence: 'doc_rag_arch: Hybrid Retrieval fuses dense and sparse candidates. The industry standard fusion method is Reciprocal Rank Fusion (RRF)... Two-Stage Reranking utilizes a cross-encoder model to jointly score the query and candidate passages. doc_vector_db: Distance metrics supported include Cosine Similarity.',
    relevantDocIds: ['doc_rag_arch', 'doc_vector_db'],
    expectedRetrievalTerms: ['hybrid retrieval', 'bm25', 'rrf', 'cross-encoder reranking', 'dense vector']
  },
  {
    id: 'multi_08',
    category: 'multi_document',
    question: 'How does Context Recall evaluation from the Ragas framework relate to the demographic subgroup disparity ratio in clinical AI?',
    referenceAnswer: 'Context Recall measures whether all reference factual components are retrieved; in clinical systems, Context Recall is audited across demographic subgroups with an enforced disparity ratio limit of 1.05 to guarantee equitable retrieval across all patient cohorts.',
    referenceEvidence: 'doc_rag_arch: Context Recall: Measures whether the retrieved context contains all factual components required to formulate the reference ground-truth answer. doc_clinical_ai: Disparity ratio in Context Recall across subgroups must not exceed 1.05 to prevent systematic under-representation in retrieval.',
    relevantDocIds: ['doc_rag_arch', 'doc_clinical_ai'],
    expectedRetrievalTerms: ['context recall', 'disparity ratio', '1.05', 'ragas', 'clinical']
  },
  {
    id: 'multi_09',
    category: 'multi_document',
    question: 'How do the latency targets in the FinTech SLOs compare with the P95 latency improvement gained by restricting Top K chunks in RAG architecture?',
    referenceAnswer: 'FinTech enforces a P95 total latency SLO of <= 1400ms; the RAG architecture document shows that restricting Top K to 3-5 relevant chunks slashes P95 latency from 2400ms down to 680ms, well within the 1400ms SLO.',
    referenceEvidence: 'doc_fintech_cloud: P95 Total Latency: <= 1400ms. doc_rag_arch: Restricting Top K to 3-5 highly relevant chunks reduces context bloat by 65% and slashes P95 response latency from 2400ms down to 680ms.',
    relevantDocIds: ['doc_fintech_cloud', 'doc_rag_arch'],
    expectedRetrievalTerms: ['1400ms', '680ms', '2400ms', 'top k', 'p95']
  },
  {
    id: 'multi_10',
    category: 'multi_document',
    question: 'Explain how chunk-level metadata inheritance in AI Governance is implemented within Qdrant vector payloads.',
    referenceAnswer: 'When a document is ingested, each generated chunk inherits the parent document security clearance and tenant tags, which are stored directly in Qdrant JSON payload fields for pre-retrieval filtering.',
    referenceEvidence: 'doc_security_governance: Chunk-level metadata inheritance: When document doc_49 is chunked, every child chunk inherits the document\'s security clearance tag. doc_vector_db: Payloads in Qdrant allow arbitrary JSON metadata to be indexed alongside vectors.',
    relevantDocIds: ['doc_security_governance', 'doc_vector_db'],
    expectedRetrievalTerms: ['metadata inheritance', 'security clearance', 'qdrant payload', 'json']
  },

  // ==========================================
  // Category 4: 10 Technical Questions
  // ==========================================
  {
    id: 'tech_01',
    category: 'technical',
    question: 'What mathematical formula calculates the Reciprocal Rank Fusion (RRF) score for document d across modalities M?',
    referenceAnswer: 'The RRF formula is Score(d) = sum_{m in M} (w_m / (k + rank_m(d))), where k is typically 60 and w_m is the weight of modality m.',
    referenceEvidence: 'Score(d) = sum(w_m / (k + rank_m(d))) where k is a smoothing constant typically set to 60, and w_m represents modality weight.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['score(d)', 'w_m', 'rank_m', 'k = 60']
  },
  {
    id: 'tech_02',
    category: 'technical',
    question: 'How is raw memory calculated for 1 million vectors with 768 dimensions in FP32 precision?',
    referenceAnswer: 'Raw memory is 1,000,000 * 768 * 4 bytes = 3,072,000,000 bytes, which equals approximately 3.07 GB.',
    referenceEvidence: 'For a 1-million vector collection with 768 dimensions (FP32): Raw memory required: 1,000,000 * 768 * 4 bytes = ~3.07 GB.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['1,000,000', '768', '4 bytes', '3.07 gb', 'fp32']
  },
  {
    id: 'tech_03',
    category: 'technical',
    question: 'What distance metrics does Qdrant support for vector similarity?',
    referenceAnswer: 'Qdrant supports Cosine Similarity, Dot Product, and Euclidean (L2) distance.',
    referenceEvidence: 'Distance metrics supported include Cosine Similarity, Dot Product, and Euclidean (L2) distance.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['cosine similarity', 'dot product', 'euclidean', 'l2']
  },
  {
    id: 'tech_04',
    category: 'technical',
    question: 'What is the token cost calculation for generating a response with 1,200 input tokens and 180 output tokens using Gemini 3.8 Flash?',
    referenceAnswer: 'Input cost = 1200 * ($0.075 / 1M) = $0.00009; Output cost = 180 * ($0.30 / 1M) = $0.000054; Total cost = $0.000144.',
    referenceEvidence: 'Input token cost is $0.075 per 1,000,000 tokens. Output token cost is $0.30 per 1,000,000 tokens.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['$0.075', '$0.30', 'token cost', 'gemini 3.8 flash']
  },
  {
    id: 'tech_05',
    category: 'technical',
    question: 'What HNSW graph parameters determine graph index RAM overhead in Qdrant?',
    referenceAnswer: 'The parameters M (links per node, typically 16) and ef_construct (typically 100) dictate the HNSW index connectivity and memory overhead.',
    referenceEvidence: 'HNSW graph index overhead adds approximately 1.5 GB to 2 GB of RAM depending on M (links per node, typical 16) and ef_construct (typical 100).',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['m', 'ef_construct', 'links per node', 'hnsw']
  },
  {
    id: 'tech_06',
    category: 'technical',
    question: 'What three defensive techniques against indirect prompt injection are outlined in the AI Governance document?',
    referenceAnswer: '1. Strict boundary delimiters (XML tags like <retrieved_context>), 2. Structured JSON schema enforcement, and 3. Dual-LLM verification auditing output before return.',
    referenceEvidence: '1. Strict Boundary Delimiters: Enclosing retrieved passages inside immutable XML tags... 2. Structured JSON Output: Enforcing rigid JSON schema validation... 3. Dual-LLM Verification: A lightweight evaluator audits the output before it is returned to the user.',
    relevantDocIds: ['doc_security_governance'],
    expectedRetrievalTerms: ['strict boundary delimiters', 'structured json', 'dual-llm verification']
  },
  {
    id: 'tech_07',
    category: 'technical',
    question: 'What threshold was configured for the Redis semantic embedding cache in the FinTech cost optimization setup?',
    referenceAnswer: 'The Redis semantic embedding cache was configured with a 0.96 cosine similarity threshold.',
    referenceEvidence: 'Embedding Cache: Redis-based semantic cache with 0.96 cosine threshold.',
    relevantDocIds: ['doc_fintech_cloud'],
    expectedRetrievalTerms: ['redis', 'semantic cache', '0.96', 'cosine threshold']
  },
  {
    id: 'tech_08',
    category: 'technical',
    question: 'What is the target threshold for Answer Relevance in the Ragas evaluation framework?',
    referenceAnswer: 'The recommended target for Answer Relevance is greater than or equal to 0.80.',
    referenceEvidence: 'Answer Relevance: Evaluates whether the generated response directly addresses the user question without superfluous or tangential filler. Target >= 0.80.',
    relevantDocIds: ['doc_rag_arch'],
    expectedRetrievalTerms: ['answer relevance', 'target >= 0.80', 'ragas']
  },
  {
    id: 'tech_09',
    category: 'technical',
    question: 'What is Product Quantization (PQ) and what compression ratio can it achieve in Qdrant?',
    referenceAnswer: 'Product Quantization decomposes vectors into smaller sub-vectors and clusters them into centroids, enabling up to 16x RAM compression.',
    referenceEvidence: 'Product Quantization (PQ): Decomposes vectors into smaller sub-vectors and clusters them into centroids, enabling up to 16x compression.',
    relevantDocIds: ['doc_vector_db'],
    expectedRetrievalTerms: ['product quantization', 'pq', 'sub-vectors', '16x compression']
  },
  {
    id: 'tech_10',
    category: 'technical',
    question: 'What are the availability uptime and maximum error rate SLO targets in the FinTech infrastructure?',
    referenceAnswer: 'Availability uptime is targeted at 99.95% across three availability zones, and maximum error rate is targeted at less than 0.05% over rolling 30-day windows.',
    referenceEvidence: 'Availability: 99.95% uptime across all three geographic availability zones... Maximum Error Rate: < 0.05% over rolling 30-day windows.',
    relevantDocIds: ['doc_fintech_cloud'],
    expectedRetrievalTerms: ['99.95%', 'uptime', '0.05%', 'error rate']
  },

  // ==========================================
  // Category 5: 10 Unanswerable Questions
  // ==========================================
  {
    id: 'unans_01',
    category: 'unanswerable',
    question: 'What was the exact stock price of NVIDIA on December 14, 2024?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. The documents discuss RAG architecture, vector databases, security, clinical protocols, and FinTech cloud costs, but contain no historical stock price data.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['nvidia', 'stock price', 'december 14']
  },
  {
    id: 'unans_02',
    category: 'unanswerable',
    question: 'What is the chemical formula and boiling point of liquid Nitrogen trifluoride?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. The knowledge base contains no chemistry or inorganic chemical data.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['nitrogen trifluoride', 'boiling point', 'chemical formula']
  },
  {
    id: 'unans_03',
    category: 'unanswerable',
    question: 'Who won the 2022 FIFA World Cup Final and what was the penalty shootout score?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. The corpus contains technical and corporate documents, not sports tournament results.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['fifa world cup', 'penalty shootout', '2022']
  },
  {
    id: 'unans_04',
    category: 'unanswerable',
    question: 'What is the recipe for classic French sourdough baguette including baker percentages?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. The corpus contains zero culinary or baking information.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['sourdough', 'baguette', 'baker percentage']
  },
  {
    id: 'unans_05',
    category: 'unanswerable',
    question: 'What is the exact fuel payload capacity of the Saturn V third stage rocket (S-IVB)?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. No aerospace hardware or rocketry specifications exist in the knowledge base.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['saturn v', 's-ivb', 'fuel payload']
  },
  {
    id: 'unans_06',
    category: 'unanswerable',
    question: 'How many Grammy Awards did Beyonce win in the year 2023?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. Music award history is completely outside the ingested corporate and technical documentation.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['grammy', 'beyonce', '2023']
  },
  {
    id: 'unans_07',
    category: 'unanswerable',
    question: 'What is the speed of sound through seawater at 20 degrees Celsius and 35 ppt salinity?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. Oceanographic acoustics data is absent from all uploaded documents.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['speed of sound', 'seawater', 'salinity']
  },
  {
    id: 'unans_08',
    category: 'unanswerable',
    question: 'Who was the Prime Minister of Australia during the 1967 referendum?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. Historical Australian political records are not present in the indexed documents.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['prime minister', 'australia', '1967 referendum']
  },
  {
    id: 'unans_09',
    category: 'unanswerable',
    question: 'What is the maximum takeoff weight of the Boeing 777-300ER in kilograms?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. Commercial aviation technical specifications are not included in the corpus.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['boeing 777-300er', 'maximum takeoff weight']
  },
  {
    id: 'unans_10',
    category: 'unanswerable',
    question: 'What was the average rainfall in Tokyo during August 2021?',
    referenceAnswer: 'I cannot answer this question based on the provided documents as there is insufficient evidence.',
    referenceEvidence: 'None. Meteorological historical statistics are not found in the knowledge base.',
    relevantDocIds: [],
    expectedRetrievalTerms: ['tokyo', 'rainfall', 'august 2021']
  }
];
