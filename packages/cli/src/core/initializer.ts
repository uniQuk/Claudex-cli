/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';
import {
  IdeClient,
  IdeConnectionEvent,
  IdeConnectionType,
  logIdeConnection,
  Storage,
  type Config,
} from '@claudex/core';
import { type LoadedSettings } from '../config/settings.js';
import { performInitialAuth } from './auth.js';
import { validateTheme } from './theme.js';
import { initializeI18n, type SupportedLanguage } from '../i18n/index.js';

export interface InitializationResult {
  authError: string | null;
  themeError: string | null;
  shouldOpenAuthDialog: boolean;
  geminiMdFileCount: number;
}

/**
 * Orchestrates the application's startup initialization.
 * This runs BEFORE the React UI is rendered.
 * @param config The application config.
 * @param settings The loaded application settings.
 * @returns The results of the initialization.
 */
/**
 * Migrates ~/.qwen to ~/.claudex on first run if the new directory doesn't exist.
 */
function migrateStorageDir(): void {
  const oldDir = path.join(os.homedir(), '.qwen');
  const newDir = Storage.getGlobalClaudexDir();
  if (!fs.existsSync(newDir) && fs.existsSync(oldDir)) {
    try {
      fs.renameSync(oldDir, newDir);
    } catch {
      // Non-fatal — fall back to creating a fresh directory
    }
  }
}

export async function initializeApp(
  config: Config,
  settings: LoadedSettings,
): Promise<InitializationResult> {
  // Migrate storage dir from .qwen to .claudex if needed
  migrateStorageDir();

  // Initialize i18n system
  const languageSetting =
    process.env['CLAUDEX_LANG'] ||
    process.env['QWEN_CODE_LANG'] ||
    (settings.merged.general?.language as string) ||
    'auto';
  await initializeI18n(languageSetting as SupportedLanguage | 'auto');

  // Use authType from modelsConfig which respects CLI --auth-type argument
  // over settings.security.auth.selectedType
  const authType = config.getModelsConfig().getCurrentAuthType();
  const authError = await performInitialAuth(config, authType);

  const themeError = validateTheme(settings);

  const shouldOpenAuthDialog =
    !config.getModelsConfig().wasAuthTypeExplicitlyProvided() || !!authError;

  if (config.getIdeMode()) {
    const ideClient = await IdeClient.getInstance();
    await ideClient.connect();
    logIdeConnection(config, new IdeConnectionEvent(IdeConnectionType.START));
  }

  return {
    authError,
    themeError,
    shouldOpenAuthDialog,
    geminiMdFileCount: config.getGeminiMdFileCount(),
  };
}
