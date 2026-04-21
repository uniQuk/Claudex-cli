/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/** Maximum number of tools to display in a list */
export const MAX_DISPLAY_TOOLS = 10;

/** Maximum number of prompts to display in a list */
export const MAX_DISPLAY_PROMPTS = 10;

/** Maximum number of log entries visible in the viewport */
export const VISIBLE_LOGS_COUNT = 15;

/** Maximum number of tools visible in the viewport */
export const VISIBLE_TOOLS_COUNT = 10;

/** Display name mapping by source type */
export const SOURCE_DISPLAY_NAMES: Record<string, string> = {
  user: 'User MCPs',
  project: 'Project MCPs',
  extension: 'Extension MCPs',
};

/** Display text for each connection status */
export const STATUS_TEXT: Record<string, string> = {
  connected: 'connected',
  connecting: 'connecting',
  disconnected: 'failed',
};
