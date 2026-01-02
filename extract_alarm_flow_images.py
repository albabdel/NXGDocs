#!/usr/bin/env python3
"""Extract images from Alarm_Journey_Five_Stages_and_Control_Points.pdf"""
import sys
import os

pdf_path = r"New articles\Alarm flow\Alarm_Journey_Five_Stages_and_Control_Points.pdf"
output_dir = r"classic\static\img\platform-fundamentals\alarm-flow"
output_md = r"classic\docs\platform-fundamentals-alarm-flow.md"

try:
    import fitz  # PyMuPDF
    print("Using PyMuPDF...")
    
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    print(f"PDF has {page_count} pages")
    
    # Create output directory for images
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract images from each page
    images_extracted = []
    
    for page_num in range(page_count):
        page = doc[page_num]
        
        # Extract embedded images
        image_list = page.get_images()
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Save image
                image_filename = f"alarm-flow-page-{page_num + 1}-img-{img_index + 1}.{image_ext}"
                image_path = os.path.join(output_dir, image_filename)
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                images_extracted.append((page_num + 1, img_index + 1, image_filename))
                print(f"[OK] Extracted image: {image_filename}")
            except Exception as e:
                print(f"[WARN] Could not extract image {img_index + 1} from page {page_num + 1}: {e}")
        
        # Also save page as image for full page screenshots
        try:
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
            page_image_path = os.path.join(output_dir, f"alarm-flow-page-{page_num + 1}.png")
            pix.save(page_image_path)
            images_extracted.append((page_num + 1, 0, f"alarm-flow-page-{page_num + 1}.png"))
            print(f"[OK] Saved page as image: alarm-flow-page-{page_num + 1}.png")
        except Exception as e:
            print(f"[WARN] Could not save page {page_num + 1} as image: {e}")
    
    doc.close()
    
    print(f"\n[OK] Successfully extracted {len(images_extracted)} images to {output_dir}/")
    print(f"\nImages extracted:")
    for page_num, img_index, filename in images_extracted:
        if img_index == 0:
            print(f"  - Page {page_num} (full page): {filename}")
        else:
            print(f"  - Page {page_num}, Image {img_index}: {filename}")
    
except ImportError:
    print("PyMuPDF not found. Please install it:")
    print("  pip install PyMuPDF")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

