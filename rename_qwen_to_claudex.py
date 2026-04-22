#!/usr/bin/env python3
"""
Rename Claudex -> Claudex across the repository.

Handles three case variants in order:
  CLAUDEX   -> CLAUDEX
  Claudex   -> Claudex
  claudex   -> claudex

External URLs (lines containing http/https with claudex) are left untouched.

Usage:
  python rename_claudex_to_claudex.py           # apply changes
  python rename_claudex_to_claudex.py --dry-run # preview only
"""

import os
import re
import sys
from pathlib import Path

# ── Directories to skip entirely ─────────────────────────────────────────────
SKIP_DIRS = {
    '.git',
    'node_modules',
    'dist',
    'bundle',
    '__pycache__',
    '.next',
    'coverage',
    '.integration-tests',
    'storybook-static',
}

# ── File extensions to skip ───────────────────────────────────────────────────
SKIP_EXTENSIONS = {
    # Images / fonts / media
    '.png', '.jpg', '.jpeg', '.gif', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.mp4', '.mp3', '.wav',
    # Archives
    '.zip', '.tar', '.gz', '.tgz',
    # Compiled / generated
    '.tsbuildinfo',
    # Lock files (managed by package manager)
    '.lock',
    # PDFs
    '.pdf',
}

# ── Specific filenames to skip ────────────────────────────────────────────────
SKIP_FILENAMES = {
    'package-lock.json',
}

# ── Ordered replacements (most specific / uppercase first) ────────────────────
REPLACEMENTS = [
    ('CLAUDEX', 'CLAUDEX'),
    ('Claudex', 'Claudex'),
    ('claudex', 'claudex'),
]

# Regex to detect a line that contains an external URL referencing claudex.
# We skip the *entire line* to avoid mangling live links.
_URL_WITH_CLAUDEX = re.compile(r'https?://[^\s]*claudex', re.IGNORECASE)


def is_binary(path: Path) -> bool:
    """Heuristic: file is binary if it contains a null byte in the first 8 KB."""
    try:
        with open(path, 'rb') as f:
            return b'\x00' in f.read(8192)
    except OSError:
        return True


def should_skip(path: Path) -> bool:
    if path.suffix.lower() in SKIP_EXTENSIONS:
        return True
    if path.name in SKIP_FILENAMES:
        return True
    return False


def replace_in_line(line: str) -> str:
    """Apply all replacements unless the line contains an external URL with claudex."""
    if _URL_WITH_CLAUDEX.search(line):
        return line  # preserve external links unchanged
    result = line
    for old, new in REPLACEMENTS:
        result = result.replace(old, new)
    return result


def process_file(path: Path, dry_run: bool) -> int:
    """
    Process a single file.  Returns the number of lines changed (0 if none / skipped).
    """
    if is_binary(path):
        return 0

    try:
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            original = f.readlines()
    except OSError as e:
        print(f'  SKIP  {path}  ({e})')
        return 0

    updated = [replace_in_line(line) for line in original]
    changed = sum(1 for o, n in zip(original, updated) if o != n)

    if changed and not dry_run:
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.writelines(updated)
        except OSError as e:
            print(f'  ERR   {path}  ({e})')
            return 0

    return changed


def main() -> None:
    dry_run = '--dry-run' in sys.argv
    root = Path(__file__).resolve().parent

    if dry_run:
        print('DRY RUN — no files will be modified\n')

    files_scanned = 0
    files_changed = 0
    lines_changed = 0

    for dirpath_str, dirnames, filenames in os.walk(root):
        dirpath = Path(dirpath_str)

        # Prune skip dirs in-place so os.walk won't descend into them
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]

        for filename in sorted(filenames):
            filepath = dirpath / filename

            if should_skip(filepath):
                continue

            files_scanned += 1
            n = process_file(filepath, dry_run=dry_run)

            if n:
                files_changed += 1
                lines_changed += n
                rel = filepath.relative_to(root)
                tag = '[dry]' if dry_run else '     '
                print(f'  {tag}  {rel}  ({n} line{"s" if n != 1 else ""})')

    mode = 'DRY RUN — ' if dry_run else ''
    print(f'\n{mode}Complete.')
    print(f'  Files scanned : {files_scanned}')
    print(f'  Files changed : {files_changed}')
    print(f'  Lines changed : {lines_changed}')
    if dry_run:
        print('\nRun without --dry-run to apply changes.')


if __name__ == '__main__':
    main()
