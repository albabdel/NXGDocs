### **Understanding and Configuring Alarm Flow in GCXONE**

**Short Description** This guide provides a comprehensive overview for administrators and operators on how security alarms are received, processed via AI analytics, and managed within the GCXONE ecosystem to ensure effective real-time monitoring.

**Context / When to Use** Apply the principles in this article when onboarding new security sites, troubleshooting missing alarms, or optimizing AI-powered filtering to reduce false positives for central monitoring stations.

**How It Works (High-Level)** The alarm flow is a multi-stage process where a security device (NVR, camera, or sensor) detects an event and transmits data to the GCXONE cloud. The platform utilizes a **proxy architecture** to handle device-specific protocols (such as TCP, HTTP, or specialized SDKs), receiving raw events and associated visual data. Once received, an **AI analytics engine** evaluates the visual evidence to classify the alarm as "real" or "false" based on custom, user-defined rules. Validated alarms are then distributed to operators via the integrated CMS (typically **Evalink Talos**) for immediate intervention or logged for historical reporting.

**Prerequisites / Requirements**

* **Administrator access** to the GCXONE configuration portal.  
* **Device-specific network settings** in place, including whitelisted IPs and open ports (e.g., 554 for RTSP, 80/443 for HTTP).  
* **Accurate Time Zone synchronization** between the physical device and the cloud platform, preferably using an NTP client.  
* **Assigned User Roles** with necessary permissions such as "Notify Surveillance Center" for alarm reception and "Live View" for streaming.  
* **Active Site and Device structure** pre-configured within the GCXONE hierarchy.

**Step-by-Step Instructions**

1. **Register the Device**: Navigate to **Configuration App \> Sites \> Devices** and click **Add** to register the physical unit using its IP address, credentials, and required ports.  
2. **Initiate Discovery**: Click the **Discover** button to allow GCXONE to connect to the device and automatically add all relevant sensors and camera channels.  
3. **Configure Alarm Transmission on Device**: Access the physical device’s local web interface and enable the **Notify Surveillance Center** or **Report Alarm** checkbox for every desired event type (e.g., Intrusion, Tripwire).  
4. **Set Image Style**: For video events, ensure the device is configured to send multiple images (Pre-alarm, Event, and Post-alarm) by selecting the **Quad Alarm** or **Video Alert** option.  
5. **Enable AI Analytics**: In the **Analytics** tab of the Configuration App, activate the **False Alarm Filter** for the specific device or sensor.  
6. **Define decision Rules**: Configure the **Priority List**, **White List**, and **Black List** in the tenant’s custom properties to specify which objects (e.g., human, vehicle) trigger a "Real" alarm status.  
7. **Link to CMS (Talos)**: Ensure the **eventProviderId** is correctly configured at the tenant level to establish a data link with the alarm management platform.  
8. **Verify the Flow**: Monitor the **Dashboard \> Alarm Receiver Log** or **Video Search** to confirm that incoming signals are being received and classified as expected.

**Expected Results / Outcomes** After following these steps, security events will appear in the **Video Search** with clear Real/False classifications and AI-generated visual bounding boxes. Confirmed threats will automatically trigger workflows in the **Talos CMS**, allowing operators to initiate responses such as audio announcements or authority dispatch.

**Notes and Tips**

* **Prioritize Smart Events**: Use **Intelligent Video Surveillance (IVS)** like line crossing or intrusion detection rather than basic motion detection to prevent "alarm floods" that overwhelm system resources.  
* **Continuous Recording**: Set NVRs to **Continuous Recording** to ensure that a complete dataset is available for the AI to analyze and for operators to review during post-event investigations.  
* **Polling vs. Push**: Most modern devices push events to GCXONE. If a device cannot push events directly (e.g., Avigilon, TruVision), enable **Event Polling** in the device settings to have the cloud pull data at set intervals.

**Troubleshooting / Common Issues**

* **"No Alarms Received"**: Check the **Alarm Receiver Log** to verify if the signal is reaching the cloud. If missing, re-verify that the **"Notify Surveillance Center"** setting is enabled on the physical device interface.  
* **"Alarms Blocked"**: If a single device sends more than 25 alarms in a 5-minute window, GCXONE will block the device to protect platform stability. You must tune the device’s analytics sensitivity to resolve this.  
* **"Missing or Inaccurate Images"**: This is often due to **Time Synchronization** issues. If the device clock does not precisely match the cloud time, the system will attempt to fetch images from the wrong timestamp, resulting in "No Image" or irrelevant footage.

Related articles:

X1

X2

X3

