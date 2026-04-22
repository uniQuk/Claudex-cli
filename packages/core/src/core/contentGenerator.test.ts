/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createContentGenerator,
  AuthType,
} from './contentGenerator.js';
import type { Config } from '../config/config.js';
import { LoggingContentGenerator } from './loggingContentGenerator/index.js';
import { OpenAIContentGenerator } from './openaiContentGenerator/index.js';

vi.mock('./openaiContentGenerator/index.js', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('./openaiContentGenerator/index.js')>();
  const mockGenerator = { generateContent: vi.fn(), generateContentStream: vi.fn(), countTokens: vi.fn(), embedContent: vi.fn(), useSummarizedThinking: vi.fn() };
  return {
    ...original,
    createOpenAIContentGenerator: vi.fn(() => mockGenerator),
    OpenAIContentGenerator: original.OpenAIContentGenerator,
  };
});

describe('createContentGenerator', () => {
  it('should create an OpenAI content generator', async () => {
    const mockConfig = {
      getUsageStatisticsEnabled: () => true,
      getContentGeneratorConfig: () => ({}),
      getCliVersion: () => '1.0.0',
      getProxy: () => undefined,
    } as unknown as Config;

    const generator = await createContentGenerator(
      {
        model: 'test-model',
        apiKey: 'test-api-key',
        authType: AuthType.USE_OPENAI,
      },
      mockConfig,
    );

    const { createOpenAIContentGenerator } = await import(
      './openaiContentGenerator/index.js'
    );
    expect(createOpenAIContentGenerator).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'test-model', apiKey: 'test-api-key' }),
      mockConfig,
    );
    // We expect it to be a LoggingContentGenerator wrapping an OpenAI generator
    expect(generator).toBeInstanceOf(LoggingContentGenerator);
    const wrapped = (generator as LoggingContentGenerator).getWrapped();
    expect(wrapped).toBeDefined();
  });

  it('should create an OpenAI content generator with usage statistics disabled', async () => {
    const mockConfig = {
      getUsageStatisticsEnabled: () => false,
      getContentGeneratorConfig: () => ({}),
      getCliVersion: () => '1.0.0',
      getProxy: () => undefined,
    } as unknown as Config;

    const generator = await createContentGenerator(
      {
        model: 'test-model',
        apiKey: 'test-api-key',
        authType: AuthType.USE_OPENAI,
      },
      mockConfig,
    );

    expect(generator).toBeInstanceOf(LoggingContentGenerator);
  });
});
