\# GCXONE Knowledge Base: IP Camera Integration Guide

\#\# Overview  
\*\*IP Cameras\*\* are independent surveillance devices designed for high-performance security by transmitting high-definition (HD) video over the internet. Within the \*\*GCXONE\*\* ecosystem, these cameras serve as a cornerstone for real-time monitoring and intelligent alarm management. 

Unlike traditional closed-circuit systems, \*\*GCXONE\*\* integrates with a vast array of IP camera manufacturers (including Axis, Hanwha, and NetVue) to provide a unified, cloud-based security management service (USMS). This integration allows for centralized oversight, reducing the need for on-premise hardware while leveraging AI-powered analytics to filter false alarms.

\---

\#\# Key Functionalities  
When integrated with \*\*GCXONE\*\*, IP cameras support a comprehensive suite of features across different modes:

\#\#\# Cloud Mode Features  
\*   \*\*Discovery:\*\* Automatic detection and addition of cameras and associated sensors once connected.  
\*   \*\*Live Video:\*\* Real-time monitoring of high-definition camera feeds directly through your web browser or mobile app.  
\*   \*\*Playback & Timeline:\*\* Access to archived footage and a chronological view of all recorded data for evidence collection.  
\*   \*\*Advanced Alarm Management:\*\* Notification and handling of security events (e.g., motion or intrusion) with AI-driven classification to distinguish between real threats and false triggers.  
\*   \*\*PTZ & Presets:\*\* Remote control of Pan-Tilt-Zoom functions and the ability to recall predefined camera positions.  
\*   \*\*GCXONE Audio (SIP):\*\* Two-way communication through integrated IP speakers for remote announcements.

\#\#\# Health Monitoring  
\*   \*\*Cloud Polling:\*\* \*\*GCXONE\*\* performs automatic health checks to monitor connectivity, storage, and battery levels.  
\*   \*\*Automated Alerts:\*\* Receive immediate notifications for critical issues like "Black Screen Cameras," "Connection Failures," or "Obstructed Cameras".

\---

\#\# System Architecture Diagram  
The following diagram illustrates the communication flow between the user and the IP hardware:

\`\`\`mermaid  
graph LR  
    A\[User Interface / App\] \--\> B\[GCXONE API Layer\]  
    B \--\> C\[Specialized Device Proxy\]  
    C \--\> D\[IP Camera Hardware\]  
    D \-- Events/Alarms \--\> C  
    C \-- Standardized JSON \--\> B  
    B \-- Notification \--\> A  
\`\`\`  
\*The Proxy Architecture handles device-specific protocols (RTSP, HTTP, SDK) to ensure the core system interacts uniformly with all hardware.\*

\---

\#\# Prerequisites for Integration  
Before beginning the onboarding process, ensure the following requirements are met:

1\.  \*\*Network Connectivity:\*\* The camera must be reachable from the \*\*GCXONE\*\* cloud. For non-VPN setups, an external IP and open ports are required.  
2\.  \*\*Required Ports:\*\*   
    \*   \*\*HTTP/HTTPS (80/443):\*\* For web access and secure communication.  
    \*   \*\*RTSP (554):\*\* Mandatory for real-time video streaming.  
3\.  \*\*User Credentials:\*\* An administrative user account must be configured on the camera for \*\*GCXONE\*\* to perform discovery and configuration tasks.  
4\.  \*\*Time Synchronization:\*\* The camera must be synchronized with an NTP server (e.g., \`time1.nxgen.cloud\`) to ensure accurate event timestamps.  
5\.  \*\*IP Whitelisting:\*\* Whitelist \*\*GCXONE\*\* Primary Gateway (\`18.185.17.113\`) and Secondary Gateway (\`3.124.50.242\`) on your firewall.

\---

\#\# Step-by-Step Onboarding Process

\#\#\# 1\. Register the Device in GCXONE  
1\.  Log in to the \*\*GCXONE\*\* platform and navigate to the \*\*Configuration App\*\*.  
2\.  Select the appropriate \*\*Site\*\* and click the \*\*Devices\*\* tab.  
3\.  Click the \*\*Add\*\* button and select the correct camera type (e.g., Axis, Hanwha, or generic IP Camera).  
4\.  Enter the \*\*Mandatory Details\*\*:  
    \*   \*\*Name:\*\* A custom name (e.g., "Main Entrance").  
    \*   \*\*IP Address / Host:\*\* The reachable network address.  
    \*   \*\*Username & Password:\*\* Administrative credentials.  
    \*   \*\*Ports:\*\* Verify Control and RTSP ports match your hardware settings.  
5\.  Click \*\*Discover\*\*. \*\*GCXONE\*\* will automatically identify and add associated sensors.  
6\.  Click \*\*Save\*\*.

\#\#\# 2\. Configure Event Forwarding  
To receive alarms, you must configure the camera to "Notify Surveillance Center". Many modern IP cameras use a \*\*Webhook Callback\*\* mechanism:  
1\.  Obtain the unique \*\*Device ID\*\* from the \*\*GCXONE\*\* device settings.  
2\.  In the camera's web interface, add a new \*\*Recipient\*\* or Webhook.  
3\.  Enter the URL provided in the device documentation (e.g., \`https://\[proxy\].nxgen.cloud/eventIngest/\`).  
4\.  Set the authentication to \*\*Basic\*\* using the \*\*Device ID\*\* as both username and password.

\---

\#\# Device Optimization Techniques  
\*   \*\*Continuous Recording:\*\* It is highly recommended to set cameras to continuous recording to ensure a complete dataset is available for analysis.  
\*   \*\*Smart Events:\*\* Prioritize "Smart Events" (e.g., Intrusion Detection or Line Crossing) over basic motion detection to reduce system overload and false alerts.  
\*   \*\*Quad Alarm View:\*\* For video events, select the "Quad Alarm" view style. This enables the camera to send three critical images (pre-alarm, current, and post-alarm) for more accurate AI processing.

\---

\#\# Troubleshooting Common Issues

| Issue | Possible Cause | Resolution |  
| :--- | :--- | :--- |  
| \*\*No Alarm Transmission\*\* | Missing "Notify Surveillance Center" check | Ensure the camera is configured to push events to the registered center. |  
| \*\*No Video Stream\*\* | Blocked RTSP port | Verify Port 554 is open and forwarded correctly in the router. |  
| \*\*Incorrect Timestamps\*\* | Time Zone Mismatch | Sync the camera to an NTP server and ensure the zone matches the \*\*GCXONE\*\* site settings. |  
| \*\*Device Offline\*\* | Network Disruption | Check physical connections and power supply (UPS recommended). |

\*\*\*

# **GCXONE Knowledge Base: Alarm Panel Integration Guide**

## **Overview**

**Alarm Panels** (also known as intrusion panels) are the central hubs of security systems that monitor sensors like door contacts, motion detectors, and glass-break sensors. By integrating these panels with **GCXONE**, you transform standard security alerts into **AI-verified events**, reducing false positives by approximately **80% to 95%** and ensuring a streamlined response through a single cloud interface.

**GCXONE** supports a wide range of panels, including modern cloud-based systems like **AJAX** and specialized wireless systems like **Reconeyez**, as well as legacy panels using the **DC09 (SIA)** protocol.

---

## **System Architecture**

The integration usually follows a dual-path communication flow. The raw alarm data is sent to the monitoring station via the **DC09/SIA** interface, while visual data (if the panel has camera capabilities) is pushed to **GCXONE** for AI analysis.

graph TD  
    A\[Alarm Panel Hardware\] \--\>|SIA/DC09 Alarm| B(Talos CMS)  
    A \--\>|Alarm Images/Clips| C(GCXONE Cloud)  
    B \--\>|Webhook Trigger| C  
    C \--\>|AI Analysis Result| B  
    B \--\>|Verified Alert| D\[Security Operator\]

*Note: GCXONE acts as the intelligence layer, analyzing images and returning "Real" or "False" classifications to the operator.*

---

## **Prerequisites for Integration**

Before beginning the onboarding process, ensure you have the following critical information from your service provider:

1. **Receiver IP Address:** The endpoint where the panel will send signals.  
2. **Listening Port:** Usually port **10000** for DC09 or specific vendor ports.  
3. **Account ID:** A unique 8-digit identifier for each site.  
4. **Encryption Key:** If the panel supports encrypted transmission (highly recommended).  
5. **Administrative Access:** Access to the panel's native mobile app or desktop software.

---

## **Integration Guide: AJAX Systems**

**AJAX** integration involves an approval process and a cloud-to-cloud connection.

### **1\. Granting Access to GCXONE**

* Login to the **AJAX Pro Desktop** application.  
* Navigate to your company settings and send an invitation to the **GCXONE** authorized account (`ajax@nxtn.io`).  
* Notify the **GCXONE** support team to approve the request for your specific **Hub ID**.

### **2\. Configuring the Hub**

* In the **AJAX** application, go to **Hub Settings** \> **Monitoring Station**.  
* Select **SIA (DC-09)** as the protocol.  
* Enter the **Primary IP Address** and **Port** provided by the **GCXONE** team.  
* Enable **"Connect on demand"** and **"Transfer group name"** to ensure individual sensors are identified correctly in the **GCXONE** dashboard.

---

## **Integration Guide: Reconeyez PIR Cams**

**Reconeyez** panels are battery-operated systems that prioritize power conservation and event-driven capture.

### **1\. Enable Image Transmission**

* Configure the panel within the **Reconeyez portal**.  
* Contact **Reconeyez support** to request an image push to the **GCXONE FTP server**.

### **2\. Configure SIA Alarms**

* Add the **Reconeyez** device in the **GCXONE Configuration App** using the device's **Serial Number**.  
* Set the **SIA DC-09** receiver details in the **Reconeyez** portal to point to the **GCXONE Alarm Receiver Gateway**.

---

## **AI Verification Workflow**

When an alarm is triggered (e.g., an AJAX PIR Cam takes 3-5 quick photos), the following occurs:

1. **Reception:** The raw event lands in the **Talos CMS**.  
2. **AI Analysis:** A workflow automatically sends the associated images to the **GCXONE AI Engine**.  
3. **Classification:** The AI scans for human or vehicle activity. If it identifies a person, it marks a **bounding box** on the image.  
4. **Reporting:** If classified as **"False"** (e.g., caused by a tree leaf or animal), the alarm can be automatically closed without distracting the operator.

---

## **Optimization and Troubleshooting**

| Issue | Possible Cause | Resolution |
| ----- | ----- | ----- |
| **No Alarms in GCXONE** | Missing "Notify Surveillance Center" | Ensure this checkbox is enabled for every rule on the panel. |
| **Images Not Matching Alarms** | Incorrect Alarm ID mapping | Verify the **Alarm Shot ID** is being passed correctly in the webhook payload. |
| **All Alarms on One Camera** | "Transfer Group Name" disabled | Enable this setting in the AJAX Hub to see individual sensor channels. |
| **Duplicate Alerts** | Redundancy Timer too low | Adjust the **Redundancy Timer** (default 30s) in **GCXONE** custom settings. |

### **Best Practices**

* **Photo Settings:** For battery-operated panels like **Reconeyez**, configure the device to take **three photos** with a 500ms interval at **medium quality** to optimize both battery life and AI accuracy.  
* **Site-to-Site VPN:** For maximum security, use a **VPN tunnel** (OpenVPN or IPsec) to connect the panel network to the **GCXONE** cloud, eliminating the need for public IP exposure.

---

**Analogy:** An **Alarm Panel** is like the nervous system of a building. The sensors are the fingertips that feel a touch (motion), and the panel is the spinal cord that sends the signal. **GCXONE** acts as the brain; it looks at the signal, opens its "eyes" (cameras), and decides if the touch was a friendly tap or a dangerous strike before telling the "muscles" (operators) to react.

# **GCXONE Knowledge Base: IoT Sensor Integration Guide**

## **Overview**

**GCXONE** has evolved from a cloud-based video surveillance solution into a comprehensive **Unified Security Management Service (USMS)** that fully integrates **IoT (Internet of Things) functionality**. IoT sensors within the GCXONE ecosystem include a wide array of devices such as **temperature probes, motion detectors, and environmental sensors** (e.g., door contacts or humidity monitors).

Unlike high-bandwidth video devices, these sensors are primarily used for **dashboard data visualization and event polling** rather than continuous streaming. They provide critical real-time insights into the health of a site, from monitoring industrial battery voltages to tracking the physical movement of assets.

---

## **Core Functional Capabilities**

Integrated IoT sensors provide three primary layers of security and data management:

* **Real-time Monitoring:** Data points (such as voltage or temperature) are displayed on custom, interactive dashboards that refresh periodically.  
* **Asynchronous Event Handling:** Using lightweight protocols like **MQTT**, sensors publish status changes to a central broker, which GCXONE then processes into actionable alerts.  
* **Intelligent Data Filtering:** Because many IoT devices (like solar chargers) send data fluctuations every second, GCXONE uses **Custom Alarm Rules** to filter "noise" and only notify operators when thresholds are breached.

---

## **System Architecture Diagram**

The following diagram illustrates how IoT data flows from the physical hardware to the GCXONE dashboard:

graph TD  
    A\[IoT Hardware: Temp/Motion/Power\] \--\>|HTTP API / Webhooks| B(GCXONE Cloud Entry Point)  
    B \--\> C{MQTT Message Broker}  
    C \--\>|Topic Subscription| D\[Device Specific Proxy\]  
    D \--\> E\[Custom Alarm Rule Filter\]  
    E \--\> F\[GCXONE Management Dashboard\]  
    E \--\> G\[Talos CMS / Operator Alert\]

*Note: This architecture allows the system to handle devices without static public IPs through reverse communication to the cloud DNS.*

---

## **Supported IoT Solutions**

GCXONE currently supports several major categories of IoT hardware:

### **1\. Environmental and Motion Sensors**

* **Door & Window Contacts:** Used to detect unauthorized entry via digital inputs.  
* **Passive Infrared (PIR):** Battery-powered sensors that track thermal signatures to detect human or vehicle movement.  
* **Temperature Sensors:** Used for monitoring sensitive environments like server rooms or refrigerated storage.

### **2\. Specialized IoT Systems**

* **Victron Energy Systems:** Monitored for **battery voltage, PV charger state, and daily solar yield**.  
* **Teltonika Routers & Trackers:** Provide network connectivity data and environmental monitoring, including **unplug detection, towing detection, crash detection, and geofencing**.  
* **I/O Modules:** Standalone units (like Advantech ADAM or Phoenix Contact) that provide extra inputs/outputs for lights, sirens, or barriers.

---

## **Onboarding and Configuration**

### **1\. Basic Device Addition**

1. Navigate to the **Configuration App** in GCXONE.  
2. Select the **Site** and click the **Devices** tab.  
3. Click **Add** and select the appropriate device type (e.g., **Teltonika-IOT** or **Victron**).  
4. Enter the **Serial Number, Username, and Password** for the device.

### **2\. Setting Custom Alarm Rules**

For IoT devices that generate high-frequency data, you must configure a filter rule in the **Additional Property** section. This prevents the system from triggering an alarm for every minor decimal change.

* **Example:** A rule can be set to trigger an alarm only if a battery drops below **12.7V** and restore it once it clears that threshold.

### **3\. Webhook Integration**

For devices like Teltonika, you must manually feed the **GCXONE Custom Receiver URL** into the hardware's local interface. This ensures the hardware knows exactly where to "push" its data messages.

---

## **Best Practices for Optimization**

* **Event Polling Interval:** Set a customizable time interval (e.g., every 10 seconds for map updates) to balance real-time awareness with network load.  
* **Unique Server Unit IDs:** Ensure every IoT device within a tenant has a **unique identifier** to prevent alarm misattribution.  
* **Unified Hierarchies:** Organize sensors within the **Tenant → Customer → Site → Device** structure to allow for bulk management and inherited settings.

---

**Analogy:** An IoT sensor is like a **security guard’s walkie-talkie** compared to the high-definition video of a camera. It doesn't show you the full "movie" of what is happening, but it provides instant, low-cost "status reports" (like "the door is open" or "the power is out") that tell the rest of the system when it's time to pay attention.

This comprehensive guide details the **GCXONE** (formerly Genesis) platform’s capabilities regarding system health, diagnostics, performance tracking, and administrative management. **GCXONE** is a cloud-based Software as a Service (SaaS) platform that unifies video surveillance and IoT management into a single interface.

---

# **Part 1: Real-Time Health Monitoring**

### **1\. Device Health Status Dashboard**

The **GCXONE** main dashboard provides a real-time, high-level overview of the operational status of all integrated hardware.

* **Visual Representation:** The system utilizes a "tile" system where each tile represents a hardware component (NVR, camera, or sensor).  
* **Color Coding:**  
  * **Green:** All systems are normal and functioning correctly.  
  * **Yellow/Orange:** The component requires attention or has a minor issue, such as a rule violation or partial connectivity loss.  
  * **Red:** Critical failure, such as a disconnected device or a major system error.  
* **Metric Visibility:** The dashboard tracks the total number of customers, sites, devices, and active sensors (e.g., a sample system showing 715 active sensors). It also visualizes the ratio between **Real Alarms**, **False Alarms**, and **Technical Alarms** through interactive pie charts and trend graphs.

### **2\. Connectivity Monitoring**

**GCXONE** provides continuous monitoring of camera availability and network performance.

* **Automated Polling:** The system periodically attempts to access the live stream of every camera to ensure it is reachable and functioning.  
* **Network Path Tracking:** For non-VPN setups, **GCXONE** monitors external IPs and forwarded ports (e.g., RTSP port 554). In VPN environments, the system monitors internal IP segments through secure side-to-side tunnels.  
* **Connectivity Failure Reporting:** If a connection fails for more than 5 minutes, the device is flagged with a "Connection Failure" icon on the supervision dashboard.

### **3\. Heartbeat Detection (`ping.primary`)**

The platform utilizes a "Heartbeat" or "Site Pulse" signal to maintain a constant awareness of device status.

* **Pulse Intervals:** Devices are typically configured to send a pulse every 30 to 60 minutes.  
* **Timeout Mechanism:** If **GCXONE** does not receive a pulse within the configured window, it triggers a `ping.timeout` or `ping.notreachable` alarm in the **Talos CMS**.  
* **Optimization:** To avoid false alarms, it is recommended to set the **GCXONE** Site Pulse duration slightly higher than the device's internal heartbeat interval (e.g., if the device pulses every 30 minutes, **GCXONE** should check for a timeout at 60 minutes).

### **4\. Device Status Indicators**

Beyond color-coded tiles, **GCXONE** uses specific icons to provide detailed health feedback:

* **Green/Red Shield:** Indicates whether a camera passed or failed its most recent health check.  
* **Live Viewer Icons:** These include indicators for **Recording** (red dot), **Audio Status** (speaker icon), and **Active Alarms** (bell icon).  
* **System Status Overlays:** On the "Video Activity Search" page, icons distinguish between human detection, vehicle detection, or uninteresting motion.

### **5\. Multi-Site Health Overview**

For service providers, **GCXONE** aggregates health data across the entire hierarchy.

* **Tenant-Level Insights:** Administrators can see site-level video alarm contributions across all customers in their tenant.  
* **Global Schedulers:** A dedicated "Analytics Scheduler" tab allows managers to view all active health check schedulers across the Service Provider hierarchy, preventing redundant analytics jobs and optimizing processing loads.

graph TD  
    A\[GCXONE Global Dashboard\] \--\> B\[Customer A Group\]  
    A \--\> C\[Customer B Group\]  
    B \--\> D\[Site 1: Green/Healthy\]  
    B \--\> E\[Site 2: Red/Offline\]  
    E \--\> F\[Automated Failure Workflow triggered\]

---

# **Part 2: Device Diagnostics**

### **6\. System Diagnostics**

**GCXONE** provides deep-level diagnostics to troubleshoot hardware failures:

* **One-Click Collection:** For certain hardware like Uniview, the system allows a "One-Click Collect" of NVR and camera diagnosis information, including operation logs for a specified number of days.  
* **Crash Reporting:** The platform can generate crash reports and core dumps to investigate software errors or hardware hangs.

### **7\. Connection Quality Metrics**

Technical administrators can monitor specific connection statistics to ensure smooth video delivery:

* **Packet Loss & Latency:** Users can test network delay and packet loss by sending pings from the NVR to the **GCXONE** cloud.  
* **Stream Information:** Real-time data including **bitrate**, **frame rate (FPS)**, and **resolution** are accessible via the window toolbar.

### **8\. Event Reception Rate**

**GCXONE** monitors the flow of incoming events to detect anomalies:

* **Event Overflow:** If a device sends more than 25 alarms in 5 minutes (a configurable threshold), the system triggers an **Event Overflow Alarm** and may temporarily block that device to protect platform stability.  
* **Log Inconsistency:** Technicians compare **GCXONE** dashboard counts against the physical device's log (e.g., a Dahua NVR log) to find gaps where alarms were detected but not transmitted.

### **9\. Device Logs & History**

Historical logs are maintained for auditing and forensic investigation:

* **Audit Tab:** Tracks every action taken by users (e.g., "Mic ON," "Device Details Updated," "Login").  
* **Receiver Logs:** Displays the raw "payload" of incoming messages (e.g., SIA-DC09 packets) to verify that a device is correctly pushing events.  
* **Data Retention:** Logs and dashboard history are typically retained for up to 90 days upon request.

---

# **Part 3: Performance Monitoring**

### **10\. Video Stream Quality Monitoring**

**GCXONE** ensures video quality through multiple monitoring layers:

* **Adaptive Streaming:** The platform automatically selects the best stream resolution (Main vs. Sub) based on the size of the viewing window to optimize client CPU and bandwidth.  
* **Video Diagnostics Overlay:** Level 2 diagnostics can be enabled to show current resolution and bitrate directly on the video feed.

### **11\. Storage Capacity Monitoring**

The platform monitors the health of on-premise recording disks:

* **S.M.A.R.T. Technology:** **GCXONE** reads S.M.A.R.T data to check disk head, platter, and motor health, alerting users to imminent failures.  
* **Capacity Alerts:** The dashboard displays "Disk Free Space" and triggers an alarm when storage is full or corrupted.

### **12\. CPU & Memory Utilization**

Administrators can monitor the load of the cloud-based proxies and on-premise servers:

* **Threshold Monitoring:** If CPU or memory usage on a server exceeds defined limits (e.g., 75% for general apps or 40% for specific AI engines), tiles on the health dashboard turn yellow or red.  
* **Resource Balancing:** **GCXONE** uses Horizontal Pod Autoscaling (HPA) to spin up additional microservice instances during peak load times.

### **13\. Temperature & Environmental Monitoring**

For IoT-integrated devices (like Teltonika or thermal cameras), **GCXONE** monitors environmental factors:

* **Thermal Alarms:** High CPU or motherboard temperatures on the NVR will trigger an abnormality alert.  
* **IoT Dashboards:** Display parameters like battery voltage, PV charger state, and solar yield, with rules to trigger alarms if voltage drops below a threshold (e.g., 12.7V).

### **14\. Bandwidth Usage Tracking**

Bandwidth is managed to prevent network saturation:

* **Traffic Logs:** Real-time incoming and outgoing bandwidth usage is displayed for each network adapter \[3981, 13.2.5\].  
* **Optimization:** In low-bandwidth scenarios, the platform uses **GreenStream** or secondary RTSP profiles to maintain video fluency.

---

# **Part 4: Alerts & Notifications**

### **15\. Device Offline Alerts**

When a device loses connection, an automated notification chain begins:

* **System Failure Workflow:** If a device remains unreachable (e.g., no `ping.primary`) for 30 minutes, an alarm is forwarded to an operator to initiate a technical response \[859, 13.2.3\].  
* **Push Notifications:** Alerts can be sent directly to the **GCXONE** mobile app or via email to site managers.

### **16\. Health Alert Rules**

Custom rules define the logic for health notifications:

* **Violation Alarms:** Rules can be set to trigger a "Passive Violation" if a site is not armed according to its schedule.  
* **Redundancy Filtering:** To prevent "alarm flooding," a redundancy timer (default 30 seconds) ensures that multiple identical alarms from the same sensor are grouped or discarded.

### **17\. Proactive Maintenance Alerts**

**GCXONE** utilizes "Advanced" health check modes to predict issues before they cause a total outage:

* **AI-Scene Analysis:** The system uses analytics to detect blurred lenses, lens obstructions (e.g., dirt or spider webs), and camera angle deviations.  
* **Maintenance Strategy:** This is a **predictive** approach, alerting technicians that a camera's quality is degrading, rather than waiting for it to go offline.

---

# **Part 5: Configuration & Management**

### **18\. Remote Device Configuration**

**GCXONE** allows for remote management of various device settings:

* **I/O Control:** Operators can remotely activate digital outputs (e.g., opening gates, turning on lights) directly from the map or dashboard.  
* **Parameter Sync:** Time zone synchronization and some local parameter settings can be pushed from the cloud to the device.

### **19\. Firmware Version Management**

The platform helps maintain a secure and updated fleet:

* **Version Tracking:** The dashboard displays the current firmware version of all discovered devices and their last update timestamp.  
* **Upgrade Alerts:** Users are notified when a new firmware version is detected on the network, allowing for remote upgrades via the **GCXONE** interface.

### **20\. Device Registration & Onboarding**

The onboarding process is standardized across device types:

1. **Selection:** Choose the device type (e.g., Dahua, Hikvision, ADPRO) from the catalog.  
2. **Authentication:** Enter IP/Host, Username, Password, and required ports (Control, RTSP, etc.).  
3. **Discovery:** Click the **Discover** button. **GCXONE** automatically scans for associated sensors and I/O channels.  
4. **Registration:** The system automatically registers **GCXONE** as the "surveillance center" on the hardware to enable alarm pushing.

### **21\. Device Grouping & Organization**

Efficiency in large systems is managed through a strict hierarchy:

* **Tenants:** Isolate customer data and organizational settings.  
* **Customer Groups:** Allow for organizing multiple clients for bulk management and specific access level permissions.  
* **Sites & Groups:** Logical groupings of cameras by physical location, allowing administrators to apply uniform arming schedules and workflows to hundreds of sensors at once.

---

**This comprehensive guide details the advanced reporting, troubleshooting, and core processing capabilities of GCXONE (formerly Genesis), designed for security professionals and system administrators managing a unified cloud ecosystem.**

---

# **Part 1: Reporting & Analytics**

### **Device Health Reports & Activity Analytics**

**GCXONE provides high-level transparency into system performance through automated and on-demand reporting. Users can generate detailed Health Reports that summarize the status of every sensor across a tenant.**

* **Health Check Modes: Reports are driven by three distinct modes: Basic (reactive monitoring of valid images), Plus (proactive scheduled checks with snapshots), and Advanced (predictive analytics for blur, low light, and angle deviation).**  
* **Customization: Report templates (e.g., Alarm Listing, Workflow Event Log) can be tailored using Angular-based code to focus on specific data points like burglary alarms or specific site locations.**  
* **Data Inflow/Outflow: Analytics dashboards visualize "Inflow vs. Outflow" trends, allowing administrators to see how many alarms were received and how many were successfully processed by operators.**

### **Uptime & Historical Performance Trends**

**The platform tracks uptime through a sophisticated Site Pulse mechanism.**

* **Availability Metrics: GCXONE performs periodic health checks, marking cameras as "Healthy" (Green) or "Critical" (Red). Historical logs retain these statuses for up to 90 days, providing a clear record of long-term hardware reliability.**  
* **Dashboard Visualizations: Metrics are presented via pie charts showing customer-level video alarm contributions and line graphs tracking real versus false alarms over 24-hour or weekly intervals.**

**graph LR**

    **A\[Raw Alarm Inflow\] \--\> B{GCXONE AI Engine}**

    **B \-- Real \--\> C\[Operator Queue\]**

    **B \-- False \--\> D\[Filtered/Archived\]**

    **C \--\> E\[Performance Metrics Dashboard\]**

    **D \--\> E**

---

# **Part 2: Troubleshooting & Support**

### **Automated Troubleshooting & Investigation**

**GCXONE standardizes the troubleshooting process for technical issues like No Alarm Transmission. A systematic multi-step investigation is used to resolve breakdowns in the communication path.**

1. **Dashboard Log Review: Technicians first verify the device dashboard logs within GCXONE to confirm if the hardware is actively sending events.**  
2. **Network Validation: Connectivity is checked by verifying if required ports (e.g., HTTPS 443, RTSP 554, Control 8000\) are open and active (Green status).**  
3. **Event Polling: For devices incapable of pushing direct events, administrators must ensure the Event Polling toggle is enabled to allow GCXONE to pull data at set intervals.**

### **Connection Troubleshooting & Recovery**

**For devices experiencing frequent Ping Timeouts, GCXONE recommends aligning the "Site Pulse Time" slightly higher than the device's internal heartbeat interval to prevent false-positive technical alarms.**

* **One-Click Collection: For certain NVR types, GCXONE supports a "One-Click Collect" feature that gathers diagnosis information and operation logs for up to 14 days, providing R\&D teams with the necessary data to solve complex software errors.**  
* **Device Reset: Remote reboot commands can be initiated directly through the GCXONE interface for supported hardware, allowing for remote recovery without site visits.**

---

# **Part 3: Core Processing (The Alarm Queue)**

### **Real-Time Alarm Queue & Prioritization**

**The Talos CMS serves as the central hub where operators manage the real-time alarm buffer.**

* **Event Grouping: GCXONE groups related alarms (e.g., a motion sensor trigger and a door contact breach) into a single Event to provide operators with comprehensive context.**  
* **Severity Routing: Alarms are sorted by priority (e.g., Burglary alarms appear above Motion alerts) or by time (Newest vs. Oldest).**  
* **Workspaces: Operators can be assigned to specific "Workspaces" to route high-priority alarms to specialist teams or specific language-speaking staff.**

### **Alarm Verification & Filtering (AI Engine)**

**The core value of GCXONE is its AI-powered false alarm filtering, which reduces the volume of alerts by approximately 80% to 95%.**

* **The Verification Process: When an alarm occurs, GCXONE extracts three critical images (pre-alarm, current, and post-alarm) or a video clip. The AI engine classifies the object (Human or Vehicle) and places a bounding box around the threat.**  
* **Automated Filtering: If the AI determines an alarm is "False" (e.g., caused by shadows or animals), it can be automatically closed without operator intervention.**

---

# **Part 4: Routing & Escalation**

### **Alarm Routing & Escalation Rules**

**GCXONE utilizes customizable Workflows to define exactly how an alarm travels through the system.**

* **Routing Logic: Alarms can be routed based on the Alarm Code, Zone, Schedule, or even a regular expression in the data payload.**  
* **Stale Alarm Escalation: Administrators can configure rules to automatically notify managers via Email or SMS if an alarm remains in the queue for too long (e.g., \>5 minutes) without operator action.**  
* **Autofeed: This feature automatically assigns matching alarms to available operators based on their expertise or current workload, preventing bottlenecks.**

### **Multi-Site Alarm Management**

**For large-scale operations, sites are organized into Site Groups or Organizational Units. This allows a single "Managed Workflow" to be applied to hundreds of sites simultaneously, ensuring standardized security responses across an entire enterprise.**

**graph TD**

    **A\[Alarm Triggered\] \--\> B{Automated Workflow?}**

    **B \-- Yes \--\> C\[AI Filtering / Logic\]**

    **B \-- No \--\> D\[Manual Workflow\]**

    **C \-- Real \--\> D**

    **D \--\> E\[Operator Action\]**

    **E \-- Stale \--\> F\[Escalation to Manager\]**

---

# **Part 5: Analytics & SLA Monitoring**

### **SLA Monitoring & Metrics**

**GCXONE is designed to guarantee high-speed processing. The platform typically enforces a Service Level Agreement (SLA) where alarms are processed within 60 to 90 seconds.**

* **Default to Real: If the AI engine is unable to classify an alarm within the SLA window (e.g., due to poor image quality), the system defaults to forwarding it as a "Real Alarm" to ensure human oversight.**  
* **Alarm History: The Video Activity Search application allows for long-term auditing of every event received by the CMS, with options to filter by date, site, or device.**

---

# **Part 6: Optimization & Training**

### **False Alarm Management & Best Practices**

**To maintain a clean monitoring environment, GCXONE recommends the following best practices:**

* **Prioritize Smart Events: Users should configure IVS (Intelligent Video Surveillance) events like Line Crossing or Intrusion Detection rather than basic motion detection to avoid "alarm floods".**  
* **Redundancy Timers: A default 30-second redundancy timer groups identical alarms from the same sensor to prevent multiple operators from working on the same incident.**  
* **Continuous Recording: Configuring devices for Continuous Recording ensures that the AI engine always has sufficient context to extract necessary frames for accurate classification.**

### **Operator Training & Journey**

**The Operator Journey is streamlined through a three-screen setup: CMS Queue, Video Viewer, and Map.**

* **Situational Awareness: The map interface highlights the exact camera that generated an event, while the video viewer displays the Quad View (pre-alarm images) to show the operator what happened *before* they arrived at the screen.**  
* **Standardized Responses: Operators follow step-by-step instructions within the workflow (e.g., "Initiate Audio Announcement" \-\> "Dispatch Guard") to ensure consistent handling of every incident.**

---

**This training guide is designed to provide operators with a comprehensive understanding of the \*\*GCXONE\*\* (formerly Genesis) ecosystem, specifically focusing on the integration with the \*\*Talos CMS\*\* for professional security monitoring.**

**\---**

**\# \*\*GCXONE Operator Training: Master Guide\*\***

**\#\# \*\*Introduction: The Operator’s Mission\*\***

**An operator in the \*\*GCXONE\*\* environment is the frontline defense for monitored sites. The goal is to provide \*\*real-time situational awareness\*\*, verify the authenticity of alarms using AI-powered analytics, and initiate appropriate interventions. \*\*GCXONE\*\* streamlines this process by reducing false alarms by approximately \*\*80% to 95%\*\*, allowing you to focus on genuine threats.**

**\---**

**\#\# \*\*1. The Operator Interface: The "Three-Screen" Philosophy\*\***

**To maximize efficiency, a standard \*\*GCXONE\*\* workstation should ideally utilize three screens:**

**1\.  \*\*Talos CMS (Alarm Receiving Screen):\*\* This is your main hub where incoming alarms land in a central buffer. Here, you assign, manage, and close events.**

**2\.  \*\*Video Viewer (Salvo View):\*\* The control center for live streaming and recorded playback. It automatically syncs with the alarm you are currently handling.**

**3\.  \*\*Map Screen:\*\* Provides a geographical representation of monitored sites. It highlights the exact camera that triggered the alarm to give you immediate context of the site layout.**

**\---**

**\#\# \*\*2. Understanding Alarms vs. Events\*\***

**In \*\*GCXONE\*\*, precision in terminology is vital for accurate reporting:**

**\*   \*\*Alarm:\*\* A single notification from a specific device (e.g., a "Line Crossing" detection from Camera 1).**

**\*   \*\*Event:\*\* A logical grouping of related alarms. For example, if a motion sensor triggers at the same time a door contact is breached, \*\*GCXONE\*\* groups them into one \*\*Event\*\* to provide you with the full context of the incident.**

**\#\#\# \*\*Prioritization and Severity\*\***

**Alarms are sorted in the queue by \*\*priority\*\* (e.g., Burglary alarms appear above Motion alerts) or by \*\*timestamp\*\*. High-severity alarms are color-coded to ensure they are addressed immediately.**

**\---**

**\#\# \*\*3. The Operator Journey: Step-by-Step Handling\*\***

**\#\#\# \*\*Step 1: Assignment\*\***

**Alarms land in the "Unassigned" buffer. You can manually take an alarm by clicking \*\*"Assign to Me"\*\* or dragging it into your column. In busy environments, the \*\*"Auto-feed"\*\* feature may be enabled to automatically push high-priority alarms directly to your screen based on your availability.**

**\#\#\# \*\*Step 2: Verification (The Power of "Quad View")\*\***

**Once an event is assigned, the \*\*Video Viewer\*\* will automatically open the relevant feed.**

**\*   \*\*The Quad View:\*\* For video events, the system displays three critical images: \*\*Pre-Alarm\*\*, \*\*Current-Alarm\*\*, and \*\*Post-Alarm\*\*.**

**\*   \*\*AI Bounding Boxes:\*\* If the AI has classified the object, you will see a blue (tracked) or red (alarm) bounding box around the person or vehicle, confirming why the system flagged the event.**

**\*   \*\*Live & Archive:\*\* You can toggle to \*\*Live View\*\* to see what is happening now or use the \*\*Timeline\*\* to scrub through the archive for further evidence.**

**\#\#\# \*\*Step 3: Following the Workflow\*\***

**Every alarm triggers a \*\*Workflow\*\*—a predefined sequence of steps that guides your response.**

**1\.  \*\*Initial Assessment:\*\* Is the alarm real or false?**

**2\.  \*\*Audio Deterrence:\*\* If the site has IP speakers, use the \*\*GCXONE Audio (SIP)\*\* tool to make a live announcement (e.g., "You are being monitored. Leave the premises immediately.").**

**3\.  \*\*Intervention:\*\* If the intruder persists, the workflow will prompt you to call a \*\*Keyholder\*\*, \*\*Guard Service\*\*, or the \*\*Police\*\*.**

**4\.  \*\*Parallel Actions:\*\* Some workflows run automated actions in the background, such as sending an SMS to the site owner or triggering a digital output to turn on site lights.**

**\#\#\# \*\*Step 4: Closure and Documentation\*\***

**After the threat is resolved, you must close the workflow.**

**\*   \*\*Classification:\*\* Mark the alarm as \*\*Real\*\*, \*\*False\*\*, or \*\*Technical\*\*.**

**\*   \*\*Reporting:\*\* Write a concise log of your actions. This data is stored in the \*\*Audit Logs\*\* and is vital for client billing and legal evidence.**

**\---**

**\#\# \*\*4. Advanced Operational Tools\*\***

**\#\#\# \*\*Isolation vs. Disarming\*\***

**\*   \*\*Disarming:\*\* A permanent state until manually changed. Used for sites following a strict arming schedule.**

**\*   \*\*Isolation:\*\* A temporary suspension of monitoring for a specific duration (e.g., 30 minutes to 8 hours). Use this when a technician is on-site or during a planned delivery. \*\*GCXONE\*\* will automatically "re-arm" the sensor once the timer expires.**

**\#\#\# \*\*Test Mode\*\***

**When a site is undergoing maintenance, put it in \*\*Test Mode\*\* within Talos. This ensures alarms are logged but do not pop up in your active queue, preventing unnecessary distraction.**

**\#\#\# \*\*Parking Alarms\*\***

**If you are waiting for a callback from the police or a site owner, you can \*\*"Park"\*\* the alarm. It will disappear from your active window and return automatically after a set time (e.g., 15 minutes).**

**\---**

**\#\# \*\*5. Shift Responsibilities\*\***

**\*   \*\*Night Shift:\*\* Primary focus is on \*\*critical alarms\*\* that threaten life or property (Burglary, Fire, Panic). Technical issues are typically parked for the day shift unless they compromise the security of the entire site.**

**\*   \*\*Day Shift:\*\* Primary focus is on \*\*technical health\*\*, performing maintenance, adjusting schedules, and onboarding new sites.**

**\---**

**\#\# \*\*6. Best Practices for High Performance\*\***

**\*   \*\*SLA Compliance:\*\* \*\*GCXONE\*\* aim to process every alarm within \*\*60 to 90 seconds\*\*. Speed and accuracy are the primary metrics of your success.**

**\*   \*\*Visual Verification First:\*\* Always verify via video before dispatching expensive emergency services to avoid "false alarm" fines for your clients.**

**\*   \*\*Check the Heartbeat:\*\* If you see a \*\*Ping Timeout\*\* or \*\*Connection Failure\*\* alarm, it means the device cannot reach the cloud. Report this to the IT Admin immediately.**

**\---**

**\#\# \*\*System Architecture Overview (Operator Perspective)\*\***

**\`\`\`mermaid**

**graph TD**

    **A\[Hardware Sensor\] \--\>|Trigger| B(GCXONE Cloud)**

    **B \--\>|AI Analytics| C{Is it a Person/Vehicle?}**

    **C \-- No \--\> D\[Filtered / False Alarm\]**

    **C \-- Yes \--\> E\[Talos CMS Queue\]**

    **E \--\> F\[Operator Assigns Event\]**

    **F \--\> G\[Video & Map Sync\]**

    **G \--\> H\[Follow Workflow Steps\]**

    **H \--\> I\[Close & Report\]**

**\`\`\`**

**\*\*\***

**\*\*Analogy:\*\* Being a \*\*GCXONE\*\* Operator is like being an \*\*Air Traffic Controller\*\* for a city's security. The radar (the Alarm Queue) shows you everything, but the AI acts as your co-pilot, filtering out the "birds" (false alarms) so you can focus on the "planes" (real threats). You use your tools (Video, Maps, Audio) to guide each incident to a safe landing (resolution).**

