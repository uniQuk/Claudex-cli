/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import { type Key } from '../hooks/useKeypress.js';
import { type IdeIntegrationNudgeResult } from '../IdeIntegrationNudge.js';
import { type FolderTrustChoice } from '../components/FolderTrustDialog.js';
import {
  type AuthType,
  type EditorType,
  type ApprovalMode,
} from '@claudex/core';
import { type SettingScope } from '../../config/settings.js';
import type { AuthState } from '../types.js';
// OpenAICredentials type (previously imported from OpenAIKeyPrompt)
export interface OpenAICredentials {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface UIActions {
  openThemeDialog: () => void;
  openEditorDialog: () => void;
  openMemoryDialog: () => void;
  handleThemeSelect: (
    themeName: string | undefined,
    scope: SettingScope,
  ) => void;
  handleThemeHighlight: (themeName: string | undefined) => void;
  handleApprovalModeSelect: (
    mode: ApprovalMode | undefined,
    scope: SettingScope,
  ) => void;
  handleAuthSelect: (
    authType: AuthType | undefined,
    credentials?: OpenAICredentials,
  ) => Promise<void>;
  setAuthState: (state: AuthState) => void;
  onAuthError: (error: string | null) => void;
  cancelAuthentication: () => void;
  handleEditorSelect: (
    editorType: EditorType | undefined,
    scope: SettingScope,
  ) => void;
  exitEditorDialog: () => void;
  closeSettingsDialog: () => void;
  closeMemoryDialog: () => void;
  closeModelDialog: () => void;
  openModelDialog: (options?: { fastModelMode?: boolean }) => void;
  dismissCodingPlanUpdate: () => void;
  closeTrustDialog: () => void;
  closePermissionsDialog: () => void;
  setShellModeActive: (value: boolean) => void;
  vimHandleInput: (key: Key) => boolean;
  handleIdePromptComplete: (result: IdeIntegrationNudgeResult) => void;
  handleFolderTrustSelect: (choice: FolderTrustChoice) => void;
  setConstrainHeight: (value: boolean) => void;
  onEscapePromptChange: (show: boolean) => void;
  onSuggestionsVisibilityChange: (visible: boolean) => void;
  refreshStatic: () => void;
  handleFinalSubmit: (value: string) => void;
  handleRetryLastPrompt: () => void;
  handleClearScreen: () => void;
  popAllQueuedMessages: () => string | null;
  // Welcome back dialog
  handleWelcomeBackSelection: (choice: 'continue' | 'restart') => void;
  handleWelcomeBackClose: () => void;
  // Subagent dialogs
  closeSubagentCreateDialog: () => void;
  closeAgentsManagerDialog: () => void;
  // Extensions manager dialog
  closeExtensionsManagerDialog: () => void;
  // MCP dialog
  closeMcpDialog: () => void;
  // Hooks dialog
  openHooksDialog: () => void;
  // Hooks dialog
  closeHooksDialog: () => void;
  // Resume session dialog
  openResumeDialog: () => void;
  closeResumeDialog: () => void;
  handleResume: (sessionId: string) => void;
  // Feedback dialog
  openFeedbackDialog: () => void;
  closeFeedbackDialog: () => void;
  temporaryCloseFeedbackDialog: () => void;
  submitFeedback: (rating: number) => void;
}

export const UIActionsContext = createContext<UIActions | null>(null);

export const useUIActions = () => {
  const context = useContext(UIActionsContext);
  if (!context) {
    throw new Error('useUIActions must be used within a UIActionsProvider');
  }
  return context;
};
