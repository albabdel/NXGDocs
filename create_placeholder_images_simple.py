#!/usr/bin/env python3
"""Create minimal placeholder PNG images"""

import os
import base64

# Minimal 1x1 transparent PNG (base64 encoded)
MINIMAL_PNG = base64.b64decode(
    b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
)

devices_needing_images = [
    'axis', 'axxon', 'axiscspro', 'auraigateway', 'autoaid',
    'davantis', 'digitalwatchdog', 'efoy', 'essence',
    'genesisaudio', 'genesisvms', 'geutebruck', 'hanwha',
    'heitel', 'hikpro', 'innovi', 'miwi', 'mobotix',
    'nxgcloudnvr', 'nxgcloudvisionedge', 'nxwitness',
    'onvif', 'rosenberger', 'spykebox', 'victron', 'viasys'
]

# Tier 1 devices needing config-gcxone-add.png specifically
tier1_devices_needing_gcxone_image = [
    'honeywell', 'axiscamerastation', 'eneo', 'eneoip', 'milestone', 'netvue'
]

def main():
    print("Creating minimal placeholder PNG images...\n")

    total_created = 0

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
                with open(img_path, 'wb') as f:
                    f.write(MINIMAL_PNG)
                created += 1

        if created > 0:
            print(f"[OK] {device} - created {created} placeholder images")
            total_created += created

    # Create config-gcxone-add.png for Tier 1 devices
    print("\nCreating config-gcxone-add.png for Tier 1 devices...\n")
    for device in tier1_devices_needing_gcxone_image:
        device_path = f"classic/docs/devices/{device}/images"

        if not os.path.exists(device_path):
            print(f"[SKIP] {device} - directory not found")
            continue

        img_path = os.path.join(device_path, 'config-gcxone-add.png')
        if not os.path.exists(img_path):
            with open(img_path, 'wb') as f:
                f.write(MINIMAL_PNG)
            print(f"[OK] {device} - created config-gcxone-add.png")
            total_created += 1

    print(f"\nDone! Created {total_created} placeholder images.")
    print("Note: These are minimal 1x1 pixel PNGs. Replace with actual screenshots.")


if __name__ == '__main__':
    main()
