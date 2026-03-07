# GCXONE Device Integration Master Guide

**Purpose:** This document is the main source of truth for adding devices to GCXONE. It enables AI agents and support staff to understand and guide customers on all supported device types, network requirements, firewalls, IP whitelisting, ports, alarm management, platform architecture, and integration patterns. It aims to cover almost everything needed for new customers and device onboarding.

---

## Table of Contents

1. [Platform Architecture](#1-platform-architecture)
2. [Hierarchy Model](#2-hierarchy-model)
3. [Network Requirements](#3-network-requirements)
4. [Firewall Configuration](#4-firewall-configuration)
5. [IP Whitelisting](#5-ip-whitelisting)
6. [Required Ports & Protocols](#6-required-ports--protocols)
7. [Domain Whitelisting](#7-domain-whitelisting)
8. [NTP Configuration](#8-ntp-configuration)
9. [Device Types Overview](#9-device-types-overview)
10. [Device Type Reference (Detailed)](#10-device-type-reference-detailed)
11. [Standard Onboarding Flow](#11-standard-onboarding-flow)
12. [Alarm Management](#12-alarm-management)
13. [Event Clips](#13-event-clips)
14. [Bandwidth Planning](#14-bandwidth-planning)
15. [Alarm Codes Reference](#15-alarm-codes-reference)
16. [Troubleshooting & Diagnostics](#16-troubleshooting--diagnostics)
17. [Glossary](#17-glossary)
18. [Summary for AI Agents](#18-summary-for-ai-agents)

---

## 1. Platform Architecture

GCXONE is a cloud-native Video Surveillance as a Service (VSaaS) and IoT security management platform hosted on AWS using Kubernetes (EKS). Devices communicate with the cloud via a **Proxy Layer** that translates manufacturer-specific protocols (ISAPI, ONVIF, SDK, etc.) into a unified format.

**Key points:**
- No local servers required; all processing in the cloud
- Proxy architecture allows direct communication from cameras to GCXONE gateway (no hardware bridges)
- Multi-tenant model with complete data isolation per tenant
- Encryption: AES-256 for data at rest and in transit
- Authentication: Auth0 for MFA and SSO
- Sites sync with Talos CMS via MQTT for alarm handling and operator workflows

---

## 2. Hierarchy Model

GCXONE uses a **5-level hierarchy** for organizing assets and access control:

| Level | Name | Description |
|-------|------|-------------|
| 1 | **Tenant** | Top-level organization (e.g., MSSP, enterprise). Complete data isolation. Subdomain access (e.g., `company.nxgen.cloud`). |
| 2 | **Customer** | Client or business unit. Isolated data. Customer-level users and permissions. |
| 3 | **Site** | Physical location (building, facility). Syncs with Talos CMS. Groups all devices at that location. |
| 4 | **Device** | Hardware unit (NVR, DVR, alarm panel, IoT gateway). Requires unique Server Unit ID. |
| 5 | **Camera/Sensor** | Individual channel or sensor. Auto-discovered when device is added. |

**Critical:** Each device must have a **unique Server Unit ID**. Duplicate IDs cause alarm attribution conflicts.

**Common patterns:**
- **Single org:** Tenant → Customer → Site → Device
- **Multi-location:** One Customer, multiple Sites
- **MSSP:** One Tenant, multiple Customers, each with multiple Sites

---

## 3. Network Requirements

**Critical:** Without whitelisting the primary gateway IPs, GCXONE will be unable to receive alarms or heartbeats from your hardware.

- **Direction:** Outbound traffic from device network to GCXONE cloud
- **Connectivity:** Devices need internet access or VPN to reach GCXONE endpoints
- **Time sync:** NTP (UDP 123) required for accurate timestamps and event correlation
- **Bandwidth:** Plan for video upload (see Bandwidth Planning section)

---

## 4. Firewall Configuration

All firewall rules must permit **outbound** traffic from the device network.

### Mandatory IP Addresses

| Service | IP Address | Purpose |
|---------|------------|---------|
| GCXONE Gateway (Primary) | `18.185.17.113` | Main platform communication |
| GCXONE Gateway (Backup) | `3.124.50.242` | Failover and redundancy |
| Messaging Services | `3.127.50.212` | Secure event delivery |

### Video Streaming Servers

| Service | IP Address | Usage |
|---------|------------|-------|
| Streaming Node 1 | `3.126.237.150` | Primary WebRTC node |
| Streaming Node 2 | `3.75.73.51` | Fallback streaming |
| Streaming Node 3 | `18.156.39.63` | Regional overflow |

---

## 5. IP Whitelisting

### Core Platform Gateways

| Service | IP Address |
|---------|------------|
| Primary Gateway | `18.185.17.113` |
| Backup Gateway | `3.124.50.242` |
| Messaging Gateway | `3.127.50.212` |

### Manufacturer-Specific Alarm Receivers

Whitelist the receiver matching your hardware:

| Manufacturer | IP Address | Role |
|--------------|------------|------|
| Hikvision | `35.156.60.98` | Alarm Receiver |
| Dahua | `52.59.60.20` | Alarm Receiver |
| Hanwha | `18.184.110.24` | Alarm Receiver |
| Milestone | `3.66.98.181` | VMS Bridge |
| Camect | `3.122.169.231` | Smart Hub Receiver |
| Uniview | `18.158.140.99` | Alarm Receiver |
| Heitel (Live) | `3.123.206.197` | Video Gateway |
| Heitel (Events) | `3.124.38.48` | Event Gateway |

### Talos Integration (Evalink Talos)

| Direction | IP Addresses |
|-----------|--------------|
| Inbound to Customer | `195.8.103.10`, `195.8.103.11`, `195.8.103.12`, `193.151.94.10`, `193.151.94.11`, `193.151.94.12` |
| Outbound to Talos | `91.240.18.20`, `91.240.19.20` |
| Domains | `*.evalink.io`, `*.talos-app.io`, `*.eu.auth0.com` |

### ADPRO (Special Case)

ADPRO uses a **dedicated virtual receiver IP per customer** provided by NXGEN CMS. Contact support for your IP. Supports primary and secondary receivers.

---

## 6. Required Ports & Protocols

| Port Range | Protocol | Service | Usage |
|------------|----------|---------|-------|
| 80 | HTTP | Web Redirects | Initial connection handshake |
| 443 | HTTPS/WSS | Core API | Secure dashboard, API, WebSockets |
| 554 | RTSP | Video Stream | Fallback for legacy viewers |
| 5671 / 5672 | AMQPS | Messaging | Secure event delivery (TLS) |
| 10001–10500 | UDP/TCP | WebRTC | Dynamic ports for video streaming |
| 123 | UDP | NTP | Time synchronization |

**Note:** 10001–10500 is required for WebRTC peer-to-peer video negotiation.

### Manufacturer-Specific Ports

| Device Type | Additional Ports |
|-------------|------------------|
| Milestone VMS | HTTP 8081 (Mobile Server), RTSP 554 |
| NXWitness VMS | HTTPS/HTTP/WebSocket 7001, RTSP 554 |
| Teltonika Router | HTTPS 443 (outgoing only) |

---

## 7. Domain Whitelisting (Operator Browser)

For operator workstations accessing the GCXONE dashboard:

**Core:** `*.nxgen.cloud`, `api.nxgen.cloud`, `monitor.nxgen.cloud`, `streaming.nxgen.cloud`

**Auth:** `nxgen.eu.auth0.com`, `cdn.auth0.com`, `sitasys-prod.eu.auth0.com`

**Media/Maps:** `*.s3-eu-central-1.amazonaws.com`, `maps.googleapis.com`, `khms0.googleapis.com`, `assets.what3words.com`

**Communication:** `sdk.twilio.com`, `genesisaudio.sip.twilio.com`, `eventgw.us1.twilio.com`

---

## 8. NTP Configuration

**Critical:** Accurate time sync ensures event logs, video playback, and alarms are aligned. Discrepancies cause misaligned event sequences and playback errors.

- **Port:** UDP 123
- **Device-side:** Configure NTP server (e.g., `pool.ntp.org`) in device time settings
- **Time zone:** Set correctly on each device
- **DST:** Enable Daylight Saving Time if supported
- **Verification:** Check event timestamps in GCXONE match device logs

---

## 9. Device Types Overview

| Category | Device Types | Discovery Method | Use Case |
|----------|--------------|------------------|----------|
| **IP Cameras / NVR** | Hikvision, Dahua, Hanwha, Uniview, Ganz | ISAPI, SDK, ONVIF | Traditional CCTV |
| **VMS** | Milestone, NXWitness | SDK, Mobile Server | Enterprise multi-camera |
| **Security Panels** | ADPRO, Ajax | Custom, SIA-DC09 | Intrusion, access control |
| **IoT / Specialized** | Teltonika, Reconeyez, Victron | Serial, webhook, HTTPS | Remote, GPS, battery |
| **Generic** | ONVIF, RTSP | ONVIF WS-Discovery | Universal camera support |

---

## 10. Device Type Reference (Detailed)

### 10.1 Hikvision (IP Camera / NVR)

**Profile:** IP Camera, NVR | Protocol: ISAPI | Receiver: `35.156.60.98` | Ports: HTTP/HTTPS, RTSP

**Events:** Line Crossing, Intrusion, Video Tampering. **Avoid** general Motion events (alarm floods).

**Step-by-step (UI paths):**
1. **Time:** Configuration → System → System Settings → Time Settings — Set time zone, enable NTP and DST
2. **User:** Configuration → System → User management → Add — Create user "NXG" with Local + Remote permissions including "Notify Surveillance Center", "Playback", "PTZ Control", "Two-way Audio"
3. **Security:** Configuration → System → Security — Set RTSP and WEB auth to **Digest**
4. **ISAPI:** Configuration → Network → Advanced Settings → Integration Protocol — Enable ISAPI
5. **Basic Events:** Configuration → Event → Basic Event — Draw area, enable "Notify Surveillance Center"
6. **Smart Events:** Configuration → Event → Smart Event — Line Crossing, Intrusion; enable "Notify Surveillance Center"
7. **GCXONE:** Add Device → Hikvision → Host, Username (NXG), Password, Ports → Discover → Save

**Prerequisites:** Continuous recording, whitelist `35.156.60.98`, Local Mode for P2P/audio.

---

### 10.2 Dahua (IP Camera / NVR)

**Profile:** IP Camera, NVR | Receiver: `52.59.60.20` — Similar flow to Hikvision: NTP, user creation, event forwarding ("Notify Surveillance Center"), add in GCXONE.

---

### 10.3 Hanwha (IP Camera / NVR)

**Profile:** IP Camera, NVR | Receiver: `18.184.110.24` — Manufacturer-specific receiver.

---

### 10.4 Uniview (IP Camera / NVR)

**Profile:** IP Camera | Receiver: `18.158.140.99` — Network config, time/NTP, user management, event linkage with "Notify Surveillance Center", add in GCXONE.

---

### 10.5 Ganz (IP Camera)

**Profile:** IP Camera | Protocol: ONVIF | Ports: HTTP/HTTPS 80/443, RTSP 554

**Steps:**
1. Network: Assign static IP, allow 80/443, 554
2. Time: Enable NTP, set time zone
3. Alarm/Event: Motion, tampering, line crossing, intrusion
4. Stream: H.264/H.265, enable ONVIF
5. GCXONE: Site → Devices → Add → GanzAI → IP, credentials → Discover → Save

---

### 10.6 Milestone VMS

**Profile:** VMS | Model: XProtect 2020 R1+ | Receiver: `3.66.98.181` | Ports: 443, 8081, 554 | Platform: Windows only

**Steps:**
1. Enable Mobile Server (Servers → Mobile Server), port 8081
2. Network: Firewall for 8081, 443, 554
3. Create integration user (`gcxone_integration`) with full permissions
4. Configure cameras and recording
5. Add in GCXONE with server IP and credentials
6. Optional: I/O triggers, alarm definitions, rules

**Features:** Live streaming, playback, PTZ, I/O, analytics, Genesis Audio.

---

### 10.7 NXWitness VMS

**Profile:** VMS | Vendor: Network Optix | Ports: 7001, RTSP 554 | Platform: Windows, Linux, macOS

**Steps:** Enable cloud service, create integration user, add server in GCXONE. Supports cloud and local streaming, timeline, PTZ, Genesis Audio.

---

### 10.8 ADPRO (Security Control Panel)

**Profile:** Security Panel (Honeywell) | Protocol: Custom ADPRO | **Unique Server ID per device** | Dedicated receiver IP from NXGEN

**Steps:**
1. Network: Public IP, VPN, or whitelisting — get receiver IP from NXGEN
2. CMS Alarm Transmission: Primary IP (and optional Secondary), Site Pulse (lifecheck)
3. Analytics: Intrusion Trace, Loiter Trace, Motion Sabotage
4. Arm/Disarm schedule
5. Alarms Profile: Configure for armed/disarmed states
6. Input/Output Behaviour: Event responses, camera assignment
7. Time: NTP sync
8. Users: NXG user with Admin or User rights
9. **iFT Gateway:** If subtype iFT, add custom properties in GCXONE: `eventClipRecord: True`, `eventClipRecordAlarmCode: motion.perimeter`
10. GCXONE: Add Device → ADPRO → Host, credentials → Discover → Save

---

### 10.9 Ajax (Security Hub / NVR)

**Profile:** Hub/NVR | Protocol: SIA-DC09 | **Invitation required** | Account mapping per device

**Steps:**
1. Ajax PRO Desktop → Space Setting → Security Companies → Invite via Email → Send to `ajax@nxgen.io` (ensure accepted)
2. GCXONE → Devices → Add Device → Select Hub or NVR → Enter Hub ID or Device ID, timezone → Discover → Save
3. GCXONE → View Device → Copy **Account number**, **Encryption key**, **Receiver IP/Port**
4. Ajax PRO Desktop → Company → CMS connection → Add Receiver → Enter IP, port, encryption key, enable "Transfer device or group name to CMS events"
5. Objects → Object → Maintenance → Monitoring via [Receiver] → Map account numbers per device
6. Verify: Trigger test event, confirm events in GCXONE

---

### 10.10 EagleEye (Bridge / NVR)

**Profile:** Camera Bridge, NVR | Discovery: ESN | Ports: WAN/CamLAN 1000Mb/s

**Steps:** Bridge Settings → Record SSN, IP, **ESN**, GUID → User Settings → Configure users → GCXONE → Add with ESN.

---

### 10.11 Teltonika (Industrial Router)

**Profile:** Cellular Router (GPS, I/O) | Protocol: Serial + HTTPS receiver URL | Ports: 443 outgoing | Connectivity: LTE/4G/5G, Ethernet, Wi-Fi

**Steps:**
1. Router web UI → Status → Device → Copy serial number
2. GCXONE → Add Device → Teltonika → Enter serial number → Save
3. GCXONE → Edit device → Copy "Teltonika Custom Receiver URL"
4. Router → Service → GPS → HTTPS tab → Paste URL → Save
5. Verify GPS antenna, I/O if used

---

### 10.12 Reconeyez (Battery PIR Camera)

**Profile:** Battery PIR event camera | Connectivity: LTE/4G or Wi-Fi | Protocol: Webhook | **Webhook mandatory**

**Key:** Use Device ID from Reconeyez client as Serial in GCXONE. Video: 10–15 sec event clips only (no continuous streaming).

**Steps:** Configure webhook in Reconeyez platform → GCXONE workflow webhook for events → Add device with Device ID as Serial → Discover → Save.

---

### 10.13 ONVIF (Generic IP Camera)

**Profile:** Generic ONVIF | Protocol: Profile S/T | Compatibility: 5,000+ models | Ports: 80, 443, 554

**Steps:** Enable ONVIF on camera → Create ONVIF user → Add in GCXONE with IP and credentials. Supports event detection, arm/disarm, Genesis Audio (if supported).

---

### 10.14 Honeywell 35 Series NVR

**Profile:** NVR | Ports: 443, 554, 80 | Cloud polling. Live streaming, Genesis Audio, Timelapse. No playback/timeline in current integration.

---

### 10.15 Senstar (Perimeter Security)

**Profile:** Perimeter security | Requires Senstar Symphony Server. Install software, configure server, add in GCXONE.

---

### 10.16 Camect, Heitel, Innovi, Netvue, Spykebox, Victron, Viasys

Each has manufacturer-specific config. Refer to device docs in `all-articles/`. All require gateway connectivity and manufacturer receiver IP when applicable.

---

## 11. Standard Onboarding Flow

1. **Pre-requisites:** Admin access to device, network connectivity, firewall configured, GCXONE account
2. **Device config:** Time/NTP, user for GCXONE, event forwarding, protocol enabled
3. **GCXONE:** Customer → Site → Devices → Add Device → Select type → Enter details → Discover → Save
4. **Verification:** Device online, events flowing, heartbeat active, live view/playback

---

## 12. Alarm Management

### Arm/Disarm vs Isolate

| Feature | Arm/Disarm | Isolate |
|---------|------------|---------|
| Duration | Persistent until changed | Temporary (required timeout, e.g. 30 min) |
| Granularity | Whole device/site | Can target single camera |
| Use | Master toggle for monitoring | Temporary silence (maintenance, loading) |
| Processing | Stops all event processing | Still "hears" alarms but no image fetch/AI |

**Isolate** = sleep timer for one sensor; **Arm/Disarm** = master light switch for site.

### Event Overflow

**Threshold:** 25 alarms from one device in 5 minutes (configurable). Exceeding triggers:
- **Block:** All subsequent alarms from that sensor discarded for 5 minutes (heartbeats excluded)
- **Alarm:** `event.overflow` raised to notify operators
- **Multi-level:** Genesis (per device) and Talos (site-wide) both enforce limits

**Causes:** Malfunctioning hardware, environmental (trees, rain, spiders), overuse of general motion. **Fix:** Tune analytics to IVS (line crossing, intrusion) and specific object types.

### Redundant Alarms

**Rule:** Same alarm code from same sensor within 30 seconds = rejected. Different codes from same camera are both processed. Configurable (e.g. extend to 5 minutes).

### Technical Alarms

Health/integrity alerts (not intrusion):
- Connectivity: `ping.primary`, `ping.timeout`, `ping.notreachable`, `network.alert`
- Health: `camera.health.fail`, `camera.health.normal`, `analytics.novideo`, `analytics.healthcheck`
- Hardware: `HDD full`, `HDD error`, `video.loss`, `UPS fault`, `battery low`
- System: `event.overflow`

**Handling:** Often active 24/7 even when disarmed so day shift can resolve issues.

### Test Mode

Used during maintenance/testing. Suppresses specified alarms from operator queue; critical (fire, panic) can remain actionable. Triggers Disarm in Genesis to save resources. Auto re-arms when Test Mode ends.

### Priority / White / Black Lists (AI)

- **Priority:** Object triggers alarm by presence alone (e.g. Person)
- **White:** Object triggers only when moving (e.g. Car — parked ignored)
- **Black:** Object auto-classified as false alarm (e.g. animals, birds)

Managed in Custom Properties at tenant/customer/site level.

---

## 13. Event Clips

**Purpose:** Auto-capture short video around alarms for operator context.

**Flow:** Device records continuously with rolling buffer → Alarm triggers → Pre-alarm (e.g. 5 s) + post-alarm (e.g. 5 s) saved → GCXONE requests clip → Operator views with alarm.

**Supported:** ADPRO, Dahua, Hikvision, Milestone. Requires event-triggered recording, recording enabled, network connectivity.

**Config:** Buffer times, alarm codes to capture (all or specific). Integrates with AI for object classification.

---

## 14. Bandwidth Planning

**Formula:**
```
Total = (Cameras × Bitrate) + (Viewers × Stream Bitrate) + 30% Overhead
```

| Resolution | H.265 | H.264 |
|------------|-------|-------|
| 720p 30fps | 1.5 Mbps | 3.0 Mbps |
| 1080p 30fps | 3.0 Mbps | 6.0 Mbps |
| 4MP 30fps | 5.0 Mbps | 10.0 Mbps |
| 4K 30fps | 12.0 Mbps | 25.0 Mbps |

**Examples:** 10 cameras 1080p H.265 → ~50 Mbps; 50 cameras mixed → ~400 Mbps; 200+ → ~2 Gbps.

**Optimization:** H.265, sub-streams for grid view, VBR, VLAN segmentation, QoS for port 443.

---

## 15. Alarm Codes Reference

**Connectivity:** `ping.primary`, `ping.timeout`, `ping.notreachable`, `network.alert`

**Smart Events:** `analytics.linecross`, `analytics.zonecross`/`analytics.intrusion`, `motion.event`, `motion.perimeter`

**Health:** `camera.health.fail`, `camera.health.normal`, `analytics.novideo`, `analytics.healthcheck`

**System:** `event.overflow`, `BA`/`BR` (SIA-DC09 burglary), `YS` (technical)

**IoT:** `battery.fall`, `ACC.FA` (Victron), `100-Medical`, `110-Fire`, `120-Panic`

---

## 16. Troubleshooting & Diagnostics

### No Alarm Transmission
- Verify "Notify Surveillance Center" (or equivalent) on device
- Check webhook/event forwarding URL
- Confirm firewall to receiver IP
- Review device logs for event generation
- Enable Event Polling for push-incapable devices

### Connection Failures
- **Ping:** `ping 18.185.17.113`
- **Ports:** `telnet 18.185.17.113 443`, `telnet 3.126.237.150 10001`
- Verify 80, 443, 554, 5671/5672, 10001–10500, 123 (NTP)
- GCXONE: Device Settings → Network Diagnostics → Ping Test, Port Check, Test Connection

### One-Click Diagnostics (Uniview)
Configuration App → Devices → Select device → Diagnostics → Collect Logs → Select days (up to 14) → Generate Report

### Diagnostic Package Includes
Operation logs, error logs, configuration files, network info, system status.

### Performance Issues
Review system resources, network bandwidth, device logs, recent config changes. Optimize settings, upgrade network, reduce concurrent operations, update firmware.

### Common Fixes
- Enable event forwarding, correct webhook URL
- Whitelist manufacturer receiver IP
- Enable Event Polling for non-push devices
- Sync NTP, verify credentials

---

## 17. Glossary

| Term | Definition |
|------|------------|
| Tenant | Top-level organization; complete data isolation |
| Customer | Client/business unit under tenant |
| Site | Physical location; syncs with Talos |
| Device | Hardware unit (NVR, panel, gateway) |
| Sensor / Camera | Individual channel on device |
| ARM / DISARM | Enable/disable alarm reporting for site/device |
| Isolate | Temporarily bypass sensor from triggering alarms |
| Site Pulse / Lifecheck | Heartbeat to verify connectivity |
| NVR | Network Video Recorder |
| RTSP | Real-Time Streaming Protocol |
| SIP | Session Initiation Protocol (voice/video) |
| Webhook | Callback for event notifications |
| PTZ | Pan-Tilt-Zoom |
| I/O | Input/Output (sensors, relays) |
| Workflow | Automated actions triggered by alarm |

---

## 18. Summary for AI Agents

When guiding customers on adding devices:

1. **Identify device type** (IP camera, VMS, panel, IoT)
2. **Confirm network:** Outbound to core gateways + manufacturer receiver IP
3. **Confirm ports:** 80, 443, 554, 5671/5672, 10001–10500, 123 (NTP)
4. **Device-specific:** Follow manufacturer steps (ISAPI, invitation, serial number, webhook, etc.)
5. **Add in GCXONE:** Customer → Site → Devices → Add → Select type → Discover → Save
6. **Verify:** Device online, events flowing, heartbeat active

**Special cases:**
- **ADPRO:** Dedicated IP from support; unique Server ID per device; iFT needs custom properties
- **Ajax:** Invite `ajax@nxgen.io`; account mapping; SIA-DC09 receiver from GCXONE
- **Teltonika:** Serial number; custom receiver URL in GPS Service HTTPS
- **Reconeyez:** Webhook mandatory; Device ID as Serial
- **Hikvision:** ISAPI, NXG user, Digest auth, avoid Motion events

Refer to device-specific articles in `all-articles/` for step-by-step details with screenshots.
