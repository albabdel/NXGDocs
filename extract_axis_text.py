#!/usr/bin/env python3
"""Extract text from Axis Camera Station PDF"""
import fitz
import sys

pdf_path = 'classic/docs/getting-started/devices/Axiscamerastation Pro End to End guide.pdf'
doc = fitz.open(pdf_path)

print(f'Total pages: {len(doc)}\n', file=sys.stderr)

# Extract first 3 pages
for i in range(min(3, len(doc))):
    page = doc[i]
    text = page.get_text()
    print(f'=== Page {i+1} ===')
    print(text)
    print()

doc.close()
