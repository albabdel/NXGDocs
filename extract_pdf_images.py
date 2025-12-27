#!/usr/bin/env python3
"""
Extract images from PDF file and save them as PNG files.
Removes the last image as per user request.
"""
import sys
import os

try:
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError:
    print("Installing required packages...")
    os.system("pip install pdf2image pillow")
    from pdf2image import convert_from_path
    from PIL import Image

def extract_pdf_images(pdf_path, output_dir):
    """Extract images from PDF, excluding the last page."""
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Extracting images from {pdf_path}...")
    
    try:
        # Convert PDF to images (excluding last page)
        images = convert_from_path(pdf_path, dpi=200)
        
        # Remove last image as requested
        if len(images) > 0:
            images = images[:-1]
            print(f"Removed last page. Processing {len(images)} pages...")
        
        for i, image in enumerate(images, 1):
            output_path = os.path.join(output_dir, f"quick-start-{i}.png")
            image.save(output_path, "PNG")
            print(f"✓ Saved: quick-start-{i}.png")
        
        print(f"\nSuccessfully extracted {len(images)} images to {output_dir}/")
        
    except Exception as e:
        print(f"Error extracting images: {e}")
        print("\nTrying alternative method...")
        # Fallback: try using PyMuPDF if available
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(pdf_path)
            page_count = len(doc) - 1  # Exclude last page
            
            for page_num in range(page_count):
                page = doc[page_num]
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
                output_path = os.path.join(output_dir, f"quick-start-{page_num + 1}.png")
                pix.save(output_path)
                print(f"✓ Saved: quick-start-{page_num + 1}.png")
            
            doc.close()
            print(f"\nSuccessfully extracted {page_count} images to {output_dir}/")
        except ImportError:
            print("Please install pdf2image: pip install pdf2image")
            print("Or install PyMuPDF: pip install PyMuPDF")

if __name__ == "__main__":
    pdf_path = "classic/docs/getting-started/GCXONE_Security_System_Setup_Guide.pdf"
    output_dir = "classic/docs/getting-started/images"
    
    extract_pdf_images(pdf_path, output_dir)

