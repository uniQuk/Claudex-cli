/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodingPlanUpdateRequest {
  prompt: string;
  onConfirm: (confirmed: boolean) => void;
}

/** Stub — Coding Plan feature removed. Always returns no pending update. */
export function useCodingPlanUpdates(
  _settings: unknown,
  _config: unknown,
  _addItem: unknown,
): { codingPlanUpdateRequest: CodingPlanUpdateRequest | undefined; dismissCodingPlanUpdate: () => void } {
  return {
    codingPlanUpdateRequest: undefined,
    dismissCodingPlanUpdate: () => {},
  };
}
