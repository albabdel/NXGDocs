import os
import re

BASE_DIR = r"c:\nxgen-docs\classic\docs"

def fix_frontmatter():
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".md"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Regex to find title and sidebar_label and quote them if not already quoted
                # This is a simple heuristic.
                
                def replace_func(match):
                    key = match.group(1)
                    value = match.group(2).strip()
                    if value.startswith('"') and value.endswith('"'):
                        return f"{key}: {value}"
                    if value.startswith("'") and value.endswith("'"):
                        return f"{key}: {value}"
                    # Escape double quotes in value
                    value = value.replace('"', '\\"')
                    return f'{key}: "{value}"'

                new_content = re.sub(r'^(title|sidebar_label):\s*(.+)$', replace_func, content, flags=re.MULTILINE)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {path}")

if __name__ == "__main__":
    fix_frontmatter()
