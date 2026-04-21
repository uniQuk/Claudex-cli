/**
 * Dead-letter stub for CodingPlan constants — no-op.
 * CodingPlan is not available in Claudex.
 */

export const CODING_PLAN_ENV_KEY = '__CLAUDEX_CODING_PLAN__' as const;

export enum CodingPlanRegion {
  CHINA = 'china',
  GLOBAL = 'global',
}

export interface CodingPlanSettings {
  region?: CodingPlanRegion;
  version?: string;
}

export function getCodingPlanConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _region: CodingPlanRegion,
): { template: Array<{ id: string; name: string; baseUrl: string; model: string }>; version: string; baseUrl: string } {
  return { template: [], version: '1.0', baseUrl: '' };
}

export function isCodingPlanConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _baseUrl: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _envKey: string | undefined,
): boolean {
  return false;
}
