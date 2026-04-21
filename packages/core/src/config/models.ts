/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// Default model when using OpenAI-compatible providers.
// Override via OPENAI_MODEL or CLAUDEX_MODEL env vars, or --model flag.
export const MAINLINE_CODER_MODEL = 'qwen3.5-plus';

// Legacy aliases kept for compatibility
export const DEFAULT_QWEN_MODEL = MAINLINE_CODER_MODEL;
export const DEFAULT_QWEN_FLASH_MODEL = MAINLINE_CODER_MODEL;
export const DEFAULT_QWEN_EMBEDDING_MODEL = 'text-embedding-v4';

