/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  MCPServerConfig,
  MCPServerStatus,
} from '@claudex/core';

/** MCP management step identifiers */
export const MCP_MANAGEMENT_STEPS = {
  SERVER_LIST: 'server-list',
  SERVER_DETAIL: 'server-detail',
  DISABLE_SCOPE_SELECT: 'disable-scope-select',
  TOOL_LIST: 'tool-list',
  TOOL_DETAIL: 'tool-detail',
  AUTHENTICATE: 'authenticate',
} as const;

export type MCPManagementStep =
  (typeof MCP_MANAGEMENT_STEPS)[keyof typeof MCP_MANAGEMENT_STEPS];

/** Display information for an MCP server */
export interface MCPServerDisplayInfo {
  name: string;
  status: MCPServerStatus;
  source: 'user' | 'project' | 'extension';
  configPath?: string;
  config: MCPServerConfig;
  toolCount: number;
  /** Number of tools missing name or description */
  invalidToolCount?: number;
  promptCount: number;
  errorMessage?: string;
  isDisabled: boolean;
  hasOAuthTokens?: boolean;
}

/** Display information for an MCP tool */
export interface MCPToolDisplayInfo {
  name: string;
  description?: string;
  serverName: string;
  schema?: object;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  /** Whether the tool is valid (requires name and description to be callable by LLM) */
  isValid: boolean;
  invalidReason?: string;
}

/** Display information for an MCP prompt */
export interface MCPPromptDisplayInfo {
  name: string;
  description?: string;
  serverName: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

/** Servers grouped by their source */
export interface GroupedServers {
  source: string;
  displayName: string;
  configPath?: string;
  servers: MCPServerDisplayInfo[];
}

export interface ServerListStepProps {
  servers: MCPServerDisplayInfo[];
  onSelect: (index: number) => void;
}

export interface ServerDetailStepProps {
  server: MCPServerDisplayInfo | null;
  onViewTools: () => void;
  onReconnect?: () => void;
  onDisable?: () => void;
  onAuthenticate?: () => void;
  onClearAuth?: () => void;
  onBack: () => void;
}

export interface DisableScopeSelectStepProps {
  server: MCPServerDisplayInfo | null;
  onSelectScope: (scope: 'user' | 'workspace') => void;
  onBack: () => void;
}

export interface ToolListStepProps {
  tools: MCPToolDisplayInfo[];
  serverName: string;
  onSelect: (tool: MCPToolDisplayInfo) => void;
  onBack: () => void;
}

export interface ToolDetailStepProps {
  tool: MCPToolDisplayInfo | null;
  onBack: () => void;
}

export interface AuthenticateStepProps {
  server: MCPServerDisplayInfo | null;
  onBack: () => void;
}

export interface MCPManagementDialogProps {
  onClose: () => void;
}
