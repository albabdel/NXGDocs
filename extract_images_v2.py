import fitz
import sys
import os

def extract_images(pdf_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        output_path = os.path.join(output_dir, f"page-{page_num + 1}.png")
        pix.save(output_path)
        print(f"Saved {output_path}")
    doc.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_images_v2.py <pdf_path> <output_dir>")
    else:
        extract_images(sys.argv[1], sys.argv[2])
