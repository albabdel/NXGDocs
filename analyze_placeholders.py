import os
import re

DOCS_DIR = r'c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\docs'
MIGRATED_DIRS = [
    r'c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\_migrated_content\docs',
    r'c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\_migrated_content\docs-internal',
    r'c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\_migrated_content\internal_docs',
    r'c:\Users\abdel\.gemini\antigravity\scratch\nxgen-docs\classic\docs\getting-started\next'
]

def get_placeholder_files(root_dir):
    placeholder_files = []
    pattern = re.compile(r'\[Placeholder:', re.IGNORECASE)
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if pattern.search(content):
                            placeholder_files.append({
                                'path': path,
                                'rel_path': os.path.relpath(path, root_dir),
                                'name': file,
                                'title': get_title(content) or file
                            })
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    return placeholder_files

def get_title(content):
    # Try frontmatter title
    fm_match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', content, re.MULTILINE)
    if fm_match:
        return fm_match.group(1)
    # Try H1
    h1_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1)
    return None

def get_migrated_index(migrated_dirs):
    index = {}
    for m_dir in migrated_dirs:
        if not os.path.exists(m_dir):
            continue
        for root, dirs, files in os.walk(m_dir):
            for file in files:
                if file.endswith('.md') or file.endswith('.mdx'):
                    path = os.path.join(root, file)
                    name_clean = re.sub(r'^\d+-', '', file).replace('.mdx', '').replace('.md', '').lower()
                    try:
                        with open(path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            title = get_title(content)
                            index[name_clean] = {'path': path, 'title': title, 'content_len': len(content)}
                            if title:
                                index[title.lower()] = {'path': path, 'title': title, 'content_len': len(content)}
                    except:
                        pass
                elif file.endswith('.pdf'):
                    path = os.path.join(root, file)
                    # Clean filename for matching
                    name_clean = file.lower().replace('.pdf', '')
                    name_clean = re.sub(r'\(.*?\)', '', name_clean).strip() # Remove (1), (2) etc.
                    name_clean = re.sub(r'[-_]', ' ', name_clean).strip()
                    index[name_clean] = {'path': path, 'title': file, 'content_len': 0}
    return index

def analyze():
    print("Scanning for placeholders...")
    placeholders = get_placeholder_files(DOCS_DIR)
    print(f"Found {len(placeholders)} files with placeholders.")
    
    print("Indexing migrated content...")
    migrated_index = get_migrated_index(MIGRATED_DIRS)
    print(f"Indexed {len(migrated_index)} potential sources.")
    
    report = []
    full_matches = 0
    partial_matches = 0
    no_matches = 0
    
    for ph in placeholders:
        match_type = 'None'
        suggestion = None
        
        # Try matching by filename (without numbers)
        name_clean = re.sub(r'^\d+-', '', ph['name']).replace('.mdx', '').replace('.md', '').lower()
        title_clean = ph['title'].lower()
        
        # 1. Direct or substring match
        if name_clean in migrated_index:
            match_type = 'Full'
            suggestion = migrated_index[name_clean]['path']
            full_matches += 1
        elif title_clean in migrated_index:
            match_type = 'Full'
            suggestion = migrated_index[title_clean]['path']
            full_matches += 1
        else:
            # 2. Flexible Substring / Word Overlap match
            best_part = None
            max_score = 0
            
            ph_words = set(re.findall(r'\w+', title_clean))
            # Remove common words
            stop_words = {'and', 'the', 'for', 'with', 'of', 'in', 'to', 'is', 'nxgen', 'gcxone', 'guide', 'overview', 'configuration'}
            ph_words = {w for w in ph_words if w not in stop_words and len(w) > 2}
            
            for key, source_data in migrated_index.items():
                if len(key) < 4: continue
                
                # Check if key is in title or vice versa
                if key in title_clean or title_clean in key:
                    score = 0.8 # Substring match
                else:
                    key_words = set(re.findall(r'\w+', key))
                    key_words = {w for w in key_words if w not in stop_words and len(w) > 2}
                    
                    if not ph_words or not key_words: continue
                    
                    overlap = ph_words.intersection(key_words)
                    score = len(overlap) / max(len(ph_words), len(key_words))
                
                if score > max_score:
                    max_score = score
                    best_part = source_data['path']
            
            if max_score > 0.4:
                match_type = 'Full' if max_score > 0.8 else 'Partial'
                suggestion = best_part
                if match_type == 'Full': full_matches += 1
                else: partial_matches += 1
            else:
                no_matches += 1
        
        report.append({
            'file': ph['rel_path'],
            'title': ph['title'],
            'match': match_type,
            'source': suggestion
        })
    
    # Output report
    with open('placeholder_report.md', 'w', encoding='utf-8') as f:
        f.write("# Placeholder Analysis Report\n\n")
        f.write(f"Total placeholder files: {len(placeholders)}\n")
        f.write(f"- Full Matches: {full_matches}\n")
        f.write(f"- Partial Matches: {partial_matches}\n")
        f.write(f"- No Matches: {no_matches}\n\n")
        f.write("## Detailed List\n\n")
        f.write("| File | Title | Match Type | Source Candidate |\n")
        f.write("| --- | --- | --- | --- |\n")
        for item in report:
            source = os.path.basename(item['source']) if item['source'] else 'N/A'
            f.write(f"| {item['file']} | {item['title']} | {item['match']} | {source} |\n")

    print(f"\nReport generated: placeholder_report.md")
    total_fillable = full_matches + partial_matches
    print(f"Estimation: {total_fillable} out of {len(placeholders)} can be filled ({((total_fillable)/len(placeholders))*100:.1f}%)")

if __name__ == "__main__":
    analyze()
