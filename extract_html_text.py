#!/usr/bin/env python3
"""
Extract text content from pdf2htmlEX generated HTML files.
Focuses on extracting readable content while ignoring styling and metadata.
"""

import re
from pathlib import Path
from html.parser import HTMLParser

class PDF2HTMLTextExtractor(HTMLParser):
    """Extract text from pdf2htmlEX HTML files."""

    def __init__(self):
        super().__init__()
        self.text_content = []
        self.in_style = False
        self.in_script = False
        self.current_line = []

    def handle_starttag(self, tag, attrs):
        if tag == 'style':
            self.in_style = True
        elif tag == 'script':
            self.in_script = True

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False
        elif tag == 'script':
            self.in_script = False
        elif tag in ['div', 'p', 'br']:
            # End of a text block
            if self.current_line:
                line_text = ''.join(self.current_line).strip()
                if line_text:
                    self.text_content.append(line_text)
                self.current_line = []

    def handle_data(self, data):
        if not self.in_style and not self.in_script:
            # Clean up whitespace but preserve structure
            cleaned = data.strip()
            if cleaned:
                self.current_line.append(cleaned)

    def get_text(self):
        """Get extracted text with basic formatting."""
        # Filter out very short lines that are likely artifacts
        meaningful_lines = []
        for line in self.text_content:
            # Skip lines that are just single characters or symbols
            if len(line) > 2 or line.isalpha():
                meaningful_lines.append(line)

        return '\n'.join(meaningful_lines)

def extract_text_from_html(html_file_path):
    """Extract text content from an HTML file."""
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        parser = PDF2HTMLTextExtractor()
        parser.feed(html_content)
        text = parser.get_text()

        # Post-processing: remove duplicate consecutive lines
        lines = text.split('\n')
        deduplicated = []
        prev_line = None
        for line in lines:
            if line != prev_line:
                deduplicated.append(line)
                prev_line = line

        return '\n'.join(deduplicated)
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def format_as_markdown(text, title):
    """Format extracted text as markdown with basic structure."""
    lines = text.split('\n')

    # Try to identify sections and format appropriately
    markdown_lines = [f"# {title}\n"]

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check if line looks like a heading (all caps, short)
        if line.isupper() and len(line) < 50 and len(line.split()) < 8:
            markdown_lines.append(f"\n## {line.title()}\n")
        else:
            markdown_lines.append(line)

    return '\n'.join(markdown_lines)

if __name__ == '__main__':
    # Extract from Bulkimport.html
    html_dir = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/HTML')
    bulkimport_file = html_dir / 'Bulkimport.html'

    if bulkimport_file.exists():
        print("Extracting text from Bulkimport.html...")
        text = extract_text_from_html(bulkimport_file)

        # Save raw text
        output_file = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/bulkimport_extracted.txt')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Raw text saved to: {output_file}")

        # Format as markdown
        markdown = format_as_markdown(text, "Bulk Import")
        markdown_file = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours/bulkimport_extracted.md')
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
        print(f"Markdown saved to: {markdown_file}")

        # Print preview
        print("\n" + "="*80)
        print("PREVIEW OF EXTRACTED CONTENT:")
        print("="*80)
        print(text[:2000] if len(text) > 2000 else text)
        print("="*80)
    else:
        print(f"File not found: {bulkimport_file}")
