#!/usr/bin/env python3
import re
import base64
import os

# Read the NTP.md file
ntp_file = 'classic/docs/getting-started/NTP.md'
images_dir = 'classic/docs/getting-started/images'

with open(ntp_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all base64 images
pattern = r'\[image(\d+)\]:\s*<data:image/(\w+);base64,([^>]+)>'
matches = re.findall(pattern, content)

# Create images directory
os.makedirs(images_dir, exist_ok=True)

# Extract and save images
extracted = []
for num, ext, img_data in matches:
    filename = f'{images_dir}/ntp-step-{num}.{ext}'
    try:
        # Decode base64 and save
        img_bytes = base64.b64decode(img_data)
        with open(filename, 'wb') as img_file:
            img_file.write(img_bytes)
        extracted.append(filename)
        print(f'✓ Extracted: {filename} ({len(img_bytes)} bytes)')
    except Exception as e:
        print(f'✗ Error extracting image {num}: {e}')

print(f'\nSuccessfully extracted {len(extracted)} images to {images_dir}/')

