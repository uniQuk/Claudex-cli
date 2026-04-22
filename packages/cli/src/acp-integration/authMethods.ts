/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthType } from '@claudex/core';
import type { AuthMethod } from '@agentclientprotocol/sdk';

export function buildAuthMethods(): AuthMethod[] {
  return [
    {
      id: AuthType.USE_OPENAI,
      name: 'Use OpenAI API key',
      description: 'Requires setting the `OPENAI_API_KEY` environment variable',
      _meta: {
        type: 'terminal',
        args: ['--auth-type=openai'],
      },
    },
    {
      id: AuthType.CLAUDEX_OAUTH,
      name: 'Claudex OAuth',
      description: 'Claudex OAuth (free tier discontinued 2026-04-15)',
      _meta: {
        type: 'terminal',
        args: ['--auth-type=claudex-oauth'],
      },
    },
  ];
}

export function filterAuthMethodsById(
  authMethods: AuthMethod[],
  authMethodId: string,
): AuthMethod[] {
  return authMethods.filter((method) => method.id === authMethodId);
}

export function pickAuthMethodsForDetails(details?: string): AuthMethod[] {
  const authMethods = buildAuthMethods();
  if (!details) {
    return authMethods;
  }
  if (details.includes('claudex-oauth') || details.includes('Claudex OAuth')) {
    const narrowed = filterAuthMethodsById(authMethods, AuthType.CLAUDEX_OAUTH);
    return narrowed.length ? narrowed : authMethods;
  }
  return authMethods;
}
