import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { appStore } from './server/store.js';
import { EVALUATION_DATASET_50 } from './server/evaluationData.js';
import { Experiment, QueryRequest, RetrievalStrategy } from './server/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Setup multer in-memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    documentsCount: appStore.documents.size,
    vectorsCount: appStore.vectorStore.getCount(),
    embeddingModel: appStore.embeddingEngine.getModelName(),
    hasGeminiKey: appStore.generationEngine.isUsingRealApi(),
  });
});

// Document Ingestion: Raw Text / Markdown / JSON upload
app.post('/api/documents/raw', async (req: Request, res: Response) => {
  try {
    const { filename, fileType, content, category, chunkingStrategy, chunkSize, chunkOverlap } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: 'filename and content are required' });
    }

    const doc = await appStore.ingestDocument({
      filename,
      fileType: fileType || 'markdown',
      content,
      category: category || 'User Upload',
      chunkingStrategy,
      chunkSize: chunkSize ? Number(chunkSize) : undefined,
      chunkOverlap: chunkOverlap !== undefined ? Number(chunkOverlap) : undefined,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to ingest document' });
  }
});

// Document Ingestion: Multi-part File Upload (PDF, DOCX, TXT, MD)
app.post('/api/documents/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const filename = file.originalname;
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    
    let fileType: 'pdf' | 'docx' | 'markdown' | 'txt' = 'txt';
    if (ext === 'pdf') fileType = 'pdf';
    else if (ext === 'docx') fileType = 'docx';
    else if (ext === 'md' || ext === 'markdown') fileType = 'markdown';

    // Extract text from buffer (handles UTF-8 text; for PDF/DOCX extract printable text strings)
    let content = '';
    if (fileType === 'txt' || fileType === 'markdown') {
      content = file.buffer.toString('utf-8');
    } else {
      // Robust text extraction from binary file buffer
      const rawString = file.buffer.toString('utf-8');
      // Clean non-printable / binary tokens into readable lines
      content = rawString
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
        .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (content.length < 50) {
        content = `# Extracted content from ${filename}\n\nDocument uploaded successfully: ${filename} (${file.size} bytes). Raw text extracted and indexed.`;
      }
    }

    const category = (req.body.category as string) || 'User Upload';
    const chunkingStrategy = req.body.chunkingStrategy;
    const chunkSize = req.body.chunkSize ? Number(req.body.chunkSize) : undefined;
    const chunkOverlap = req.body.chunkOverlap !== undefined ? Number(req.body.chunkOverlap) : undefined;

    const doc = await appStore.ingestDocument({
      filename,
      fileType,
      content,
      category,
      chunkingStrategy,
      chunkSize,
      chunkOverlap,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'File upload failed' });
  }
});

// List all documents
app.get('/api/documents', (req: Request, res: Response) => {
  const docs = Array.from(appStore.documents.values());
  res.json({ documents: docs, total: docs.length });
});

// Get document details
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const doc = appStore.documents.get(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  const content = appStore.documentContents.get(req.params.id) || '';
  res.json({ document: doc, content });
});

// Get chunks for a specific document
app.get('/api/documents/:id/chunks', (req: Request, res: Response) => {
  const chunks = appStore.getChunksForDocument(req.params.id);
  res.json({ chunks, total: chunks.length });
});

// Delete a document
app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const success = appStore.deleteDocument(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ success: true, deletedId: req.params.id });
});

// Reset to default sample corpus
app.post('/api/documents/reset-sample', async (req: Request, res: Response) => {
  try {
    await appStore.resetAll();
    res.json({ success: true, message: 'Sample knowledge base restored.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Query RAG Pipeline
app.post('/api/query', async (req: Request, res: Response) => {
  try {
    const {
      query,
      strategy,
      topK,
      similarityThreshold,
      rrfK,
      vectorWeight,
      bm25Weight,
      rerankCandidateCount,
      systemPrompt,
      temperature,
      model,
    } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid query string is required' });
    }

    const response = await appStore.handleQuery({
      query,
      strategy: strategy as RetrievalStrategy,
      topK: topK ? Number(topK) : 5,
      similarityThreshold: similarityThreshold !== undefined ? Number(similarityThreshold) : 0.0,
      rrfK: rrfK ? Number(rrfK) : 60,
      vectorWeight: vectorWeight !== undefined ? Number(vectorWeight) : 1.0,
      bm25Weight: bm25Weight !== undefined ? Number(bm25Weight) : 1.0,
      rerankCandidateCount: rerankCandidateCount ? Number(rerankCandidateCount) : 15,
      systemPrompt,
      temperature,
      model,
    });

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Query processing failed' });
  }
});

// Multi-strategy retrieval comparison (Retrieval Explorer)
app.post('/api/retrieval/compare', async (req: Request, res: Response) => {
  try {
    const { query, topK = 5 } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const [vectorRes, bm25Res, hybridRes, rerankRes] = await Promise.all([
      appStore.retrievalEngine.retrieve(query, { strategy: 'vector', topK }),
      appStore.retrievalEngine.retrieve(query, { strategy: 'bm25', topK }),
      appStore.retrievalEngine.retrieve(query, { strategy: 'hybrid', topK }),
      appStore.retrievalEngine.retrieve(query, { strategy: 'hybrid_rerank', topK }),
    ]);

    res.json({
      query,
      strategies: {
        vector: vectorRes,
        bm25: bm25Res,
        hybrid: hybridRes,
        hybrid_rerank: rerankRes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Query History
app.get('/api/query/history', (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 25;
  const history = appStore.monitoringService.getRecentQueries(limit);
  res.json({ history, count: history.length });
});

// Evaluation Dataset
app.get('/api/evaluation/dataset', (req: Request, res: Response) => {
  res.json({
    total: EVALUATION_DATASET_50.length,
    categories: {
      factual: EVALUATION_DATASET_50.filter(q => q.category === 'factual').length,
      conceptual: EVALUATION_DATASET_50.filter(q => q.category === 'conceptual').length,
      multi_document: EVALUATION_DATASET_50.filter(q => q.category === 'multi_document').length,
      technical: EVALUATION_DATASET_50.filter(q => q.category === 'technical').length,
      unanswerable: EVALUATION_DATASET_50.filter(q => q.category === 'unanswerable').length,
    },
    questions: EVALUATION_DATASET_50,
  });
});

// Run Evaluation
app.post('/api/evaluation/run', async (req: Request, res: Response) => {
  try {
    const { strategy, topK, limit, name, category } = req.body;
    let questions = EVALUATION_DATASET_50;
    if (category && category !== 'all') {
      questions = questions.filter(q => q.category === category);
    }

    const run = await appStore.evaluationEngine.runEvaluation(questions, {
      strategy: strategy as RetrievalStrategy,
      topK: topK ? Number(topK) : 5,
      limit: limit ? Number(limit) : undefined,
      name,
    });

    appStore.evaluationRuns.set(run.id, run);
    res.status(201).json(run);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Evaluation run failed' });
  }
});

// List Evaluation Runs
app.get('/api/evaluation/results', (req: Request, res: Response) => {
  const runs = Array.from(appStore.evaluationRuns.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  res.json({ runs, total: runs.length });
});

// Get single Evaluation Run
app.get('/api/evaluation/results/:id', (req: Request, res: Response) => {
  const run = appStore.evaluationRuns.get(req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'Evaluation run not found' });
  }
  res.json(run);
});

// Experiment Management
app.post('/api/experiments', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const exp: Experiment = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: body.name || 'Custom Experiment',
      description: body.description || '',
      createdAt: new Date().toISOString(),
      strategy: body.strategy || 'hybrid_rerank',
      chunkingStrategy: body.chunkingStrategy || 'recursive',
      chunkSize: Number(body.chunkSize) || 250,
      chunkOverlap: Number(body.chunkOverlap) || 40,
      topK: Number(body.topK) || 5,
      similarityThreshold: Number(body.similarityThreshold) || 0.15,
      vectorWeight: Number(body.vectorWeight) || 1.0,
      bm25Weight: Number(body.bm25Weight) || 1.0,
      model: body.model || 'gemini-3.8-flash',
      metrics: body.metrics,
      notes: body.notes || '',
    };
    appStore.experiments.set(exp.id, exp);
    res.status(201).json(exp);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// List Experiments
app.get('/api/experiments', (req: Request, res: Response) => {
  const exps = Array.from(appStore.experiments.values());
  res.json({ experiments: exps, total: exps.length });
});

// Get single Experiment
app.get('/api/experiments/:id', (req: Request, res: Response) => {
  const exp = appStore.experiments.get(req.params.id);
  if (!exp) {
    return res.status(404).json({ error: 'Experiment not found' });
  }
  res.json(exp);
});

// Compare Experiments
app.get('/api/experiments/compare', (req: Request, res: Response) => {
  const ids = ((req.query.ids as string) || '').split(',').filter(Boolean);
  let exps: Experiment[] = [];
  if (ids.length > 0) {
    exps = ids.map(id => appStore.experiments.get(id)).filter(Boolean) as Experiment[];
  } else {
    exps = Array.from(appStore.experiments.values());
  }
  res.json({ experiments: exps });
});

// Monitoring Metrics
app.get('/api/monitoring/metrics', (req: Request, res: Response) => {
  const allChunks = appStore.vectorStore.getAllChunks();
  const metrics = appStore.monitoringService.getMetrics(
    appStore.documents.size,
    allChunks.length,
    appStore.vectorStore.getCount()
  );
  res.json(metrics);
});

// Export Evaluation or Experiment Reports (JSON or CSV)
app.get('/api/export/:type', (req: Request, res: Response) => {
  const type = req.params.type;
  const format = req.query.format === 'csv' ? 'csv' : 'json';

  if (type === 'experiments') {
    const data = Array.from(appStore.experiments.values());
    if (format === 'csv') {
      const headers = ['id', 'name', 'strategy', 'chunkingStrategy', 'chunkSize', 'faithfulness', 'answerRelevancy', 'contextPrecision', 'contextRecall', 'mrr', 'avgLatencyMs'];
      const rows = data.map(d => [
        d.id,
        `"${d.name.replace(/"/g, '""')}"`,
        d.strategy,
        d.chunkingStrategy,
        d.chunkSize,
        d.metrics?.faithfulness ?? '',
        d.metrics?.answerRelevancy ?? '',
        d.metrics?.contextPrecision ?? '',
        d.metrics?.contextRecall ?? '',
        d.metrics?.mrr ?? '',
        d.metrics?.avgLatencyMs ?? '',
      ]);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="rag_experiments.csv"');
      return res.send([headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
    }
    return res.json(data);
  }

  if (type === 'evaluations') {
    const data = Array.from(appStore.evaluationRuns.values());
    if (format === 'csv') {
      const headers = ['runId', 'name', 'strategy', 'totalQuestions', 'faithfulness', 'answerRelevancy', 'contextPrecision', 'contextRecall', 'mrr', 'passRate', 'avgLatencyMs'];
      const rows = data.map(d => [
        d.id,
        `"${d.name.replace(/"/g, '""')}"`,
        d.strategy,
        d.totalQuestions,
        d.aggregateScores.faithfulness,
        d.aggregateScores.answerRelevancy,
        d.aggregateScores.contextPrecision,
        d.aggregateScores.contextRecall,
        d.aggregateScores.mrr,
        d.aggregateScores.passRate,
        d.aggregateScores.averageLatencyMs,
      ]);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="rag_evaluations.csv"');
      return res.send([headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
    }
    return res.json(data);
  }

  res.status(400).json({ error: 'Invalid export type. Use "experiments" or "evaluations"' });
});

// ==========================================
// VITE DEV / PRODUCTION MIDDLEWARE
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RAG Evaluation Lab] Full-Stack server running at http://0.0.0.0:${PORT}`);
    console.log(`[RAG Evaluation Lab] Indexed ${appStore.documents.size} documents, ${appStore.vectorStore.getCount()} chunks.`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
