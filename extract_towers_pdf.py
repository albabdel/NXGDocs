#!/usr/bin/env python3
"""Extract text and images from Towers.pdf and create a markdown article"""
import sys
import os

pdf_path = r"classic\docs\getting-started\Towers\Towers.pdf"
output_dir = r"classic\docs\getting-started\Towers\images"
output_md = r"classic\docs\getting-started\Towers\Towers.md"

try:
    import fitz  # PyMuPDF
    print("Using PyMuPDF...")
    
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    print(f"PDF has {page_count} pages")
    
    # Create output directory for images
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract text and images from each page
    all_text = []
    images_extracted = []
    
    for page_num in range(page_count):
        page = doc[page_num]
        
        # Extract text
        text = page.get_text()
        if text.strip():
            all_text.append(f"\n## Page {page_num + 1}\n\n{text.strip()}\n")
        
        # Extract images
        image_list = page.get_images()
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Save image
            image_filename = f"tower-step-{page_num + 1}-{img_index + 1}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)
            images_extracted.append((page_num + 1, img_index + 1, image_filename))
            print(f"[OK] Extracted image: {image_filename}")
        
        # Also save page as image for screenshots
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better quality
        page_image_path = os.path.join(output_dir, f"tower-page-{page_num + 1}.png")
        pix.save(page_image_path)
        print(f"[OK] Saved page as image: tower-page-{page_num + 1}.png")
    
    doc.close()
    
    # Write markdown file
    with open(output_md, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write("sidebar_position: 1\n")
        f.write("title: Add and Configure a New Mobile Tower\n")
        f.write("description: Complete step-by-step guide for adding and configuring mobile towers in GCXONE\n")
        f.write("tags:\n")
        f.write("  - towers\n")
        f.write("  - mobile-towers\n")
        f.write("  - configuration\n")
        f.write("  - getting-started\n")
        f.write("---\n\n")
        f.write("# Add and Configure a New Mobile Tower\n\n")
        f.write("This comprehensive guide walks you through the complete process of adding and configuring a new mobile tower in GCXONE, from creating templates in the Marketplace to final deployment and component configuration.\n\n")
        f.write("## Overview\n\n")
        f.write("The tower configuration process consists of three main phases:\n\n")
        f.write("1. **Marketplace Setup** - Create and configure tower templates\n")
        f.write("2. **Tower Deployment** - Deploy towers using configured templates\n")
        f.write("3. **Component Configuration** - Configure all tower components and monitoring\n\n")
        f.write("---\n\n")
        
        # Write extracted content
        for text_block in all_text:
            f.write(text_block)
            f.write("\n")
        
        # Add image references
        if images_extracted:
            f.write("\n## Images\n\n")
            f.write("The following images are available for reference:\n\n")
            for page_num, img_index, filename in images_extracted:
                f.write(f"![Step {page_num} - Image {img_index}](./images/{filename})\n\n")
    
    print(f"\n[OK] Successfully extracted {len(images_extracted)} images to {output_dir}/")
    print(f"[OK] Created markdown file: {output_md}")
    
except ImportError:
    print("PyMuPDF not found. Please install it:")
    print("  pip install PyMuPDF")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

