#!/usr/bin/env python3
"""
Batch PDF Image Extractor for GCXONE Device Documentation

Extracts images from multiple device PDF guides and organizes them into
device-specific directories.
"""

import os
import sys
from pathlib import Path

# PDF to Device mapping for Tier 1 devices
PDF_DEVICE_MAPPING = [
    {
        'pdf': 'classic/docs/getting-started/devices/Honeywell.pdf',
        'device_slug': 'honeywell',
        'output_dir': 'classic/docs/devices/honeywell/images',
        'prefix': 'config',
        'name': 'Honeywell 35 Series NVR'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/Axiscamerastation Pro End to End guide.pdf',
        'device_slug': 'axiscamerastation',
        'output_dir': 'classic/docs/devices/axiscamerastation/images',
        'prefix': 'config',
        'name': 'Axis Camera Station VMS'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/eneo-integration (1).pdf',
        'device_slug': 'eneo',
        'output_dir': 'classic/docs/devices/eneo/images',
        'prefix': 'config',
        'name': 'ENEO NVR'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/release-notes-eneo-ip-integration (1).pdf',
        'device_slug': 'eneoip',
        'output_dir': 'classic/docs/devices/eneoip/images',
        'prefix': 'config',
        'name': 'ENEOIP NVR'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/genesis-milestone-configuration (2).pdf',
        'device_slug': 'milestone',
        'output_dir': 'classic/docs/devices/milestone/images',
        'prefix': 'config',
        'name': 'Milestone VMS'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/Milestone Alarm  Trigger Configuration as IO.pdf',
        'device_slug': 'milestone',
        'output_dir': 'classic/docs/devices/milestone/images',
        'prefix': 'alarm',
        'name': 'Milestone VMS (Alarm Config)'
    },
    {
        'pdf': 'classic/docs/getting-started/devices/netvu-integration (2).pdf',
        'device_slug': 'netvue',
        'output_dir': 'classic/docs/devices/netvue/images',
        'prefix': 'config',
        'name': 'NetVue IP Camera'
    },
]


def extract_pdf_images(pdf_path, output_dir, prefix='page', zoom=2):
    """
    Extract all pages from PDF as PNG images using PyMuPDF

    Args:
        pdf_path: Path to PDF file
        output_dir: Output directory for images
        prefix: Prefix for image filenames
        zoom: Zoom factor for image quality (2 = 2x resolution)

    Returns:
        Number of images extracted, or -1 on error
    """
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("  [ERROR] PyMuPDF not installed. Run: pip install PyMuPDF")
        return -1

    try:
        # Open PDF
        doc = fitz.open(pdf_path)
        page_count = len(doc)

        # Create output directory
        os.makedirs(output_dir, exist_ok=True)

        # Extract each page
        extracted = 0
        for page_num in range(page_count):
            page = doc[page_num]
            # Render at specified zoom for better quality
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
            output_path = os.path.join(output_dir, f"{prefix}-step{page_num + 1}.png")
            pix.save(output_path)
            extracted += 1

        doc.close()
        return extracted

    except Exception as e:
        print(f"  [ERROR] {e}")
        return -1


def get_pdf_page_count(pdf_path):
    """Get the number of pages in a PDF"""
    try:
        import fitz
        doc = fitz.open(pdf_path)
        count = len(doc)
        doc.close()
        return count
    except:
        return 0


def main():
    """Main execution"""
    print("\n=== Batch PDF Image Extractor ===\n")
    print("Extracting images from Tier 1 device PDFs...\n")

    total_pdfs = len(PDF_DEVICE_MAPPING)
    total_images = 0
    successful = 0
    failed = []

    for idx, mapping in enumerate(PDF_DEVICE_MAPPING, 1):
        pdf_path = mapping['pdf']
        device_name = mapping['name']
        output_dir = mapping['output_dir']
        prefix = mapping['prefix']

        print(f"[{idx}/{total_pdfs}] {device_name}")
        print(f"  PDF: {os.path.basename(pdf_path)}")

        # Check if PDF exists
        if not os.path.exists(pdf_path):
            print(f"  [SKIP] PDF not found\n")
            failed.append(device_name)
            continue

        # Get page count
        page_count = get_pdf_page_count(pdf_path)
        print(f"  Pages: {page_count}")
        print(f"  Output: {output_dir}")

        # Extract images
        extracted = extract_pdf_images(pdf_path, output_dir, prefix)

        if extracted > 0:
            print(f"  [OK] Extracted {extracted} images\n")
            total_images += extracted
            successful += 1
        else:
            print(f"  [FAIL] Extraction failed\n")
            failed.append(device_name)

    # Summary
    print("="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total PDFs processed: {total_pdfs}")
    print(f"[OK] Successful: {successful}")
    print(f"[FAIL] Failed: {len(failed)}")
    print(f"Total images extracted: {total_images}")

    if failed:
        print("\nFailed extractions:")
        for name in failed:
            print(f"  - {name}")

    print("\nNext steps:")
    print("  1. Review extracted images in device images/ directories")
    print("  2. Rename images to follow naming convention if needed")
    print("  3. Reference images in configuration.md with:")
    print("     ![Description](./images/config-stepX.png)")
    print("  4. Add alt text descriptions for accessibility")
    print()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
