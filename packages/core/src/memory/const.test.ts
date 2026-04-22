/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi, describe, it, expect } from 'vitest';
import {
  setContextFilename,
  getCurrentContextFilename,
  getAllContextFilenames,
} from './const.js';

// Mock dependencies
vi.mock(import('node:fs/promises'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mkdir: vi.fn(),
    readFile: vi.fn(),
  };
});

vi.mock('os');

describe('setContextFilename', () => {
  it('should update currentGeminiMdFilename when a valid new name is provided', () => {
    const newName = 'CUSTOM_CONTEXT.md';
    setContextFilename(newName);
    expect(getCurrentContextFilename()).toBe(newName);
  });

  it('should not update currentGeminiMdFilename if the new name is empty or whitespace', () => {
    const initialName = getCurrentContextFilename(); // Get current before trying to change
    setContextFilename('  ');
    expect(getCurrentContextFilename()).toBe(initialName);

    setContextFilename('');
    expect(getCurrentContextFilename()).toBe(initialName);
  });

  it('should handle an array of filenames', () => {
    const newNames = ['CUSTOM_CONTEXT.md', 'ANOTHER_CONTEXT.md'];
    setContextFilename(newNames);
    expect(getCurrentContextFilename()).toBe('CUSTOM_CONTEXT.md');
    expect(getAllContextFilenames()).toEqual(newNames);
  });
});
