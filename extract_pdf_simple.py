#!/usr/bin/env python3
"""Extract images from PDF - simple version"""
import sys
import os

pdf_path = r"classic\docs\getting-started\GCXONE_Security_System_Setup_Guide.pdf"
output_dir = r"classic\docs\getting-started\images"

# Try PyMuPDF first (faster, no external dependencies)
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
        # 2x zoom for better quality
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        output_path = os.path.join(output_dir, f"quick-start-{page_num + 1}.png")
        pix.save(output_path)
        print(f"✓ Saved: quick-start-{page_num + 1}.png ({pix.width}x{pix.height})")
    
    doc.close()
    print(f"\nSuccessfully extracted {pages_to_extract} images to {output_dir}/")
    
except ImportError:
    print("PyMuPDF not found. Trying pdf2image...")
    try:
        from pdf2image import convert_from_path
        from PIL import Image
        
        images = convert_from_path(pdf_path, dpi=200)
        # Remove last image
        if len(images) > 0:
            images = images[:-1]
        
        os.makedirs(output_dir, exist_ok=True)
        
        for i, image in enumerate(images, 1):
            output_path = os.path.join(output_dir, f"quick-start-{i}.png")
            image.save(output_path, "PNG")
            print(f"✓ Saved: quick-start-{i}.png")
        
        print(f"\nSuccessfully extracted {len(images)} images to {output_dir}/")
        
    except ImportError:
        print("ERROR: Neither PyMuPDF nor pdf2image is installed.")
        print("\nTo install PyMuPDF (recommended):")
        print("  pip install PyMuPDF")
        print("\nOr to install pdf2image:")
        print("  pip install pdf2image")
        print("  (Also requires poppler: https://github.com/oschwartz10612/poppler-windows/releases/)")
        sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

