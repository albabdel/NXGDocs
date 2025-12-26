#!/usr/bin/env python3
"""
Batch Device Directory Generator for GCXONE Documentation

Creates directories and documentation for multiple devices at once.
"""

import os
import sys
from datetime import date
import re


def create_device_slug(device_name):
    """Convert device name to URL-friendly slug"""
    slug = device_name.lower()
    # Remove special characters
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = slug.strip('-')
    return slug


def populate_template(template_path, output_path, replacements):
    """Read template, replace placeholders, and write output file"""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()

        for key, value in replacements.items():
            content = content.replace(key, value)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False


def create_device_docs(device_info, base_path='classic/docs/devices'):
    """Create device directory structure and documentation files"""
    device_slug = device_info['slug']
    device_path = os.path.join(base_path, device_slug)
    images_path = os.path.join(device_path, 'images')

    # Create directories
    try:
        os.makedirs(images_path, exist_ok=True)
    except Exception as e:
        print(f"  ✗ Failed to create directory: {e}")
        return False

    # Template files
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
        '[Vendor Name]': device_info.get('vendor', 'Unknown'),
        '[Vendor]': device_info.get('vendor', 'Unknown'),
        '[beginner|intermediate|advanced]': device_info.get('difficulty', 'intermediate'),
        '[YYYY-MM-DD]': device_info['date'],
        '[Device Type from dropdown]': device_info['type'],
        '[device]': device_info['name'],
        '[Device type]': device_info['type'],
        '[device type]': device_info['type'].lower()
    }

    # Create documentation files
    success = True
    for doc_file, template_file in templates.items():
        output_path = os.path.join(device_path, doc_file)
        if not populate_template(template_file, output_path, replacements):
            success = False

    return success


# Device list based on integration-hub.tsx
# Format: (name, type, vendor, difficulty, slug_override)
MISSING_DEVICES = [
    # Tier 1 - High Priority (with PDFs)
    ('Honeywell 35 Series NVR', 'NVR', 'Honeywell', 'intermediate', 'honeywell'),
    ('AxisCameraStation VMS', 'VMS', 'Axis Communications', 'intermediate', 'axiscamerastation'),
    ('ENEO NVR', 'NVR', 'ENEO', 'intermediate', 'eneo'),
    ('ENEOIP NVR', 'NVR', 'ENEO', 'intermediate', 'eneoip'),
    ('Milestone VMS', 'VMS', 'Milestone Systems', 'intermediate', 'milestone'),
    ('NetVue IP Camera', 'IP Camera', 'NetVue', 'beginner', 'netvue'),

    # Tier 2 - Medium Priority (common devices)
    ('NXWitness', 'VMS', 'Network Optix', 'intermediate', 'nxwitness'),
    ('GenesisVms', 'VMS', 'NXGEN', 'intermediate', 'genesisvms'),
    ('DigitalWatchdog', 'VMS', 'Digital Watchdog', 'intermediate', 'digitalwatchdog'),
    ('NXGCloudNVR', 'Cloud VMS', 'NXGEN', 'beginner', 'nxgcloudnvr'),
    ('NXG Cloud Vision Edge', 'Cloud VMS', 'NXGEN', 'intermediate', 'nxgcloudvisionedge'),
    ('SPYKEBOX NVR', 'NVR', 'SPYKEBOX', 'intermediate', 'spykebox'),
    ('Viasys/ShieldBox Cloud NVR', 'Cloud VMS', 'Viasys', 'intermediate', 'viasys'),
    ('Mobotix IP Camera', 'IP Camera', 'Mobotix', 'intermediate', 'mobotix'),
    ('Onvif IP Camera', 'IP Camera', 'Generic', 'beginner', 'onvif'),

    # Tier 3 - Specialized devices
    ('Hikpro P2P Cloud VMS', 'Cloud VMS', 'Hikvision', 'intermediate', 'hikpro'),
    ('HANWHA', 'VMS', 'Hanwha', 'intermediate', 'hanwha'),
    ('Axxon VMS', 'VMS', 'AxxonSoft', 'advanced', 'axxon'),
    ('AXIS CS Pro VMS', 'VMS', 'Axis Communications', 'advanced', 'axiscspro'),
    ('Geutebrück VMS', 'VMS', 'Geutebrück', 'advanced', 'geutebruck'),
    ('Heitel NVR', 'NVR', 'Heitel', 'intermediate', 'heitel'),
    ('Axis IP Camera', 'IP Camera', 'Axis Communications', 'beginner', 'axis'),
    ('Davantis AI BOX', 'AI Box', 'Davantis', 'intermediate', 'davantis'),
    ('GenesisAudio SIP Twillio', 'Other', 'NXGEN', 'advanced', 'genesisaudio'),
    ('EFOY Router', 'Router', 'EFOY', 'intermediate', 'efoy'),
    ('Victron Router', 'Router', 'Victron Energy', 'intermediate', 'victron'),
    ('Essence My Sheild PIR CAM', 'IOT', 'Essence', 'beginner', 'essence'),
    ('Innovi AI Cloud', 'IOT', 'Innovi', 'intermediate', 'innovi'),
    ('Rosenberger IOT battery Mgmt', 'IOT', 'Rosenberger', 'advanced', 'rosenberger'),
    ('Autoaid IOT', 'IOT', 'Autoaid', 'intermediate', 'autoaid'),
    ('Auraigateway IOT Mining', 'IOT', 'Auraigateway', 'advanced', 'auraigateway'),
    ('Miwi Urmet (Polish) NVR/IP Camera', 'NVR', 'Urmet', 'intermediate', 'miwi'),
]


def main():
    """Main execution"""
    print("\n=== Batch Device Documentation Generator ===\n")
    print(f"Creating documentation for {len(MISSING_DEVICES)} devices...")
    print(f"Date: {date.today().strftime('%Y-%m-%d')}\n")

    success_count = 0
    failed_devices = []
    current_date = date.today().strftime('%Y-%m-%d')

    for device_data in MISSING_DEVICES:
        name, dev_type, vendor, difficulty, slug = device_data

        device_info = {
            'name': name,
            'slug': slug,
            'type': dev_type,
            'vendor': vendor,
            'difficulty': difficulty,
            'date': current_date
        }

        print(f"Creating: {name} ({slug})...")

        if create_device_docs(device_info):
            print(f"  [OK] Created successfully\n")
            success_count += 1
        else:
            print(f"  [FAIL] Failed\n")
            failed_devices.append(name)

    # Summary
    print("\n" + "="*60)
    print(f"SUMMARY")
    print("="*60)
    print(f"Total devices: {len(MISSING_DEVICES)}")
    print(f"[OK] Successfully created: {success_count}")
    print(f"[FAIL] Failed: {len(failed_devices)}")

    if failed_devices:
        print("\nFailed devices:")
        for device in failed_devices:
            print(f"  - {device}")

    print("\nNext steps:")
    print("  1. Review generated documentation in classic/docs/devices/")
    print("  2. Add device-specific content to each overview.md")
    print("  3. Populate configuration.md with setup steps")
    print("  4. Add troubleshooting content to troubleshooting.md")
    print("  5. Extract and add images to images/ subdirectories")
    print("  6. Test all device documentation routes\n")


if __name__ == '__main__':
    try:
        # Check if templates exist
        required_templates = [
            'templates/device-overview-template.md',
            'templates/device-configuration-template.md',
            'templates/device-troubleshooting-template.md'
        ]

        missing_templates = [t for t in required_templates if not os.path.exists(t)]
        if missing_templates:
            print("ERROR: Required template files not found:")
            for t in missing_templates:
                print(f"  - {t}")
            print("\nPlease ensure templates are created first.")
            sys.exit(1)

        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
