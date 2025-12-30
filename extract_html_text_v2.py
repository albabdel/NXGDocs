#!/usr/bin/env python3
"""
Extract text content from pdf2htmlEX generated HTML files.
Uses BeautifulSoup for better HTML parsing.
"""

import re
from pathlib import Path

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False

def extract_text_regex_method(html_file_path):
    """Extract text using regex patterns specific to pdf2htmlEX structure."""
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # pdf2htmlEX typically wraps text in spans with class 't'
    # Look for patterns like: <span class="t ...">text</span>

    # Remove style and script tags completely
    html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)

    # Extract text from specific div classes used by pdf2htmlEX
    # Look for divs with text content
    text_segments = []

    # Find all text within tags, ignoring the tags themselves
    # This regex finds content between > and <
    pattern = r'>([^<>]+)<'
    matches = re.findall(pattern, html_content)

    for match in matches:
        text = match.strip()
        # Filter out empty strings, CSS properties, and JavaScript
        if text and not text.startswith('{') and not text.startswith('/*') and len(text) > 1:
            # Decode HTML entities
            text = text.replace('&nbsp;', ' ')
            text = text.replace('&amp;', '&')
            text = text.replace('&lt;', '<')
            text = text.replace('&gt;', '>')
            text = text.replace('&quot;', '"')

            # Skip if it's mostly numbers (likely coordinates or styles)
            if not re.match(r'^[\d\s\.\-\:]+$', text):
                text_segments.append(text)

    return text_segments

def extract_text_bs4_method(html_file_path):
    """Extract text using BeautifulSoup."""
    with open(html_file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Remove script and style elements
    for element in soup(['script', 'style', 'head']):
        element.decompose()

    # Get text
    text = soup.get_text(separator='\n')

    # Clean up whitespace
    lines = [line.strip() for line in text.split('\n')]
    # Remove empty lines
    lines = [line for line in lines if line]

    return lines

def clean_and_deduplicate(lines):
    """Clean up extracted lines and remove duplicates."""
    cleaned = []
    seen = set()

    for line in lines:
        # Skip very short lines (likely artifacts)
        if len(line) < 3:
            continue

        # Skip lines that are just special characters or numbers
        if re.match(r'^[^\w\s]*$', line) or re.match(r'^\d+\.?\d*$', line):
            continue

        # Remove excessive whitespace
        line = ' '.join(line.split())

        # Skip duplicates
        if line.lower() not in seen:
            cleaned.append(line)
            seen.add(line.lower())

    return cleaned

def identify_sections(lines):
    """Try to identify major sections in the document."""
    sections = {}
    current_section = "Introduction"
    sections[current_section] = []

    for line in lines:
        # Check if line might be a section header
        # Headers are often short, may be all caps, and contain key terms
        is_header = False

        if len(line) < 60 and any(keyword in line.upper() for keyword in [
            'FEATURE', 'BENEFIT', 'HOW IT WORKS', 'WHY', 'WHAT',
            'OVERVIEW', 'INTRODUCTION', 'KEY', 'MAIN', 'ABOUT'
        ]):
            # Likely a header
            current_section = line
            if current_section not in sections:
                sections[current_section] = []
            is_header = True

        if not is_header:
            sections[current_section].append(line)

    return sections

def format_as_markdown(lines, title):
    """Format extracted text as markdown."""
    sections = identify_sections(lines)

    markdown = [f"# {title}\n"]

    for section_title, section_lines in sections.items():
        if section_lines:  # Only add sections with content
            if section_title != "Introduction":
                markdown.append(f"\n## {section_title}\n")

            for line in section_lines:
                # Check if line might be a bullet point
                if line.startswith(('-', '•', '●', '○')):
                    markdown.append(line)
                else:
                    markdown.append(line)
                markdown.append('')  # Add blank line

    return '\n'.join(markdown)

if __name__ == '__main__':
    html_dir = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/HTML')
    bulkimport_file = html_dir / 'Bulkimport.html'

    if not bulkimport_file.exists():
        print(f"File not found: {bulkimport_file}")
        exit(1)

    print("Extracting text from Bulkimport.html...")

    # Try BeautifulSoup method first, fall back to regex
    if BS4_AVAILABLE:
        print("Using BeautifulSoup method...")
        lines = extract_text_bs4_method(bulkimport_file)
    else:
        print("BeautifulSoup not available, using regex method...")
        lines = extract_text_regex_method(bulkimport_file)

    # Clean and deduplicate
    cleaned_lines = clean_and_deduplicate(lines)

    print(f"Extracted {len(cleaned_lines)} lines of content")

    # Save raw text
    output_file = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/bulkimport_extracted.txt')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines))
    print(f"Raw text saved to: {output_file}")

    # Format as markdown
    markdown = format_as_markdown(cleaned_lines, "Bulk Import")
    markdown_file = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/bulkimport_extracted.md')
    with open(markdown_file, 'w', encoding='utf-8') as f:
        f.write(markdown)
    print(f"Markdown saved to: {markdown_file}")

    # Print preview
    print("\n" + "="*80)
    print("PREVIEW OF EXTRACTED CONTENT (first 50 lines):")
    print("="*80)
    for i, line in enumerate(cleaned_lines[:50]):
        print(f"{i+1:3d}: {line}")
    print("="*80)
    print(f"\nTotal lines extracted: {len(cleaned_lines)}")
