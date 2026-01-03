#!/usr/bin/env python3
"""Remove all references to broken links from all files"""
import os
import re
from pathlib import Path

# Broken paths to remove
broken_paths = [
    "devices/hikvision/admin-configuration",
    "devices/hikvision/installer-configuration",
    "devices/hikvision/overview",
    "devices/hikvision/supported-features",
    "devices/hikvision/troubleshooting",
    "devices/honeywell/configuration",
    "devices/honeywell/overview",
    "devices/honeywell/troubleshooting",
    "devices/innovi/configuration",
    "devices/innovi/overview",
    "devices/innovi/troubleshooting",
    "devices/axis/installer-configuration",
    "devices/axxon/installer-configuration",
    "devices/gcxone-audio/installer-configuration",
    "devices/hanwha/installer-configuration",
    "devices/heitel/installer-configuration",
    "devices/innovi/installer-configuration",
    "devices/milestone/installer-configuration",
    "devices/teltonika/installer-configuration",
    "devices/generic/limitations",
    "devices/milestone/admin-configuration",
    "devices/milestone/configuration",
    "devices/milestone/overview",
    "devices/milestone/troubleshooting",
    "devices/miwi/configuration",
    "devices/miwi/overview",
    "devices/miwi/troubleshooting",
    "devices/mobotix/configuration",
    "devices/mobotix/overview",
    "devices/mobotix/troubleshooting",
    "devices/nxgcloudnvr/configuration",
    "devices/nxgcloudnvr/overview",
    "devices/nxgcloudvisionedge/configuration",
    "devices/nxgcloudvisionedge/overview",
    "devices/nxgcloudvisionedge/troubleshooting",
    "devices/nxgcloudnvr/troubleshooting",
    "devices/nxwitness/troubleshooting",
    "devices/nxwitness/configuration",
    "devices/nxwitness/overview",
    "devices/netvue/configuration",
    "devices/netvue/overview",
    "devices/netvue/troubleshooting",
    "devices/onvif/configuration",
    "devices/onvif/overview",
    "devices/general/onboarding-overview",
    "devices/onvif/troubleshooting",
    "devices/generic/onvif-integration",
    "devices/adpro/operator-view",
    "devices/avigilon/operator-view",
    "devices/axis/operator-view",
    "devices/axxon/operator-view",
    "devices/camect/operator-view",
    "devices/dahua/operator-view",
    "devices/gcxone-audio/operator-view",
    "devices/hanwha/operator-view",
    "devices/heitel/operator-view",
    "devices/hikvision/operator-view",
    "devices/innovi/operator-view",
    "devices/milestone/operator-view",
    "devices/reconeyez/operator-view",
    "devices/teltonika/operator-view",
    "devices/gcxone-audio/overview",
    "devices/reconeyez/admin-configuration",
    "devices/reconeyez/installer-configuration",
    "devices/reconeyez/overview",
    "devices/reconeyez/troubleshooting",
    "devices/rosenberger/configuration",
    "devices/rosenberger/overview",
    "devices/rosenberger/troubleshooting",
    "devices/generic/rtsp-configuration",
    "devices/spykebox/configuration",
    "devices/spykebox/overview",
    "devices/spykebox/troubleshooting",
    "devices/senstar/installer-configuration",
    "devices/axxon/supported-features",
    "devices/camect/supported-features",
    "devices/gcxone-audio/supported-features",
    "devices/hanwha/supported-features",
    "devices/heitel/supported-features",
    "devices/innovi/supported-features",
    "devices/milestone/supported-features",
    "devices/reconeyez/supported-features",
    "devices/teltonika/supported-features",
    "devices/general/troubleshooting-basics",
    "devices/teltonika/admin-configuration",
    "devices/teltonika/overview",
    "devices/camect/troubleshooting",
    "devices/gcxone-audio/troubleshooting",
    "devices/teltonika/troubleshooting",
    "devices/uniview/installer-configuration",
    "devices/uniview/overview",
    "devices/viasys/configuration",
    "devices/viasys/overview",
    "devices/viasys/troubleshooting",
    "devices/victron/configuration",
    "devices/victron/overview",
    "devices/victron/troubleshooting",
    "features/ai-analytics/overview",
    "features/ai-analytics/configuration",
    "features/audio-detection/configuration",
    "features/event-clips/configuration",
    "features/face-detection/configuration",
    "features/heat-mapping/configuration",
    "features/intrusion-detection/configuration",
    "features/license-plate/configuration",
    "features/line-crossing/configuration",
    "features/motion-detection/configuration",
    "features/people-counting/configuration",
    "features/tamper-detection/configuration",
    "features/event-clips/overview",
    "features/live-view/configuration",
    "features/live-view/overview",
    "features/live-view/troubleshooting",
    "features/local-mode/configuration",
    "features/local-mode/overview",
    "features/audio-detection/overview",
    "features/face-detection/overview",
    "features/heat-mapping/overview",
    "features/intrusion-detection/overview",
    "features/license-plate/overview",
    "features/line-crossing/overview",
    "features/motion-detection/overview",
    "features/people-counting/overview",
    "features/tamper-detection/overview",
    "features/ptz-control/configuration",
    "features/ptz-control/overview",
    "features/ptz-control/troubleshooting",
    "features/playback/configuration",
    "features/playback/overview",
    "features/playback/troubleshooting",
    "features/ai-analytics/troubleshooting",
    "features/audio-detection/troubleshooting",
    "features/event-clips/troubleshooting",
    "features/face-detection/troubleshooting",
    "features/heat-mapping/troubleshooting",
    "features/intrusion-detection/troubleshooting",
    "features/license-plate/troubleshooting",
    "features/line-crossing/troubleshooting",
    "features/motion-detection/troubleshooting",
    "features/people-counting/troubleshooting",
    "features/tamper-detection/troubleshooting",
    "features/twilio-conference-mode",
    "features/video-streaming/configuration",
    "features/video-streaming/overview",
    "features/video-streaming/troubleshooting",
    "getting-started/devices/adpro/overview",
    "getting-started/devices/ajax/overview",
    "getting-started/alarm-forwarding",
    "getting-started/troubleshooting/overflow-thresholds",
    "getting-started/features/audio-routing",
    "getting-started/devices/avigilon/overview",
    "getting-started/devices/axis-camera-station/overview",
    "getting-started/bandwidth-requirementsx",
    "getting-started/troubleshooting/browser-errors",
    "getting-started/devices/camect/overview",
    "getting-started/cloud-architecture",
    "getting-started/user-management/creating-roles",
    "getting-started/user-management/customer-groups",
    "getting-started/devices/dahua-dolynk/overview",
    "getting-started/devices/dahua/overview",
    "getting-started/devices/eagle-eye/overview",
    "getting-started/firewall-configuration",
    "getting-started/first-time-login",
    "getting-started/gcxone-talos-interaction",
    "getting-started/devices/ganz/overview",
    "getting-started/getting-to-know-evalink-talos",
    "getting-started/devices/hikvision/overview",
    "getting-started/next/IMPLEMENTATION_PHASE2",
    "getting-started/ip-whitelisting",
    "getting-started/troubleshooting/image-and-video-issues",
    "getting-started/next/IMPLEMENTATION_REVIEW",
    "getting-started/next/IMPLEMENTATION_SUMMARY",
    "getting-started/user-management/inviting-users",
    "getting-started/key-benefits",
    "getting-started/user-management/managing-users",
    "getting-started/ntp-configuration",
    "getting-started/password-management",
    "getting-started/features/feature-list",
    "getting-started/quick-start-checklist",
    "getting-started/devices/reconeyez/overview",
    "getting-started/required-ports",
    "getting-started/talos/roles-and-permissions",
    "getting-started/user-management/roles-and-access-levels",
    "getting-started/devices/senstar/overview",
    "getting-started/talos/site-management",
    "getting-started/user-management/talos-user-management",
]

def process_file(file_path):
    """Process a single file to remove broken links"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return 0
    
    original_content = content
    changes = 0
    
    for broken_path in broken_paths:
        escaped_path = re.escape(broken_path)
        
        # Pattern 1: Sidebar string literals: 'path' or "path"
        pattern1 = rf"['\"]({escaped_path})['\"]"
        if re.search(pattern1, content):
            content = re.sub(pattern1, '', content)
            changes += 1
        
        # Pattern 2: Markdown links: [text](/docs/path) or [text](/docs/path.md)
        pattern2 = rf'\[([^\]]*)\]\(/docs/{escaped_path}(\.md)?(#[^\)]*)?\)'
        if re.search(pattern2, content):
            content = re.sub(pattern2, '', content)
            changes += 1
        
        # Pattern 3: Relative markdown links: [text](path) or [text](path.md)
        pattern3 = rf'\[([^\]]*)\]\({escaped_path}(\.md)?(#[^\)]*)?\)'
        if re.search(pattern3, content):
            content = re.sub(pattern3, '', content)
            changes += 1
        
        # Pattern 4: URL properties in JS/TS: url: "/docs/path" or link: '/docs/path'
        pattern4 = rf'(url|link|to|configLink):\s*["\']/docs/{escaped_path}(\.md)?["\']'
        if re.search(pattern4, content):
            content = re.sub(pattern4, '', content)
            changes += 1
        
        # Pattern 5: See references: See [text](/docs/path)
        pattern5 = rf'See\s+\[([^\]]*)\]\(/docs/{escaped_path}(\.md)?\)'
        if re.search(pattern5, content):
            content = re.sub(pattern5, '', content)
            changes += 1
    
    # Clean up: Remove trailing commas on lines that are now empty or just whitespace
    lines = content.split('\n')
    cleaned_lines = []
    for i, line in enumerate(lines):
        # Remove lines that are just whitespace and a comma
        if re.match(r'^\s*,\s*$', line):
            # Check if next line is also empty or contains closing bracket
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line == '' or next_line.startswith((']', '}', '),')):
                    continue
        cleaned_lines.append(line)
    
    content = '\n'.join(cleaned_lines)
    
    # Clean up excessive blank lines (3+ -> 2)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    if content != original_content:
        try:
            with open(file_path, 'w', encoding='utf-8', errors='ignore') as f:
                f.write(content)
            return changes
        except Exception as e:
            print(f"Error writing {file_path}: {e}")
            return 0
    
    return 0

# Process files
total_changes = 0
files_processed = 0

# Process markdown and TS/TSX files in classic directory
for root, dirs, files in os.walk('classic'):
    # Skip certain directories
    if 'node_modules' in root or 'build' in root or '.git' in root:
        continue
    
    for file in files:
        if file.endswith(('.md', '.mdx', '.ts', '.tsx')):
            file_path = os.path.join(root, file)
            changes = process_file(file_path)
            if changes > 0:
                files_processed += 1
                total_changes += changes
                print(f"Processed {file_path}: {changes} changes")

# Process content-staging directory
for root, dirs, files in os.walk('content-staging'):
    if 'node_modules' in root or 'build' in root or '.git' in root:
        continue
    
    for file in files:
        if file.endswith(('.md', '.mdx', '.ts', '.tsx')):
            file_path = os.path.join(root, file)
            changes = process_file(file_path)
            if changes > 0:
                files_processed += 1
                total_changes += changes
                print(f"Processed {file_path}: {changes} changes")

print(f"\nTotal: {files_processed} files processed, {total_changes} changes made")

