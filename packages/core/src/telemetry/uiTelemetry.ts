/**
 * In-process session metrics service. Tracks token counts and tool call stats
 * in memory only — no data is sent anywhere.
 */

import { EventEmitter } from 'events';

export interface ModelMetricsCore {
  api: {
    totalRequests: number;
    totalErrors: number;
    totalLatencyMs: number;
  };
  tokens: {
    prompt: number;
    candidates: number;
    total: number;
    cached: number;
    thoughts: number;
    tool: number;
  };
}

export interface ModelMetrics extends ModelMetricsCore {
  bySource: Record<string, ModelMetricsCore>;
}

export interface ToolCallStats {
  count: number;
  success: number;
  fail: number;
  durationMs: number;
  decisions: Record<string, number>;
}

export interface SessionMetrics {
  files: {
    totalLinesAdded: number;
    totalLinesRemoved: number;
  };
  tools: {
    totalCalls: number;
    totalSuccess: number;
    totalFail: number;
    totalDurationMs: number;
    totalDecisions: Record<string, number>;
    byName: Record<string, ToolCallStats>;
  };
  models: Record<string, ModelMetrics>;
}

export type UiEvent = Record<string, unknown>;

function emptyMetrics(): SessionMetrics {
  return {
    files: { totalLinesAdded: 0, totalLinesRemoved: 0 },
    tools: {
      totalCalls: 0,
      totalSuccess: 0,
      totalFail: 0,
      totalDurationMs: 0,
      totalDecisions: {},
      byName: {},
    },
    models: {},
  };
}

export interface UiTelemetryService {
  reset(): void;
  addEvent(event: UiEvent): void;
  getMetrics(): SessionMetrics;
  getLastPromptTokenCount(): number;
  getLastCachedContentTokenCount(): number;
  setLastPromptTokenCount(count: number): void;
  setLastCachedContentTokenCount(count: number): void;
  on(event: 'update', listener: () => void): void;
  off(event: 'update', listener: () => void): void;
}

class UiTelemetryServiceImpl extends EventEmitter implements UiTelemetryService {
  private metrics: SessionMetrics = emptyMetrics();
  private lastPromptTokenCount = 0;
  private lastCachedContentTokenCount = 0;

  reset(): void {
    this.metrics = emptyMetrics();
    this.lastPromptTokenCount = 0;
    this.lastCachedContentTokenCount = 0;
    this.emit('update');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addEvent(_event: UiEvent): void {
    this.emit('update');
  }

  getMetrics(): SessionMetrics {
    return this.metrics;
  }

  getLastPromptTokenCount(): number {
    return this.lastPromptTokenCount;
  }

  getLastCachedContentTokenCount(): number {
    return this.lastCachedContentTokenCount;
  }

  setLastPromptTokenCount(count: number): void {
    this.lastPromptTokenCount = count;
    this.emit('update');
  }

  setLastCachedContentTokenCount(count: number): void {
    this.lastCachedContentTokenCount = count;
    this.emit('update');
  }
}

export const uiTelemetryService: UiTelemetryService =
  new UiTelemetryServiceImpl();

/** Event name constant for API response events */
export const EVENT_API_RESPONSE = 'api.response' as const;
