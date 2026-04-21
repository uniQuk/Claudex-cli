/**
 * Stub telemetry types — no data is collected or sent.
 */
import type { ApiLogEventData } from './loggers.js';

export enum LoopType {
  TOOL_LOOP = 'tool_loop',
  CONTENT_LOOP = 'content_loop',
  CONSECUTIVE_IDENTICAL_TOOL_CALLS = 'consecutive_identical_tool_calls',
  CHANTING_IDENTICAL_SENTENCES = 'chanting_identical_sentences',
  REPETITIVE_THOUGHTS = 'repetitive_thoughts',
  READ_FILE_LOOP = 'read_file_loop',
  ACTION_STAGNATION = 'action_stagnation',
}

export enum IdeConnectionType {
  VSCODE = 'vscode',
  JETBRAINS = 'jetbrains',
  ZED = 'zed',
  START = 'start',
  SESSION = 'session',
}

// Minimal base class for all event stubs
class BaseEvent implements ApiLogEventData {
  [key: string]: unknown;
  constructor(..._args: unknown[]) {}
}

export class ApiRequestEvent extends BaseEvent {}
export class ApiResponseEvent extends BaseEvent {}
export class ApiErrorEvent extends BaseEvent {}
export class ApiCancelEvent extends BaseEvent {}
export class FileOperationEvent extends BaseEvent {}
export class ToolCallEvent extends BaseEvent {}
export class SubagentExecutionEvent extends BaseEvent {}
export class ContentRetryEvent extends BaseEvent {}
export class ContentRetryFailureEvent extends BaseEvent {}
export class HookCallEvent extends BaseEvent {}
export class ToolOutputTruncatedEvent extends BaseEvent {}
export class StartSessionEvent extends BaseEvent {}
export class RipgrepFallbackEvent extends BaseEvent {}
export class ConversationFinishedEvent extends BaseEvent {}
export class UserPromptEvent extends BaseEvent {}
export class UserRetryEvent extends BaseEvent {}
export class SkillLaunchEvent extends BaseEvent {}
export class AuthEvent extends BaseEvent {}
export class ExtensionDisableEvent extends BaseEvent {}
export class ExtensionEnableEvent extends BaseEvent {}
export class ExtensionInstallEvent extends BaseEvent {}
export class ExtensionUninstallEvent extends BaseEvent {}
export class ExtensionUpdateEvent extends BaseEvent {}
export class IdeConnectionEvent extends BaseEvent {}
export class ModelSlashCommandEvent extends BaseEvent {}
export class PromptSuggestionEvent extends BaseEvent {}
export class SpeculationEvent extends BaseEvent {}
export class MemoryExtractEvent extends BaseEvent {}
export class MemoryDreamEvent extends BaseEvent {}
export class MemoryRecallEvent extends BaseEvent {}
export class ArenaSessionStartedEvent extends BaseEvent {}
export class ArenaAgentCompletedEvent extends BaseEvent {}
export class ArenaSessionEndedEvent extends BaseEvent {}
export class ChatCompressionEvent extends BaseEvent {}
export class NextSpeakerCheckEvent extends BaseEvent {}
export class InvalidChunkEvent extends BaseEvent {}
export class MalformedJsonResponseEvent extends BaseEvent {}
export class FlashFallbackEvent extends BaseEvent {}
export class UserFeedbackEvent extends BaseEvent {}
export class StartupPerformanceEvent extends BaseEvent {}
export class LoopDetectedEvent extends BaseEvent {}
export class LoopDetectionDisabledEvent extends BaseEvent {}
export class KittySequenceOverflowEvent extends BaseEvent {}
export class SlashCommandEvent extends BaseEvent {}

export function makeChatCompressionEvent(_params: {
  tokens_before: number;
  tokens_after: number;
  compression_input_token_count: number;
  compression_output_token_count: number;
}): ChatCompressionEvent {
  return new ChatCompressionEvent();
}

// Arena factory functions (stubs)
export function makeArenaSessionStartedEvent(..._args: unknown[]): ArenaSessionStartedEvent {
  return new ArenaSessionStartedEvent();
}

export function makeArenaAgentCompletedEvent(..._args: unknown[]): ArenaAgentCompletedEvent {
  return new ArenaAgentCompletedEvent();
}

export type ArenaSessionEndedStatus = 'selected' | 'failed' | 'cancelled' | 'discarded' | string;

export function makeArenaSessionEndedEvent(..._args: unknown[]): ArenaSessionEndedEvent {
  return new ArenaSessionEndedEvent();
}

export enum SlashCommandStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}

export function makeSlashCommandEvent(_params: unknown): SlashCommandEvent {
  return new SlashCommandEvent();
}
