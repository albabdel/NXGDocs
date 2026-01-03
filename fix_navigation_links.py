#!/usr/bin/env python3
"""
Fix broken navigation links in markdown files.
This script removes or replaces broken top-level navigation links that point to non-existent pages.
"""
import os
import re
from pathlib import Path

# Broken top-level navigation paths (without /docs prefix)
BROKEN_NAV_PATHS = [
    "getting-started",
    "devices", 
    "features",
    "troubleshooting",
    "support",
    "release-notes"
]

# File extensions to process
EXTENSIONS_MD = {'.md', '.mdx'}
EXTENSIONS_TS = {'.ts', '.tsx', '.js', '.jsx'}

# Directories to search
SEARCH_DIRS_MD = ['classic/docs', 'content-staging/docs']
SEARCH_DIRS_TS = ['classic/src']

def fix_broken_links_in_content(content, file_path, is_ts_file=False):
    """
    Fix broken navigation links in content.
    Returns: (modified_content, changes_made)
    """
    original_content = content
    changes = []
    
    for broken_path in BROKEN_NAV_PATHS:
        if is_ts_file:
            # Pattern for TSX/TS: to="/docs/path" or to='/docs/path' or href="/docs/path"
            pattern_ts = rf'(to|href)=["\']/docs/{re.escape(broken_path)}(?:/[^"\']*)?["\']'
            matches = list(re.finditer(pattern_ts, content))
            for match in matches:
                # Replace with /docs (safe fallback)
                content = content.replace(match.group(0), f'{match.group(1)}="/docs"')
                changes.append(f"Fixed {match.group(1)} link to /docs/{broken_path}")
        else:
            # Pattern 1: Markdown links: [text](/docs/path) or [text](/docs/path#anchor)
            # We'll remove these links but keep the text
            pattern1 = rf'\[([^\]]+)\]\(/docs/{re.escape(broken_path)}(?:#[^\)]+)?\)'
            matches = list(re.finditer(pattern1, content))
            for match in reversed(matches):  # Reverse to maintain positions
                link_text = match.group(1)
                # Replace with just the text (remove the link)
                content = content[:match.start()] + link_text + content[match.end():]
                changes.append(f"Removed link to /docs/{broken_path} (text: '{link_text}')")
            
            # Pattern 2: Markdown links with .md: [text](/docs/path.md)
            pattern2 = rf'\[([^\]]+)\]\(/docs/{re.escape(broken_path)}\.md(?:#[^\)]+)?\)'
            matches = list(re.finditer(pattern2, content))
            for match in reversed(matches):
                link_text = match.group(1)
                content = content[:match.start()] + link_text + content[match.end():]
                changes.append(f"Removed link to /docs/{broken_path}.md (text: '{link_text}')")
            
            # Pattern 3: HTML links: <a href="/docs/path">text</a>
            pattern3 = rf'<a\s+href=["\']/docs/{re.escape(broken_path)}(?:#[^"\']*)?["\'][^>]*>([^<]+)</a>'
            matches = list(re.finditer(pattern3, content))
            for match in reversed(matches):
                link_text = match.group(1)
                content = content[:match.start()] + link_text + content[match.end():]
                changes.append(f"Removed HTML link to /docs/{broken_path} (text: '{link_text}')")
            
            # Pattern 4: Plain URL references: /docs/path or /docs/path.md
            # Only remove if they're on their own line or in a list
            pattern4 = rf'^(\s*[-*]\s*)?/docs/{re.escape(broken_path)}(?:\.md)?(?:#[^\s]+)?\s*$'
            if re.search(pattern4, content, re.MULTILINE):
                content = re.sub(pattern4, '', content, flags=re.MULTILINE)
                changes.append(f"Removed standalone reference to /docs/{broken_path}")
    
    # Clean up excessive blank lines (3+ -> 2)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content, changes

def process_file(file_path, is_ts_file=False):
    """Process a single file to fix broken links."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False, []
    
    modified_content, changes = fix_broken_links_in_content(content, file_path, is_ts_file)
    
    if modified_content != content:
        try:
            with open(file_path, 'w', encoding='utf-8', errors='ignore') as f:
                f.write(modified_content)
            return True, changes
        except Exception as e:
            print(f"Error writing {file_path}: {e}")
            return False, []
    
    return False, []

def main():
    """Main function to process all files."""
    print("=" * 60)
    print("Fixing Broken Navigation Links")
    print("=" * 60)
    print()
    
    total_files_modified = 0
    total_changes = 0
    files_with_changes = []
    
    # Process markdown files
    for search_dir in SEARCH_DIRS_MD:
        if not os.path.exists(search_dir):
            print(f"Directory not found: {search_dir}, skipping...")
            continue
        
        print(f"Scanning markdown: {search_dir}")
        
        for root, dirs, files in os.walk(search_dir):
            # Skip certain directories
            if 'node_modules' in root or 'build' in root or '.git' in root:
                continue
            
            for file in files:
                if any(file.endswith(ext) for ext in EXTENSIONS_MD):
                    file_path = os.path.join(root, file)
                    modified, changes = process_file(file_path, is_ts_file=False)
                    
                    if modified:
                        total_files_modified += 1
                        total_changes += len(changes)
                        files_with_changes.append((file_path, changes))
                        print(f"[FIXED] {file_path}")
                        for change in changes:
                            print(f"  - {change}")
    
    # Process TypeScript/JavaScript files
    for search_dir in SEARCH_DIRS_TS:
        if not os.path.exists(search_dir):
            print(f"Directory not found: {search_dir}, skipping...")
            continue
        
        print(f"Scanning TypeScript/JS: {search_dir}")
        
        for root, dirs, files in os.walk(search_dir):
            # Skip certain directories
            if 'node_modules' in root or 'build' in root or '.git' in root or '__tests__' in root:
                continue
            
            for file in files:
                if any(file.endswith(ext) for ext in EXTENSIONS_TS):
                    file_path = os.path.join(root, file)
                    modified, changes = process_file(file_path, is_ts_file=True)
                    
                    if modified:
                        total_files_modified += 1
                        total_changes += len(changes)
                        files_with_changes.append((file_path, changes))
                        print(f"[FIXED] {file_path}")
                        for change in changes:
                            print(f"  - {change}")
    
    print()
    print("=" * 60)
    print(f"Summary:")
    print(f"  Files modified: {total_files_modified}")
    print(f"  Total changes: {total_changes}")
    print("=" * 60)
    
    if files_with_changes:
        print()
        print("Files modified:")
        for file_path, changes in files_with_changes:
            print(f"  - {file_path} ({len(changes)} changes)")
    
    return total_files_modified > 0

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)

