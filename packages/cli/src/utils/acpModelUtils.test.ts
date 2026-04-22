/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { AuthType } from '@claudex/core';
import {
  formatAcpModelId,
  parseAcpBaseModelId,
  parseAcpModelOption,
} from './acpModelUtils.js';

describe('acpModelUtils', () => {
  it('formats modelId(authType)', () => {
    expect(formatAcpModelId('claudex3', AuthType.CLAUDEX_OAUTH)).toBe(
      `claudex3(${AuthType.CLAUDEX_OAUTH})`,
    );
  });

  it('extracts base model id when string ends with parentheses', () => {
    expect(parseAcpBaseModelId(`claudex3(${AuthType.USE_OPENAI})`)).toBe('claudex3');
  });

  it('does not strip when parentheses are not a trailing suffix', () => {
    expect(parseAcpBaseModelId('claudex3(x) y')).toBe('claudex3(x) y');
  });

  it('parses modelId and validates authType', () => {
    expect(parseAcpModelOption(` claudex3(${AuthType.USE_OPENAI}) `)).toEqual({
      modelId: 'claudex3',
      authType: AuthType.USE_OPENAI,
    });
  });

  it('returns trimmed input as modelId when authType is invalid', () => {
    expect(parseAcpModelOption('claudex3(not-a-real-auth)')).toEqual({
      modelId: 'claudex3(not-a-real-auth)',
    });
  });
});
