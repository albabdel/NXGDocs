import os
import re

def audit_docs(docs_root):
    results = []
    for root, dirs, files in os.walk(docs_root):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check frontmatter
                    has_frontmatter = content.startswith('---')
                    
                    # Identify Tier
                    tier = "Unknown"
                    if "tutorial" in content.lower(): tier = "Tutorial"
                    elif "how-to" in content.lower(): tier = "How-To"
                    elif "explanation" in content.lower() or "understanding" in content.lower(): tier = "Explanation"
                    elif "reference" in content.lower() or "api" in content.lower(): tier = "Reference"
                    
                    # Word count
                    word_count = len(content.split())
                    
                    results.append({
                        "path": path,
                        "has_frontmatter": has_frontmatter,
                        "tier": tier,
                        "word_count": word_count
                    })
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    
    return results

if __name__ == "__main__":
    docs_root = 'classic/docs'
    audit_results = audit_docs(docs_root)
    
    with open('AUDIT_REPORT.md', 'w', encoding='utf-8') as f:
        f.write("# Documentation Audit Report\n\n")
        f.write(f"Total files audited: {len(audit_results)}\n\n")
        f.write("| Path | Frontmatter | Identified Tier | Word Count |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        for res in audit_results:
            f.write(f"| {res['path']} | {res['has_frontmatter']} | {res['tier']} | {res['word_count']} |\n")
    
    print(f"Audit complete. Report saved to AUDIT_REPORT.md")
