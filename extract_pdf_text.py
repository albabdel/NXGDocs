#!/usr/bin/env python3
"""
Extract text content from PDF brochure files.
"""

from pathlib import Path
import subprocess
import sys

def extract_text_with_pdftotext(pdf_file):
    """Extract text from PDF using pdftotext command-line tool."""
    try:
        result = subprocess.run(
            ['pdftotext', '-layout', str(pdf_file), '-'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if result.returncode == 0:
            return result.stdout
        else:
            return None
    except FileNotFoundError:
        return None

def extract_text_with_pypdf(pdf_file):
    """Extract text from PDF using PyPDF2."""
    try:
        import PyPDF2
        text_parts = []
        with open(pdf_file, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text_parts.append(page.extract_text())
        return '\n'.join(text_parts)
    except ImportError:
        return None
    except Exception as e:
        print(f"PyPDF2 error: {e}")
        return None

def extract_text_with_pymupdf(pdf_file):
    """Extract text from PDF using PyMuPDF (fitz)."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(pdf_file)
        text_parts = []
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
        return '\n'.join(text_parts)
    except ImportError:
        return None
    except Exception as e:
        print(f"PyMuPDF error: {e}")
        return None

def clean_text(text):
    """Clean up extracted text."""
    if not text:
        return ""

    lines = text.split('\n')
    cleaned = []

    for line in lines:
        line = line.strip()
        # Skip empty lines
        if not line:
            continue
        # Skip lines that are just page numbers
        if line.isdigit():
            continue
        cleaned.append(line)

    return '\n'.join(cleaned)

def format_as_markdown(text, title):
    """Format extracted text as markdown with basic structure."""
    lines = text.split('\n')

    markdown_lines = [f"# {title}\n"]
    in_list = False

    for line in lines:
        line = line.strip()
        if not line:
            if in_list:
                markdown_lines.append('')
                in_list = False
            continue

        # Check if line looks like a heading
        if line.isupper() and len(line) < 80:
            if in_list:
                markdown_lines.append('')
                in_list = False
            markdown_lines.append(f"\n## {line.title()}\n")
        # Check if line starts with bullet or number
        elif line.startswith(('•', '-', '●', '○')) or (len(line) > 2 and line[0].isdigit() and line[1] in '.):'):
            if not in_list:
                markdown_lines.append('')
            markdown_lines.append(f"- {line.lstrip('•-●○0123456789.:) ')}")
            in_list = True
        else:
            if in_list:
                markdown_lines.append('')
                in_list = False
            markdown_lines.append(line)
            markdown_lines.append('')

    return '\n'.join(markdown_lines)

def extract_pdf_text(pdf_file):
    """Extract text from PDF using available methods."""
    print(f"Extracting text from {pdf_file.name}...")

    # Try different extraction methods in order of preference
    text = None

    # Try PyMuPDF first (best quality)
    text = extract_text_with_pymupdf(pdf_file)
    if text:
        print("  [OK] Extracted using PyMuPDF")
        return text

    # Try pdftotext command-line tool
    text = extract_text_with_pdftotext(pdf_file)
    if text:
        print("  [OK] Extracted using pdftotext")
        return text

    # Try PyPDF2
    text = extract_text_with_pypdf(pdf_file)
    if text:
        print("  [OK] Extracted using PyPDF2")
        return text

    print("  [ERROR] No extraction method available")
    print("  Install one of: pip install PyMuPDF  OR  pip install PyPDF2")
    return None

if __name__ == '__main__':
    pdf_dir = Path('c:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/Brochours')
    bulkimport_pdf = pdf_dir / 'Bulkimport.pdf'

    if not bulkimport_pdf.exists():
        print(f"File not found: {bulkimport_pdf}")
        sys.exit(1)

    # Extract text
    text = extract_pdf_text(bulkimport_pdf)

    if text:
        # Clean text
        cleaned_text = clean_text(text)

        # Save raw text
        output_file = pdf_dir / 'bulkimport_extracted.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(cleaned_text)
        print(f"\n[OK] Raw text saved to: {output_file}")

        # Format as markdown
        markdown = format_as_markdown(cleaned_text, "Bulk Import")
        markdown_file = pdf_dir / 'bulkimport_extracted.md'
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
        print(f"[OK] Markdown saved to: {markdown_file}")

        # Print preview
        print("\n" + "="*80)
        print("PREVIEW OF EXTRACTED CONTENT:")
        print("="*80)
        preview_lines = cleaned_text.split('\n')[:100]
        for i, line in enumerate(preview_lines, 1):
            print(f"{i:3d}: {line}")
        print("="*80)
        print(f"\nTotal lines: {len(cleaned_text.split(chr(10)))}")
    else:
        print("\nFailed to extract text from PDF")
        sys.exit(1)
