import fitz
import sys
import os

def extract_text_from_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_text.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    text = extract_text_from_pdf(pdf_path)
    
    output_path = pdf_path.rsplit('.', 1)[0] + '.utf8'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Extracted text to {output_path}")
