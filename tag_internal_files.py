#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys

# Mapping of file paths to tags
TAG_MAPPINGS = {
    # Support Operations
    'internal/01-support-operations/01-l1-first-check-protocol.md': ['internal', 'support', 'l1', 'protocol', 'troubleshooting'],
    'internal/01-support-operations/02-24-hour-analysis-rule.md': ['internal', 'support', 'protocol', 'analysis'],
    'internal/01-support-operations/03-information-gathering-protocol.md': ['internal', 'support', 'protocol', 'troubleshooting'],
    'internal/01-support-operations/04-ticket-ownership-guidelines.md': ['internal', 'support', 'ticketing', 'guidelines'],
    'internal/01-support-operations/05-consolidated-resolution-approach.md': ['internal', 'support', 'resolution', 'protocol'],
    'internal/01-support-operations/06-l1-to-l2-escalation-criteria.md': ['internal', 'support', 'escalation', 'l1', 'l2'],
    'internal/01-support-operations/07-when-not-to-escalate.md': ['internal', 'support', 'escalation', 'guidelines'],
    'internal/01-support-operations/08-csm-queue-management.md': ['internal', 'support', 'csm', 'queue management'],
    'internal/01-support-operations/09-jump-server-access-protocol.md': ['internal', 'support', 'jump server', 'access', 'protocol'],

    # Technical Architecture
    'internal/02-technical-architecture/01-microservices-proxy-architecture.md': ['internal', 'architecture', 'microservices', 'proxy', 'technical'],
    'internal/02-technical-architecture/02-communication-flow-deep-dive.md': ['internal', 'architecture', 'data flow', 'integration', 'technical'],
    'internal/02-technical-architecture/03-protocol-flavors-reference.md': ['internal', 'architecture', 'protocols', 'api', 'reference'],
    'internal/02-technical-architecture/04-cvidr-ai-engine-overview.md': ['internal', 'architecture', 'ai', 'cvidr', 'analytics'],
    'internal/02-technical-architecture/05-kubernetes-infrastructure.md': ['internal', 'architecture', 'kubernetes', 'infrastructure', 'deployment'],

    # Device Technical Reference
    'internal/03-device-technical-reference-internal-only/01-adpro-technical-reference.md': ['internal', 'technical reference', 'adpro', 'device', 'tcp'],
    'internal/03-device-technical-reference-internal-only/02-hikvision-technical-reference.md': ['internal', 'technical reference', 'hikvision', 'device', 'isapi'],
    'internal/03-device-technical-reference-internal-only/03-dahua-technical-reference.md': ['internal', 'technical reference', 'dahua', 'device', 'p2p'],
    'internal/03-device-technical-reference-internal-only/04-milestone-technical-reference.md': ['internal', 'technical reference', 'milestone', 'vms', 'mip sdk'],
    'internal/03-device-technical-reference-internal-only/05-axxon-technical-reference.md': ['internal', 'technical reference', 'axxon', 'vms', 'device'],
    'internal/03-device-technical-reference-internal-only/06-hanwha-technical-reference.md': ['internal', 'technical reference', 'hanwha', 'device', 'webhook'],
    'internal/03-device-technical-reference-internal-only/07-heitel-technical-reference.md': ['internal', 'technical reference', 'heitel', 'device', 'legacy'],
    'internal/03-device-technical-reference-internal-only/08-true-vision-technical-reference.md': ['internal', 'technical reference', 'true vision', 'device'],
    'internal/03-device-technical-reference-internal-only/09-camect-technical-reference.md': ['internal', 'technical reference', 'camect', 'device', 'hls'],
    'internal/03-device-technical-reference-internal-only/10-senstar-technical-reference.md': ['internal', 'technical reference', 'senstar', 'device'],
    'internal/03-device-technical-reference-internal-only/11-reconeyez-technical-reference.md': ['internal', 'technical reference', 'reconeyez', 'pir camera', 'device'],

    # Custom Properties
    'internal/04-custom-properties-reference-internal-only/01-master-custom-properties-sheet.md': ['internal', 'custom properties', 'reference', 'configuration'],
    'internal/04-custom-properties-reference-internal-only/02-eventcliprecord-configuration.md': ['internal', 'custom properties', 'event clip recording', 'configuration'],
    'internal/04-custom-properties-reference-internal-only/03-milestone-custom-properties.md': ['internal', 'custom properties', 'milestone', 'configuration'],
    'internal/04-custom-properties-reference-internal-only/04-teltonika-custom-alarm-rules.md': ['internal', 'custom properties', 'teltonika', 'iot', 'alarm rules'],
    'internal/04-custom-properties-reference-internal-only/05-false-alarm-filter-properties.md': ['internal', 'custom properties', 'false alarm filtering', 'ai'],
    'internal/04-custom-properties-reference-internal-only/06-alarm-overflow-threshold.md': ['internal', 'custom properties', 'alarm overflow', 'threshold'],

    # Troubleshooting Playbooks
    'internal/05-troubleshooting-playbooks/01-playbook-no-alarms-received.md': ['internal', 'playbook', 'troubleshooting', 'alarms', 'debugging'],
    'internal/05-troubleshooting-playbooks/02-playbook-alarms-blockedoverflow.md': ['internal', 'playbook', 'troubleshooting', 'alarm blocking', 'overflow'],
    'internal/05-troubleshooting-playbooks/03-playbook-incorrect-ai-classification.md': ['internal', 'playbook', 'troubleshooting', 'ai', 'misclassification'],
    'internal/05-troubleshooting-playbooks/04-playbook-alarm-multiplicity.md': ['internal', 'playbook', 'troubleshooting', 'alarms', 'duplication'],
    'internal/05-troubleshooting-playbooks/05-playbook-no-live-video.md': ['internal', 'playbook', 'troubleshooting', 'live video', 'streaming'],
    'internal/05-troubleshooting-playbooks/06-playbook-discovery-failure.md': ['internal', 'playbook', 'troubleshooting', 'device discovery', 'onboarding'],
    'internal/05-troubleshooting-playbooks/07-playbook-time-sync-issues.md': ['internal', 'playbook', 'troubleshooting', 'time synchronization', 'ntp'],
    'internal/05-troubleshooting-playbooks/08-playbook-sdkexe-not-running.md': ['internal', 'playbook', 'troubleshooting', 'sdk', 'debugging'],
    'internal/05-troubleshooting-playbooks/09-using-dahua-sdk-test-client.md': ['internal', 'playbook', 'troubleshooting', 'dahua', 'sdk'],

    # Alarm Routing Workflows
    'internal/06-alarm-routing-workflows/01-two-level-alarm-routing-setup.md': ['internal', 'alarm routing', 'workflow', 'configuration'],
    'internal/06-alarm-routing-workflows/02-workspace-configuration-deep-dive.md': ['internal', 'alarm routing', 'workspace', 'configuration'],
    'internal/06-alarm-routing-workflows/03-old-ajax-implementation-guide.md': ['internal', 'alarm routing', 'ajax', 'legacy'],
    'internal/06-alarm-routing-workflows/04-ajax-migration-recommendation.md': ['internal', 'alarm routing', 'ajax', 'migration'],
    'internal/06-alarm-routing-workflows/05-armdisarm-vs-isolate-technical.md': ['internal', 'alarm routing', 'arm/disarm', 'device isolation'],
    'internal/06-alarm-routing-workflows/06-talos-alarm-blocking-logic.md': ['internal', 'alarm routing', 'talos', 'alarm blocking'],
    'internal/06-alarm-routing-workflows/07-event-polling-vs-push.md': ['internal', 'alarm routing', 'event polling', 'push events'],

    # Network Security
    'internal/07-network-security-internal/01-master-gateway-ip-list.md': ['internal', 'network', 'security', 'gateway', 'ip address'],
    'internal/07-network-security-internal/02-device-receiver-ip-quick-reference.md': ['internal', 'network', 'security', 'receiver', 'ip address'],
    'internal/07-network-security-internal/03-vpn-vs-whitelist-vs-public-ip.md': ['internal', 'network', 'security', 'vpn', 'connectivity'],
    'internal/07-network-security-internal/04-port-to-feature-mapping.md': ['internal', 'network', 'security', 'ports', 'mapping'],

    # AI Analytics
    'internal/08-ai-analytics-internal/01-ai-identification-vs-decision.md': ['internal', 'ai', 'analytics', 'object detection', 'false alarm filtering'],
    'internal/08-ai-analytics-internal/02-complete-ai-object-tag-list.md': ['internal', 'ai', 'analytics', 'object detection', 'reference'],
    'internal/08-ai-analytics-internal/03-troubleshooting-ai-misclassification.md': ['internal', 'ai', 'analytics', 'troubleshooting', 'misclassification'],
    'internal/08-ai-analytics-internal/04-data-team-escalation-process.md': ['internal', 'ai', 'analytics', 'escalation', 'data team'],

    # Documentation/Vendor Management
    'internal/09-documentation-vendor-management/01-adding-new-findings-to-docs.md': ['internal', 'documentation', 'updates', 'knowledge base'],
    'internal/09-documentation-vendor-management/02-documentation-style-guide.md': ['internal', 'documentation', 'style guide', 'best practices'],
    'internal/09-documentation-vendor-management/03-feeding-the-genie.md': ['internal', 'documentation', 'genie', 'knowledge base'],
    'internal/09-documentation-vendor-management/04-when-to-contact-device-vendor.md': ['internal', 'documentation', 'vendor', 'escalation'],
    'internal/09-documentation-vendor-management/05-vendor-escalation-templates.md': ['internal', 'documentation', 'vendor', 'escalation'],
    'internal/09-documentation-vendor-management/06-summary.md': ['internal', 'documentation', 'summary'],
    'internal/09-documentation-vendor-management/07-total-articles.md': ['internal', 'documentation', 'metrics'],
    'internal/09-documentation-vendor-management/08-60.md': ['internal', 'documentation'],
    'internal/09-documentation-vendor-management/09-57.md': ['internal', 'documentation'],
}

def add_tags_to_file(filepath, tags):
    """Add tags to a markdown file's frontmatter."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if tags already exist
        if 'tags:' in content[:500]:
            return False, "Tags already exist"

        # Find the end of frontmatter
        parts = content.split('---', 2)
        if len(parts) < 3:
            return False, "Invalid frontmatter"

        frontmatter = parts[1]
        body = parts[2]

        # Add tags
        tags_str = str(tags).replace("'", '"')
        new_frontmatter = frontmatter.rstrip() + f'\ntags: {tags_str}\n'

        # Write back
        new_content = f'---{new_frontmatter}---{body}'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True, f"Added {len(tags)} tags"

    except Exception as e:
        return False, f"Error: {e}"

def main():
    base_dir = r"c:\nxgen-docs\classic\docs"

    stats = {'success': 0, 'skipped': 0, 'errors': 0}

    for rel_path, tags in TAG_MAPPINGS.items():
        full_path = os.path.join(base_dir, rel_path.replace('/', os.sep))

        if not os.path.exists(full_path):
            print(f"File not found: {full_path}")
            stats['errors'] += 1
            continue

        success, msg = add_tags_to_file(full_path, tags)

        if success:
            print(f"OK: {rel_path}")
            stats['success'] += 1
        elif 'already exist' in msg:
            stats['skipped'] += 1
        else:
            print(f"ERROR: {rel_path} - {msg}")
            stats['errors'] += 1

    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Successfully tagged: {stats['success']}")
    print(f"  Skipped (already tagged): {stats['skipped']}")
    print(f"  Errors: {stats['errors']}")
    print(f"  Total processed: {sum(stats.values())}")

if __name__ == '__main__':
    main()
