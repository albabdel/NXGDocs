---
title: "Teltonika Router Integration Guide"
description: "Complete guide to integrating Teltonika industrial routers with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:intermediate
  - manufacturer:teltonika
  - device-type:router
supported: true
last_verified: "2025-12-28"
firmware_version: "v7.06 or later"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Teltonika Router Integration Guide

## Quick Summary

**Device Capabilities:**
- ✅ Industrial Cellular Connectivity
- ✅ VPN Server/Client
- ✅ Ethernet Switching
- ✅ WiFi Access Point
- ✅ GPS Tracking
- ✅ Remote Management
- ✅ Firewall & Security
- ✅ SNMP Monitoring

**Certification Level:** ✅ NXGEN Certified
**Support Level:** Full Support
**Recommended Firmware:** v7.06 or later

---

## Prerequisites

### Hardware Requirements
- Teltonika router (RUT series) with firmware v7.06+
- SIM card with data plan (for cellular models)
- Ethernet cables for LAN connections
- External antennas (cellular/WiFi/GPS)

### Network Requirements
- Cellular data connection or WAN internet
- Static IP or dynamic DNS for remote access
- Port forwarding capabilities
- SNMP access for monitoring

### Access Requirements
- Administrator credentials for router
- GCXONE account with installer or admin role
- Remote Management System (RMS) account (optional)

---

## Step 1: Router Setup

### 1.1 Initial Configuration

<Tabs>
  <TabItem value="ethernet" label="Ethernet Setup">
    1. Connect computer to LAN port
    2. Access router at http://192.168.1.1
    3. Login with default credentials (admin/admin01)
    4. Run initial setup wizard
    5. Change default password immediately
  </TabItem>

  <TabItem value="cellular" label="Cellular Setup">
    1. Insert SIM card into router
    2. Connect cellular antennas
    3. Power on router and wait for network registration
    4. Check cellular signal strength LEDs
    5. Verify data connection established
  </TabItem>
</Tabs>

### 1.2 Network Configuration

**Path:** Network → WAN

1. **WAN Interface Setup:**
   - **Primary:** Cellular (Mobile)
   - **Secondary:** Ethernet WAN (backup)
   - **Failover:** Enable automatic failover
   - **Load Balancing:** Configure if using multiple WANs

2. **Cellular Configuration:**
   - **APN:** Carrier-specific APN settings
   - **Authentication:** Username/password if required
   - **Network Type:** Auto (4G/3G/2G)
   - **Band Selection:** Auto or specific bands

3. **LAN Configuration:**
   - **IP Range:** 192.168.1.0/24 (or custom)
   - **DHCP Server:** Enable with IP pool
   - **DNS Servers:** Auto or custom DNS

### 1.3 WiFi Configuration

**Path:** Network → Wireless

1. **WiFi Settings:**
   - **SSID:** Network name
   - **Security:** WPA2-PSK (recommended)
   - **Password:** Strong WiFi password
   - **Channel:** Auto or specific channel
   - **Bandwidth:** 20/40 MHz

2. **Guest Network:** (Optional)
   - Enable guest WiFi network
   - Separate VLAN for guest access
   - Bandwidth limitations
   - Time-based access control

---

## Step 2: VPN Configuration

### 2.1 OpenVPN Server Setup

**Path:** Services → VPN → OpenVPN

1. **Enable OpenVPN Server:**
   - **Protocol:** UDP (recommended)
   - **Port:** 1194 (default)
   - **Encryption:** AES-256-CBC
   - **Authentication:** SHA256

2. **Certificate Management:**
   - Generate CA certificate
   - Create server certificate
   - Generate client certificates
   - Download client configuration files

3. **Network Settings:**
   - **VPN Subnet:** 10.8.0.0/24
   - **Push Routes:** LAN networks to access
   - **DNS Servers:** Push DNS to clients
   - **Client-to-Client:** Enable if needed

### 2.2 IPsec VPN (Alternative)

**Path:** Services → VPN → IPsec

1. **IPsec Configuration:**
   - **Mode:** Site-to-Site or Road Warrior
   - **Authentication:** Pre-shared key or certificates
   - **Encryption:** AES-256
   - **Phase 1/2:** Configure IKE parameters

2. **Tunnel Settings:**
   - **Local Network:** LAN subnet
   - **Remote Network:** Remote site subnet
   - **Gateway:** Remote VPN endpoint
   - **Keep-Alive:** Enable DPD

---

## Step 3: Security & Monitoring

### 3.1 Firewall Configuration

**Path:** Network → Firewall

1. **Basic Firewall Rules:**
   - **Default Policy:** Drop (secure)
   - **Allow LAN to WAN:** Enable
   - **Allow established connections:** Enable
   - **Block invalid packets:** Enable

2. **Port Forwarding:**
   - **GCXONE Access:** Forward required ports
   - **Camera Access:** Forward camera ports if needed
   - **VPN Access:** Forward VPN ports
   - **Remote Management:** SSH/HTTP access

3. **Access Control:**
   - **MAC Filtering:** Allow/deny specific devices
   - **Time-based Rules:** Restrict access by time
   - **Bandwidth Control:** QoS rules
   - **Content Filtering:** Block unwanted content

### 3.2 SNMP Monitoring

**Path:** Services → SNMP

1. **Enable SNMP:**
   - **Version:** SNMPv2c or SNMPv3
   - **Community String:** Custom community name
   - **Access Control:** Restrict to management IPs
   - **MIB Support:** Standard and Teltonika MIBs

2. **Monitoring Parameters:**
   - **System Information:** Device status
   - **Interface Statistics:** Traffic counters
   - **Cellular Signal:** Signal strength and quality
   - **Temperature:** Device temperature
   - **GPS Location:** Coordinates (if GPS enabled)

---

## Step 4: GCXONE Integration

### 4.1 Network Monitoring Setup

1. **Navigate to GCXONE:** Customer → Site → Devices → Add Device
2. **Select Manufacturer:** Choose "Teltonika"
3. **Enter Connection Details:**
   ```
   Device Type: Router/Gateway
   IP Address: [router-wan-ip or domain]
   SNMP Community: [community-string]
   SNMP Port: 161
   SSH Access: [if enabled]
   ```
4. **Advanced Settings:**
   - **Server Unit ID:** `TELT-RTR-001`
   - **Location:** Router installation site
   - **Description:** Network gateway description

5. **Monitoring Configuration:**
   - **Interface Monitoring:** WAN/LAN/Cellular interfaces
   - **VPN Monitoring:** VPN tunnel status
   - **Signal Monitoring:** Cellular signal strength
   - **Temperature Monitoring:** Device health

### 4.2 Remote Management Integration

**RMS (Remote Management System):**
1. **Enable RMS:** Services → Cloud Solutions → RMS
2. **Device Registration:** Register with Teltonika RMS
3. **GCXONE Integration:** Configure RMS API access
4. **Monitoring Dashboard:** View device status in RMS

### 4.3 Verification Checklist

| Check | Expected Result | Troubleshooting |
|-------|----------------|-----------------|
| Router Status | 🟢 Online | [Check power/connectivity](#troubleshooting) |
| Cellular Signal | Good signal strength | [Check antennas/location](#signal-issues) |
| VPN Connectivity | Tunnels established | [Check VPN config](#vpn-issues) |
| SNMP Monitoring | Data collection active | [Verify SNMP settings](#snmp-issues) |

---

## Advanced Configuration

### SNMP Monitoring

```bash title="Query Teltonika router via SNMP"
# Get system information
snmpget -v2c -c public [router-ip] 1.3.6.1.2.1.1.1.0

# Get cellular signal strength
snmpget -v2c -c public [router-ip] 1.3.6.1.4.1.48690.2.1.0

# Get interface statistics
snmpwalk -v2c -c public [router-ip] 1.3.6.1.2.1.2.2.1.10
```

### API Integration

```bash title="RMS API access"
curl -X GET "https://rms.teltonika-networks.com/api/devices/[device-id]" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

### GPS Tracking

```json title="GPS location data"
{
  "device_id": "TELT-12345",
  "timestamp": "2025-12-28T10:30:00Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "altitude": 10.5,
    "accuracy": 3.2
  },
  "cellular": {
    "signal_strength": -75,
    "signal_quality": 85,
    "network_type": "4G",
    "operator": "Verizon"
  }
}
```

---

## Troubleshooting

### No Cellular Connection

**Solutions:**
1. **SIM Card:** Verify SIM is activated and has data plan
2. **APN Settings:** Check carrier-specific APN configuration
3. **Signal Strength:** Improve antenna placement/orientation
4. **Network Registration:** Check network operator selection

### VPN Connection Issues

**Solutions:**
1. **Port Forwarding:** Ensure VPN ports are accessible
2. **Firewall Rules:** Check firewall allows VPN traffic
3. **Certificate Issues:** Verify certificates are valid
4. **Network Routing:** Check routing tables and conflicts

### Poor Performance

**Solutions:**
1. **Signal Quality:** Optimize antenna placement
2. **Network Congestion:** Check cellular network load
3. **QoS Configuration:** Implement traffic prioritization
4. **Firmware Update:** Update to latest firmware version

### Remote Access Problems

**Solutions:**
1. **Dynamic IP:** Use dynamic DNS service
2. **Port Forwarding:** Configure correct port forwarding
3. **Firewall Rules:** Allow remote management traffic
4. **VPN Access:** Use VPN for secure remote access

---

## Device Specifications

### Teltonika Router Models
- **RUT240:** Basic 4G router, 2×Ethernet, WiFi
- **RUT241:** Enhanced 4G router, 4×Ethernet, WiFi, GPS
- **RUT955:** Industrial 4G router, dual-SIM, WiFi, GPS, I/O
- **RUT956:** Advanced 4G router, 5×Ethernet, dual-band WiFi

### Technical Specifications
- **Cellular:** 4G LTE Cat 4/6, 3G, 2G fallback
- **WiFi:** 802.11 b/g/n, dual-band (select models)
- **Ethernet:** 10/100 Mbps ports
- **VPN:** OpenVPN, IPsec, GRE, PPTP, L2TP
- **Operating Temp:** -40°C to +75°C (industrial models)

### Monitoring Capabilities
- **SNMP:** v1/v2c/v3 support
- **Syslog:** Remote logging
- **Email Alerts:** Event notifications
- **SMS Alerts:** Cellular-based alerts
- **RMS Integration:** Cloud management platform

---

## Support & Resources

### Teltonika Resources
- [Teltonika Wiki](https://wiki.teltonika-networks.com/)
- [Firmware Downloads](https://teltonika-networks.com/downloads/)
- [RMS Platform](https://rms.teltonika-networks.com/)
- [Technical Support](https://teltonika-networks.com/support/)

### NXGEN Resources
- [Video Tutorial: Teltonika Setup](/tutorials/teltonika-setup)
- [Industrial Networking Guide](/guides/teltonika-industrial)
- [VPN Configuration Guide](/guides/teltonika-vpn)

---

**Last Updated:** 2025-12-28  
**Verified Firmware:** v7.06  
**Certification:** ✅ NXGEN Certified  
**Document Version:** 2.0.0