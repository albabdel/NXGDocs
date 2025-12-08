import os
import re
import shutil

# Configuration
BASE_DIR = r"c:\nxgen-docs\classic\docs"
ARTICLE_LIST_PATH = r"c:\nxgen-docs\article_list.txt"
EXTRACTED_CONTENT_PATH = r"c:\nxgen-docs\extracted_content.txt"

def clean_docs_dir():
    """Removes all content in the docs directory to start fresh."""
    if os.path.exists(BASE_DIR):
        shutil.rmtree(BASE_DIR)
    os.makedirs(BASE_DIR)
    print(f"Cleaned {BASE_DIR}")

def slugify(text):
    """Converts text to a filename-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text

def parse_article_list():
    """Parses the article_list.txt file."""
    with open(ARTICLE_LIST_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    structure = []
    current_part = None
    current_section = None
    
    # Regex patterns
    part_pattern = re.compile(r"PART (\d+): (.+)")
    section_pattern = re.compile(r"(\d+)\. (.+)")
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
            
        # Check for Part
        part_match = part_pattern.match(line)
        if part_match:
            current_part = {
                "name": part_match.group(2).strip(),
                "is_internal": "INTERNAL" in line.upper(),
                "sections": []
            }
            structure.append(current_part)
            i += 1
            continue
            
        # Check for Section
        section_match = section_pattern.match(line)
        if section_match:
            if current_part:
                current_section = {
                    "name": section_match.group(2).strip(),
                    "articles": []
                }
                current_part["sections"].append(current_section)
            i += 1
            # Skip headers (Article Name, Contains, Scope)
            while i < len(lines) and (lines[i].strip() == "Article Name" or lines[i].strip() == "Contains" or lines[i].strip() == "Scope"):
                i += 1
            continue
            
        # Check for Article (assuming 3 lines per article: Name, Contains, Scope)
        # We need to be careful as some lines might be wrapped or empty
        if current_section:
            # Heuristic: If we have a line, and the next line looks like content, and the one after looks like scope
            # But the file format seems strictly 3 lines per article block based on the view_file output?
            # Let's look at the file content again.
            # 8: What is GCXONE GCXONE?
            # 9: Platform definition, cloud SaaS model, USMS concept, key capabilities
            # 10: Overview
            
            # So it is groups of 3 lines.
            if i + 2 < len(lines):
                article_name = lines[i].strip()
                article_contains = lines[i+1].strip()
                article_scope = lines[i+2].strip()
                
                # Validation: check if the next line is a section or part header, which would mean we misaligned
                if part_pattern.match(article_name) or section_pattern.match(article_name):
                    # Backtrack or handle error? 
                    # Actually, if we hit a header, we shouldn't be in this block.
                    # But the loop handles headers at the top.
                    pass
                else:
                    current_section["articles"].append({
                        "name": article_name,
                        "contains": article_contains,
                        "scope": article_scope
                    })
                    i += 3
                    continue
        
        i += 1

    return structure

def create_files(structure):
    """Creates the directory structure and markdown files."""
    
    # Read extracted content for simple matching (optional enhancement)
    try:
        with open(EXTRACTED_CONTENT_PATH, 'r', encoding='utf-8') as f:
            brain_content = f.read()
    except:
        brain_content = ""

    for part in structure:
        # Determine base path for this part
        if part["is_internal"]:
            part_dir = os.path.join(BASE_DIR, "internal")
        else:
            part_dir = BASE_DIR # External goes to root of docs
            
        if not os.path.exists(part_dir):
            os.makedirs(part_dir)
            
        for section_idx, section in enumerate(part["sections"]):
            # Create section directory with numbering
            section_slug = slugify(section["name"])
            section_dir_name = f"{section_idx + 1:02d}-{section_slug}"
            section_path = os.path.join(part_dir, section_dir_name)
            
            if not os.path.exists(section_path):
                os.makedirs(section_path)
                
            # Create _category_.json
            with open(os.path.join(section_path, "_category_.json"), 'w') as f:
                f.write(f'{{\n  "label": "{section["name"]}",\n  "position": {section_idx + 1},\n  "link": {{\n    "type": "generated-index"\n  }}\n}}')

            for article_idx, article in enumerate(section["articles"]):
                article_slug = slugify(article["name"])
                filename = f"{article_idx + 1:02d}-{article_slug}.md"
                file_path = os.path.join(section_path, filename)
                
                # Generate content
                content = f"""---
title: {article['name']}
sidebar_label: {article['name']}
---

# {article['name']}

## Overview
{article['contains']}

## Scope
**{article['scope']}**

---

> [!NOTE]
> This article is part of the {part['name']} knowledge base.

"""
                # Try to find relevant content in brain_content (naive search)
                # If the article name appears in the brain content, grab the surrounding text?
                # This is risky. Better to just leave the placeholder for now and let the agent fill it in.
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Created {file_path}")

def main():
    print("Starting documentation generation...")
    clean_docs_dir()
    structure = parse_article_list()
    create_files(structure)
    print("Done.")

if __name__ == "__main__":
    main()
