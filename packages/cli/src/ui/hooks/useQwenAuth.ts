/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/** Stub — Qwen OAuth removed. */
export interface QwenAuthState {
  deviceAuth: null;
  authStatus: 'idle';
  errorMessage: null;
  authMessage?: string;
}

export function useQwenAuth(
  _pendingAuthType: unknown,
  _isAuthenticating: boolean,
): { qwenAuthState: QwenAuthState; cancelQwenAuth: () => void } {
  return {
    qwenAuthState: {
      deviceAuth: null,
      authStatus: 'idle',
      errorMessage: null,
      authMessage: undefined,
    },
    cancelQwenAuth: () => {},
  };
}
