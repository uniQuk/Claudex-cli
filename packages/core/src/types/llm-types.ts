/**
 * LLM type shim — single import point for all types originally sourced from
 * @google/genai. The rest of the codebase MUST import LLM types from here,
 * not directly from @google/genai.
 *
 * Long-term goal: replace @google/genai types with fully local definitions.
 * For now, this shim re-exports everything and lets us decouple incrementally.
 */
export * from '@google/genai';
