/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const CLAUDEX_CONFIG_DIR = '.claudex';
/** @deprecated Use CLAUDEX_CONFIG_DIR */
export const QWEN_CONFIG_DIR = CLAUDEX_CONFIG_DIR;
export const DEFAULT_CONTEXT_FILENAME = 'CLAUDEX.md';
export const AGENT_CONTEXT_FILENAME = 'AGENTS.md';
export const MEMORY_SECTION_HEADER = '## Claudex Added Memories';

// The currently configured context filename(s).
// Defaults to both CLAUDEX.md and AGENTS.md; can be overridden at startup.
// CLAUDEX.md is first (used by /init command tool).
let currentContextFilename: string | string[] = [
  DEFAULT_CONTEXT_FILENAME,
  AGENT_CONTEXT_FILENAME,
];

export function setContextFilename(newFilename: string | string[]): void {
  if (Array.isArray(newFilename)) {
    if (newFilename.length > 0) {
      currentContextFilename = newFilename.map((name) => name.trim());
    }
  } else if (newFilename && newFilename.trim() !== '') {
    currentContextFilename = newFilename.trim();
  }
}

export function getCurrentContextFilename(): string {
  if (Array.isArray(currentContextFilename)) {
    return currentContextFilename[0];
  }
  return currentContextFilename;
}

export function getAllContextFilenames(): string[] {
  if (Array.isArray(currentContextFilename)) {
    return currentContextFilename;
  }
  return [currentContextFilename];
}

// Backward-compat aliases
/** @deprecated Use setContextFilename */
export const setGeminiMdFilename = setContextFilename;
/** @deprecated Use getCurrentContextFilename */
export const getCurrentGeminiMdFilename = getCurrentContextFilename;
/** @deprecated Use getAllContextFilenames */
export const getAllGeminiMdFilenames = getAllContextFilenames;
