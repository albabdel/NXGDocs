#!/usr/bin/env python3
"""
Generate a comprehensive list of all articles with their links.
This script scans all markdown files and extracts article information.
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
            
            # Parse YAML-like frontmatter (simple key-value pairs)
            for line in frontmatter_text.split('\n'):
                line = line.strip()
                if ':' in line:
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
        # Fallback: use filename as title
        return {'title': Path(file_path).stem.replace('-', ' ').replace('_', ' ').title()}, ''

def generate_url(file_path, base_dir, slug=None):
    """Generate URL from file path."""
    # Use slug if provided
    if slug:
        return f"/docs/{slug}"
    
    # Get relative path from docs directory
    rel_path = os.path.relpath(file_path, base_dir)
    
    # Remove .md/.mdx extension
    rel_path = rel_path.replace('.md', '').replace('.mdx', '')
    
    # Convert path to URL format (forward slashes)
    url_path = rel_path.replace('\\', '/')
    
    # If it's index or README, use parent directory
    if url_path.endswith('/index') or url_path.endswith('/README'):
        url_path = url_path.rsplit('/', 1)[0]
        if not url_path:  # If it was just "index", return root
            return "/docs"
    
    return f"/docs/{url_path}"

def scan_docs_directory(docs_dir):
    """Scan docs directory and collect all articles."""
    articles = defaultdict(list)
    
    for root, dirs, files in os.walk(docs_dir):
        # Skip certain directories
        if any(skip in root for skip in ['node_modules', '.git', '__pycache__', '.next']):
            continue
            
        for file in files:
            if file.endswith(('.md', '.mdx')):
                file_path = os.path.join(root, file)
                
                # Skip certain files (but keep them if they're actual articles)
                if file.lower() in ['readme.md', 'readme.mdx']:
                    continue
                # Skip test files
                if 'test' in file.lower() and 'test-article' not in file.lower():
                    continue
                
                metadata, content = extract_frontmatter(file_path)
                
                title = metadata.get('title') or metadata.get('sidebar_label') or Path(file).stem
                slug = metadata.get('slug')
                
                # Get category from directory structure
                rel_path = os.path.relpath(root, docs_dir)
                if rel_path == '.':
                    category = 'Root'
                else:
                    category = rel_path.replace('\\', '/')
                
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
        f.write("# 📚 Complete Article List with Links\n\n")
        f.write("**Purpose**: Double-check content coverage and verify all articles are accessible.\n\n")
        f.write("---\n\n")
        
        total_count = sum(len(articles_list) for articles_list in articles.values())
        f.write(f"## 📊 Summary\n\n")
        f.write(f"**Total Articles**: {total_count}\n\n")
        f.write(f"**Categories**: {len(articles)}\n\n")
        f.write("---\n\n")
        
        # Sort categories
        sorted_categories = sorted(articles.keys())
        
        for category in sorted_categories:
            category_articles = sorted(articles[category], key=lambda x: x['title'])
            
            f.write(f"## {category}\n\n")
            f.write(f"**Path**: `{category}` | **Articles**: {len(category_articles)}\n\n")
            f.write("| # | Article Title | Link | File Name |\n")
            f.write("|---|--------------|------|-----------|\n")
            
            for idx, article in enumerate(category_articles, 1):
                title = article['title'].replace('|', '\\|')
                url = article['url']
                filename = article['file']
                f.write(f"| {idx} | {title} | [{url}]({url}) | `{filename}` |\n")
            
            f.write("\n---\n\n")
        
        # Add alphabetical index
        f.write("## 🔍 Alphabetical Index\n\n")
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
    # Set paths
    base_dir = Path(__file__).parent
    docs_dir = base_dir / 'classic' / 'docs'
    output_file = base_dir / 'ARTICLE_LIST_WITH_LINKS.md'
    
    if not docs_dir.exists():
        print(f"Error: Docs directory not found at {docs_dir}")
        return
    
    print(f"Scanning documentation directory: {docs_dir}")
    articles = scan_docs_directory(str(docs_dir))
    
    print(f"Found {len(articles)} categories with {sum(len(a) for a in articles.values())} total articles")
    
    print(f"Generating article list: {output_file}")
    generate_markdown_list(articles, output_file)
    
    print("Article list generated successfully!")

if __name__ == '__main__':
    main()

