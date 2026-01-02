#!/usr/bin/env python3
"""
Generate article list matching the Excel spreadsheet structure.
Counts only root-level articles and main category articles, 
excluding detailed device/feature subdirectory articles.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

def extract_frontmatter(file_path):
    """Extract frontmatter from markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        metadata = {}
        
        # Check for frontmatter (YAML between --- markers)
        frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
        if frontmatter_match:
            frontmatter_text = frontmatter_match.group(1)
            content = frontmatter_match.group(2)
            
            # Parse YAML-like frontmatter
            for line in frontmatter_text.split('\n'):
                line = line.strip()
                if ':' in line and not line.startswith('-'):
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    metadata[key] = value
        
        # If no title in frontmatter, try to extract from first heading
        if 'title' not in metadata:
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if title_match:
                metadata['title'] = title_match.group(1).strip()
            else:
                metadata['title'] = Path(file_path).stem.replace('-', ' ').replace('_', ' ').title()
        
        return metadata, content
    except Exception as e:
        return {'title': Path(file_path).stem.replace('-', ' ').replace('_', ' ').title()}, ''

def generate_url(file_path, base_dir, slug=None):
    """Generate URL from file path."""
    if slug:
        return f"/docs/{slug}"
    
    rel_path = os.path.relpath(file_path, base_dir)
    rel_path = rel_path.replace('.md', '').replace('.mdx', '')
    url_path = rel_path.replace('\\', '/')
    
    if url_path.endswith('/index') or url_path.endswith('/README'):
        url_path = url_path.rsplit('/', 1)[0]
        if not url_path:
            return "/docs"
    
    return f"/docs/{url_path}"

def should_include_article(file_path, docs_dir):
    """Determine if article should be included based on Excel criteria."""
    rel_path = os.path.relpath(file_path, docs_dir)
    filename = os.path.basename(file_path).lower()
    
    # Skip test files
    if 'test' in filename and 'test-article' not in filename:
        return False
    
    # Skip README and index files
    if filename in ['readme.md', 'readme.mdx', 'index.md', 'index.mdx']:
        return False
    
    # Skip internal documentation
    if 'internal' in rel_path.lower():
        return False
    
    # Include root-level files (these are the main articles)
    # Check if file is directly in docs directory (no subdirectory)
    if os.path.dirname(rel_path) == '.' or os.path.dirname(rel_path) == '':
        return True
    
    # Include main category files (first level subdirectories only)
    path_parts = rel_path.replace('\\', '/').split('/')
    
    # Main categories to include - matching Excel spreadsheet
    # Only these categories are counted in the Excel file
    main_categories = [
        'admin-guide',
        'alarm-management'
        # Note: Excel only includes ROOT CATEGORY, ADMIN GUIDE, and ALARM MANAGEMENT
    ]
    
    # Only include if it's in a main category and not in a subdirectory
    if len(path_parts) == 2:  # category/filename.md
        category = path_parts[0]
        if category in main_categories:
            return True
    
    # Exclude device-specific and feature-specific subdirectories
    if 'devices' in path_parts and len(path_parts) > 2:
        return False  # Exclude devices/manufacturer/ files
    
    if 'features' in path_parts and len(path_parts) > 2:
        return False  # Exclude features/feature-name/ files
    
    return False

def scan_docs_directory(docs_dir):
    """Scan docs directory and collect articles matching Excel criteria."""
    articles = defaultdict(list)
    
    for root, dirs, files in os.walk(docs_dir):
        # Skip certain directories
        if any(skip in root for skip in ['node_modules', '.git', '__pycache__', '.next', 'internal', 'breakthroughs']):
            continue
            
        for file in files:
            if file.endswith(('.md', '.mdx')):
                file_path = os.path.join(root, file)
                
                if not should_include_article(file_path, docs_dir):
                    continue
                
                metadata, content = extract_frontmatter(file_path)
                
                title = metadata.get('title') or metadata.get('sidebar_label') or Path(file).stem
                slug = metadata.get('slug')
                
                # Get category
                rel_path = os.path.relpath(root, docs_dir)
                if rel_path == '.':
                    category = 'ROOT CATEGORY'
                else:
                    category = rel_path.replace('\\', '/').upper().replace('-', ' ')
                
                url = generate_url(file_path, docs_dir, slug)
                
                article_info = {
                    'title': title,
                    'file': file,
                    'path': file_path,
                    'url': url,
                    'category': category,
                    'slug': slug
                }
                
                articles[category].append(article_info)
    
    return articles

def generate_markdown_list(articles, output_file):
    """Generate markdown file with article list."""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Complete Article List with Links\n\n")
        f.write("**Purpose**: Double-check content coverage and verify all articles are accessible.\n\n")
        f.write("**Note**: This list matches the Excel spreadsheet structure - includes main articles only, excluding detailed device/feature subdirectory articles.\n\n")
        f.write("---\n\n")
        
        total_count = sum(len(articles_list) for articles_list in articles.values())
        f.write(f"## Summary\n\n")
        f.write(f"**Total Articles**: {total_count}\n\n")
        f.write(f"**Categories**: {len(articles)}\n\n")
        f.write("---\n\n")
        
        # Sort categories (ROOT CATEGORY first, then alphabetically)
        sorted_categories = sorted(articles.keys(), key=lambda x: (x != 'ROOT CATEGORY', x))
        
        for category in sorted_categories:
            category_articles = sorted(articles[category], key=lambda x: x['title'])
            
            f.write(f"## {category}\n\n")
            f.write(f"**Articles**: {len(category_articles)}\n\n")
            f.write("| # | Article Title | Link | File Name |\n")
            f.write("|---|--------------|------|-----------|\n")
            
            for idx, article in enumerate(category_articles, 1):
                title = article['title'].replace('|', '\\|')
                url = article['url']
                filename = article['file']
                f.write(f"| {idx} | {title} | [{url}]({url}) | `{filename}` |\n")
            
            f.write("\n---\n\n")
        
        # Add alphabetical index
        f.write("## Alphabetical Index\n\n")
        all_articles_flat = []
        for category, articles_list in articles.items():
            for article in articles_list:
                all_articles_flat.append((article['title'], article['url'], category))
        
        all_articles_flat.sort(key=lambda x: x[0].lower())
        
        f.write("| Article Title | Link | Category |\n")
        f.write("|--------------|------|----------|\n")
        for title, url, category in all_articles_flat:
            title_escaped = title.replace('|', '\\|')
            f.write(f"| {title_escaped} | [{url}]({url}) | {category} |\n")

def main():
    """Main function."""
    base_dir = Path(__file__).parent
    docs_dir = base_dir / 'classic' / 'docs'
    output_file = base_dir / 'ARTICLE_LIST_WITH_LINKS.md'
    
    if not docs_dir.exists():
        print(f"Error: Docs directory not found at {docs_dir}")
        return
    
    print(f"Scanning documentation directory: {docs_dir}")
    articles = scan_docs_directory(str(docs_dir))
    
    total = sum(len(a) for a in articles.values())
    print(f"Found {len(articles)} categories with {total} total articles")
    
    print(f"Generating article list: {output_file}")
    generate_markdown_list(articles, output_file)
    
    print("Article list generated successfully!")

if __name__ == '__main__':
    main()

