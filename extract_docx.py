import zipfile
import xml.etree.ElementTree as ET
import os
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as zf:
            xml_content = zf.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text = []
        for node in tree.iter():
            if node.tag == '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t':
                if node.text:
                    text.append(node.text)
            elif node.tag == '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p':
                text.append('\n')
        
        return ''.join(text)
    except Exception as e:
        return str(e)

docx_filename = "This comprehensive article serves as a deep synthesis of the source documents, detailing the architecture, functionality, integration protocols, and device-specific configurations for the NXGEN GCXONE platfor (1).docx"
content = extract_text_from_docx(docx_filename)
print(content[:2000]) # Print first 2000 chars to verify
with open('extracted_content.txt', 'w', encoding='utf-8') as f:
    f.write(content)
