import type { GenerateContentConfig } from '../../../types/llm-types.js';
import type OpenAI from 'openai';

export interface OpenAICompatibleProvider {
  buildHeaders(): Record<string, string | undefined>;
  buildClient(): OpenAI;
  buildRequest(
    request: OpenAI.Chat.ChatCompletionCreateParams,
    userPromptId: string,
  ): OpenAI.Chat.ChatCompletionCreateParams;
  getDefaultGenerationConfig(): GenerateContentConfig;
}
