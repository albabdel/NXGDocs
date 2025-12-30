---
title: "Senstar Integration Guide"
description: "Complete guide to integrating Senstar perimeter intrusion detection with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:advanced
  - manufacturer:senstar
  - device-type:sensor
supported: true
last_verified: "2025-12-28"
firmware_version: "v5.3 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Senstar Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Fiber Optic Intrusion Detection
- ✅ Fence-Mounted Sensors
- ✅ Buried Cable Detection
- ✅ Microwave Barriers
- ✅ Video Analytics Integration
- ✅ Multi-Zone Processing
- ✅ Environmental Compensation
- ✅ Critical Infrastructure Grade

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v5.3 or later

---

## Prerequisites

### Hardware Requirements
- Senstar processor unit (FiberPatrol, OmniTrax, etc.)
- Senstar sensors (fiber optic, buried cable, microwave)
- Network connectivity (Ethernet)
- Power supply (110/220V AC or 12/24V DC)

### Network Requirements
- Static IP address recommended
- Ports 80 (HTTP), 443 (HTTPS), 161 (SNMP) accessible
- Reliable network for alarm transmission
- NTP server access for time synchronization

### Access Requirements
- Administrator credentials for Senstar processor
- GCXONE account with installer or admin role
- Senstar Symphony software (optional)

---

## Step 1: Senstar System Setup

### 1.1 Processor Installation

<Tabs>
  <TabItem value="fiberpatrol" label="FiberPatrol System">
    1. Mount processor in secure location
    2. Connect fiber optic sensors to processor
    3. Connect power (AC or DC as specified)
    4. Connect Ethernet for network communication
    5. Verify LED status indicators
  </TabItem>

  <TabItem value="omnitrax" label="OmniTrax System">
    1. Install processor unit in control room
    2. Connect buried cable sensors via interface modules
    3. Connect power and network cables
    4. Configure zone interface modules
    5. Test system communications
  </TabItem>
</Tabs>

### 1.2 Initial Configuration

**Web Interface Access:**
1. **Connect via Browser:** `https://[processor-ip]`
2. **Default Credentials:**
   - **Username:** `admin`
   - **Password:** `admin` (change immediately)
3. **SSL Certificate:** Accept self-signed certificate
4. **Initial Setup Wizard:** Follow configuration steps

**Basic System Settings:**
- **System Name:** Descriptive identifier
- **Location:** Geographic location
- **Time Zone:** Local time zone setting
- **NTP Server:** Network time synchronization
- **Network Settings:** IP, subnet, gateway, DNS

### 1.3 User Management

**Path:** System → Users

1. **Create GCXONE User:**
   - **Username:** `nxgen`
   - **Password:** [secure password]
   - **Role:** Operator or Monitor
   - **Permissions:** View alarms, acknowledge events

2. **Required Permissions:**
   - ✅ View system status
   - ✅ View alarm events
   - ✅ Acknowledge alarms
   - ✅ Access reports
   - ✅ View zone status

---

## Step 2: Sensor Configuration

### 2.1 Zone Setup

**Path:** Configuration → Zones

1. **Add Zone:**
   - **Zone Number:** Sequential numbering
   - **Zone Name:** Descriptive name (e.g., "East Perimeter")
   - **Sensor Type:** Fiber optic, buried cable, microwave
   - **Zone Length:** Physical length in meters

2. **Detection Parameters:**
   - **Sensitivity:** 1-100 (start with 50)
   - **Processing Algorithm:** Standard, enhanced, custom
   - **Cut/Climb Detection:** Enable for fence applications
   - **Tamper Detection:** Monitor sensor integrity

### 2.2 Fiber Optic Configuration

**FiberPatrol Settings:**
1. **Fiber Configuration:**
   - **Fiber Type:** Single-mode or multi-mode
   - **Wavelength:** 1310nm or 1550nm
   - **Power Budget:** Calculate link loss
   - **Splice Locations:** Document splice points

2. **Detection Algorithms:**
   - **Standard Algorithm:** General purpose detection
   - **Fence Algorithm:** Optimized for fence mounting
   - **Buried Algorithm:** For buried fiber applications
   - **Custom Algorithm:** Site-specific tuning

3. **Environmental Compensation:**
   - **Temperature Compensation:** Auto-adjust for thermal effects
   - **Vibration Filtering:** Filter mechanical vibrations
   - **Weather Compensation:** Adjust for wind/rain
   - **Traffic Filtering:** Ignore nearby traffic

### 2.3 Buried Cable Configuration

**OmniTrax Settings:**
1. **Cable Configuration:**
   - **Cable Type:** Coaxial or twisted pair
   - **Cable Length:** Total length per zone
   - **Burial Depth:** Typical 12-18 inches
   - **Cable Spacing:** Distance between send/receive

2. **Detection Parameters:**
   - **Sensitivity Levels:** Adjust per soil conditions
   - **Frequency Response:** Optimize for target detection
   - **Ground Coupling:** Soil moisture compensation
   - **Seismic Filtering:** Filter natural seismic activity

---

## Step 3: Integration Configuration

### 3.1 Communication Protocols

**Path:** Configuration → Communications

1. **TCP/IP Settings:**
   - **Protocol:** TCP or UDP
   - **Port:** 4001 (default) or custom
   - **Message Format:** Senstar protocol or SIA

2. **SNMP Configuration:**
   - **SNMP Version:** v2c or v3
   - **Community String:** Read/write communities
   - **Trap Destinations:** GCXONE server IP
   - **MIB Support:** Senstar enterprise MIB

3. **Email Notifications:**
   - **SMTP Server:** Mail server settings
   - **Recipients:** Alert email addresses
   - **Message Templates:** Alarm notification format

### 3.2 Event Processing

**Alarm Processing Rules:**
1. **Alarm Verification:**
   - **Confirmation Time:** 2-10 seconds
   - **Reset Time:** 30-300 seconds
   - **Cross-Zone Logic:** Multiple zone correlation

2. **Output Actions:**
   - **Relay Outputs:** Physical alarm outputs
   - **Network Messages:** TCP/IP notifications
   - **SNMP Traps:** Network management alerts
   - **Video Integration:** PTZ camera control

---

## Step 4: Add Senstar to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Senstar"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [processor-ip]
   Port: 4001 (or configured port)
   Protocol: Senstar/TCP or SNMP
   Community: [SNMP community string]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `SENSTAR-001`
   - **Time Zone:** [Auto-detected]
   - **Description:** System description

5. **Click "Discover"** to detect zones
6. **Map Zones:** Assign zone names and priorities
7. **Click "Save"**

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Processor Status | 🟢 Online | [Check network](#troubleshooting) |
| Zone Discovery | All zones detected | [Verify zone config](#zone-issues) |
| Alarm Reception | Test alarms received | [Check communication](#comm-issues) |
| SNMP Monitoring | Status updates received | [Verify SNMP](#snmp-issues) |

---

## Advanced Configuration

### SNMP Integration

```bash title="Query Senstar via SNMP"
# Get system status
snmpget -v2c -c public [processor-ip] 1.3.6.1.4.1.3052.1.1.1.0

# Get zone status
snmpwalk -v2c -c public [processor-ip] 1.3.6.1.4.1.3052.1.2.1
```

### TCP Protocol Example

```python title="Senstar TCP communication"
import socket

def connect_senstar(host, port=4001):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))
    
    # Request system status
    sock.send(b"STATUS\r\n")
    response = sock.recv(1024)
    
    return response.decode()
```

---

## Troubleshooting

### High False Alarm Rate

**Solutions:**
1. **Environmental Tuning:** Adjust compensation settings
2. **Sensitivity Reduction:** Lower detection sensitivity
3. **Algorithm Selection:** Choose appropriate detection algorithm
4. **Physical Installation:** Check sensor mounting and alignment

### Fiber Optic Issues

**Solutions:**
1. **Power Budget:** Check optical power levels
2. **Splice Quality:** Verify fiber splice integrity
3. **Bend Radius:** Ensure proper fiber routing
4. **Connector Cleaning:** Clean fiber connectors regularly

### Buried Cable Problems

**Solutions:**
1. **Cable Integrity:** Test cable continuity
2. **Burial Depth:** Verify proper installation depth
3. **Soil Conditions:** Adjust for soil moisture/type
4. **Ground Loops:** Check electrical grounding

### Communication Failures

**Solutions:**
1. **Network Connectivity:** Verify processor network access
2. **Port Configuration:** Check firewall port settings
3. **Protocol Settings:** Verify communication protocol config
4. **SNMP Configuration:** Check community strings and versions

---

## Device Specifications

### Senstar Processors
- **FiberPatrol:** Fiber optic intrusion detection
- **OmniTrax:** Buried cable detection system
- **FlexZone:** Multi-technology processor
- **UltraWave:** Microwave barrier processor

### Sensor Technologies
- **Fiber Optic:** Distributed sensing along fiber
- **Buried Cable:** Seismic/magnetic detection
- **Microwave:** Volumetric detection barriers
- **Video Analytics:** Intelligent video processing

### Detection Performance
- **Detection Range:** Up to 100km (fiber optic)
- **Location Accuracy:** ±1-5 meters typical
- **Response Time:** <1 second detection
- **Environmental:** -40°C to +75°C operation

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v5.3  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0