---
title: "ADPRO Integration Guide"
description: "Complete guide to integrating ADPRO perimeter intrusion detection with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:intermediate
  - manufacturer:adpro
  - device-type:sensor
supported: true
last_verified: "2025-12-28"
firmware_version: "v3.2 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ADPRO Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Perimeter Intrusion Detection
- ✅ Fence-Mounted Sensors
- ✅ Zone-Based Monitoring
- ✅ Environmental Compensation
- ✅ Event Forwarding
- ✅ Tamper Detection
- ✅ Weather Resistance
- ✅ Industrial Applications

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v3.2 or later

---

## Prerequisites

### Hardware Requirements
- ADPRO E-Series processor with firmware v3.2+
- ADPRO sensors (FastTrace, IntelliFence, etc.)
- Network connectivity (Ethernet)
- Power supply (12V DC or PoE)

### Network Requirements
- Static IP address recommended
- Ports 80 (HTTP), 23 (Telnet) accessible
- Reliable network connection for alarm transmission

### Access Requirements
- Administrator credentials for ADPRO processor
- GCXONE account with installer or admin role

---

## Step 1: ADPRO System Setup

### 1.1 Processor Configuration

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect processor to network via Ethernet
    2. Power on processor (12V DC or PoE)
    3. Wait for initialization (LED indicators show status)
    4. Access via default IP or DHCP-assigned address
  </TabItem>

  <TabItem value="serial" label="Serial Configuration">
    1. Connect via RS-232 serial cable
    2. Use terminal software (9600 baud, 8-N-1)
    3. Configure network settings
    4. Switch to Ethernet connection
  </TabItem>
</Tabs>

### 1.2 Access ADPRO Interface

1. **Telnet Access:** `telnet [processor-ip]`
2. **Web Interface:** `http://[processor-ip]`
3. **Default Credentials:**
   - **Username:** `admin`
   - **Password:** `admin` (change immediately)

### 1.3 Basic Configuration

**System Settings:**
1. **Set System Name:** Descriptive identifier
2. **Configure Time/Date:** Sync with NTP server
3. **Network Settings:** Static IP, subnet, gateway
4. **User Management:** Create operator accounts

---

## Step 2: Sensor Configuration

### 2.1 Zone Setup

**Path:** Configuration → Zones

1. **Add Zone:**
   - **Zone Number:** 1-64 (depending on model)
   - **Zone Name:** Descriptive name (e.g., "North Fence")
   - **Zone Type:** Perimeter, Area, or Point
   - **Sensor Type:** FastTrace, IntelliFence, etc.

2. **Sensor Parameters:**
   - **Sensitivity:** 1-10 (start with 5)
   - **Processing Gain:** Auto or manual
   - **Environmental Compensation:** Enable
   - **Cut/Climb Detection:** Enable if supported

### 2.2 Detection Settings

**Environmental Compensation:**
- **Wind Compensation:** Auto-adjust for wind conditions
- **Rain Compensation:** Reduce sensitivity during rain
- **Temperature Compensation:** Adjust for thermal effects
- **Vegetation Compensation:** Account for plant movement

**Advanced Settings:**
- **Dual Technology:** Combine multiple detection methods
- **Pattern Recognition:** Learn normal fence behavior
- **Nuisance Alarm Reduction:** Filter false alarms
- **Tamper Detection:** Monitor sensor integrity

### 2.3 Alarm Processing

**Path:** Configuration → Alarm Processing

1. **Alarm Verification:**
   - **Confirmation Time:** 2-5 seconds
   - **Reset Time:** 30-60 seconds
   - **Multiple Zone Logic:** AND/OR conditions

2. **Output Actions:**
   - **Relay Outputs:** Physical alarm outputs
   - **Network Notifications:** TCP/IP messages
   - **SNMP Traps:** Network management alerts

---

## Step 3: Network Integration

### 3.1 Communication Protocols

**Path:** Configuration → Communications

1. **TCP/IP Settings:**
   - **Protocol:** TCP or UDP
   - **Port:** 2001 (default) or custom
   - **Message Format:** SIA, Contact ID, or custom

2. **Receiver Configuration:**
   - **Primary Receiver:** GCXONE server IP
   - **Secondary Receiver:** Backup server (optional)
   - **Heartbeat Interval:** 60-300 seconds
   - **Retry Attempts:** 3-5 attempts

### 3.2 Event Formatting

**SIA Protocol Configuration:**
- **Account Code:** Unique system identifier
- **Event Codes:** Map zone events to SIA codes
- **Message Structure:** Standard SIA format
- **Encryption:** Enable if required

**Contact ID Configuration:**
- **Account Number:** 4-digit identifier
- **Event Mapping:** Zone events to Contact ID codes
- **Qualifier Codes:** Event type qualifiers
- **Checksum:** Enable message integrity

---

## Step 4: Add ADPRO to GCXONE

### 4.1 Device Discovery

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "ADPRO"
3. **Enter Connection Details:**
   ```
   Host/IP Address: [processor-ip]
   Port: 2001 (or configured port)
   Protocol: TCP/SIA or Contact ID
   Account Code: [system identifier]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `ADPRO-001`
   - **Time Zone:** [Auto-detected]
   - **Description:** System location/description

5. **Click "Discover"** to detect zones
6. **Map Zones:** Assign zone names and types
7. **Click "Save"**

### 4.2 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Processor Status | 🟢 Online | [Check network](#troubleshooting) |
| Zone Discovery | All zones detected | [Verify zone config](#zone-issues) |
| Alarm Reception | Test alarms received | [Check communication](#comm-issues) |
| Heartbeat | Regular status updates | [Verify heartbeat](#heartbeat-issues) |

---

## Advanced Configuration

### API Integration

```bash title="Query ADPRO status via Telnet"
telnet [processor-ip]
# Commands:
STATUS          # System status
ZONES           # Zone status
ALARMS          # Active alarms
CONFIG ZONE 1   # Zone 1 configuration
```

### Zone Mapping Example

```json title="ADPRO zone configuration"
{
  "zones": [
    {
      "number": 1,
      "name": "North Perimeter",
      "type": "fence_line",
      "sensor": "fasttrace",
      "sensitivity": 5,
      "length_meters": 150
    },
    {
      "number": 2,
      "name": "East Gate",
      "type": "gate_sensor",
      "sensor": "intellifence",
      "sensitivity": 7,
      "length_meters": 20
    }
  ]
}
```

---

## Troubleshooting

### High False Alarm Rate

**Solutions:**
1. **Environmental Compensation:** Enable all compensation features
2. **Sensitivity Adjustment:** Reduce sensitivity gradually
3. **Pattern Learning:** Allow system to learn normal conditions
4. **Physical Installation:** Check sensor mounting and alignment

### Communication Issues

**Solutions:**
1. **Network Connectivity:** Verify processor can reach GCXONE
2. **Port Configuration:** Ensure correct ports are open
3. **Protocol Settings:** Verify SIA/Contact ID configuration
4. **Firewall Rules:** Check firewall allows communication

### Zone Not Responding

**Solutions:**
1. **Sensor Power:** Check 12V power to sensors
2. **Cable Integrity:** Test sensor cables for breaks
3. **Processor Inputs:** Verify processor input channels
4. **Environmental Factors:** Check for extreme weather conditions

---

## Device Specifications

### ADPRO Processors
- **E-Series:** 8-64 zones, Ethernet, multiple protocols
- **Compact Series:** 4-16 zones, basic functionality
- **Industrial Series:** Harsh environment, extended temperature

### Sensor Types
- **FastTrace:** Taut wire perimeter sensor
- **IntelliFence:** Intelligent fence sensor
- **MicroPoint:** Point detection sensor
- **MicroTrack:** Buried cable sensor

### Detection Capabilities
- **Cut Detection:** Wire cutting attempts
- **Climb Detection:** Fence climbing attempts
- **Lift Detection:** Fence lifting attempts
- **Spread Detection:** Fence spreading attempts

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v3.2  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0