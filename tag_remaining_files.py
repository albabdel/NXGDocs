import os
import re
from pathlib import Path

# Define tag mappings based on file path and content
def get_tags_for_file(filepath, content):
    """Determine appropriate tags based on file path and content."""
    tags = []

    # Extract path components
    path_parts = filepath.lower().replace('\\', '/').split('/')
    filename = os.path.basename(filepath).lower()

    # Workflows section
    if '07-workflows-automation' in filepath:
        tags.append('workflow')
        tags.append('automation')
        if 'arm' in filename or 'disarm' in filename:
            tags.extend(['arm/disarm', 'scheduling'])
        if 'audio' in filename:
            tags.extend(['GCXONE audio', 'sip', 'announcements'])
        if 'introduction' in filename:
            tags.append('configuration')
        if 'creating' in filename:
            tags.extend(['setup', 'configuration'])
        if 'customization' in filename:
            tags.extend(['configuration', 'best practices'])
        if 'levels' in filename:
            tags.extend(['hierarchy', 'configuration'])

    # Troubleshooting section
    elif '08-troubleshooting-support' in filepath:
        tags.append('troubleshooting')
        tags.append('support')
        if 'alarm' in filename:
            tags.extend(['alarms', 'debugging'])
        if 'video' in filename or 'live' in filename:
            tags.extend(['live video', 'streaming', 'rtsp'])
        if 'time' in filename or 'sync' in filename:
            tags.extend(['ntp', 'time synchronization'])
        if 'discovery' in filename:
            tags.extend(['device discovery', 'onboarding'])
        if 'blocked' in filename:
            tags.extend(['alarm blocking', 'overflow'])
        if 'ticket' in filename:
            tags.extend(['support ticket', 'helpdesk'])
        if 'priority' in filename:
            tags.extend(['support', 'priority levels'])
        if 'salvo' in filename:
            tags.extend(['salvo links', 'debugging'])

    # Internal section - support operations
    elif 'internal/01-support-operations' in filepath:
        tags.extend(['internal', 'support', 'operations'])
        if 'l1' in filename or 'l2' in filename:
            tags.extend(['escalation', 'protocol'])
        if 'ticket' in filename:
            tags.append('ticketing')
        if 'jump' in filename or 'server' in filename:
            tags.extend(['jump server', 'access'])
        if 'csm' in filename:
            tags.extend(['csm', 'queue management'])
        if 'escalation' in filename:
            tags.append('escalation')

    # Internal - technical architecture
    elif 'internal/02-technical-architecture' in filepath:
        tags.extend(['internal', 'architecture', 'technical'])
        if 'microservices' in filename:
            tags.extend(['microservices', 'proxy'])
        if 'communication' in filename:
            tags.extend(['data flow', 'integration'])
        if 'protocol' in filename:
            tags.extend(['protocols', 'api'])
        if 'ai' in filename or 'cvidr' in filename:
            tags.extend(['ai', 'analytics', 'cvidr'])
        if 'kubernetes' in filename or 'k8s' in filename:
            tags.extend(['kubernetes', 'infrastructure', 'deployment'])

    # Internal - device technical reference
    elif 'internal/03-device-technical-reference' in filepath:
        tags.extend(['internal', 'technical reference', 'device'])
        # Add device-specific tags
        if 'adpro' in filename:
            tags.extend(['adpro', 'tcp'])
        if 'hikvision' in filename:
            tags.extend(['hikvision', 'isapi'])
        if 'dahua' in filename:
            tags.extend(['dahua', 'p2p'])
        if 'milestone' in filename:
            tags.extend(['milestone', 'vms', 'mip sdk'])
        if 'axxon' in filename:
            tags.extend(['axxon', 'vms'])
        if 'hanwha' in filename:
            tags.extend(['hanwha', 'webhook'])
        if 'heitel' in filename:
            tags.extend(['heitel', 'legacy'])
        if 'true' in filename or 'vision' in filename:
            tags.extend(['true vision'])
        if 'camect' in filename:
            tags.extend(['camect', 'hls'])
        if 'senstar' in filename:
            tags.extend(['senstar'])
        if 'reconeyez' in filename:
            tags.extend(['reconeyez', 'pir camera'])

    # Internal - custom properties
    elif 'internal/04-custom-properties' in filepath:
        tags.extend(['internal', 'custom properties', 'configuration'])
        if 'eventclip' in filename:
            tags.extend(['event clip recording', 'video'])
        if 'milestone' in filename:
            tags.append('milestone')
        if 'teltonika' in filename:
            tags.extend(['teltonika', 'iot', 'alarm rules'])
        if 'false' in filename and 'alarm' in filename:
            tags.extend(['false alarm filtering', 'ai'])
        if 'overflow' in filename:
            tags.extend(['alarm overflow', 'threshold'])

    # Internal - troubleshooting playbooks
    elif 'internal/05-troubleshooting-playbooks' in filepath:
        tags.extend(['internal', 'playbook', 'troubleshooting'])
        if 'no-alarms' in filename or 'not-received' in filename:
            tags.extend(['alarms', 'debugging'])
        if 'blocked' in filename or 'overflow' in filename:
            tags.extend(['alarm blocking', 'overflow'])
        if 'ai' in filename or 'classification' in filename:
            tags.extend(['ai', 'object detection', 'misclassification'])
        if 'multiplicity' in filename:
            tags.extend(['alarms', 'duplication'])
        if 'live' in filename or 'video' in filename:
            tags.extend(['live video', 'streaming'])
        if 'discovery' in filename:
            tags.extend(['device discovery', 'onboarding'])
        if 'time' in filename or 'sync' in filename:
            tags.extend(['time synchronization', 'ntp'])
        if 'sdk' in filename:
            tags.extend(['sdk', 'debugging'])
        if 'dahua' in filename:
            tags.append('dahua')

    # Internal - alarm routing workflows
    elif 'internal/06-alarm-routing' in filepath:
        tags.extend(['internal', 'alarm routing', 'workflow'])
        if 'two-level' in filename:
            tags.extend(['configuration', 'hierarchy'])
        if 'workspace' in filename:
            tags.extend(['workspace', 'configuration'])
        if 'ajax' in filename:
            tags.extend(['ajax', 'integration'])
        if 'migration' in filename:
            tags.append('migration')
        if 'arm' in filename or 'disarm' in filename or 'isolate' in filename:
            tags.extend(['arm/disarm', 'device isolation'])
        if 'talos' in filename:
            tags.extend(['talos', 'alarm blocking'])
        if 'polling' in filename or 'push' in filename:
            tags.extend(['event polling', 'push events'])

    # Internal - network security
    elif 'internal/07-network-security' in filepath:
        tags.extend(['internal', 'network', 'security'])
        if 'gateway' in filename or 'ip' in filename:
            tags.extend(['gateway', 'ip address', 'whitelist'])
        if 'receiver' in filename:
            tags.extend(['receiver', 'ip address'])
        if 'vpn' in filename:
            tags.extend(['vpn', 'connectivity'])
        if 'port' in filename:
            tags.extend(['ports', 'firewall', 'mapping'])

    # Internal - AI analytics
    elif 'internal/08-ai-analytics' in filepath:
        tags.extend(['internal', 'ai', 'analytics'])
        if 'identification' in filename or 'decision' in filename:
            tags.extend(['object detection', 'false alarm filtering'])
        if 'object' in filename or 'tag' in filename:
            tags.extend(['object detection', 'reference'])
        if 'misclassification' in filename:
            tags.extend(['troubleshooting', 'debugging'])
        if 'data' in filename or 'escalation' in filename:
            tags.extend(['escalation', 'data team'])

    # Internal - documentation/vendor management
    elif 'internal/09-documentation' in filepath or 'internal/09-vendor' in filepath:
        tags.extend(['internal', 'documentation'])
        if 'style' in filename or 'guide' in filename:
            tags.extend(['style guide', 'best practices'])
        if 'genie' in filename:
            tags.extend(['genie', 'knowledge base'])
        if 'vendor' in filename:
            tags.extend(['vendor', 'escalation'])
        if 'findings' in filename:
            tags.append('updates')

    # Remove duplicates and limit to 8 tags
    tags = list(dict.fromkeys(tags))[:8]

    return tags

def update_frontmatter(filepath):
    """Read file, add tags to frontmatter if missing."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file has frontmatter
        if not content.startswith('---'):
            return False, "No frontmatter found"

        # Check if tags already exist
        if 'tags:' in content.split('---')[1]:
            return False, "Tags already exist"

        # Extract frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            return False, "Invalid frontmatter structure"

        frontmatter = parts[1]
        body = parts[2]

        # Get appropriate tags
        tags = get_tags_for_file(filepath, content)

        if not tags:
            return False, "No tags determined"

        # Add tags to frontmatter
        tags_line = f'\ntags: {tags}\n'
        new_frontmatter = frontmatter.rstrip() + tags_line

        # Write back to file
        new_content = f'---{new_frontmatter}---{body}'

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True, f"Added {len(tags)} tags: {tags}"

    except Exception as e:
        return False, f"Error: {str(e)}"

def process_directory(directory):
    """Process all markdown files in directory and subdirectories."""
    results = {
        'processed': 0,
        'tagged': 0,
        'skipped': 0,
        'errors': 0,
        'details': []
    }

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                filepath = os.path.join(root, file)
                results['processed'] += 1

                success, message = update_frontmatter(filepath)

                if success:
                    results['tagged'] += 1
                    results['details'].append(f"✓ {filepath}: {message}")
                elif 'already exist' in message:
                    results['skipped'] += 1
                else:
                    results['errors'] += 1
                    results['details'].append(f"✗ {filepath}: {message}")

    return results

# Main execution
if __name__ == "__main__":
    docs_dir = r"c:\nxgen-docs\classic\docs"

    print(f"Processing markdown files in: {docs_dir}")
    print("=" * 80)

    results = process_directory(docs_dir)

    print(f"\nSummary:")
    print(f"Total files processed: {results['processed']}")
    print(f"Files tagged: {results['tagged']}")
    print(f"Files skipped (already tagged): {results['skipped']}")
    print(f"Errors: {results['errors']}")
    print("\n" + "=" * 80)

    # Show sample of tagged files
    print("\nSample of tagged files:")
    for detail in results['details'][:20]:
        print(detail)

    if len(results['details']) > 20:
        print(f"\n... and {len(results['details']) - 20} more files")
