#!/usr/bin/env python3
"""
Device Directory Generator for GCXONE Documentation

Creates directory structure and documentation files for new device integrations.
"""

import os
import sys
from datetime import date
import re


def create_device_slug(device_name):
    """Convert device name to URL-friendly slug"""
    # Remove special characters and convert to lowercase
    slug = device_name.lower()
    # Replace spaces and special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = slug.strip('-')
    return slug


def get_device_info():
    """Prompt for device information"""
    print("\n=== Device Documentation Generator ===\n")

    device_name = input("Device Name (e.g., 'Honeywell 35 Series'): ").strip()
    if not device_name:
        print("Error: Device name is required")
        sys.exit(1)

    device_type = input("Device Type (NVR/VMS/IP Camera/AI Box/Router/IOT/Cloud VMS/Other): ").strip()
    vendor = input("Vendor Name: ").strip()

    difficulty = input("Difficulty Level (beginner/intermediate/advanced) [default: intermediate]: ").strip()
    if not difficulty:
        difficulty = "intermediate"

    return {
        'name': device_name,
        'slug': create_device_slug(device_name),
        'type': device_type if device_type else 'Device',
        'vendor': vendor if vendor else 'Unknown',
        'difficulty': difficulty,
        'date': date.today().strftime('%Y-%m-%d')
    }


def create_directory_structure(device_slug, base_path='classic/docs/devices'):
    """Create device directory and images subdirectory"""
    device_path = os.path.join(base_path, device_slug)
    images_path = os.path.join(device_path, 'images')

    try:
        os.makedirs(images_path, exist_ok=True)
        print(f"✓ Created directory: {device_path}/")
        print(f"✓ Created directory: {images_path}/")
        return device_path
    except Exception as e:
        print(f"Error creating directories: {e}")
        sys.exit(1)


def populate_template(template_path, output_path, replacements):
    """Read template, replace placeholders, and write output file"""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace placeholders
        for key, value in replacements.items():
            content = content.replace(key, value)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f"Error processing template {template_path}: {e}")
        return False


def create_device_docs(device_info, device_path):
    """Create all three documentation files from templates"""
    templates = {
        'overview.md': 'templates/device-overview-template.md',
        'configuration.md': 'templates/device-configuration-template.md',
        'troubleshooting.md': 'templates/device-troubleshooting-template.md'
    }

    # Prepare replacements
    replacements = {
        '[Device Name]': device_info['name'],
        '[device-slug]': device_info['slug'],
        '[Device Type/Model]': device_info['type'],
        '[Vendor Name]': device_info['vendor'],
        '[Vendor]': device_info['vendor'],
        '[beginner|intermediate|advanced]': device_info['difficulty'],
        '[YYYY-MM-DD]': device_info['date'],
        '[Device Type from dropdown]': device_info['type'],
        '[device]': device_info['name'],
        '[Device type]': device_info['type'],
        '[device type]': device_info['type'].lower()
    }

    print("\nCreating documentation files:")
    success_count = 0

    for doc_file, template_file in templates.items():
        output_path = os.path.join(device_path, doc_file)

        if populate_template(template_file, output_path, replacements):
            print(f"  ✓ Created: {doc_file}")
            success_count += 1
        else:
            print(f"  ✗ Failed: {doc_file}")

    return success_count == len(templates)


def create_category_file(device_path):
    """Create _category_.json file for Docusaurus sidebar"""
    category_content = '''{
  "label": "Devices",
  "position": 3,
  "link": {
    "type": "generated-index",
    "description": "Device integration guides for GCXONE platform"
  }
}
'''

    category_path = os.path.join(device_path, '../_category_.json')

    # Only create if it doesn't exist
    if not os.path.exists(category_path):
        try:
            with open(category_path, 'w', encoding='utf-8') as f:
                f.write(category_content)
            print(f"✓ Created: _category_.json")
        except Exception as e:
            print(f"Note: Could not create _category_.json: {e}")


def main():
    """Main execution"""
    # Get device information
    device_info = get_device_info()

    print(f"\nGenerating documentation for: {device_info['name']}")
    print(f"  Slug: {device_info['slug']}")
    print(f"  Type: {device_info['type']}")
    print(f"  Vendor: {device_info['vendor']}")
    print(f"  Difficulty: {device_info['difficulty']}")
    print(f"  Date: {device_info['date']}\n")

    # Create directory structure
    device_path = create_directory_structure(device_info['slug'])

    # Create documentation files
    if create_device_docs(device_info, device_path):
        print("\n✓ Device documentation created successfully!")
        print(f"\nLocation: {device_path}/")
        print("\nNext steps:")
        print("  1. Add images to the images/ subdirectory")
        print("  2. Customize the documentation templates with device-specific content")
        print("  3. Update the integration hub (classic/src/pages/integration-hub.tsx) if needed")
        print(f"  4. Test the documentation at /docs/devices/{device_info['slug']}/overview\n")
    else:
        print("\n✗ Failed to create some documentation files")
        sys.exit(1)

    # Create category file if needed
    create_category_file(device_path)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
