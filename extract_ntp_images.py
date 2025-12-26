import re
import base64
import os

# Read the NTP.md file
with open('classic/docs/getting-started/NTP.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all base64 images
pattern = r'\[image(\d+)\]:\s*<data:image/(\w+);base64,([^>]+)>'
matches = re.findall(pattern, content)

# Create images directory
os.makedirs('classic/docs/getting-started/images', exist_ok=True)

# Extract and save images
for num, ext, img_data in matches:
    filename = f'classic/docs/getting-started/images/ntp-step-{num}.{ext}'
    try:
        with open(filename, 'wb') as img_file:
            img_file.write(base64.b64decode(img_data))
        print(f'Extracted: {filename}')
    except Exception as e:
        print(f'Error extracting image {num}: {e}')

print(f'\nExtracted {len(matches)} images successfully')

