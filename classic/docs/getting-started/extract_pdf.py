#!/usr/bin/env python3
"""Extract images from PDF"""
import sys
import os

pdf_path = r"GCXONE_Security_System_Setup_Guide.pdf"
output_dir = r"images"

try:
    import fitz  # PyMuPDF
    print("Using PyMuPDF...")
    
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    print(f"PDF has {page_count} pages")
    
    # Exclude last page as requested
    pages_to_extract = page_count - 1
    print(f"Extracting {pages_to_extract} pages (excluding last page)...")
    
    os.makedirs(output_dir, exist_ok=True)
    
    for page_num in range(pages_to_extract):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        output_path = os.path.join(output_dir, f"quick-start-{page_num + 1}.png")
        pix.save(output_path)
        print(f"✓ Saved: quick-start-{page_num + 1}.png ({pix.width}x{pix.height})")
    
    doc.close()
    print(f"\nSuccessfully extracted {pages_to_extract} images to {output_dir}/")
    
except ImportError:
    print("PyMuPDF not found. Please install it:")
    print("  pip install PyMuPDF")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

