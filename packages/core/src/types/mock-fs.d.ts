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
