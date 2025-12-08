# NXGEN GCXONE - Comprehensive Feature List
## To Be Validated and Completed During Review

**Purpose:** This document lists all features to ensure complete coverage in documentation  
**Status:** DRAFT - Requires SME validation  
**Last Updated:** December 2025

---

## Core Platform Features

### Video Management
- [ ] Live Video Streaming
  - RTSP streaming
  - P2P streaming
  - HLS streaming (Camect)
  - TCP JPEG/Raw (Milestone)
  - WebSocket streaming
  - Low bandwidth mode
  - Multi-camera view
  - Stream quality controls

- [ ] Video Playback
  - Timeline navigation
  - Event markers
  - Speed controls
  - Export functionality
  - Clip download
  - Frame-by-frame

- [ ] PTZ Control
  - Pan/Tilt/Zoom
  - Preset positions
  - Tours (if supported)
  - Focus control
  - Pattern recording

### Alarm & Event Management
- [ ] AI Analytics
  - Human detection
  - Vehicle detection
  - False alarm reduction (up to 80%)
  - Priority alarm classification
  - 60-90 second critical alarm handling

- [ ] Event Clip Recording
  - Pre/post-alarm recording (-5 to +5 seconds)
  - Configurable alarm codes
  - Automatic capture
  - Supported devices: ADPRO, Dahua, Hikvision, Milestone

- [ ] Real-time Event Processing
  - Event forwarding
  - Event filtering
  - Event enrichment
  - Analytics overlay

- [ ] Alarm Supervision
  - Timeout monitoring
  - Guard check-in verification
  - QR code scanning
  - Custom check-in signals

### System Health & Monitoring
- [ ] Site Pulse / Lifecheck
  - Heartbeat monitoring
  - Configurable intervals (10/30/60 min)
  - Timeout alarms
  - Power failure detection
  - Network outage alerts
  - Supported: ADPRO, Axis, GCXONE Audio, Milestone, Hanwha

- [ ] Device Health Monitoring
  - Offline camera detection
  - Storage status monitoring
  - Battery status (IoT devices)
  - Connection quality
  - Device diagnostics

- [ ] Event Polling
  - Configurable polling intervals
  - Manual event retrieval
  - Used when push not available
  - Critical for Teltonika

### Communication Features
- [ ] GCXONE Audio (SIP Twilio)
  - Remote announcements
  - Two-way audio communication
  - IP speaker integration
  - Cloud-initiated calls
  - Works with local mode disabled

- [ ] Email Notifications
  - Alarm notifications
  - Image attachments
  - Video clip sharing
  - Custom templates
  - Recipient management

- [ ] SMS Notifications
  - Alarm alerts
  - Status updates
  - Custom messages

- [ ] Voice Calls
  - Automated calling
  - Call routing
  - IVR integration (?)

### I/O Management
- [ ] Input Monitoring
  - Door/window contacts
  - Motion sensors
  - Environmental sensors
  - Custom inputs
  - Status display

- [ ] Output Control
  - Relay control
  - Door strike control
  - Siren activation
  - Custom outputs
  - Manual/automated triggers

### ARM/DISARM Functions
- [ ] Software ARM/DISARM
  - Per-site control
  - Per-zone control (?)
  - User-based permissions
  - Supported devices

- [ ] Schedule-Based ARM/DISARM
  - Time-based schedules
  - Day of week patterns
  - Holiday schedules (?)
  - Automated execution

- [ ] Test Mode
  - Disable alarm processing
  - Resource conservation
  - GCXONE workflow integration
  - Temporary disablement

### Dashboard & Visualization
- [ ] Active Sites Widget
  - Real-time site status
  - Alarm volume indicators
  - Quick filters

- [ ] Alarm Volume Analytics
  - Historical trends
  - Peak time analysis
  - Site comparisons

- [ ] Device Health Status
  - Offline devices
  - Connection status
  - Health indicators

- [ ] Sites Without Images
  - Missing image alerts
  - Configuration issues
  - Troubleshooting links

- [ ] Blocked Devices
  - Blocked device list
  - Unblock actions
  - Block reasons

- [ ] Performance Metrics
  - System performance
  - Response times
  - Resource utilization

- [ ] Custom Widgets (?)
  - User-created widgets
  - Data source selection

### User & Access Management
- [ ] Role-Based Access Control (RBAC)
  - Predefined roles: Admin, Customer Admin, Backend API QA, Operator
  - Custom roles (?)
  - Permission granularity
  - APP/Category/Action/API based

- [ ] Workspace Management
  - Alarm routing
  - Standard vs VIP workspaces
  - User restrictions
  - Work groups
  - Site groups
  - Site types

- [ ] Auto-Feed Configuration
  - Automatic alarm assignment
  - Block prevention
  - User preferences

- [ ] Multi-Factor Authentication
  - 2FA support
  - Authentication methods

### Configuration Features
- [ ] Custom Properties
  - Tenant level
  - Customer level
  - Site level
  - Device level
  - Camera/Sensor level
  - Free-flow configuration
  - On-the-fly enablement

- [ ] Time Zone Management
  - Per-site time zones
  - Automatic synchronization
  - DST handling

- [ ] Multi-Language Support
  - User interface translation
  - Content translation (AI-powered)
  - Supported: English, German, French

### Integration Features
- [ ] Auto-Streaming
  - Automatic stream initiation
  - Configuration parameters
  - Customer self-setup
  - Stream quality settings

- [ ] NOVA (Marketplace)
  - Third-party integrations
  - Feature enablement
  - Plugin management
  - Integration configuration

- [ ] Local Mode
  - Advanced streaming capabilities
  - Two-way audio enhancement
  - Encrypted streams
  - Operator workstation software
  - Prerequisites: Microsoft Redistributables, .NET 4.8, NodeJS
  - Supported: Dahua, Hikvision (?)

- [ ] GCXONE Bridge (STOS)
  - Legacy system integration
  - Event bridging
  - Protocol translation

- [ ] API Access
  - RESTful API
  - Webhooks
  - Authentication
  - Rate limiting

### Reporting & Analytics
- [ ] Alarm Listing Report
  - Time filters
  - Alarm type filters
  - Location filters
  - Export options (CSV, PDF, Excel?)

- [ ] Workflow Report
  - Execution details
  - Step outcomes
  - Operator comments
  - Performance analysis

- [ ] Event Log Report
  - All system events
  - ARM/DISARM log
  - System messages
  - Audit trail

- [ ] Site Documentation Report
  - Configuration summary
  - Device status
  - Health metrics
  - Contact info

- [ ] Custom Report Builder
  - Field selection
  - Layout customization
  - Filter configuration
  - Data source integration

- [ ] Scheduled Reports
  - Automated generation
  - Email distribution
  - Recurring schedules

- [ ] Audit Logs
  - User action logging
  - Configuration changes
  - Timestamp tracking
  - Accountability trail

### Talos-Specific Features
- [ ] Workflows
  - Manual workflows
  - Automated workflows
  - Global/Group/Site-specific
  - Managed workflows
  - Conditional logic
  - Step-by-step guidance
  - Email/SMS/Call actions
  - Device status checks

- [ ] Operator Interface
  - Three-screen layout
  - Alarm receiving screen
  - Video screen
  - Dashboard screen
  - Sortable alarm lists (priority/time)

- [ ] Shift Management
  - Night shift protocols
  - Day shift protocols
  - Shift handover

- [ ] Site Synchronization
  - Automatic site creation in Talos
  - Data synchronization
  - Real-time updates

---

## Device-Specific Features

### ADPRO
- [ ] iFT Gateway support
- [ ] Event clip recording
- [ ] Site pulse/lifecheck
- [ ] TCP event transmission
- [ ] Armed/Disarmed behavior configuration

### Hikvision
- [ ] Cloud Mode (HikProConnect)
- [ ] Local Mode
- [ ] Smart event support (line crossing, intrusion)
- [ ] Encryption support
- [ ] P2P streaming
- [ ] NTP synchronization

### Dahua
- [ ] Cloud Mode (DoLynk)
- [ ] Local Mode
- [ ] P2P streaming
- [ ] Two-way audio
- [ ] Encrypted streams
- [ ] NTP synchronization
- [ ] Smart analytics

### Hanwha/NX Witness
- [ ] Webhook event integration
- [ ] ARM/DISARM
- [ ] GCXONE Audio

### Milestone
- [ ] TCP JPEG/Raw streaming
- [ ] MIP Component SDK integration
- [ ] I/O auto-discovery
- [ ] Basic/Basic+ camera health
- [ ] All standard features

### Axxon
- [ ] WebSocket event subscription
- [ ] Software ARM
- [ ] Standard video features

### Camect
- [ ] HLS streaming
- [ ] Event acknowledgement
- [ ] Per-camera streams

### Axis
- [ ] Site pulse support

### Teltonika IoT
- [ ] Dashboard data polling
- [ ] Battery monitoring
- [ ] Voltage monitoring
- [ ] Custom alarm rules
- [ ] Threshold-based filtering

### GCXONE Audio
- [ ] SIP-based communication
- [ ] Cloud-initiated calls
- [ ] No local mode dependency

---

## Features Requiring Validation

### Unclear/Need SME Input
- [ ] Video retention periods and storage management
- [ ] Map integration (if exists)
- [ ] Mobile app features (if different from web)
- [ ] Backup and disaster recovery features
- [ ] Bandwidth optimization features
- [ ] Camera analytics configuration (beyond AI detection)
- [ ] Multi-site dashboards
- [ ] Customer portal features (if separate)
- [ ] Billing and licensing management
- [ ] System maintenance features
- [ ] Database management features
- [ ] Log management and retention
- [ ] Performance tuning options
- [ ] Advanced search features
- [ ] Bookmark/favorite features
- [ ] Custom alert sounds
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Export/import configurations
- [ ] Bulk operations
- [ ] Template management
- [ ] Integration with third-party tools
- [ ] SSO (Single Sign-On)
- [ ] LDAP/Active Directory integration
- [ ] Compliance reporting
- [ ] Video analytics beyond human/vehicle detection
- [ ] Heat mapping
- [ ] People counting
- [ ] License plate recognition (LPR)
- [ ] Facial recognition
- [ ] Object tracking
- [ ] Loitering detection
- [ ] Line crossing detection (beyond Hikvision)
- [ ] Intrusion detection zones
- [ ] Audio detection
- [ ] Smoke detection
- [ ] Camera tampering detection
- [ ] Scene change detection

### Ad-Hoc Features (Mentioned but need details)
- [ ] Platform-level ad-hoc capabilities
- [ ] Need specific examples and use cases

### Marketplace (NOVA) Features
- [ ] Need complete list of available integrations
- [ ] Need configuration details for each

---

## Feature Categories for Documentation

### By User Role

**Admin Features:**
- Customer/site/user management
- Device configuration
- Custom properties
- Dashboards
- Reports
- Audit logs
- System settings

**Operator Features:**
- Alarm handling
- Video viewing
- PTZ control
- I/O control
- Communication tools
- Workflow following

**Installer Features:**
- Device installation
- Network configuration
- Integration setup
- Testing tools

**Customer Features (if applicable):**
- Self-service portal (?)
- Alarm history
- Video access (?)
- Report viewing

### By Function

**Monitoring:**
- Live video, health monitoring, alarm reception

**Response:**
- Alarm handling, communication, control actions

**Analysis:**
- Reports, analytics, audit logs

**Configuration:**
- Setup, customization, user management

**Maintenance:**
- Troubleshooting, system health, updates

---

## Next Steps

1. **SME Review Session:** Schedule meeting to:
   - Validate existing feature list
   - Add missing features
   - Clarify unclear features
   - Prioritize features for documentation

2. **Feature Audit:** Review existing helpdesk articles to identify:
   - Features with existing documentation
   - Common feature questions
   - Missing documentation

3. **Customer Survey (optional):** Identify:
   - Most-used features
   - Least understood features
   - Desired feature documentation

4. **Documentation Mapping:** For each feature:
   - Create feature overview article
   - Create configuration guide
   - Create operator guide (if applicable)
   - Link to related devices
   - Add to troubleshooting

---

## Feature Documentation Template Usage

For each feature, create:
1. **Overview Article** → Features section (5.X)
2. **Configuration Guide** → Admin Guide (3.X) or Device Guide (4.X)
3. **Operator Guide** → Operator Guide (8.X)
4. **Troubleshooting** → Troubleshooting section (10.X)

---

## Notes

- This list is intentionally comprehensive to capture everything
- Not all features may exist or be documented
- Some features may be internal-only (exclude from customer docs)
- Priority should be given to customer-facing features
- Beta/experimental features should be marked as such
- Deprecated features should be documented in Release Notes
