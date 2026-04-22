declare module 'mock-fs' {
  interface FileOptions {
    content?: string | Buffer;
    mode?: number;
    uid?: number;
    gid?: number;
    mtime?: Date;
    atime?: Date;
    ctime?: Date;
    birthtime?: Date;
  }
  function mockFs(config?: Record<string, unknown>): void;
  namespace mockFs {
    function restore(): void;
    function file(options: FileOptions): unknown;
  }
  export = mockFs;
}

declare module 'memfs' {
  import type { IFs } from 'memfs/lib/node';
  export const fs: IFs;
  export const vol: {
    fromJSON(json: Record<string, string>, cwd?: string): void;
    reset(): void;
    toJSON(paths?: string[]): Record<string, string | null>;
    unlinkSync(path: string): void;
    mkdirSync(path: string, options?: { recursive?: boolean }): void;
    writeFileSync(path: string, data: string | Buffer): void;
    readFileSync(path: string, encoding?: BufferEncoding): string | Buffer;
  };
}
