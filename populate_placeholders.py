import os
import re

DOCS_DIR = r"c:\nxgen-docs\classic\docs"
BRAIN_FILE = r"c:\nxgen-docs\extracted_content.txt"

# Explicit mapping from Article Title (or filename slug) to Brain Header
# Keys are the titles found in the markdown files.
MAPPING = {
    "What is GCXONE GCXONE?": "A. NXGEN GCXONE: A Cloud-Based USMS Platform",
    "GCXONE vs Talos: How They Work Together": "B. Evalink Talos: Alarm Management and Workflows",
    "Microservices & Proxy Architecture": "A. Microservices and Proxy Architecture",
    "Protocol Flavors Reference": "B. Device Protocol Flavors",
    "Infrastructure & Scaling": "C. Infrastructure and Scaling",
    "Network Ports Reference": "D. Network and Ports",
    "Standard Device Onboarding Process": "A. Standard Device Onboarding Process in GCXONE",
    "Custom Properties Reference": "B. Custom Properties",
    "Health Monitoring & Site Pulse": "C. Health Monitoring, Site Pulse, and Event Polling",
    "Talos Workflows": "A. Talos Workflows",
    "User Roles & Access Control": "B. User Roles and Access Control",
    "Reporting & Audit Logs": "C. Reporting and Audit Logs",
    "ADPRO Technical Reference": "A. ADPRO (XT/iFT Gateway)",
    "Hikvision Technical Reference": "B. Hikvision and HikProConnect",
    "Dahua Technical Reference": "C. Dahua and Dahua DoLynk",
    "Hanwha Technical Reference": "D. Hanwha-Techwin / NX Witness",
    "Milestone Technical Reference": "E. Milestone VMS",
    "Axxon Technical Reference": "F. Axxon VMS",
    "Camect Technical Reference": "G. Camect AI Video Recorders",
    "Heitel Technical Reference": "H. Heitel (Legacy Device)",
    "Reconeyez Technical Reference": "I. Reconeyez PIR Cam",
    "Teltonika Technical Reference": "J. Teltonika IoT",
    "GCXONE Audio (SIP) Setup": "K. GCXONE Audio (SIP Twilio)",
    "Troubleshooting Guide": "VI. Troubleshooting and Support",
    "Support Operations Protocol": "VI. Support, Troubleshooting, and Knowledge Management",
    "AI Analytics & False Alarm Filtering": "C. Advanced Analytics and False Alarm Classification",
    "Live Video Streaming": "A. Standard Device Onboarding Process in GCXONE", # Fallback or specific section if available
    "Playback & Timeline": "A. Standard Device Onboarding Process in GCXONE", # Fallback
    "PTZ Control & Presets": "A. Standard Device Onboarding Process in GCXONE", # Fallback
    "I/O Management": "A. Standard Device Onboarding Process in GCXONE", # Fallback
    "Event Clip Recording": "B. Custom Properties",
    "Configuring the Priority List": "C. Advanced Analytics and False Alarm Classification",
    "Configuring the Whitelist": "C. Advanced Analytics and False Alarm Classification",
    "Configuring the Blacklist": "C. Advanced Analytics and False Alarm Classification",
    "AI Supported Object List": "B. Documentation and Knowledge Base Requirements",
    "Introduction to Workflows": "A. Talos Workflows",
    "Workflow Levels Explained": "A. Talos Workflows",
    "Creating a Workflow": "A. Talos Workflows",
    "Workflow Customization Tips": "A. Talos Workflows",
    "Setting Up ARM/DISARM Schedules": "A. Talos Workflows",
    "Video/Live View Not Working": "VI. Troubleshooting and Support",
    "Time Synchronization Issues": "VI. Troubleshooting and Support",
    "Device Discovery Failures": "VI. Troubleshooting and Support",
    "Alarms Being Blocked": "VI. Troubleshooting and Support",
    "How to Submit a Support Ticket": "A. Support Structure and Ticket Handling",
    "Understanding Ticket Priority Levels": "A. Support Structure and Ticket Handling",
    "L1 First Check Protocol": "A. Support Structure and Ticket Handling",
    "24-Hour Analysis Rule": "A. Support Structure and Ticket Handling",
    "Information Gathering Protocol": "A. Support Structure and Ticket Handling",
    "Ticket Ownership Guidelines": "A. Support Structure and Ticket Handling",
    "Consolidated Resolution Approach": "A. Support Structure and Ticket Handling",
    "L1 to L2 Escalation Criteria": "A. Support Structure and Ticket Handling",
    "When NOT to Escalate": "A. Support Structure and Ticket Handling",
    "CSM Queue Management": "A. Support Structure and Ticket Handling",
    "CVIDR AI Engine Overview": "C. Infrastructure and Scaling",
    "Kubernetes Infrastructure": "C. Infrastructure and Scaling",
    "eventClipRecord Configuration": "B. Custom Properties",
    "Teltonika Custom Alarm Rules": "J. Teltonika IoT",
    "Alarm Overflow Threshold": "C. Health Monitoring, Site Pulse, and Event Polling",
    "Playbook: No Alarms Received": "VI. Troubleshooting and Support",
    "Playbook: Alarms Blocked/Overflow": "VI. Troubleshooting and Support",
    "Playbook: Incorrect AI Classification": "C. Advanced Analytics and False Alarm Classification",
    "Playbook: Alarm Multiplicity": "VI. Troubleshooting and Support",
    "Playbook: No Live Video": "VI. Troubleshooting and Support",
    "Playbook: Discovery Failure": "VI. Troubleshooting and Support",
    "Playbook: Time Sync Issues": "VI. Troubleshooting and Support",
    "Playbook: SDK/EXE Not Running": "VI. Troubleshooting and Support",
    "Two-Level Alarm Routing Setup": "A. Talos Workflows",
    "AJAX Migration Recommendation": "A. Talos Workflows",
    "ARM/DISARM vs Isolate Technical": "A. Talos Workflows",
    "AI Identification vs Decision": "C. Advanced Analytics and False Alarm Classification",
    "Complete AI Object Tag List": "B. Documentation and Knowledge Base Requirements",
    "Troubleshooting AI Misclassification": "C. Advanced Analytics and False Alarm Classification",
    "Adding New Findings to Docs": "B. Documentation and Knowledge Base Requirements",
    "Documentation Style Guide": "B. Documentation and Knowledge Base Requirements",
    "Feeding the Genie": "B. Documentation and Knowledge Base Requirements",
    "When to Contact Device Vendor": "B. Documentation and Knowledge Base Requirements",
}

def parse_brain_content(file_path):
    """Parses the brain file into sections based on headers."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    sections = {}
    current_header = None
    current_content = []

    # Regex for headers like "I. Title", "A. Title", "1. Title"
    header_regex = re.compile(r'^([A-Z0-9]+)\.\s+(.+)$')

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        match = header_regex.match(line)
        if match:
            # Save previous section
            if current_header:
                sections[current_header] = "\n".join(current_content)
            
            current_header = line # Use the full line as key
            current_content = []
        else:
            current_content.append(line)
    
    # Save last section
    if current_header:
        sections[current_header] = "\n".join(current_content)
        
    return sections

def find_best_match(title, sections):
    """Finds the best matching section for a given title."""
    # Check explicit mapping
    if title in MAPPING:
        target_header = MAPPING[title]
        # Try to find the header in sections keys (partial match)
        for header in sections:
            if target_header in header:
                return sections[header]
    
    # Fuzzy match / Keyword match
    title_words = set(re.findall(r'\w+', title.lower()))
    best_score = 0
    best_section = None
    
    for header, content in sections.items():
        header_words = set(re.findall(r'\w+', header.lower()))
        # Calculate overlap
        overlap = len(title_words.intersection(header_words))
        if overlap > best_score:
            best_score = overlap
            best_section = content
            
    if best_score >= 2: # Minimum 2 matching words
        return best_section
    
    return None

def populate_docs():
    sections = parse_brain_content(BRAIN_FILE)
    print(f"Parsed {len(sections)} sections from brain file.")
    
    updated_count = 0
    
    for root, dirs, files in os.walk(DOCS_DIR):
        for file in files:
            if file.endswith(".md"):
                path = os.path.join(root, file)
                
                # Check if placeholder (size check or content check)
                is_placeholder = False
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if len(content) < 1000: # Arbitrary threshold for "small"
                        is_placeholder = True
                    if "## Scope" in content and "## Overview" in content and len(content) < 1500:
                         is_placeholder = True
                
                if not is_placeholder:
                    continue
                
                # Extract title
                title_match = re.search(r'^title:\s*["\']?(.+?)["\']?$', content, re.MULTILINE)
                if not title_match:
                    continue
                title = title_match.group(1)
                
                # Find content
                matched_content = find_best_match(title, sections)
                
                if matched_content:
                    # Create new content
                    new_content = f"---\ntitle: \"{title}\"\nsidebar_label: \"{title}\"\n---\n\n# {title}\n\n{matched_content}\n"
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Populated: {file} (Match: {title})")
                    updated_count += 1
                else:
                    print(f"Skipped: {file} (No match found for '{title}')")

    print(f"Total files updated: {updated_count}")

if __name__ == "__main__":
    populate_docs()
