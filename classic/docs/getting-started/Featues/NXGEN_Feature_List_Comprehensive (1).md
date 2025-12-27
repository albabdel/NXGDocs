# NXGEN Genesis - Comprehensive Feature List
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
  - Supported: ADPRO, Axis, Genesis Audio, Milestone, Hanwha

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
- [ ] Genesis Audio (SIP Twilio)
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
  - Genesis workflow integration
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

- [ ] Genesis Bridge (STOS)
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
- [ ] Genesis Audio

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

### Genesis Audio
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
**GCXONE** is a comprehensive, cloud-based Software-as-a-Service (SaaS) platform that unifies video surveillance, Internet of Things (IoT) security management, and advanced alarm analytics into a single interface. Designed to eliminate the need for costly on-premise hardware like dedicated servers, **GCXONE** centralizes the management of multiple systems, providing high performance, enhanced efficiency, and a user-friendly experience across various industries.

The following is a detailed list and explanation of the features provided by **GCXONE**:

### 1. Advanced Alarm and Event Management
**GCXONE** functions as an efficient cloud-based video alarm handling platform, providing state-of-the-art management of security events.
*   **AI-Powered False Alarm Filtering:** One of the standout features of the platform is its ability to use intelligent algorithms to analyze video footage and distinguish real threats (like humans or vehicles) from false triggers (such as animals, wind, or shadows). This technology can **reduce the number of false alarms by approximately 80%**, significantly lowering the burden on security operators.
*   **Centralized Alarm Processing:** The system receives alarms from various connected devices, applies analytics to classify them as "real" or "false," and distributes them to operators based on predefined customer preferences.
*   **Strict Service Level Agreements (SLA):** **GCXONE** is engineered for early detection and timely intervention, aiming to process alarms within a strict **60-90 second window**. If the system cannot process an alarm within this timeframe, it automatically forwards it as a "real" alarm for human review to ensure safety.
*   **Alarm Quad Views:** For simultaneous monitoring of multiple feeds during an incident, **GCXONE** provides alarm quad views that allow operators to maintain high situational awareness.

### 2. Video Surveillance Capabilities
The platform provides a unified control center for managing video from diverse manufacturers and systems.
*   **Real-Time Live Streaming:** The **Video Viewer** application serves as the control center, enabling operators to monitor live camera feeds in real-time through a web browser or mobile app.
*   **Historical Playback and Timeline:** Users can access archived video footage for investigations or evidence collection. The **Timeline** feature provides a chronological view of all archived data, allowing for easy navigation through recorded history.
*   **Video Activity Search:** This specialized search tool allows operators to display all received events within preferred filtration criteria, making it easy to audit specific types of alarms or time periods.
*   **Multi-Monitor Support:** The system is designed to support setups with multiple screens—typically one for the alarm queue, one for video viewing, and one for the map.
*   **Adaptive Streaming (GreenStream):** This feature automatically selects the best matching live video stream resolution based on the size of the view item on the client screen, which **decreases the load on the operator's CPU and GPU** while optimizing bandwidth.

### 3. Integrated Device Health Monitoring
**GCXONE** performs automated system supervision to ensure that all integrated security components are functioning correctly.
*   **Comprehensive Health Checks:** The system periodically attempts to access live video from each camera to ensure it is online and functional. Health monitoring is offered in three tiers:
    *   **Basic:** Checks for a valid image every 12 hours and notifies for failures.
    *   **Plus:** Includes basic checks plus proactive reporting at shorter intervals (15 minutes to 8 hours).
    *   **Advanced:** Uses AI to detect specific issues like **blur, spider webs, low light, and angle deviations**.
*   **Status Indicators:** Sites and devices are color-coded in the dashboard—**green for healthy**, **red for issues** (such as disconnected devices or rule violations), and **gray for inactive** or unknown states.
*   **Automated Alerts:** The platform generates automated alerts for critical issues, such as offline cameras, low battery levels in sensors, or reaching storage capacity limits.

### 4. Workflow Automation
Workflows are predefined sequences of actions that standardize how specific alarms or events are handled.
*   **Customizable Procedures:** Admins can create end-to-end procedures for handling different alarm types, such as intrusion or fire.
*   **Manual and Automated Workflows:** **Manual workflows** guide a human operator through specific steps (e.g., checking video, calling police), while **automated workflows** run without human intervention to perform tasks like sending email notifications or updating device statuses.
*   **Logic-Based Triggers:** Workflows can be triggered by specific conditions, such as alarm codes, the time of day, or the armed/disarmed status of a site.

### 5. Control and Interaction Features
The platform allows operators to interact with and control remote security hardware directly from the interface.
*   **PTZ (Pan-Tilt-Zoom) Control:** For compatible cameras, operators can remotely control movement and zoom levels. Advanced features include **Rectangle PTZ** (zooming in on a drawn area) and **Point to Center** (focusing on a specific clicked point).
*   **Input/Output (I/O) Management:** **GCXONE** supports the management of digital inputs and outputs, allowing operators to see the status of physical sensors and trigger external actions, such as opening a door or activating a siren.
*   **Software-Level Arm/Disarm:** Beyond physical device schedules, **GCXONE** provides a software-level arming/disarming feature. If a device is "disarmed" in the software, the platform skips the processing of alarms from that device to conserve resources.
*   **Sensor Isolation:** Operators can choose to "isolate" a specific sensor for a set duration (e.g., 1, 3, 5, or 8 hours) during maintenance or planned activities, preventing alarms from being processed during that window.

### 6. Geospatial and Contextual Awareness
**GCXONE** uses maps to provide operators with geographical context for security events.
*   **Interactive Map Module:** This feature displays camera locations on a map, allowing administrators to see which camera generated an event for immediate situational awareness.
*   **Geofencing and Zone Definition:** Administrators can define specific zones on the map, which can then be used to trigger specialized rules or workflows when activity is detected within them.
*   **Heatmap Visualization:** This tool identifies areas of high activity over time, helping users understand traffic patterns or potential security vulnerabilities.

### 7. Communication and Audio Services
The platform integrates audio tools to enhance response capabilities.
*   **Genesis Audio (SIP):** Utilizing Session Initiation Protocol (SIP) through Twilio, this feature enables **two-way audio communication** and remote announcements through integrated IP speakers.
*   **Audio File Playback:** Operators can upload and play pre-recorded audio files through site speakers to warn or instruct individuals on-site.

### 8. Analytics and Insight Tools
Beyond real-time responses, the platform provides data to help optimize security operations.
*   **Customizable Dashboards:** Users can view real-time data on active statuses for sites, alarm contributions at different levels, and the ratio between real, false, and technical alarms.
*   **Management and CMS Insights:** These sections provide analytics on business performance, user engagement, system uptime, and content performance.
*   **Comprehensive Reporting:** **GCXONE** provides templates for various reports, including **Alarm Listings, Workflow Reports, and Event Logs**. Reports can be scheduled for automatic generation and delivery via email.

### 9. Management and Integration
The platform is designed to be a flexible hub for security infrastructure.
*   **Multi-Tenant Architecture:** **GCXONE** securely isolates data between different businesses while sharing a robust core infrastructure.
*   **Extensive Device Support:** The platform integrates with major video systems (Dahua, Hikvision, Axis, Milestone, etc.) and various IoT devices, vehicle tracking dongles, and routers.
*   **RESTful APIs and Webhooks:** For integration with third-party systems like ticketing tools or smart home platforms, **GCXONE** offers robust API endpoints and webhook support.
*   **Audit Trails:** The **Audit** tab maintains a detailed, immutable record of all actions taken within a tenant—listing who performed an action, the type of action, its status, and a timestamp—essential for accountability and troubleshooting.

***

**Analogy:**
Think of **GCXONE** as the **"Smart Air Traffic Control Tower"** for a city's security. Just as a tower manages various types of planes (cameras and sensors) from different airlines (manufacturers) in one unified system, **GCXONE** coordinates all your security data. The AI analytics act like an advanced radar filter that ignores birds (false alarms) but highlights potential issues, ensuring the controllers (operators) only focus on relevant flights, all while the system automatically checks the health of every landing light and beacon in the airport.
While the previous summary provided a strong high-level overview, the sources contain many additional technical and specialized features that make **GCXONE** a robust enterprise platform. 

Here is an exhaustive list of the granular features of **GCXONE**, drawing from the provided sources:

### 1. Architectural & Multi-Tenant Features
*   **True SaaS Cloud Architecture:** **GCXONE** operates as a Software-as-a-Service, eliminating the need for on-premise servers and manual updates.
*   **Multi-Tenant Model:** Uses a hierarchical structure (Tenant → Customer → Site → Device → Cameras/Sensors) where each tenant has an isolated workspace to manage their own clients independently.
*   **Subdomain Isolation:** Serves customers through unique subdomains (e.g., `customer.inexchange.cloud`) to ensure data security and personalized service.
*   **Microservices Design:** The platform is built on independent microservices (Proxies, API, RTSP services), ensuring that if one part has an issue, the rest of the system remains operational.

### 2. Specialized Video & Analytics Capabilities
*   **Fisheye Image Dewarping:** Supports standard and panomorph fisheye lenses, performing image correction on the client-side GPU to provide multiple normal views without taxing the CPU.
*   **Privacy Masking (Static & Dynamic):** Allows administrators to obscure sensitive areas (like ATM keyboards) in both live and recorded video. Dynamic masks can even follow and obscure tracked objects.
*   **Thermal Imaging Support:** Integrates with thermal cameras for perimeter protection in complete darkness.
*   **Smart Search (Metadata-Based):** Operators can search recorded footage for specific attributes like object color, size, or behavior (e.g., crossing a line) rather than manually scrubbing through hours of video.
*   **GreenStream / Adaptive Streaming:** Automatically matches the video resolution to the size of the viewing window on the operator's screen, significantly reducing bandwidth and CPU/GPU load.
*   **Timelapse Video Generation:** Provides the capability to create condensed time-lapse summaries from archived camera footage.

### 3. Advanced Alarm & Workflow Management
*   **SLA-Driven Alarm Processing:** Guaranteed processing of critical alerts within a **60-90 second window**; alarms are automatically escalated to a "real" status for human intervention if the AI cannot process them in time.
*   **Redundancy Timer:** Prevents "alarm floods" by rejecting duplicate alarms with the same code from the same sensor within a configurable window (default 30 seconds).
*   **Event Overflow Logic:** Automatically suspends alarm processing for five minutes if a specific sensor overloads the system, protecting platform stability.
*   **Test Mode Integration:** Automatically disarms a site in **GCXONE** when it is set to "test mode" in the monitoring system, conserving cloud processing resources during planned maintenance.
*   **AI Visual Verification:** Specifically for devices like Ajax or Reconeyez, the system pulls still images associated with an alarm, applies AI to mark bounding boxes around detected persons, and returns the verified result to the monitoring center.

### 4. Advanced Hardware Interaction
*   **Rectangle PTZ & Point to Center:** Exclusive to Milestone-integrated PTZ cameras, this allows operators to draw a box on a screen to zoom in optically or click a point to center the camera on that exact spot.
*   **Auxiliary Command Support:** Supports custom device-level commands, such as remotely activating a camera wiper or turning on a heater.
*   **Two-Way Audio (SIP & Local SDK):** Supports high-quality audio communication via SIP protocols or local SDKs, allowing operators to broadcast warnings or listen to on-site audio.
*   **Manual Action Triggers:** Administrators can configure buttons in the interface to manually trigger predefined action rules, such as opening a barrier or flashing an LED for verification.
*   **Digital I/O Management:** Real-time visualization and control of physical inputs (sensors) and outputs (relays/doors) through the platform's I/O tab.

### 5. Geographic & Insights Tools
*   **3D Interactive Map:** Superimposes camera locations and live video onto a site map, color-coding devices based on their health status.
*   **Tag&Track:** Predicts an object's path when it leaves one camera’s field of view and automatically highlights the next "destination" camera on the map for the operator.
*   **Field of View (FOV) Visualization:** Displays the current viewing angle and depth of a camera directly on the map, which updates dynamically for PTZ cameras.
*   **Management & CMS Insights:** Detailed analytics on business performance, user engagement, and content efficiency to help managers optimize security operations.

### 6. IoT & Telemetry Integration
*   **Victron Energy Monitoring:** specialized dashboard for IoT power devices that tracks real-time battery voltage, solar charger states, and historical yield data.
*   **Teltonika Router & Fleet Tracking:** Monitors network connectivity, environmental conditions, and fleet movements through GPS and sensor data.
*   **Reconeyez Battery Status:** specifically handles battery-operated intrusion panels, reporting periodic battery levels and LTE signal strength as technical events.

### 7. Management & Security Standards
*   **Bulk Import Utility:** Enables administrators to create hundreds of customers, sites, or devices simultaneously using an Excel file instead of manual UI entry.
*   **Audit Trail Logs:** An immutable record tracking every action taken within a tenant—listing the user, the time, and the status of the action for full accountability.
*   **Custom SIP URL Support:** Allows the combination of usernames, passwords, IPs, and port numbers to configure highly specific SIP audio endpoints.
*   **Role-Based Session Timeouts:** Administrators can define custom logout times (up to 1,440 minutes) based on specific user roles to balance security and convenience.

***

**Analogy:**
If the previous summary described **GCXONE** as a "Smart Air Traffic Control Tower," this full list reveals it is also the **Black Box, the Radar Array, and the Maintenance Hangar** all in one. It doesn't just watch the planes; it knows the battery level of every landing light (**IoT/Victron Monitoring**), can tell if a bird is just a bird (**AI Filtering**), and keeps a permanent, unchangeable record of every decision made by the pilots (**Audit Logs**). It is a universal multi-tool that reshapes itself to fit whatever aircraft—or security manufacturer—is currently landing on the runway.
Based on the sources provided, there are many additional granular and technical features of **GCXONE** beyond a basic high-level summary. Here is a comprehensive list and in-depth explanation of every feature identified in the materials:

### 1. Core Architectural Features
*   **Multi-Tenant SaaS Model:** **GCXONE** uses a hierarchical structure (**Tenant → Customer → Site → Device → Cameras/Sensors**) to isolate data for different businesses while allowing centralized management.
*   **Subdomain Isolation:** Each tenant operates on its own dedicated subdomain (e.g., `customer.inexchange.cloud`) to ensure data security and personalized service branding.
*   **Microservices Design:** The platform is built on independent microservices (e.g., API Service, RTSP Services, Connect Proxies), which ensures that if one component fails, the rest of the system remains operational.
*   **Cloud and Local Mode Support:** Users can operate in **Cloud Mode** for remote access or **Local Mode** (installed on workstations) for high-performance tasks like P2P streaming and encrypted streams.

### 2. Advanced Alarm & Event Management
*   **AI-Powered False Alarm Filtering:** Uses algorithms to distinguish real threats (humans/vehicles) from false triggers like animals or wind, potentially **reducing false alarms by 80%**.
*   **DC09/SIA Integration:** Supports standard protocols like **DC09 and SIA** to receive and forward alarms to legacy or third-party Central Monitoring Stations (CMS).
*   **Alarm Quad Views:** Provides a simultaneous view of pre-alarm, current, and post-alarm images to give operators total context during an incident.
*   **Redundancy Timer:** Prevents "alarm floods" by rejecting duplicate alarms from the same sensor within a set window (defaulting to 30 seconds).
*   **Event Overflow Protection:** Automatically stops processing alarms from a sensor for a set period (e.g., 5 minutes) if it overloads the platform with excessive alerts.
*   **Alarm Assignment and Parking:** Operators can manually assign alarms or use "auto-feed" for automatic distribution. Alarms can also be **"parked"** (temporarily set aside) during ongoing interventions.
*   **SLA-Driven Processing:** Alarms are prioritized and handled within a strict **60-90 second window**; if processing fails, the system defaults to flagging the alert as "real" for human review.

### 3. Comprehensive Video Surveillance
*   **GreenStream (Adaptive Streaming):** Automatically selects the video resolution based on the size of the viewing window on the operator’s screen, reducing CPU and bandwidth load.
*   **Smart Timeline:** Offers a chronological view of all archived data, allowing for easy navigation through recorded history.
*   **Video Activity Search:** A tool that allows operators to filter all received events by date, site, or classification (real/false) for auditing.
*   **P2P Streaming:** Supports peer-to-peer streaming in Local Mode for faster access to video feeds without going through the cloud.
*   **Time-Lapse Generation:** Allows users to create condensed time-lapse summaries from camera footage over extended periods.

### 4. Interactive Control & Interaction
*   **PTZ (Pan-Tilt-Zoom) Control:** Operators can remotely move cameras. Advanced versions include **Rectangle PTZ** (zoom on a specific area) and **Point to Center**.
*   **Two-Way Audio (SIP Twilio):** Integrates with IP speakers to allow operators to broadcast warnings or communicate with on-site personnel.
*   **Digital I/O Management:** Real-time visualization and manual triggering of physical inputs (sensors) and outputs (relays/doors) directly from the interface.
*   **Software-Level Arm/Disarm:** Allows an admin to "disarm" a site in the software, causing the system to skip alarm processing for that site without changing the physical device's schedule.

### 5. Deep Device Health Monitoring
*   **Automated Health Checks:** The system periodically pings cameras to ensure they are online. Health monitoring is offered in three tiers:
    *   **Basic:** Checks for a valid image every 12 hours.
    *   **Plus:** Includes basic checks with proactive reporting at shorter intervals (15 minutes to 8 hours).
    *   **Advanced:** Detects specific visual issues like **blur, spider webs, low light, and angle deviations**.
*   **Site Pulse (Lifecheck):** Sends heartbeat signals between the device and the cloud; if a pulse is missed, a timeout alarm is raised.
*   **Pause & Tag Health Check:** Admins can temporarily suspend health checks for specific cameras during maintenance or tag them as "Work in Progress".

### 6. Workflow Automation
*   **Customizable Procedures:** Admins can create end-to-end procedures for different events. Workflows can be **Manual** (guiding an operator) or **Automated** (background tasks like emails).
*   **Test Mode Integration:** Automatically disarms a site in **GCXONE** when it is set to "test mode" in the monitoring station to conserve processing resources.
*   **Call Acceptance Workflow:** Streamlines handling incoming customer calls, such as identifying callers via **site codewords** and performing on-demand site isolation.

### 7. Geospatial & Analytical Insights
*   **Interactive 3D Maps:** Displays camera and I/O locations on a map with the ability to define **Geofencing zones**.
*   **Heatmap Visualization:** Identifies areas of high activity over time to understand traffic patterns or vulnerabilities.
*   **Management & CMS Insights:** Provides analytics on business performance, user engagement, and system uptime to help managers optimize operations.

### 8. Administration & Security
*   **Audit Trail:** An immutable record of every action taken within a tenant—listing the user, the action, the status, and a timestamp.
*   **Role-Based Access Control (RBAC):** Permissions are granularly assigned by role, determining which users can view live feeds, export video, or modify configurations.
*   **Bulk Import Utility:** Enables administrators to create hundreds of customers, sites, or devices simultaneously using an Excel file.
*   **Custom SIP URLs:** Allows advanced configuration of audio endpoints using a combination of usernames, passwords, IPs, and port numbers.

***

**Analogy:**
Think of **GCXONE** as a **"Smart Universal Remote"** for a massive skyscraper. Instead of having separate remotes for the lights, elevators, and security cameras (different manufacturers), you have one high-tech tablet. This remote doesn't just push buttons; it has a built-in assistant (AI Analytics) that only notifies you if a person is in the hallway (Real Alarm) while ignoring the moving curtains (False Alarm). It even runs a self-diagnostic (Health Check) every hour to make sure the lightbulbs haven't burned out and keeps a permanent diary (Audit Trail) of every button pressed by every security guard.

Yes, there are several more specialized and technical features of **GCXONE** detailed in the sources. While the core functionalities like live streaming and AI filtering are central, the platform includes deep architectural, operational, and device-specific capabilities.

Here is an additional list of features and in-depth explanations for **GCXONE**:

### 1. Architectural & Connectivity Features
*   **Microservices and Proxy Architecture:** The platform is built using specialized microservices called "proxies" (e.g., Dahua proxy, Axis proxy) to handle device-specific communication. This allows the core system to interact with any device type uniformly through standardized JSON-based APIs.
*   **Reverse Communication (Cloud-to-Cloud):** For cloud-integrated devices like HikProConnect or Dahua DoLynk, **GCXONE** does not require the device to have a static public IP. Instead, the device establishes an outbound connection to its native cloud, and **GCXONE** communicates with that cloud using API keys and tokens.
*   **VPN Integration Options:** For customers requiring enhanced security, **GCXONE** supports site-to-site VPN tunnels using OpenVPN or IPsec (IKEv1/IKEv2), allowing the cloud to communicate with devices using internal private IP addresses.
*   **Standardized Tenant Hierarchy:** **GCXONE** organizes data using a nested structure: **Tenant → Customer → Site → Device → Camera/Sensor**. This hierarchy ensures secure data isolation while allowing service providers to manage hundreds of clients from a single portal.

### 2. High-Performance Video Management
*   **Adaptive Streaming (GreenStream):** This feature saves network bandwidth and reduces the load on the operator's CPU/GPU by automatically selecting a video stream resolution that matches the size of the viewing window on the screen.
*   **Client-Side GPU Dewarping:** For fisheye cameras, **GCXONE** performs image correction (dewarping) on the operator's computer GPU rather than the server. This provides multiple "normal" views from a single 360-degree feed without taxing system performance.
*   **Advanced Privacy Masking:** The platform supports three types of masking to comply with privacy laws like GDPR: **Permanent** (always hidden), **Temporary**, and **Automated** (dynamic masks that can follow tracked objects).
*   **Event-Driven Video Clips:** For specific real alarms, **GCXONE** can automatically record and retrieve pre- and post-alarm video clips (typically -5 to +5 seconds). This provides operators with the exact context needed to verify an intrusion.

### 3. Smart Alarm & Workflow Logic
*   **Redundancy Timer:** To prevent "alarm floods," the system uses a configurable redundancy timer (default 30 seconds). If the same sensor sends multiple alarms with the same code within this window, the duplicates are rejected.
*   **Event Overflow Suspension:** If a single sensor overloads the platform with excessive signals, **GCXONE** will automatically discard alarms from that sensor for a set period (e.g., 5 minutes) to protect system stability.
*   **Managed and Global Workflows:** Admins can create **Managed Workflows**—standard procedures created once and assigned to multiple sites—or **Global Workflows** that apply to the entire tenant.
*   **Test Mode Synchronization:** When a site is set to "test mode" in a connected monitoring system like Talos, **GCXONE** can automatically disarm the site software-level to conserve cloud processing resources.

### 4. Advanced Hardware Interactions
*   **Milestone-Specific PTZ Features:** For Milestone VMS integrations, **GCXONE** supports **Rectangle PTZ** (drawing a box on the screen to optically zoom) and **Point to Center** (clicking a spot to center the camera).
*   **Auxiliary (AUX) Commands:** The system can send specialized commands to hardware, such as remotely activating a camera’s windshield wiper or heater.
*   **Digital I/O Control:** Operators can manually trigger digital outputs, such as opening a gate, turning on lights, or activating a siren, directly from the **GCXONE** interface.

### 5. IoT and Telemetry Integration
*   **Victron Energy Monitoring:** **GCXONE** integrates with Victron IoT devices to track solar charger states, battery voltage, and historical power yield, displaying this data on a dedicated dashboard.
*   **Vehicle and Fleet Tracking:** The platform supports IoT dongles for monitoring vehicle test drives or fleet movements, providing GPS-based location data and event logs.
*   **Custom Threshold Filtering:** For IoT sensors that send high-frequency data, **GCXONE** allows admins to set "additional properties" with rules to only trigger alarms when a metric (like voltage) drops below a specific threshold.

### 6. Administrative Efficiency
*   **Bulk Configuration Wizard:** This tool allows administrators to configure health check schedules, analytics, and subscriptions for hundreds of cameras simultaneously.
*   **Audit Trails:** The **Audit** tab maintains an immutable record of every action taken within the platform, including the user, action type, status, and timestamp.
*   **Site Health Color Coding:** Sites are color-coded for instant status assessment: **Green** (normal), **Red** (critical issues/rule violations), **Yellow** (warning), and **Gray** (inactive or maintenance mode).

***

**Analogy:**
If the previous analogy described **GCXONE** as an air traffic control tower, these additional features reveal that it is also a **Global Logistics Network**. It doesn't just manage the "planes" (cameras); it has a **Deep Underground Tunnel System** (VPN/Proxy Architecture) for secure movement, a **Smart Fuel Monitor** (IoT/Victron Integration) that alerts you only when tanks are low, and an **Automated Maintenance Log** (Audit Trail) that records every wrench turn. It is an ecosystem that optimizes itself by ignoring the "noise" of empty hangers while ensuring every "flight" is perfectly documented and handled.