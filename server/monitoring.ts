import { QueryResponse, RetrievalStrategy, SystemMetrics } from './types.js';

export class MonitoringService {
  private queryLog: QueryResponse[] = [];
  private maxLogSize: number = 200;
  private errorCount: number = 0;
  private totalAttempted: number = 0;

  public recordQuery(response: QueryResponse): void {
    this.totalAttempted++;
    this.queryLog.unshift(response);
    if (this.queryLog.length > this.maxLogSize) {
      this.queryLog.pop();
    }
  }

  public recordError(): void {
    this.totalAttempted++;
    this.errorCount++;
  }

  public getRecentQueries(limit: number = 20): QueryResponse[] {
    return this.queryLog.slice(0, limit);
  }

  public getMetrics(totalDocs: number = 0, totalChunks: number = 0, totalVectors: number = 0): SystemMetrics {
    const latencies = this.queryLog.map(q => q.metrics.totalLatencyMs).sort((a, b) => a - b);
    const count = latencies.length;

    const p50 = count > 0 ? latencies[Math.floor(count * 0.5)] : 0;
    const p90 = count > 0 ? latencies[Math.floor(count * 0.9)] : 0;
    const p95 = count > 0 ? latencies[Math.floor(count * 0.95)] : 0;
    const avgLatency = count > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / count) : 0;

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;

    const strategyCounts: Record<RetrievalStrategy, number> = {
      vector: 0,
      bm25: 0,
      hybrid: 0,
      hybrid_rerank: 0,
    };

    for (const q of this.queryLog) {
      totalInputTokens += q.metrics.inputTokens;
      totalOutputTokens += q.metrics.outputTokens;
      totalCost += q.metrics.estimatedCostUsd;
      if (q.strategy in strategyCounts) {
        strategyCounts[q.strategy]++;
      }
    }

    const errorRate = this.totalAttempted > 0 ? Number((this.errorCount / this.totalAttempted).toFixed(4)) : 0;

    const recentLatencies = this.queryLog.slice(0, 15).reverse().map(q => ({
      timestamp: q.timestamp,
      latencyMs: q.metrics.totalLatencyMs,
      strategy: q.strategy,
    }));

    return {
      totalQueries: this.totalAttempted,
      totalDocuments: totalDocs,
      totalChunks,
      totalVectors,
      latencyP50Ms: p50,
      latencyP90Ms: p90,
      latencyP95Ms: p95,
      averageLatencyMs: avgLatency,
      totalInputTokens,
      totalOutputTokens,
      totalEstimatedCostUsd: Number(totalCost.toFixed(6)),
      errorRate,
      queriesByStrategy: strategyCounts,
      recentLatencies,
    };
  }
}
