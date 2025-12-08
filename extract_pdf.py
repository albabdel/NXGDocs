import sys
import os

try:
    # Try using pypdf2
    from PyPDF2 import PdfReader
    
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "GCXONE_Article_List.pdf"
    reader = PdfReader(pdf_path)
    
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    
    print(text)
    
    # Save to file
    with open("article_list.txt", "w", encoding="utf-8") as f:
        f.write(text)
        
except ImportError:
    print("PyPDF2 not available, trying pdfplumber...")
    try:
        import pdfplumber
        
        pdf_path = sys.argv[1] if len(sys.argv) > 1 else "GCXONE_Article_List.pdf"
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
            
            print(text)
            
            # Save to file
            with open("article_list.txt", "w", encoding="utf-8") as f:
                f.write(text)
    except ImportError:
        print("No PDF library available. Install PyPDF2 or pdfplumber.")
