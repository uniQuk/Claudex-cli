/**
 * Stub telemetry index — no data is collected or sent.
 * All OpenTelemetry SDK initialization is removed.
 */

export const DEFAULT_OTLP_ENDPOINT = '';
export const DEFAULT_TELEMETRY_TARGET = 'none';

export type TelemetryTarget = 'none' | 'local' | 'gcp';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function initializeTelemetry(_config: unknown): void {}

// Re-export all stubs so callers can import from 'telemetry/index.js'
export * from './loggers.js';
export * from './types.js';
export * from './uiTelemetry.js';

/** @deprecated Dead-letter stub for ClaudexLogger — no-op class. */
export class ClaudexLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logStartSessionEvent(_args: unknown): void {}
}
