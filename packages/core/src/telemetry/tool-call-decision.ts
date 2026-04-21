/**
 * Stub tool call decision telemetry — no-op.
 */
export type ToolCallDecisionEvent = Record<string, unknown>;

export enum ToolCallDecision {
  ACCEPT = 'accept',
  REJECT = 'reject',
  MODIFY = 'modify',
  AUTO_ACCEPT = 'auto-accept',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logToolCallDecision(_config: unknown, _event: unknown): void {}
