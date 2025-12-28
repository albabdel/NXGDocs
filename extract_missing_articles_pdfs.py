#!/usr/bin/env python3
"""
Extract images from PDF files in Missing articles folder
"""
import sys
import os

# PDF files to process
pdfs = [
    {
        'path': 'Missing articles/Blueprint_to_Operation_Guide.pdf',
        'output_dir': 'classic/static/img/device-integration/blueprint-operation',
        'prefix': 'blueprint'
    },
    {
        'path': 'Missing articles/GCXONE_Platform_Mastery_Integration_Guide.pdf',
        'output_dir': 'classic/static/img/device-integration/platform-mastery',
        'prefix': 'platform-mastery'
    },
    {
        'path': 'Missing articles/GCXONE_Sensor_Lifecycle_Guide.pdf',
        'output_dir': 'classic/static/img/device-integration/sensor-lifecycle',
        'prefix': 'sensor-lifecycle'
    }
]

try:
    import fitz  # PyMuPDF
    print("Using PyMuPDF for extraction...\n")
    
    for pdf_info in pdfs:
        pdf_path = pdf_info['path']
        output_dir = pdf_info['output_dir']
        prefix = pdf_info['prefix']
        
        if not os.path.exists(pdf_path):
            print(f"[WARNING] PDF not found: {pdf_path}")
            continue
        
        print(f"Processing: {pdf_path}")
        
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        print(f"  PDF has {page_count} pages")
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        # Extract each page as image
        extracted = 0
        for page_num in range(page_count):
            page = doc[page_num]
            # 2x zoom for better quality
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            output_path = os.path.join(output_dir, f"{prefix}-page-{page_num + 1}.png")
            pix.save(output_path)
            extracted += 1
            print(f"  [OK] Saved: {prefix}-page-{page_num + 1}.png ({pix.width}x{pix.height})")
        
        # Also extract embedded images from pages
        embedded_images = 0
        for page_num in range(page_count):
            page = doc[page_num]
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                xref = img[0]
                try:
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Save embedded image
                    image_filename = f"{prefix}-page-{page_num + 1}-img-{img_index + 1}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    with open(image_path, "wb") as img_file:
                        img_file.write(image_bytes)
                    embedded_images += 1
                    print(f"  [OK] Extracted embedded image: {image_filename}")
                except Exception as e:
                    print(f"  [WARNING] Could not extract image {img_index + 1} from page {page_num + 1}: {e}")
        
        doc.close()
        print(f"  [SUCCESS] Extracted {extracted} pages and {embedded_images} embedded images to {output_dir}/\n")
    
    print("[SUCCESS] All PDFs processed successfully!")
    
except ImportError:
    print("PyMuPDF not found. Installing...")
    os.system("pip install PyMuPDF")
    print("Please run the script again.")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

