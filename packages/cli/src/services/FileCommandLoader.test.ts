/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from 'node:path';
import type { Config } from '@claudex/core';
import { Storage } from '@claudex/core';
import mock from 'mock-fs';
import { FileCommandLoader } from './FileCommandLoader.js';
import { assert, vi } from 'vitest';
import { createMockCommandContext } from '../test-utils/mockCommandContext.js';
import {
  SHELL_INJECTION_TRIGGER,
  SHORTHAND_ARGS_PLACEHOLDER,
  type PromptPipelineContent,
} from './prompt-processors/types.js';
import {
  ConfirmationRequiredError,
  ShellProcessor,
} from './prompt-processors/shellProcessor.js';
import { DefaultArgumentProcessor } from './prompt-processors/argumentProcessor.js';
import type { CommandContext } from '../ui/commands/types.js';
import { AtFileProcessor } from './prompt-processors/atFileProcessor.js';

const mockShellProcess = vi.hoisted(() => vi.fn());
const mockAtFileProcess = vi.hoisted(() => vi.fn());
vi.mock('./prompt-processors/atFileProcessor.js', () => ({
  AtFileProcessor: vi.fn().mockImplementation(() => ({
    process: mockAtFileProcess,
  })),
}));
vi.mock('./prompt-processors/shellProcessor.js', () => ({
  ShellProcessor: vi.fn().mockImplementation(() => ({
    process: mockShellProcess,
  })),
  ConfirmationRequiredError: class extends Error {
    constructor(
      message: string,
      public commandsToConfirm: string[],
    ) {
      super(message);
      this.name = 'ConfirmationRequiredError';
    }
  },
}));

vi.mock('./prompt-processors/argumentProcessor.js', async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import('./prompt-processors/argumentProcessor.js')
    >();
  return {
    DefaultArgumentProcessor: vi
      .fn()
      .mockImplementation(() => new original.DefaultArgumentProcessor()),
  };
});
vi.mock('@claudex/core', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@claudex/core')>();
  return {
    ...original,
    Storage: original.Storage,
    isCommandAllowed: vi.fn(),
    ShellExecutionService: {
      execute: vi.fn(),
    },
  };
});

describe('FileCommandLoader', () => {
  const signal: AbortSignal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
    mockShellProcess.mockImplementation(
      (prompt: PromptPipelineContent, context: CommandContext) => {
        const userArgsRaw = context?.invocation?.args || '';
        // This is a simplified mock. A real implementation would need to iterate
        // through all parts and process only the text parts.
        const firstTextPart = prompt.find(
          (p) => typeof p === 'string' || 'text' in p,
        );
        let textContent = '';
        if (typeof firstTextPart === 'string') {
          textContent = firstTextPart;
        } else if (firstTextPart && 'text' in firstTextPart) {
          textContent = firstTextPart.text ?? '';
        }

        const processedText = textContent.replaceAll(
          SHORTHAND_ARGS_PLACEHOLDER,
          userArgsRaw,
        );
        return Promise.resolve([{ text: processedText }]);
      },
    );
    mockAtFileProcess.mockImplementation(async (prompt: string) => prompt);
  });

  afterEach(() => {
    mock.restore();
  });

  it('loads a single command from a file', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'test.md': '---\ndescription: ""\n---\nThis is a test prompt',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    expect(commands).toHaveLength(1);
    const command = commands[0];
    expect(command).toBeDefined();
    expect(command.name).toBe('test');

    const result = await command.action?.(
      createMockCommandContext({
        invocation: {
          raw: '/test',
          name: 'test',
          args: '',
        },
      }),
      '',
    );
    if (result?.type === 'submit_prompt') {
      expect(result.content).toEqual([{ text: 'This is a test prompt' }]);
    } else {
      assert.fail('Incorrect action type');
    }
  });

  // Symlink creation on Windows requires special permissions that are not
  // available in the standard CI environment. Therefore, we skip these tests
  // on Windows to prevent CI failures. The core functionality is still
  // validated on Linux and macOS.
  const itif = (condition: boolean) => (condition ? it : it.skip);

  itif(process.platform !== 'win32')(
    'loads commands from a symlinked directory',
    async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      const realCommandsDir = '/real/commands';
      mock({
        [realCommandsDir]: {
          'test.md': '---\ndescription: ""\n---\nThis is a test prompt',
        },
        // Symlink the user commands directory to the real one
        [userCommandsDir]: mock.symlink({
          path: realCommandsDir,
        }),
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(1);
      const command = commands[0];
      expect(command).toBeDefined();
      expect(command.name).toBe('test');
    },
  );

  itif(process.platform !== 'win32')(
    'loads commands from a symlinked subdirectory',
    async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      const realNamespacedDir = '/real/namespaced-commands';
      mock({
        [userCommandsDir]: {
          namespaced: mock.symlink({
            path: realNamespacedDir,
          }),
        },
        [realNamespacedDir]: {
          'my-test.md': '---\ndescription: ""\n---\nThis is a test prompt',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(1);
      const command = commands[0];
      expect(command).toBeDefined();
      expect(command.name).toBe('namespaced:my-test');
    },
  );

  it('loads multiple commands', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'test1.md': '---\ndescription: ""\n---\nPrompt 1',
        'test2.md': '---\ndescription: ""\n---\nPrompt 2',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    expect(commands).toHaveLength(2);
  });

  it('creates deeply nested namespaces correctly', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();

    mock({
      [userCommandsDir]: {
        gcp: {
          pipelines: {
            'run.md': '---\ndescription: ""\n---\nrun pipeline',
          },
        },
      },
    });
    const mockConfig = {
      getProjectRoot: vi.fn(() => '/path/to/project'),
      getExtensions: vi.fn(() => []),
      getFolderTrustFeature: vi.fn(() => false),
      getFolderTrust: vi.fn(() => false),
    } as unknown as Config;
    const loader = new FileCommandLoader(mockConfig);
    const commands = await loader.loadCommands(signal);
    expect(commands).toHaveLength(1);
    expect(commands[0]!.name).toBe('gcp:pipelines:run');
  });

  it('creates namespaces from nested directories', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        git: {
          'commit.md': '---\ndescription: ""\n---\ngit commit prompt',
        },
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    expect(commands).toHaveLength(1);
    const command = commands[0];
    expect(command).toBeDefined();
    expect(command.name).toBe('git:commit');
  });

  it('returns both user and project commands in order', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    const projectCommandsDir = new Storage(
      process.cwd(),
    ).getProjectCommandsDir();
    mock({
      [userCommandsDir]: {
        'test.md': '---\ndescription: ""\n---\nUser prompt',
      },
      [projectCommandsDir]: {
        'test.md': '---\ndescription: ""\n---\nProject prompt',
      },
    });

    const mockConfig = {
      getProjectRoot: vi.fn(() => process.cwd()),
      getExtensions: vi.fn(() => []),
      getFolderTrustFeature: vi.fn(() => false),
      getFolderTrust: vi.fn(() => false),
    } as unknown as Config;
    const loader = new FileCommandLoader(mockConfig);
    const commands = await loader.loadCommands(signal);

    expect(commands).toHaveLength(2);
    const userResult = await commands[0].action?.(
      createMockCommandContext({
        invocation: {
          raw: '/test',
          name: 'test',
          args: '',
        },
      }),
      '',
    );
    if (userResult?.type === 'submit_prompt') {
      expect(userResult.content).toEqual([{ text: 'User prompt' }]);
    } else {
      assert.fail('Incorrect action type for user command');
    }
    const projectResult = await commands[1].action?.(
      createMockCommandContext({
        invocation: {
          raw: '/test',
          name: 'test',
          args: '',
        },
      }),
      '',
    );
    if (projectResult?.type === 'submit_prompt') {
      expect(projectResult.content).toEqual([{ text: 'Project prompt' }]);
    } else {
      assert.fail('Incorrect action type for project command');
    }
  });

  it('skips auto-discovered commands in bare mode', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    const projectCommandsDir = new Storage(
      process.cwd(),
    ).getProjectCommandsDir();
    mock({
      [userCommandsDir]: {
        'user.md': '---\ndescription: ""\n---\nUser prompt',
      },
      [projectCommandsDir]: {
        'project.md': '---\ndescription: ""\n---\nProject prompt',
      },
    });

    const mockConfig = {
      getProjectRoot: vi.fn(() => process.cwd()),
      getExtensions: vi.fn(() => []),
      getFolderTrustFeature: vi.fn(() => false),
      getFolderTrust: vi.fn(() => false),
      getBareMode: vi.fn(() => true),
    } as unknown as Config;
    const loader = new FileCommandLoader(mockConfig);
    const commands = await loader.loadCommands(signal);

    expect(commands).toEqual([]);
  });

  it('loads files with non-standard YAML frontmatter gracefully', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        // The lenient YAML parser handles non-standard content gracefully
        'unusual.md': '---\ndescription: some value with: colons\n---\nsome prompt',
        'good.md': '---\ndescription: ""\n---\nThis one is fine',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    // Both files are loaded since the markdown parser is lenient
    expect(commands).toHaveLength(2);
    const names = commands.map((c) => c.name).sort();
    expect(names).toEqual(['good', 'unusual']);
  });

  it('loads files with only frontmatter and no prompt body', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        // No body after frontmatter — prompt will be an empty string, still valid
        'no_prompt.md': '---\ndescription: "This file has no body"\n---\n',
        'good.md': '---\ndescription: ""\n---\nThis one is fine',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    // Both files are loaded; the markdown schema accepts empty-string prompts
    expect(commands).toHaveLength(2);
    const names = commands.map((c) => c.name).sort();
    expect(names).toEqual(['good', 'no_prompt']);
  });

  it('handles filename edge cases correctly', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'test.v1.md': '---\ndescription: ""\n---\nTest prompt',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);
    const command = commands[0];
    expect(command).toBeDefined();
    expect(command.name).toBe('test.v1');
  });

  it('handles file system errors gracefully', async () => {
    mock({}); // Mock an empty file system
    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);
    expect(commands).toHaveLength(0);
  });

  it('uses a default description if not provided', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'test.md': '---\ndescription: ""\n---\nTest prompt',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);
    const command = commands[0];
    expect(command).toBeDefined();
    expect(command.description).toBe('Custom command from test.md');
  });

  it('uses the provided description', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'test.md': '---\ndescription: "My test command"\n---\nTest prompt',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);
    const command = commands[0];
    expect(command).toBeDefined();
    expect(command.description).toBe('My test command');
  });

  it('should sanitize colons in filenames to prevent namespace conflicts', async () => {
    const userCommandsDir = Storage.getUserCommandsDir();
    mock({
      [userCommandsDir]: {
        'legacy:command.md': '---\ndescription: ""\n---\nThis is a legacy command',
      },
    });

    const loader = new FileCommandLoader(null);
    const commands = await loader.loadCommands(signal);

    expect(commands).toHaveLength(1);
    const command = commands[0];
    expect(command).toBeDefined();

    // Verify that the ':' in the filename was replaced with an '_'
    expect(command.name).toBe('legacy_command');
  });

  describe('Processor Instantiation Logic', () => {
    it('instantiates only DefaultArgumentProcessor if no {{args}} or !{} are present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'simple.md': '---\ndescription: ""\n---\nJust a regular prompt',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).not.toHaveBeenCalled();
      expect(DefaultArgumentProcessor).toHaveBeenCalledTimes(1);
    });

    it('instantiates only ShellProcessor if {{args}} is present (but not !{})', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'args.md': '---\ndescription: ""\n---\nPrompt with {{args}}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledTimes(1);
      expect(DefaultArgumentProcessor).not.toHaveBeenCalled();
    });

    it('instantiates ShellProcessor and DefaultArgumentProcessor if !{} is present (but not {{args}})', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shell.md': '---\ndescription: ""\n---\nPrompt with !{cmd}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledTimes(1);
      expect(DefaultArgumentProcessor).toHaveBeenCalledTimes(1);
    });

    it('instantiates only ShellProcessor if both {{args}} and !{} are present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'both.md': '---\ndescription: ""\n---\nPrompt with {{args}} and !{cmd}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledTimes(1);
      expect(DefaultArgumentProcessor).not.toHaveBeenCalled();
    });

    it('instantiates AtFileProcessor and DefaultArgumentProcessor if @{} is present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'at-file.md': '---\ndescription: ""\n---\nContext: @{./my-file.txt}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(AtFileProcessor).toHaveBeenCalledTimes(1);
      expect(ShellProcessor).not.toHaveBeenCalled();
      expect(DefaultArgumentProcessor).toHaveBeenCalledTimes(1);
    });

    it('instantiates ShellProcessor and AtFileProcessor if !{} and @{} are present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shell-and-at.md': '---\ndescription: ""\n---\nRun !{cmd} with @{file.txt}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledTimes(1);
      expect(AtFileProcessor).toHaveBeenCalledTimes(1);
      expect(DefaultArgumentProcessor).toHaveBeenCalledTimes(1); // because no {{args}}
    });

    it('instantiates only ShellProcessor and AtFileProcessor if {{args}} and @{} are present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'args-and-at.md': '---\ndescription: ""\n---\nRun {{args}} with @{file.txt}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledTimes(1);
      expect(AtFileProcessor).toHaveBeenCalledTimes(1);
      expect(DefaultArgumentProcessor).not.toHaveBeenCalled();
    });
  });

  describe('Extension Command Loading', () => {
    it('loads commands from active extensions', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      const projectCommandsDir = new Storage(
        process.cwd(),
      ).getProjectCommandsDir();
      const extensionDir = path.join(
        process.cwd(),
        '.claudex/extensions/test-ext',
      );

      mock({
        [userCommandsDir]: {
          'user.md': '---\ndescription: ""\n---\nUser command',
        },
        [projectCommandsDir]: {
          'project.md': '---\ndescription: ""\n---\nProject command',
        },
        [extensionDir]: {
          'claudex-extension.json': JSON.stringify({
            name: 'test-ext',
            version: '1.0.0',
          }),
          commands: {
            'ext.md': '---\ndescription: ""\n---\nExtension command',
          },
        },
      });

      const mockConfig = {
        getProjectRoot: vi.fn(() => process.cwd()),
        getExtensions: vi.fn(() => [
          {
            name: 'test-ext',
            version: '1.0.0',
            isActive: true,
            path: extensionDir,
          },
        ]),
        getFolderTrustFeature: vi.fn(() => false),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(3);
      const commandNames = commands.map((cmd) => cmd.name);
      expect(commandNames).toEqual(['user', 'project', 'ext']);

      const extCommand = commands.find((cmd) => cmd.name === 'ext');
      expect(extCommand?.extensionName).toBe('test-ext');
      expect(extCommand?.description).toMatch(/^\[test-ext\]/);
    });

    it('extension commands have extensionName metadata for conflict resolution', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      const projectCommandsDir = new Storage(
        process.cwd(),
      ).getProjectCommandsDir();
      const extensionDir = path.join(
        process.cwd(),
        '.claudex/extensions/test-ext',
      );

      mock({
        [extensionDir]: {
          'claudex-extension.json': JSON.stringify({
            name: 'test-ext',
            version: '1.0.0',
          }),
          commands: {
            'deploy.md': '---\ndescription: ""\n---\nExtension deploy command',
          },
        },
        [userCommandsDir]: {
          'deploy.md': '---\ndescription: ""\n---\nUser deploy command',
        },
        [projectCommandsDir]: {
          'deploy.md': '---\ndescription: ""\n---\nProject deploy command',
        },
      });

      const mockConfig = {
        getProjectRoot: vi.fn(() => process.cwd()),
        getExtensions: vi.fn(() => [
          {
            name: 'test-ext',
            version: '1.0.0',
            isActive: true,
            path: extensionDir,
          },
        ]),
        getFolderTrustFeature: vi.fn(() => false),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      // Return all commands, even duplicates
      expect(commands).toHaveLength(3);

      expect(commands[0].name).toBe('deploy');
      expect(commands[0].extensionName).toBeUndefined();
      const result0 = await commands[0].action?.(
        createMockCommandContext({
          invocation: {
            raw: '/deploy',
            name: 'deploy',
            args: '',
          },
        }),
        '',
      );
      expect(result0?.type).toBe('submit_prompt');
      if (result0?.type === 'submit_prompt') {
        expect(result0.content).toEqual([{ text: 'User deploy command' }]);
      }

      expect(commands[1].name).toBe('deploy');
      expect(commands[1].extensionName).toBeUndefined();
      const result1 = await commands[1].action?.(
        createMockCommandContext({
          invocation: {
            raw: '/deploy',
            name: 'deploy',
            args: '',
          },
        }),
        '',
      );
      expect(result1?.type).toBe('submit_prompt');
      if (result1?.type === 'submit_prompt') {
        expect(result1.content).toEqual([{ text: 'Project deploy command' }]);
      }

      expect(commands[2].name).toBe('deploy');
      expect(commands[2].extensionName).toBe('test-ext');
      expect(commands[2].description).toMatch(/^\[test-ext\]/);
      const result2 = await commands[2].action?.(
        createMockCommandContext({
          invocation: {
            raw: '/test-ext.deploy',
            name: 'test-ext.deploy',
            args: '',
          },
        }),
        '',
      );
      expect(result2?.type).toBe('submit_prompt');
      if (result2?.type === 'submit_prompt') {
        expect(result2.content).toEqual([{ text: 'Extension deploy command' }]);
      }
    });

    it('only loads commands from active extensions', async () => {
      const extensionDir1 = path.join(
        process.cwd(),
        '.claudex/extensions/active-ext',
      );
      const extensionDir2 = path.join(
        process.cwd(),
        '.claudex/extensions/inactive-ext',
      );

      mock({
        [extensionDir1]: {
          'claudex-extension.json': JSON.stringify({
            name: 'active-ext',
            version: '1.0.0',
          }),
          commands: {
            'active.md': '---\ndescription: ""\n---\nActive extension command',
          },
        },
        [extensionDir2]: {
          'claudex-extension.json': JSON.stringify({
            name: 'inactive-ext',
            version: '1.0.0',
          }),
          commands: {
            'inactive.md': '---\ndescription: ""\n---\nInactive extension command',
          },
        },
      });

      const mockConfig = {
        getProjectRoot: vi.fn(() => process.cwd()),
        getExtensions: vi.fn(() => [
          {
            name: 'active-ext',
            version: '1.0.0',
            isActive: true,
            path: extensionDir1,
          },
          {
            name: 'inactive-ext',
            version: '1.0.0',
            isActive: false,
            path: extensionDir2,
          },
        ]),
        getFolderTrustFeature: vi.fn(() => false),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(1);
      expect(commands[0].name).toBe('active');
      expect(commands[0].extensionName).toBe('active-ext');
      expect(commands[0].description).toMatch(/^\[active-ext\]/);
    });

    it('handles missing extension commands directory gracefully', async () => {
      const extensionDir = path.join(
        process.cwd(),
        '.claudex/extensions/no-commands',
      );

      mock({
        [extensionDir]: {
          'claudex-extension.json': JSON.stringify({
            name: 'no-commands',
            version: '1.0.0',
          }),
          // No commands directory
        },
      });

      const mockConfig = {
        getProjectRoot: vi.fn(() => process.cwd()),
        getExtensions: vi.fn(() => [
          {
            name: 'no-commands',
            version: '1.0.0',
            isActive: true,
            path: extensionDir,
          },
        ]),
        getFolderTrustFeature: vi.fn(() => false),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);
      expect(commands).toHaveLength(0);
    });

    it('handles nested command structure in extensions', async () => {
      const extensionDir = path.join(process.cwd(), '.claudex/extensions/a');

      mock({
        [extensionDir]: {
          'claudex-extension.json': JSON.stringify({
            name: 'a',
            version: '1.0.0',
          }),
          commands: {
            b: {
              'c.md': '---\ndescription: ""\n---\nNested command from extension a',
              d: {
                'e.md': '---\ndescription: ""\n---\nDeeply nested command',
              },
            },
            'simple.md': '---\ndescription: ""\n---\nSimple command',
          },
        },
      });

      const mockConfig = {
        getProjectRoot: vi.fn(() => process.cwd()),
        getExtensions: vi.fn(() => [
          { name: 'a', version: '1.0.0', isActive: true, path: extensionDir },
        ]),
        getFolderTrustFeature: vi.fn(() => false),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(3);

      const commandNames = commands.map((cmd) => cmd.name).sort();
      expect(commandNames).toEqual(['b:c', 'b:d:e', 'simple']);

      const nestedCmd = commands.find((cmd) => cmd.name === 'b:c');
      expect(nestedCmd?.extensionName).toBe('a');
      expect(nestedCmd?.description).toMatch(/^\[a\]/);
      expect(nestedCmd).toBeDefined();
      const result = await nestedCmd!.action?.(
        createMockCommandContext({
          invocation: {
            raw: '/a.b:c',
            name: 'a.b:c',
            args: '',
          },
        }),
        '',
      );
      if (result?.type === 'submit_prompt') {
        expect(result.content).toEqual([
          { text: 'Nested command from extension a' },
        ]);
      } else {
        assert.fail('Incorrect action type');
      }
    });
  });

  describe('Argument Handling Integration (via ShellProcessor)', () => {
    it('correctly processes a command with {{args}}', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shorthand.md': '---\ndescription: "Shorthand test"\n---\nThe user wants to: {{args}}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'shorthand');
      expect(command).toBeDefined();

      const result = await command!.action?.(
        createMockCommandContext({
          invocation: {
            raw: '/shorthand do something cool',
            name: 'shorthand',
            args: 'do something cool',
          },
        }),
        'do something cool',
      );
      expect(result?.type).toBe('submit_prompt');
      if (result?.type === 'submit_prompt') {
        expect(result.content).toEqual([
          { text: 'The user wants to: do something cool' },
        ]);
      }
    });
  });

  describe('Default Argument Processor Integration', () => {
    it('correctly processes a command without {{args}}', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'model_led.md': '---\ndescription: "Default processor test"\n---\nThis is the instruction.',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'model_led');
      expect(command).toBeDefined();

      const result = await command!.action?.(
        createMockCommandContext({
          invocation: {
            raw: '/model_led 1.2.0 added "a feature"',
            name: 'model_led',
            args: '1.2.0 added "a feature"',
          },
        }),
        '1.2.0 added "a feature"',
      );
      expect(result?.type).toBe('submit_prompt');
      if (result?.type === 'submit_prompt') {
        const expectedContent =
          'This is the instruction.\n\n/model_led 1.2.0 added "a feature"';
        expect(result.content).toEqual([{ text: expectedContent }]);
      }
    });
  });

  describe('Shell Processor Integration', () => {
    it('instantiates ShellProcessor if {{args}} is present (even without shell trigger)', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'args_only.md': '---\ndescription: ""\n---\nHello {{args}}',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledWith('args_only');
    });
    it('instantiates ShellProcessor if the trigger is present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shell.md': `---\ndescription: ""\n---\nRun this: ${SHELL_INJECTION_TRIGGER}echo hello}`,
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).toHaveBeenCalledWith('shell');
    });

    it('does not instantiate ShellProcessor if no triggers ({{args}} or !{}) are present', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'regular.md': '---\ndescription: ""\n---\nJust a regular prompt',
        },
      });

      const loader = new FileCommandLoader(null as unknown as Config);
      await loader.loadCommands(signal);

      expect(ShellProcessor).not.toHaveBeenCalled();
    });

    it('returns a "submit_prompt" action if shell processing succeeds', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shell.md': "---\ndescription: \"\"\n---\nRun !{echo 'hello'}",
        },
      });
      mockShellProcess.mockResolvedValue([{ text: 'Run hello' }]);

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'shell');
      expect(command).toBeDefined();

      const result = await command!.action!(
        createMockCommandContext({
          invocation: { raw: '/shell', name: 'shell', args: '' },
        }),
        '',
      );

      expect(result?.type).toBe('submit_prompt');
      if (result?.type === 'submit_prompt') {
        expect(result.content).toEqual([{ text: 'Run hello' }]);
      }
    });

    it('returns a "confirm_shell_commands" action if shell processing requires it', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      const rawInvocation = '/shell rm -rf /';
      mock({
        [userCommandsDir]: {
          'shell.md': '---\ndescription: ""\n---\nRun !{rm -rf /}',
        },
      });

      // Mock the processor to throw the specific error
      const error = new ConfirmationRequiredError('Confirmation needed', [
        'rm -rf /',
      ]);
      mockShellProcess.mockRejectedValue(error);

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'shell');
      expect(command).toBeDefined();

      const result = await command!.action!(
        createMockCommandContext({
          invocation: { raw: rawInvocation, name: 'shell', args: 'rm -rf /' },
        }),
        'rm -rf /',
      );

      expect(result?.type).toBe('confirm_shell_commands');
      if (result?.type === 'confirm_shell_commands') {
        expect(result.commandsToConfirm).toEqual(['rm -rf /']);
        expect(result.originalInvocation.raw).toBe(rawInvocation);
      }
    });

    it('re-throws other errors from the processor', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'shell.md': '---\ndescription: ""\n---\nRun !{something}',
        },
      });

      const genericError = new Error('Something else went wrong');
      mockShellProcess.mockRejectedValue(genericError);

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'shell');
      expect(command).toBeDefined();

      await expect(
        command!.action!(
          createMockCommandContext({
            invocation: { raw: '/shell', name: 'shell', args: '' },
          }),
          '',
        ),
      ).rejects.toThrow('Something else went wrong');
    });
    it('assembles the processor pipeline in the correct order (AtFile -> Shell -> Default)', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          // This prompt uses !{}, @{}, but NOT {{args}}, so all processors should be active.
          'pipeline.md': '---\ndescription: ""\n---\nShell says: !{echo foo}. File says: @{./bar.txt}',
        },
        './bar.txt': 'bar content',
      });

      const defaultProcessMock = vi
        .fn()
        .mockImplementation((p: PromptPipelineContent) =>
          Promise.resolve([
            { text: `${(p[0] as { text: string }).text}-default-processed` },
          ]),
        );

      mockShellProcess.mockImplementation((p: PromptPipelineContent) =>
        Promise.resolve([
          { text: `${(p[0] as { text: string }).text}-shell-processed` },
        ]),
      );

      mockAtFileProcess.mockImplementation((p: PromptPipelineContent) =>
        Promise.resolve([
          { text: `${(p[0] as { text: string }).text}-at-file-processed` },
        ]),
      );

      vi.mocked(DefaultArgumentProcessor).mockImplementation(
        () =>
          ({
            process: defaultProcessMock,
          }) as unknown as DefaultArgumentProcessor,
      );

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'pipeline');
      expect(command).toBeDefined();

      const result = await command!.action!(
        createMockCommandContext({
          invocation: {
            raw: '/pipeline baz',
            name: 'pipeline',
            args: 'baz',
          },
        }),
        'baz',
      );

      expect(mockAtFileProcess.mock.invocationCallOrder[0]).toBeLessThan(
        mockShellProcess.mock.invocationCallOrder[0],
      );
      expect(mockShellProcess.mock.invocationCallOrder[0]).toBeLessThan(
        defaultProcessMock.mock.invocationCallOrder[0],
      );

      // Verify the flow of the prompt through the processors
      // 1. AtFile processor runs first
      expect(mockAtFileProcess).toHaveBeenCalledWith(
        [{ text: expect.stringContaining('@{./bar.txt}') }],
        expect.any(Object),
      );
      // 2. Shell processor runs second
      expect(mockShellProcess).toHaveBeenCalledWith(
        [{ text: expect.stringContaining('-at-file-processed') }],
        expect.any(Object),
      );
      // 3. Default processor runs third
      expect(defaultProcessMock).toHaveBeenCalledWith(
        [{ text: expect.stringContaining('-shell-processed') }],
        expect.any(Object),
      );

      if (result?.type === 'submit_prompt') {
        const contentAsArray = Array.isArray(result.content)
          ? result.content
          : [result.content];
        expect(contentAsArray.length).toBeGreaterThan(0);
        const firstPart = contentAsArray[0];

        if (typeof firstPart === 'object' && firstPart && 'text' in firstPart) {
          expect(firstPart.text).toContain(
            '-at-file-processed-shell-processed-default-processed',
          );
        } else {
          assert.fail(
            'First part of content is not a text part or is a string',
          );
        }
      } else {
        assert.fail('Incorrect action type');
      }
    });
  });

  describe('@-file Processor Integration', () => {
    it('correctly processes a command with @{file}', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'at-file.md': '---\ndescription: "@-file test"\n---\nContext from file: @{./test.txt}',
        },
        './test.txt': 'file content',
      });

      mockAtFileProcess.mockImplementation(
        async (prompt: PromptPipelineContent) => {
          // A simplified mock of AtFileProcessor's behavior
          const textContent = (prompt[0] as { text: string }).text;
          if (textContent.includes('@{./test.txt}')) {
            return [
              {
                text: textContent.replace('@{./test.txt}', 'file content'),
              },
            ];
          }
          return prompt;
        },
      );

      // Prevent default processor from interfering
      vi.mocked(DefaultArgumentProcessor).mockImplementation(
        () =>
          ({
            process: (p: PromptPipelineContent) => Promise.resolve(p),
          }) as unknown as DefaultArgumentProcessor,
      );

      const loader = new FileCommandLoader(null as unknown as Config);
      const commands = await loader.loadCommands(signal);
      const command = commands.find((c) => c.name === 'at-file');
      expect(command).toBeDefined();

      const result = await command!.action?.(
        createMockCommandContext({
          invocation: {
            raw: '/at-file',
            name: 'at-file',
            args: '',
          },
        }),
        '',
      );
      expect(result?.type).toBe('submit_prompt');
      if (result?.type === 'submit_prompt') {
        expect(result.content).toEqual([
          { text: 'Context from file: file content' },
        ]);
      }
    });
  });

  describe('with folder trust enabled', () => {
    it('loads multiple commands', async () => {
      const mockConfig = {
        getProjectRoot: vi.fn(() => '/path/to/project'),
        getExtensions: vi.fn(() => []),
        getFolderTrustFeature: vi.fn(() => true),
        getFolderTrust: vi.fn(() => true),
      } as unknown as Config;
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'test1.md': '---\ndescription: ""\n---\nPrompt 1',
          'test2.md': '---\ndescription: ""\n---\nPrompt 2',
        },
      });

      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(2);
    });

    it('does not load when folder is not trusted', async () => {
      const mockConfig = {
        getProjectRoot: vi.fn(() => '/path/to/project'),
        getExtensions: vi.fn(() => []),
        getFolderTrustFeature: vi.fn(() => true),
        getFolderTrust: vi.fn(() => false),
      } as unknown as Config;
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'test1.md': '---\ndescription: ""\n---\nPrompt 1',
          'test2.md': '---\ndescription: ""\n---\nPrompt 2',
        },
      });

      const loader = new FileCommandLoader(mockConfig);
      const commands = await loader.loadCommands(signal);

      expect(commands).toHaveLength(0);
    });
  });

  describe('AbortError handling', () => {
    it('should silently ignore AbortError when operation is cancelled', async () => {
      const userCommandsDir = Storage.getUserCommandsDir();
      mock({
        [userCommandsDir]: {
          'test1.md': '---\ndescription: ""\n---\nPrompt 1',
          'test2.md': '---\ndescription: ""\n---\nPrompt 2',
        },
      });

      const loader = new FileCommandLoader(null);
      const controller = new AbortController();
      const signal = controller.signal;

      // Start loading and immediately abort
      const loadPromise = loader.loadCommands(signal);
      controller.abort();

      // Should not throw or print errors
      const commands = await loadPromise;
      expect(commands).toHaveLength(0);
    });
  });
});
