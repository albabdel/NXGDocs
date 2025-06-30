# ADPRO

## Overview

### Disclaimer and Introduction

:::warning Legal Notice
This document is provided under NXGEN Technology Ltd's (NXGEN) General Terms & Conditions. All content is the intellectual property of NXGEN or its licensors and is protected by copyright laws. Unauthorized reproduction, distribution, or modification is strictly prohibited.
:::

This document serves as a comprehensive, step-by-step guide for configuring ADPRO devices using the ADPRO XO client. It is specifically designed to assist installers in setting up and configuring devices to ensure successful alarm transmission to the NXGEN Genesis platform.

### Genesis Platform Overview

**NXGEN Genesis** is a cloud-based Software as a Service (SaaS) platform providing video surveillance and IoT services. Key features include:

- Remote device management via web browser or mobile app
- Elimination of on-premise hardware and software management needs
- High performance and enhanced efficiency
- Integration with existing infrastructure to reduce false alarms
- Robust cloud architecture for secure, scalable, and accessible data
- Multi-tenant architecture support

**ADPRO Device Integration** involves security systems with Network Video Recorders (NVRs) and analytics, configured through the ADPRO XO Client software application.

## Prerequisites and Planning

### Device Support Confirmation

Genesis supports ADPRO devices as part of its comprehensive device integration portfolio, which includes various security and surveillance systems.

### Unique Device Identification

:::danger Critical Requirement
Each ADPRO device **must** have a unique server unit ID. This ID acts as the primary identifier for alarms, ensuring Genesis can correctly attribute alarms to the specific device and preventing conflicts when multiple ADPRO devices are in use.
:::

### Required Information Before Setup

Before beginning the setup process, gather the following information:

- Device IP address (internal/external)
- RTSP port and control port information
- Network connectivity method (VPN or Public Network)
- User credentials with appropriate permissions
- Time zone information
- Unique Server Unit ID

## Initial Device Setup

### Hardware Installation

1. **Power Requirements:** Ensure proper power supply to the ADPRO device
2. **Network Connection:** Connect the device to the network infrastructure
3. **Physical Security:** Secure the device in an appropriate location

### ADPRO XO Client Access

1. Connect a monitor and keyboard to the device
2. Power on the device
3. Access the ADPRO XO Client interface
4. Navigate through the initial setup wizard

## Network Configuration

Effective network configuration is fundamental for seamless communication between the ADPRO device and the Genesis platform.

### Connectivity Options

#### Public Network (Non-VPN Customers)

For customers without a VPN connection, the ADPRO device must be exposed through a public network. This requires:
- External IP address
- External ports for RTSP and control

#### Side-to-Side VPN Connection (Recommended)

This is the preferred and more secure method. With a side-to-side VPN:
- A logical tunnel is established between the customer's network and Genesis's network
- Creates a single virtual network
- Only the internal IP address of the ADPRO device is needed
- External ports are not required to be open
- Simplifies configuration and enhances security

### IP and Port Requirements

#### Essential Port Information

Regardless of connection type, the following information is required:

| Port Type | Internal Default | External Standard | Purpose |
|-----------|------------------|-------------------|---------|
| RTSP | 553 | 554 | Video streaming |
| Control | 1500 | 2000 | Device control |
| Audio | 3000 | 3000 | Audio transmission |
| Alarm to Genesis | - | 10,000 | Alarm transmission |

#### Genesis Server IP Addresses for Whitelisting

**Primary ADPRO Alarm Receiver Gateways:**
- 3.123.151.x
- 52.28.72.x
- 18.159.54.x

**Genesis Services Public IP Addresses:**
- Primary Gateway: 18.185.17.x
- Secondary Gateway: 3.124.50.x

**Streaming Gateways:**
- Primary: 3.126.237.x
- Secondary: 3.75.73.x

**Messaging Services:**
- 3.127.50.x

#### Important Configuration Notes

:::info Configuration Requirements
- **Unencrypted Strings:** Genesis only supports unencrypted strings for ADPRO devices. Ensure the "encrypt string" option is **not** selected during configuration.
- **P2P License and O Key:** Genesis currently does not support P2P licenses or O keys for ADPRO devices. Connections are TCP-based only.
:::

### IP Whitelisting Requirements

For non-VPN customers:
- IT team must whitelist NXGEN server IPs in their router or firewall
- Whitelisting should be done at the router level, not inside the device
- Ensures connection requests from Genesis are allowed to reach the ADPRO device

**Port Forwarding/Mapping** means explicitly opening required ports on the customer's router and mapping them to the device's internal IP address. This allows external systems like Genesis to access the device behind a local network.

## User Configuration

Proper user configuration and access rights management are essential for Genesis to interact effectively with the ADPRO device.

### Access Rights for NXG Users

In the "Users" section of the ADPRO XO client:
- Configure access rights for Genesis users
- **Recommendation:** Administrative rights are recommended for full functionality
- User rights can suffice if all necessary basic functions are explicitly enabled
- Create a dedicated user account like "NXG" with a strong password

### Essential Permissions for Genesis Functionality

The user account configured for Genesis must have the following permissions enabled:

#### Core Permissions
- **PTZ Control** - For pan, tilt, and zoom camera operations
- **I/O Trigger** - To control input/output functions (e.g., triggering a relay)
- **Alarm Subscription** - Crucial for receiving alarms from the device
- **Live Streaming** - For real-time video feeds
- **Setup Device/Configuration** - Permissions for device registration and configuration

#### Additional Permissions
- **Local Log Search** - To retrieve event logs from the device
- **Playback/Video Export** - For accessing and downloading recorded video footage
- **Two-Way Audio** - If supported by the device and required for communication
- **Video Output Control** - To manage video output from the device
- **Serial Port Control** - For serial communication if applicable
- **Manual Operations** - Covers various manual controls and operations
- **Live View** - For viewing live video feeds

:::warning Important
Verify that these basic functions are enabled for the user role associated with the credentials shared with Genesis, even if restricted access is granted.
:::

## CMS Alarm Transmission

This section details how ADPRO devices transmit alarms to the Central Monitoring Station (CMS), specifically Genesis.

### Primary and Secondary Transmission

The ADPRO XO client allows configuring both primary and secondary alarm transmission destinations:

- **Dual Configuration:** Serves as a failover or backup strategy
- **Automatic Failover:** If the primary IP address or connection fails, the system automatically attempts to send alarms through the secondary IP address
- **Enhanced Reliability:** Ensures continuous alarm reporting even during network interruptions

### Site Pulse / Lifecheck (Recommended)

The "Site Pulse" or "Lifecheck" feature is highly recommended as it acts as a heartbeat for the system.

#### Purpose
- ADPRO device sends regular "I am alive" heartbeat signals to Genesis
- Configurable intervals: 10 minutes, 30 minutes, or 1 hour
- Based on customer needs and desired monitoring frequency

#### Timeout Alarms
- If Genesis doesn't receive a site pulse within the configured time, a timeout alarm is raised
- Alert indicates potential issues with the device (power failure) or network connectivity (internet outage)

#### Configuration in Genesis
- Site pulse configuration must be enabled in Genesis device general settings
- Interval must match the interval set on the ADPRO device
- Synchronization ensures Genesis correctly monitors device status

### Parallel Alarm Transmission

Parallel alarm transmission is an optional feature that differs from the primary/secondary failover mechanism.

#### Functionality
- Sends simultaneous copy of alarms to an additional IP address
- Primary/secondary alarm stream continues as configured
- Identical copy of alarm data is dispatched to another designated recipient

#### Use Cases
- Integrating with other third-party alarm management systems
- Sending alarms to a separate platform for reporting, analytics, or archival purposes
- Ensuring multiple stakeholders receive real-time alarm notifications

## Analytics Configuration

Analytics are crucial for enabling the ADPRO device to intelligently detect events and generate alarms for Genesis.

:::warning Critical Note
Without proper analytics configuration, the device will not generate alarms, and Genesis will have no events to analyze.
:::

### Core Analytics Configuration

Key analytics must be configured in the "Analytics" section of the ADPRO XO client:

#### Available Analytics
- Intrusion detection
- Motion detection
- Loitering traces

#### Configuration Parameters
- **Region of Interest:** Define specific areas within the camera's view for monitoring
- **Sensitivity Levels:** Adjust how easily an event triggers an alarm (very low, normal, very high)
- **Detection Rules:** Set conditions for triggering, such as time or distance acceptance
- **Object Duration:** Specify how long an object must remain in the scene before triggering an alarm

#### Smart Events vs Basic Motion Detection
- **Intrusion analytics:** Offers granular control and tweaking options
- **Basic motion detection:** Simply alerts for any activity (can generate too many alarms)
- **Recommendation:** Use smart events like line crossing or intrusion over basic motion detection

### Video Clip Recording (ADPRO iFT Gateway devices)

For ADPRO iFT Gateway subtypes, Genesis can record short video clips associated with alarms.

#### Configuration
Set the following Genesis custom properties:
- **eventClipRecord:** Set to `True` to enable recording of event clips
- **eventClipRecordAlarmCode:** Specify alarm codes for which clips should be recorded (e.g., `motion.perimeter`)

#### Benefits
- Genesis receives clips allowing operators better view of events
- Clips include 5 seconds before alarm and seconds after alarm
- Genesis can extract pre-alarm, current, and post-alarm images for analysis

## Alarm Profiles and Scheduling

### Arm and Disarm Schedule

Schedules define when alarms from the ADPRO device are actively forwarded to the Genesis platform.

#### Scheduled Operation
- System can be configured to forward alarms only within specified schedules
- Example: Send intrusion alarms only when site is "armed" during non-business hours

#### Sabotage Alarms
Handling depends on configuration:
- **Sent during disarmed times:** Genesis will receive sabotage alarms even when system is disarmed
- **Sent only during armed times:** Will not be transmitted to Genesis if system is disarmed

#### Software vs Panel Arm/Disarm
- ADPRO devices support native scheduling and arm/disarm functionality
- Genesis also provides "software arm/disarm" feature
- If device is explicitly disarmed within Genesis, alarms will be skipped even if physical panel is armed

### Alarms Profile

Alarm profiles allow granular control over which types of alarms are transmitted to Genesis.

#### Grouping and Operational States
- Alarms are grouped into profiles based on nature or category
- For each profile, define whether it should be active during disarmed, armed, or both states

#### Customization
- Choose precisely which alarms to receive and when
- Example configurations:
  - "Normal event" category: Send alarms only during armed times
  - Technical/sabotage alarms: Send alerts at all times if deemed critical

#### Profile Management
- Users can add custom alarm profiles
- Group several events into profiles
- Adding new profiles might be restricted for certain user roles

## Input/Output Behavior

Input/Output (I/O) behavior configuration is essential for correlating events with their corresponding cameras.

### Event-to-Camera Correlation

Configure events to their corresponding cameras for effective reporting:
- Ensures alarms are linked directly to the specific camera that detected the event
- Facilitates accurate alarm reports, video verification, and incident response

### Genesis Automatic I/O Reading

Genesis automatically reads and displays I/O information once the device is discovered:

#### Benefits
- Reduces manual data entry within Genesis platform
- Minimizes potential for human error
- Simplifies management of inputs and outputs
- Ensures I/O data in Genesis is synchronized with device's actual configuration

## Time Zone Configuration

Correct time zone configuration is critical for accurate event logging, alarm timestamps, and synchronization.

### Matching Time Zones

The time zone configured on the ADPRO device must match the customer's device time zone in Genesis:
- Ensures accurate timestamping of real-time event forwarding
- Aligns historical logs across both systems

### NTP Server Synchronization (Recommended)

Configure the ADPRO device to synchronize with an NTP (Network Time Protocol) server.

#### Benefits
- Automatic date and time reading from server
- Eliminates need for manual configuration
- Automatic adjustment for Daylight Saving Time (DST)
- Prevents time-related discrepancies

#### Recommended NTP Server
Use `time1.nxgen.cloud` for Genesis integration.

## Hard Disk Management

Proper hard disk management ensures reliable recording and storage of video data.

### Hard Disk Installation and Requirements

#### Installation Process

:::danger Safety Precaution
Always turn off the power to the device before installing or replacing hard disk drives (HDDs).
:::

1. **For the first hard disk:** Follow specific instructions
2. **If installing two hard disks:** Follow separate instructions for dual installation
3. **After physical installation:**
   - Connect monitor and keyboard
   - Switch on the device
   - Access XOa Installer (press arrow keys during boot)
   - Navigate to **Update current system > Manage recording disks**
4. **Initialization:** Initialize any uninitialized HDDs when prompted

#### RAID Support
- Models like iFT-E support RAID 1 for enhanced data redundancy

#### Recommended Storage
- Continuous recording is generally recommended if sufficient storage capacity is available
- Provides more comprehensive data capture
- Invaluable for clip extraction and processing
- Calculate required capacity using tools on Xtralis Security Solutions Support site

### Hard Disk Information and Monitoring

Monitor hard disk status using ADPRO XOa Client software:

#### Access Path
Navigate to **System > Maintenance > Harddisks** to view:
- Operational status of all installed hard disks
- Temperature information
- SMART status

#### Regular Monitoring
- Check **Menu > HDD > General** for generic NVRs
- Monitor "Smart" column for operational status
- Monitor "Temp" column for temperature
- Replace HDDs if status shows "Abnormal" or if not detected

## Audio Configuration

For ADPRO devices supporting audio capabilities, proper port configuration enables audio transmission through Genesis.

### Dedicated Audio Ports

#### Port Requirements
- Specific audio ports must be opened at customer's site
- ADPRO devices typically use audio port **3000**
- Genesis Audio device uses separate configuration

### SIP Audio vs Native ADPRO Audio

#### Important Distinctions
- Genesis supports its own Genesis Audio device
- Different from native audio functions of ADPRO devices
- Ensure correct ports are opened for desired audio communication method
- Two-way audio is supported by SDKs for complex integrations

## Custom Parameters and Advanced Settings

Certain ADPRO device types require specific parameters at the service provider level in Genesis, known as Custom Properties.

:::info Configuration Responsibility
This configuration is typically handled by the onboarding team and is not the responsibility of installers or customers.
:::

### Purpose of Custom Properties

Custom parameters are flexible configuration types that can be enabled for different features across various levels:
- Tenant
- Customer
- Site
- Device
- Cameras

#### Uses
- Setting up base URLs for proxies
- Enabling specific functionalities like event clip recording
- Configuring alarm/event subscriptions for certain devices

### How to Configure Custom Properties

1. Log in to Genesis and navigate to the Configuration App
2. Go to Service Provider Configuration
3. Navigate to "Additional Settings"
4. Click on "Custom property"
5. Click "Add" and provide parameter name and value
6. Click "Save"

### ADPRO-Specific Custom Properties

#### Core ADPRO Parameters
```
AdPro_Device_Custom_baseUrl: https://adproproxy.nxgen.cloud/
AdPro_Device_Custom_webSocketEndPoint: wss://adproproxy.nxgen.cloud/ws/
AdPro_Device_Custom_audioWebSocketEndPoint: wss://adproproxy.nxgen.cloud/ws/
AdPro_Device_Custom_audioCommandEndPoint: https://adproproxy.nxgen.cloud/audioCommand/
```

#### Local Configuration Parameters
```
AdPro_Device_Custom_localNodeUrl: http://localhost:10001/
AdPro_Device_Custom_localStreamUrl: (configurable)
AdPro_Device_Custom_localAudioNodeUrl: http://localhost:1880/audioCommand/
AdPro_Device_Custom_localAudioStreamUrl: ws://localhost:10001/liveAudio/
AdPro_Device_Custom_localStreamMode: JPEG
AdPro_Device_Custom_localAudioMode: device
AdPro_Device_Custom_localStreamSocket: ws://localhost:10001/
```

#### Health Check and Monitoring
```
ADPRO_HEALTH_CHECK: https://adproproxy.nxgen.cloud/health
adpro_objectDetectionUrl: http://localhost:4455/
```

#### ADPRO iFT Gateway Subtype Parameters
For event clip recording functionality:
```
eventClipRecord: True
eventClipRecordAlarmCode: motion.perimeter
```

## Testing and Verification

Thorough testing is essential to verify successful alarm transmission and reception.

### Customer Responsibility for Testing

:::info Important Note
Only the customer can ultimately test alarm reception because they possess the actual monitoring panel or software (DC9 system) that receives the alarms. Genesis's responsibility is to ensure alarms are correctly sent from its platform.
:::

#### DC09 Integration Requirements
Three critical pieces of information needed from the customer:
- Receiver IP address (where Genesis forwards alarms)
- Listening port
- Unique account ID for each site to identify alarm source

### Conducting a Testing Session

Typical testing process involves:
- Request 1-hour session with customer's technical team
- Customer's team confirms successful receipt of alarms from Genesis
- Access to monitoring panel/software required for verification

### Verifying Transmission via ADPRO XO Client Logs

The ADPRO XO client provides log view for checking alarm transmission:

#### Status Messages
- Look for **ATX OK** status messages in logs
- **ATX OK** indicates successful transmission from ADPRO device to Genesis
- If ATX is not OK, signifies problem with alarm transmission from device

### Troubleshooting Site Pulse / Ping Timeout Alarms

#### Issue Identification
If Genesis doesn't receive heartbeats within expected interval:
- Timeout alarm is raised to operator in Talos

#### Rectification
- Verify device is connected to internet or network
- Adjust ADPRO Lifecheck intervals (e.g., from 1 hour to 30 minutes)
- Adjust Genesis Site Pulse duration
- Once connectivity is restored, timeout alarm should automatically restore

## Troubleshooting

This section provides guidance on diagnosing and resolving common issues.

### Device Discovery Issues

#### Confirm Device Support
- Genesis supports ADPRO devices as part of comprehensive integration portfolio
- Ensure specific ADPRO model is compatible with Genesis

#### Network Connectivity Verification
- **VPN vs Public Network:** Determine customer's connection method
- **IP Whitelisting:** Verify Genesis IP addresses are whitelisted on customer's firewall
- **Port Configuration:** Ensure all necessary ports are open and properly configured

#### Device-Specific Configuration in Genesis
- **Credentials:** Verify correct IP Address/Host, Username, and Password
- **Server Unit ID:** Ensure ID is correctly configured and unique within tenant
- **Time Zone:** Confirm Device Time Zone in Genesis matches physical device
- **User Privileges:** Verify user account has necessary administrative privileges

### General Alarm Transmission Troubleshooting

#### Systematic Approach

1. **Device Configuration**
   - Double-check all ADPRO device configurations
   - Ensure unique server unit ID is correctly set and not duplicated

2. **Network Settings**
   - Verify IP addresses, subnets, and gateway settings
   - Ensure proper network connectivity between device and Genesis

3. **Firewall Rules**
   - Ensure customer's firewall and router have necessary NXGEN server IPs whitelisted
   - Verify required ports are open

4. **Logs**
   - Check ADPRO XO client's log view for **ATX OK** status messages

5. **Escalation**
   - Involve customer's IT team for network infrastructure issues
   - Contact NXGEN development team for deeper system diagnostics

### Specific Port Requirements

Different devices and functionalities require specific ports:

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| HTTP | 80 | TCP | Web access |
| HTTPS | 443 | TCP | Secure web access |
| RTSP | 554 | TCP | Video streaming |
| Control | 2000 | TCP | ADPRO control |
| Audio | 3000 | TCP | ADPRO audio |
| Genesis Websockets | 10000-10500 | TCP | P2P streaming |
| Genesis P2P | 14890-14990 | TCP | P2P streaming |

:::warning Important
Genesis only supports unencrypted strings for ADPRO device communication.
:::

### Permissions-Related Issues

If Genesis features are not working, verify the user account has necessary permissions:
- PTZ control
- I/O trigger
- Live streaming
- All required basic permissions

### Additional Troubleshooting Steps

#### Genesis Dashboard Check
- Check notification section for "event count from devices which are not configured in Genesis"
- Device might show up here if sending alarms but not discovered

#### Device Logs Inspection
- Check alarm and event logs directly on device server
- Confirm if events are being generated by device

#### Site Pulse Configuration
- Enable "Site Pulse Configuration" in Genesis
- Allows Genesis to send health checks to device
- Helps diagnose connectivity issues

#### Event Polling Configuration
- Enable "Event Polling" in Genesis if device cannot send events directly
- Allows Genesis to periodically pull events from device

### Escalation Process

#### NXGEN Support
If troubleshooting steps don't resolve the issue, raise a ticket at: https://helpdesk.nxgen.io/portal

#### Required Information for Tickets
- **Subject:** Concise problem summary
- **Description:** Short issue description
- **Product Name:** Always "GENESIS"
- **Priority Level:** Critical, High, Medium, Low
- **Attach File (Optional):** Additional context files

#### Customer's IT Team Consultation
Often necessary to check:
- Network-related settings
- Firewall rules
- Any restrictions affecting alarm transmission

## Integration with Talos and Genesis Workflows

The integration extends beyond simple alarm transmission, involving sophisticated interplay between Genesis and Talos.

### Alarm Flow and Processing

#### Process Flow
1. **Transmission to Genesis:** Alarms generated by ADPRO devices are transmitted to Genesis platform
2. **Genesis Analytics:** Genesis performs analytics on received raw alarm data and video clips
3. **Forwarding to Talos:** Processed outcome is sent to Talos as follow-up alarm

#### Benefits
- Talos receives enriched and verified event data
- Improved accuracy in alarm classification

### Genesis and Talos Workflows

**Talos** is a cloud-based platform for managing alarms and security operations with automation capabilities.

#### Available Workflows

**Arm/Disarm Workflow**
- Triggered by schedules or status changes
- Verifies if arming/disarming action was successful
- Notifies operators if there's a failure

**Test Mode Workflow**
- When site in Talos is set to "test mode," Genesis automatically disarms that site
- Conserves processing resources on Genesis platform
- Prevents unnecessary alarm processing when alarms are not intended for operator action
- Site is re-armed when test mode ends

**Event Overflow Alarm**
- Generated when event overload persists beyond configurable time
- Alerts operators in Talos to potential issues
- Indicates alarms from particular sensor might be discarded due to overload

#### Customization and Flexibility
- Workflows are highly customizable to align with customer procedures
- Site-specific capabilities considered (e.g., removing audio if no loudspeakers)
- **Managed vs Global Workflows:**
  - Global workflows apply to all sites
  - Managed workflows can be assigned to specific sites or groups
  - Managed workflows recommended for most cases

### Data Synchronization between Genesis and Talos

#### Automatic Site Creation
- When site is created in Genesis, site name is automatically created in Talos

#### Site Data Synchronization
- Site data synchronization implemented between platforms
- Updates in Genesis (address, phone, city, country) automatically update in Talos
- Previously only site name was synced

#### Site Templates
- Genesis supports site templates similar to Talos
- "From Template" tab appears when adding site if templates available
- Automatically applies predefined settings like business hours and schedules
- Form validation and required fields mirror Talos for consistency

#### Current Limitations
- Changes made directly in Talos rely on "polling" mechanism for synchronization
- NXGEN working towards Talos implementing direct notification mechanism

## Appendices

### Appendix A: Onboarding Process Overview

The onboarding process for new customers is a structured multi-week process.

#### Week 1: Initial Setup and Data Collection
**Responsibilities:** Sales Team, Tenant Creation by Dhana (NXGEN), Data Collection by CSM Team

**Required Information:**
- Name of the Tenant
- Contact Details (Address, Telephone numbers, email addresses)
- Company Logo
- Administrator User Email
- Operator User emails (optional)
- Confirmation if existing Talos customer or need Talos CMS requirements

**Process:**
- Creating company in Talos (manual process initially)
- Register new company as trial for 30 days
- Generate API token and company ID from Talos integrations
- Configure in Genesis at root level to establish linkage

**Timeline:** 2-4 business days

#### Week 2: Tenant Setup
**Responsibilities:** Device Enablement by NXGEN, Tenant Setup by CSM Team

**Activities:**
- Enable authorized devices
- Configure tenant including device additions and workflow setup
- Configure device details in Genesis (IP address, credentials, ports)
- Set up Lifecheck/Site Pulse
- Ensure necessary analytics are configured on devices

**Timeline:** 3-5 business days

#### Week 3: Training and Follow-Up
**Responsibilities:** Training led by Yves, Follow-up Meeting by CSM Team

**Activities:**
- In-depth system usage training
- Ongoing communication and feedback gathering
- Continual improvement initiatives

**Timeline:** 2 trainings, 2-4 hours each (1 week between trainings)

#### Week 4: Finalization
**Responsibilities:** Sales Team

**Activities:**
- Finalize contractual agreements
- Discuss payment terms
- Smooth transition to full implementation

### Appendix B: Support and Troubleshooting Resources

NXGEN provides comprehensive support resources for effective utilization of the Genesis platform.

#### Help Desk and Ticketing System

**Access:** Users receive invite to set up password after Customer Success Manager adds them to help desk

**Available Resources:**
- Knowledge base access
- Ticket creation capability

#### Priority Levels

| Priority | Description | Response Time |
|----------|-------------|---------------|
| Critical | Complete outage of service | Immediate |
| High | Service severely degraded | Within 2 hours |
| Medium | Service/feature has a problem | Within 24 hours |
| Low | Reporting an issue | Within 48 hours |

#### Internal Issue Handling Process

1. Issues received and documented in Zoho Connect
2. Forwarded to assigned project manager
3. Categorized and prioritized
4. Development input determined
5. Internal meeting held to review customer issues
6. Detailed documentation prepared
7. Communication to R&D for input
8. Project Manager and Tech Lead follow up
9. Review meeting assesses implementation
10. Solution documented on helpdesk
11. Processes refined based on feedback

#### Support Resources

**Official Documentation:**
- [Genesis Documentation](https://workdrive.nxgen.io/writer/open/c27f21972d9d4aa2948b994abd4853746802d)

**ADPRO XO Client Manual:**
- [User Instructions](https://www.scorpionsecurity.co.uk/wp-content/uploads/2019/08/Adpro-XO-User-Instructions.pdf)

**NXGEN Support Portal:**
- [Help Desk](https://helpdesk.nxgen.io/portal)
- [Support Tickets](https://helpdesk.nxgen.io/agent/nxgentechnology/nxgen-technology-ag/tickets/list/all-cases)

---

:::info
This document contains all essential information for successfully configuring ADPRO devices with the Genesis platform. For additional support or clarification on any topic covered in this guide, please refer to the support resources listed in Appendix B or contact NXGEN support directly.
:::