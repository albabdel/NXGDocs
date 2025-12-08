---
title: "Playbook: Alarm Multiplicity"
sidebar_label: "Playbook: Alarm Multiplicity"
tags: ["internal", "playbook", "troubleshooting", "alarms", "duplication"]
---

# Playbook: Alarm Multiplicity

General troubleshooting involves a systematic approach across layers, typically starting with device logs, followed by network configuration, and escalating to support if necessary.
Issue Category
Common Causes
Resolution Steps
Alarm Transmission Failure
Device/Sensor Disarmed; Incorrect alarm profile/schedule configuration; Incorrect Hub ID/Server Unit ID.
Check device dashboard logs (video vs. technical alarms); Verify device arm/disarm schedule alignment; Check Talos receiver status (SIA DC-09 is operational); Ensure the unique Server Unit ID is correct.
Connectivity/Video Failure
Ports not open on firewall; Incorrect IP address/DNS; Network instability/bandwidth issues.
Verify all required ports are open and forwarded (check for green status in GCXONE); Ensure GCXONE service IPs are whitelisted on customer firewall; Check network connections and compatibility.
Time Synchronization
Device time does not match GCXONE time; Incorrect NTP server address.
Ensure NTP server is set to timel.nxgen.cloud; Use the GCXONE "time zone sync" button if available; Ensure time zone configuration in GCXONE matches the physical device.
SDK/EXE Issues
EXE not running or listening on the correct port.
Ensure the SDK executable is running and monitoring the correct port.
Cloud API Issues
Invalid authentication tokens or API keys.
Verify and refresh authentication tokens/API keys used by the proxy.
Device Discovery Failure
Incorrect mandatory fields (e.g., Serial Number, Device Base URL, API Token).
Double-check all entered credentials and required identifiers. If persistent, raise a ticket to the NXGEN support team.
Analogy for System Integration
The GCXONE platform and its device ecosystem function like a central global switchboard that manages diverse communication devices. Each device (Hikvision, Dahua, ADPRO) speaks a different "language" (protocol: REST, SDK, TCP). Instead of requiring the central switchboard (GCXONE) to learn every language, specialized Proxy microservices act as universal translators. A request from the user interface goes to the central API (the receptionist), which directs it to the correct translator (the proxy). The translator figures out the specific native language/protocol needed (SDK, port 8000, etc.) to talk to the device, handles the conversation, and then replies back to the central switchboard in a standardized, common language (JSON/HTTP). This system allows the core functions (like analytics and alarming in Talos) to operate uniformly, regardless of whether the source device is a modern IP camera or a legacy NVR.
This comprehensive article serves as a deep synthesis of the provided source documents, compiling detailed technical information, architecture specifications, device-specific configurations, operational workflows, and support protocols for the NXGEN GCXONE platform, its associated Evalink Talos system, and its expansive device ecosystem.
The NXGEN Knowledge Repository: GCXONE, Talos, and Unified Security Management (Continued)
