#!/usr/bin/env python3
"""
Extract clean text content from PDF-converted HTML files.
Strips out all the pdf2htmlEX CSS and formatting, leaving just the readable text.
"""
import os
import re
from html.parser import HTMLParser
from pathlib import Path

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_content = []
        self.in_style = False
        self.in_script = False

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

    def handle_data(self, data):
        if not self.in_style and not self.in_script:
            # Clean up whitespace but preserve paragraph breaks
            text = data.strip()
            if text:
                self.text_content.append(text)

    def get_text(self):
        return '\n'.join(self.text_content)

def extract_text_from_html(html_path):
    """Extract plain text from HTML file."""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        parser = TextExtractor()
        parser.feed(html)
        text = parser.get_text()

        # Clean up excessive whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text
    except Exception as e:
        print(f"Error processing {html_path}: {e}")
        return ""

def main():
    html_dir = Path("Brochours/HTML")
    output_dir = Path("Brochours/extracted")
    output_dir.mkdir(exist_ok=True)

    html_files = list(html_dir.glob("*.html"))

    for html_file in html_files:
        print(f"Processing {html_file.name}...")
        text = extract_text_from_html(html_file)

        # Save extracted text
        output_file = output_dir / f"{html_file.stem}.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(text)

        print(f"  Extracted to {output_file.name}")

    print(f"\nProcessed {len(html_files)} files")

if __name__ == "__main__":
    main()
