/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GitIgnoreFilter } from '../utils/gitIgnoreParser.js';
import type { ClaudexIgnoreFilter } from '../utils/claudexIgnoreParser.js';
import { GitIgnoreParser } from '../utils/gitIgnoreParser.js';
import { ClaudexIgnoreParser } from '../utils/claudexIgnoreParser.js';
import { isGitRepository } from '../utils/gitUtils.js';
import * as path from 'node:path';

export interface FilterFilesOptions {
  respectGitIgnore?: boolean;
  respectClaudexIgnore?: boolean;
}

export interface FilterReport {
  filteredPaths: string[];
  gitIgnoredCount: number;
  claudexIgnoredCount: number;
}

export class FileDiscoveryService {
  private gitIgnoreFilter: GitIgnoreFilter | null = null;
  private claudexIgnoreFilter: ClaudexIgnoreFilter | null = null;
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = path.resolve(projectRoot);
    if (isGitRepository(this.projectRoot)) {
      this.gitIgnoreFilter = new GitIgnoreParser(this.projectRoot);
    }
    this.claudexIgnoreFilter = new ClaudexIgnoreParser(this.projectRoot);
  }

  /**
   * Filters a list of file paths based on git ignore rules
   */
  filterFiles(
    filePaths: string[],
    options: FilterFilesOptions = {
      respectGitIgnore: true,
      respectClaudexIgnore: true,
    },
  ): string[] {
    return filePaths.filter((filePath) => {
      if (options.respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
        return false;
      }
      if (options.respectClaudexIgnore && this.shouldQwenIgnoreFile(filePath)) {
        return false;
      }
      return true;
    });
  }

  /**
   * Filters a list of file paths based on git ignore rules and returns a report
   * with counts of ignored files.
   */
  filterFilesWithReport(
    filePaths: string[],
    opts: FilterFilesOptions = {
      respectGitIgnore: true,
      respectClaudexIgnore: true,
    },
  ): FilterReport {
    const filteredPaths: string[] = [];
    let gitIgnoredCount = 0;
    let claudexIgnoredCount = 0;

    for (const filePath of filePaths) {
      if (opts.respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
        gitIgnoredCount++;
        continue;
      }

      if (opts.respectClaudexIgnore && this.shouldQwenIgnoreFile(filePath)) {
        claudexIgnoredCount++;
        continue;
      }

      filteredPaths.push(filePath);
    }

    return {
      filteredPaths,
      gitIgnoredCount,
      claudexIgnoredCount,
    };
  }

  /**
   * Checks if a single file should be git-ignored
   */
  shouldGitIgnoreFile(filePath: string): boolean {
    if (this.gitIgnoreFilter) {
      return this.gitIgnoreFilter.isIgnored(filePath);
    }
    return false;
  }

  /**
   * Checks if a single file should be qwen-ignored
   */
  shouldQwenIgnoreFile(filePath: string): boolean {
    if (this.claudexIgnoreFilter) {
      return this.claudexIgnoreFilter.isIgnored(filePath);
    }
    return false;
  }

  /**
   * Unified method to check if a file should be ignored based on filtering options
   */
  shouldIgnoreFile(
    filePath: string,
    options: FilterFilesOptions = {},
  ): boolean {
    const {
      respectGitIgnore = true,
      respectClaudexIgnore: respectClaudexIgnore = true,
    } = options;

    if (respectGitIgnore && this.shouldGitIgnoreFile(filePath)) {
      return true;
    }
    if (respectClaudexIgnore && this.shouldQwenIgnoreFile(filePath)) {
      return true;
    }
    return false;
  }

  /**
   * Returns loaded patterns from .claudexignore
   */
  getQwenIgnorePatterns(): string[] {
    return this.claudexIgnoreFilter?.getPatterns() ?? [];
  }
}
