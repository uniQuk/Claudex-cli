/**
 * Stub telemetry loggers — all functions are no-ops. No data is sent.
 */

export interface ApiLogEventData {
  request_text?: string;
  response_id?: string;
  model?: string;
  prompt_id?: string;
  input_token_count?: number;
  output_token_count?: number;
  status_code?: number;
  error_type?: string;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logApiRequest(_config: unknown, _event: ApiLogEventData): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logApiResponse(_config: unknown, _event: ApiLogEventData): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logApiError(_config: unknown, _event: ApiLogEventData): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logApiCancel(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logFileOperation(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logToolCall(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logSubagentExecution(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logContentRetry(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logContentRetryFailure(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logHookCall(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logToolOutputTruncated(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logStartSession(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logRipgrepFallback(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logConversationFinishedEvent(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logUserPrompt(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logUserRetry(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logSkillLaunch(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logAuth(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logExtensionDisable(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logExtensionEnable(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logExtensionUpdateEvent(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logIdeConnection(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logModelSlashCommand(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logPromptSuggestion(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logSpeculation(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logMemoryExtract(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logMemoryDream(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logMemoryRecall(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logChatCompression(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logNextSpeakerCheck(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logArenaSessionStarted(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logArenaAgentCompleted(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logArenaSessionEnded(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logFlashFallback(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logUserFeedback(_config: unknown, _event: unknown): void {}

// Additional missing loggers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logExtensionInstallEvent(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logExtensionUninstall(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logLoopDetected(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logStartupPerformance(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logInvalidChunk(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logMalformedJsonResponse(_config: unknown, _event: unknown): void {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logLoopDetectionDisabled(_config: unknown, _event: unknown): void {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logKittySequenceOverflow(_config: unknown, _event: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function logSlashCommand(_config: unknown, _event: unknown): void {}
