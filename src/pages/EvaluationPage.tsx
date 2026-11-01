import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Play, 
  Download, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { EvaluationQuestion, EvaluationRun, RetrievalStrategy, SingleEvaluationScore } from '../../server/types.js';
import { api, EvaluationDatasetResponse } from '../services/api.js';

export const EvaluationPage: React.FC = () => {
  const [datasetInfo, setDatasetInfo] = useState<EvaluationDatasetResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [strategy, setStrategy] = useState<RetrievalStrategy>('hybrid_rerank');
  const [topK, setTopK] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [latestRun, setLatestRun] = useState<EvaluationRun | null>(null);
  const [historyRuns, setHistoryRuns] = useState<EvaluationRun[]>([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const loadInitialData = async () => {
    try {
      const [ds, runsRes] = await Promise.all([
        api.getEvaluationDataset(),
        api.getEvaluationRuns(),
      ]);
      setDatasetInfo(ds);
      setHistoryRuns(runsRes.runs);
      if (runsRes.runs.length > 0) {
        setLatestRun(runsRes.runs[0]);
      }
    } catch (err) {
      console.error('Failed to load evaluation dataset or runs:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    try {
      const run = await api.runEvaluation({
        strategy,
        topK,
        category: activeCategory !== 'all' ? activeCategory : undefined,
      });
      setLatestRun(run);
      setHistoryRuns((prev) => [run, ...prev]);
    } catch (err: any) {
      alert('Evaluation run failed: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/api/export/evaluations?format=csv';
  };

  // Filter questions or results
  const displayedQuestions = datasetInfo?.questions.filter((q) => {
    const matchesCategory = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch = !searchFilter || q.question.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Automated Evaluation Suite (50+ Benchmark)</h1>
          <p className="text-xs text-stone-500 mt-1">
            Measure Faithfulness, Answer Relevancy, Context Precision/Recall, MRR, and NDCG across 50 validated queries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunEvaluation}
            disabled={isRunning}
            className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Benchmarking 50 Questions...' : 'Run Benchmark'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Benchmark Scorecard Banner */}
      {latestRun && (
        <div className="bg-white border border-stone-200 rounded p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900">{latestRun.name}</span>
                <span className="text-[11px] text-stone-500 font-mono">
                  ({new Date(latestRun.timestamp).toLocaleTimeString()})
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Strategy: <strong className="capitalize">{latestRun.strategy.replace('_', ' ')}</strong> · Top K: {latestRun.topK} · Evaluated: {latestRun.totalQuestions} questions
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-stone-600">
                Pass Rate: <strong className="text-stone-900">{(latestRun.aggregateScores.passRate * 100).toFixed(1)}%</strong>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-600">
                Avg Latency: <strong className="text-stone-900">{latestRun.aggregateScores.averageLatencyMs}ms</strong>
              </span>
            </div>
          </div>

          {/* Ragas & Retrieval Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Faithfulness</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.faithfulness.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Target &ge; 0.85</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Relevancy</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.answerRelevancy.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Target &ge; 0.80</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Ctx Precision</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.contextPrecision.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Target &ge; 0.75</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Ctx Recall</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.contextRecall.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Target &ge; 0.80</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Precision@K</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.precisionAtK.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Top-{latestRun.topK} accuracy</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Recall@K</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.recallAtK.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Doc coverage</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">MRR</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.mrr.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">First relevant rank</div>
            </div>

            <div className="p-3 bg-stone-50 rounded border border-stone-200/80">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">NDCG@K</div>
              <div className="text-lg font-semibold text-stone-900 mt-1">
                {latestRun.aggregateScores.ndcgAtK.toFixed(2)}
              </div>
              <div className="text-[10px] text-stone-400">Discounted gain</div>
            </div>
          </div>
        </div>
      )}

      {/* Benchmark Control Bar: Strategy & Category Segmented Tabs */}
      <div className="bg-white border border-stone-200 rounded p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Strategy selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Test Strategy:</span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as RetrievalStrategy)}
              className="border border-stone-300 rounded px-2.5 py-1 text-stone-800 bg-white"
            >
              <option value="hybrid_rerank">Hybrid + Reranking (Cross-Encoder)</option>
              <option value="hybrid">Hybrid (Reciprocal Rank Fusion)</option>
              <option value="vector">Dense Vector Search (Cosine)</option>
              <option value="bm25">BM25 Keyword Search</option>
            </select>
          </div>

          {/* Top-K Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Top-K:</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="border border-stone-300 rounded px-2.5 py-1 text-stone-800 bg-white"
            >
              <option value={3}>3 Passages</option>
              <option value={5}>5 Passages</option>
              <option value={8}>8 Passages</option>
            </select>
          </div>

          {/* Search filter */}
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter questions by keyword..."
            className="border border-stone-300 rounded px-3 py-1 text-stone-900 placeholder-stone-400 max-w-xs"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-stone-100 text-xs">
          {[
            { id: 'all', label: `All Benchmark Questions (${datasetInfo?.total ?? 50})` },
            { id: 'factual', label: `Direct Factual (${datasetInfo?.categories.factual ?? 10})` },
            { id: 'conceptual', label: `Conceptual (${datasetInfo?.categories.conceptual ?? 10})` },
            { id: 'multi_document', label: `Multi-Document (${datasetInfo?.categories.multi_document ?? 10})` },
            { id: 'technical', label: `Technical (${datasetInfo?.categories.technical ?? 10})` },
            { id: 'unanswerable', label: `Unanswerable Guardrail (${datasetInfo?.categories.unanswerable ?? 10})` },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap font-medium ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions & Results Table */}
      <div className="bg-white border border-stone-200 rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Validated Evaluation Questions ({displayedQuestions.length})
          </h2>
          <span className="text-xs text-stone-500">
            Click question row to inspect reference evidence & model generation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 w-12">ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-6 py-3">Question</th>
                <th className="px-4 py-3">Relevant Docs</th>
                {latestRun && (
                  <>
                    <th className="px-4 py-3 font-medium">Faithfulness</th>
                    <th className="px-4 py-3 font-medium">Relevance</th>
                    <th className="px-4 py-3 font-medium">MRR</th>
                    <th className="px-4 py-3 text-right">Result</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedQuestions.map((q) => {
                const scoreResult = latestRun?.results.find((r) => r.questionId === q.id);
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <React.Fragment key={q.id}>
                    <tr
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="hover:bg-stone-50/70 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-[11px] text-stone-400">
                        {q.id}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-stone-700 font-medium text-[11px]">
                          {q.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-stone-900 max-w-md">
                        {q.question}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                        {q.relevantDocIds.length > 0 ? q.relevantDocIds.join(', ') : 'None (Unanswerable)'}
                      </td>
                      {scoreResult && (
                        <>
                          <td className="px-4 py-3 font-mono text-stone-900 font-medium">
                            {scoreResult.faithfulness.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-mono text-stone-900 font-medium">
                            {scoreResult.answerRelevancy.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-mono text-stone-900 font-medium">
                            {scoreResult.mrr.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {scoreResult.passed ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Passed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-700 font-medium text-[11px]">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Failed</span>
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>

                    {/* Expanded Detail Accordion */}
                    {isExpanded && (
                      <tr className="bg-stone-50/60">
                        <td colSpan={latestRun ? 8 : 4} className="p-5 text-xs space-y-3 border-b border-stone-200">
                          <div>
                            <div className="font-semibold text-stone-800 mb-1">Reference Answer (Ground Truth):</div>
                            <p className="text-stone-700 bg-white border border-stone-200 rounded p-2.5 leading-relaxed">
                              {q.referenceAnswer}
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-stone-800 mb-1">Reference Evidence Passage:</div>
                            <p className="text-stone-600 italic bg-white border border-stone-200 rounded p-2.5 leading-relaxed font-sans">
                              "{q.referenceEvidence}"
                            </p>
                          </div>
                          {scoreResult && (
                            <div>
                              <div className="font-semibold text-stone-800 mb-1">Model Generated Answer:</div>
                              <p className="text-stone-900 bg-white border border-stone-200 rounded p-2.5 leading-relaxed">
                                {scoreResult.generatedAnswer}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-[11px] text-stone-500">
                                <span>Context Precision: <strong>{scoreResult.contextPrecision.toFixed(2)}</strong></span>
                                <span aria-hidden="true">·</span>
                                <span>Context Recall: <strong>{scoreResult.contextRecall.toFixed(2)}</strong></span>
                                <span aria-hidden="true">·</span>
                                <span>NDCG@K: <strong>{scoreResult.ndcgAtK.toFixed(2)}</strong></span>
                                <span aria-hidden="true">·</span>
                                <span>Latency: <strong>{scoreResult.latencyMs}ms</strong></span>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
