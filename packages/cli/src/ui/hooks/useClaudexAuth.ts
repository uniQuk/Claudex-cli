/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/** Stub — Claudex OAuth removed. */
export interface ClaudexAuthState {
  deviceAuth: null;
  authStatus: 'idle';
  errorMessage: null;
  authMessage?: string;
}

export function useClaudexAuth(
  _pendingAuthType: unknown,
  _isAuthenticating: boolean,
): { claudexAuthState: ClaudexAuthState; cancelClaudexAuth: () => void } {
  return {
    claudexAuthState: {
      deviceAuth: null,
      authStatus: 'idle',
      errorMessage: null,
      authMessage: undefined,
    },
    cancelClaudexAuth: () => {},
  };
}
