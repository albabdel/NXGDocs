# AutoStream Feature Documentation

**Source Files:**
- GCXONE_AutoStream_Guide.docx (binary - not readable)
- .planning/release-items/autostream-settings.json
- .planning/release-items/autostream-multimonitor.json
- .planning/test-cases/autostream-req.json
- .planning/test-cases/autostream-mu.json
- all-articles/features_video-streaming_overview.md

**Extracted:** 2026-03-15

---

## 1. What is AutoStream (High-Level Overview)

AutoStream is an intelligent video streaming automation feature in GCXONE that automatically initiates live camera streams when qualifying alarms are triggered. The feature integrates the Talos alarm workflow system with the Salvo video display system, creating a seamless operator experience where relevant camera feeds appear automatically without manual intervention.

**Core Concept:** When an alarm is received and assigned, the system automatically:
1. Opens the alarm workflow in Talos
2. Loads the corresponding alarm quad in Salvo
3. Starts live streams for all cameras mapped to that alarm

This eliminates the need for operators to manually search for and select cameras during critical alarm response situations.

---

## 2. Key Capabilities & Functionality

### Alarm-Triggered Auto Streaming
- Live streams start automatically for all cameras mapped to a qualifying alarm
- Multiple cameras can stream simultaneously
- Streams stop automatically when alarms are closed or acknowledged (per Genesis rules)
- Supported alarm types are configurable by admin

### Zone-Based Camera Selection
- Auto streaming respects zone definitions from Genesis
- When an alarm is mapped to a specific zone, only cameras within that zone stream
- If no zones are defined, all site cameras stream by default
- Zone changes affect future alarms only (not active alarms)

### Talos-Salvo Multi-Monitor Integration
- Motion alarms automatically open alarm workflow in Talos
- Corresponding alarm quad loads automatically in Salvo
- Toggle combinations control behavior:
  - Multi-monitor only: Alarm workflow opens in Talos, quad loads in Salvo
  - Autostream only: Current view replaced with alarm quad
  - Both enabled: Full integration with workflow and display
  - Both disabled: Manual operation required

### Streaming Permission Controls
- Admins set which roles can view streams
- Operators without permission cannot see or access streams
- Deep links are blocked for unauthorized users
- UI elements hidden for unauthorized roles

### Comprehensive Activity Logging
- All streaming activity logged (alarm ID, site, cameras, user, timestamps)
- Permission denials logged with full details
- Streaming failures logged for troubleshooting

### Burglar Alarm Zone Handling
- Handles zone configurations from both GCX and Talos
- System matches against GCX zone configurations for relevant sensors
- Unmatched/missing zones fall back to site-level streaming

---

## 3. How to Configure/Use

### For Administrators

**Accessing Auto Streaming Settings:**
1. Login as Admin to GCX
2. Navigate to Auto Streaming Settings page
3. All settings are read from/written to Genesis (no local GCX storage)

**Configuration Options:**
- Enable/disable auto streaming globally
- Select which alarm types trigger streaming
- Configure streaming permissions by role
- View and manage zone definitions

**Zone Management:**
1. Open GCX and navigate to Zones page
2. View all site zones as defined in Genesis
3. Zone changes affect future alarms only

### For Operators

**Receiving an Alarm:**
1. Alarm is triggered and assigned
2. Alarm workflow opens automatically in Talos
3. Alarm quad loads automatically in Salvo
4. Live streams start for relevant cameras

**Closing an Alarm:**
1. Cancel using "X" icon closes workflow popup in Talos
2. Alarm quad closes in Salvo
3. All associated streams stop per Genesis rules

**Toggle Behavior (Multi-Monitor + Autostream):**
| Toggle State | Behavior |
|--------------|----------|
| Multi-monitor only | Workflow opens in Talos, quad loads in Salvo |
| Autostream only | Current live camera view replaced with alarm quad |
| Both enabled | Full automatic integration |
| Both disabled | Manual operation required |

---

## 4. Target Audience

### Primary Users
- **Security Operations Center (SOC) Operators** - Benefit from automatic camera display during alarm response
- **Monitoring Station Personnel** - Reduced manual steps during critical situations

### Configuration Users
- **System Administrators** - Configure auto streaming settings, permissions, and zones
- **IT Security Teams** - Manage access controls and audit logs

### Stakeholders
- **Compliance Officers** - Activity logging provides audit trail
- **Operations Managers** - Improved response times and efficiency metrics

---

## 5. Technical Notes

**System Integration Points:**
- **Talos**: Alarm workflow management
- **Salvo**: Video display and streaming
- **Genesis**: Settings storage and zone definitions
- **GCX**: User interface for configuration

**Data Flow:**
1. Alarm triggered → Genesis
2. Genesis → GCX (alarm data with zone info)
3. GCX matches zone to camera mapping
4. Stream request → Salvo
5. Live video displayed to operator

**Fallback Behavior:**
- No zone match → Site-level streaming (all cameras)
- No cameras mapped → No streams start (system stable)
- Zone only in Talos → Falls back to site-level or no streams

---

## 6. Consolidated Release Item Recommendation

**This is ONE major feature release, not multiple separate items.**

**Recommended Article Title:** "AutoStream: Automatic Video Streaming for Alarm Response"

**Article Sections:**
1. Overview - What is AutoStream
2. Key Features - Alarm-triggered streaming, zone-based selection, multi-monitor integration
3. Configuration Guide - Admin setup steps
4. Operator Workflow - How operators use the feature
5. Troubleshooting - Common issues and solutions

**Total Test Cases:** 41 (23 from autostream-req.json + 18 from autostream-mu.json)
