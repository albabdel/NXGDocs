#!/usr/bin/env python3
"""Create placeholder images for device documentation"""

import os
from PIL import Image, ImageDraw, ImageFont

def create_placeholder_image(output_path, text="Image Coming Soon", size=(800, 600)):
    """Create a simple placeholder image"""
    # Create image with light gray background
    img = Image.new('RGB', size, color=(240, 240, 240))
    draw = ImageDraw.Draw(img)

    # Add text
    try:
        # Try to use a system font
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Get text bounding box for centering
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Calculate position to center text
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2

    # Draw text
    draw.text((x, y), text, fill=(128, 128, 128), font=font)

    # Save image
    img.save(output_path, 'PNG')


# Device directories that need placeholder images
devices_needing_images = [
    'axis', 'axxon', 'axiscspro', 'auraigateway', 'autoaid',
    'davantis', 'digitalwatchdog', 'efoy', 'essence',
    'genesisaudio', 'genesisvms', 'geutebruck', 'hanwha',
    'heitel', 'hikpro', 'innovi', 'miwi', 'mobotix',
    'nxgcloudnvr', 'nxgcloudvisionedge', 'nxwitness',
    'onvif', 'rosenberger', 'spykebox', 'victron', 'viasys'
]

def main():
    print("Creating placeholder images for devices...\n")

    for device in devices_needing_images:
        device_path = f"classic/docs/devices/{device}/images"

        if not os.path.exists(device_path):
            print(f"[SKIP] {device} - directory not found")
            continue

        # Create placeholder images
        placeholders = [
            'config-step1.png',
            'config-step2.png',
            'config-step3.png',
            'config-gcxone-add.png'
        ]

        created = 0
        for placeholder in placeholders:
            img_path = os.path.join(device_path, placeholder)
            if not os.path.exists(img_path):
                create_placeholder_image(img_path, f"{device.upper()}\n{placeholder}")
                created += 1

        print(f"[OK] {device} - created {created} placeholder images")

    print("\nDone! Placeholder images created.")
    print("Note: Replace these with actual screenshots during documentation.")


if __name__ == '__main__':
    try:
        from PIL import Image, ImageDraw, ImageFont
        main()
    except ImportError:
        print("ERROR: PIL/Pillow not installed.")
        print("Install with: pip install Pillow")
        print("\nAlternative: Comment out image references in config files.")
