/**
 * @license
 * Copyright 2025 Claudex
 * SPDX-License-Identifier: Apache-2.0
 */

export const CLAUDEX_CODE_SIMPLE_ENV_VAR = 'CLAUDEX_CODE_SIMPLE';

function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase().trim());
}

export function isBareMode(cliFlag?: boolean): boolean {
  return cliFlag === true || isTruthy(process.env[CLAUDEX_CODE_SIMPLE_ENV_VAR]);
}
