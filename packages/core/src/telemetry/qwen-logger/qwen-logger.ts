/**
 * Stub ClaudexLogger — no-op, sends no data to any remote endpoint.
 */

export class ClaudexLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getInstance(_config?: unknown): ClaudexLogger | undefined {
    return undefined;
  }

  static clearInstance(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logEvent(_event: unknown): void {}

  async flush(): Promise<void> {}

  async shutdown(): Promise<void> {}
}
