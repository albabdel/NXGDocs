# 🔧 Amazon Q - Device Documentation & Technical Content Lead Instructions

**Role:** Device Documentation Standardization and Technical Reference
**Project:** NXGEN GCXONE Documentation Overhaul

---

## Your Mission

Transform 60+ device-specific documentation pages into a consistent, professional, and highly usable resource. Make device integration effortless for installers and administrators.

### Core Responsibilities
1. **Device Documentation Standardization:** Create uniform structure across all devices
2. **Technical Accuracy:** Ensure all technical details are correct and complete
3. **Configuration Wizards:** Build guided setup tools for each device type
4. **Comparison Matrices:** Help users choose the right devices
5. **Integration Guides:** Document every integration scenario
6. **API Documentation:** Create comprehensive API reference

---

## Current State Analysis

### Device Documentation Inventory
**Manufacturers covered:** 60+
- ADPRO, Ajax, Avigilon, Axis, Camect, Dahua, EagleEye, Ganz, Hikvision, Reconeyez, Senstar, Uniview, and 48+ more

**Current structure:** Inconsistent
- Some have images, some don't
- Varying levels of detail
- Different content structures
- Missing critical information

**Your mission:** Standardize all 60+ device docs

---

## Phase 1-4 Tasks (Weeks 1-5)

### Week 1: Foundation & Templates
**Priority: HIGHEST**

#### 1. Device Documentation Template
Create the definitive template for all device docs:

```markdown
---
title: "[Manufacturer] [Model] Integration Guide"
description: "Complete guide to integrating [device] with GCXONE"
tags:
  - role:installer
  - role:admin
  - category:device
  - difficulty:[beginner|intermediate|advanced]
  - manufacturer:[manufacturer]
  - device-type:[camera|nvr|alarm-panel|sensor|gateway]
supported: true
last_verified: "2025-12-28"
firmware_version: "[latest verified version]"
---

# [Manufacturer] [Model]

<DeviceHeader
  manufacturer="[Manufacturer]"
  model="[Model]"
  image="/img/devices/[manufacturer]/[model].png"
  supportLevel="full|partial|beta"
  certificationLevel="certified|compatible|community"
/>

## Quick Summary

<DeviceCapabilities capabilities={[
  { name: "Live Streaming", supported: true },
  { name: "Playback", supported: true },
  { name: "PTZ Control", supported: true },
  { name: "Two-Way Audio", supported: false },
  { name: "Motion Detection", supported: true },
  { name: "AI Analytics", supported: true, note: "Requires firmware 2.x+" },
]} />

---

## Prerequisites

<Prerequisites>
  <Requirement type="hardware">
    - [Device model] with firmware [version] or later
    - Network connectivity (Ethernet or WiFi)
    - Power supply ([voltage])
  </Requirement>

  <Requirement type="network">
    - Static IP address or DHCP reservation
    - Ports 80, 443, 554 accessible
    - Internet connectivity for cloud features
  </Requirement>

  <Requirement type="access">
    - Administrator credentials for device
    - GCXONE account with installer or admin role
  </Requirement>
</Prerequisites>

---

## Step 1: Device Preparation

### 1.1 Initial Device Setup

<Tabs>
  <TabItem value="ethernet" label="Ethernet Connection">
    1. Connect device to network via Ethernet cable
    2. Power on device
    3. Wait for initialization (typically 60-90 seconds)
    4. Note the device IP address from:
       - Device display screen
       - Router DHCP client list
       - [Manufacturer] discovery tool
  </TabItem>

  <TabItem value="wifi" label="WiFi Connection">
    1. Power on device
    2. Connect to device's WiFi hotspot (SSID: [pattern])
    3. Access setup portal at http://192.168.1.1
    4. Configure WiFi credentials
    5. Note assigned IP address
  </TabItem>
</Tabs>

### 1.2 Access Device Web Interface

<Steps>
  <Step number={1}>
    Open web browser and navigate to: `http://[device-ip]`
  </Step>

  <Step number={2}>
    Login with default credentials:
    - **Username:** `admin`
    - **Password:** `[default password]`

    <Callout type="warning">
    Change the default password immediately for security!
    </Callout>
  </Step>

  <Step number={3}>
    Verify firmware version in System → About

    **Minimum required:** v[X.X.X]
    **Recommended:** v[Y.Y.Y] or later

    [Update firmware if needed →](/guides/firmware-update-[manufacturer])
  </Step>
</Steps>

### 1.3 Network Configuration

<ConfigWizard type="network-setup" manufacturer="[manufacturer]" />

---

## Step 2: GCXONE Platform Setup

### 2.1 Add Device to GCXONE

<InteractiveTutorial
  title="Add [Manufacturer] Device"
  estimatedTime="5 minutes"
  steps={addDeviceSteps}
/>

Alternatively, follow these manual steps:

<Steps>
  <Step number={1} title="Navigate to Devices">
    In GCXONE, go to **Devices** → **Add New Device**
  </Step>

  <Step number={2} title="Select Manufacturer">
    - Manufacturer: `[Manufacturer]`
    - Model: `[Model]` or select "Generic [Manufacturer]" for auto-detection
  </Step>

  <Step number={3} title="Enter Connection Details">
    \`\`\`
    IP Address: [device-ip]
    Port: 80 (HTTP) or 443 (HTTPS)
    Username: [username]
    Password: [password]
    \`\`\`
  </Step>

  <Step number={4} title="Configure Advanced Settings">
    - **Server Unit ID:** Unique identifier (e.g., `[manufacturer]-001`)
    - **NTP Server:** `time1.nxgen.cloud`
    - **Timezone:** [Auto-detected or manual]
  </Step>

  <Step number={5} title="Test Connection">
    Click **Test Connection** to verify:
    - ✅ Device reachable
    - ✅ Credentials valid
    - ✅ Firmware compatible
  </Step>

  <Step number={6} title="Save Configuration">
    Click **Save** to add device to GCXONE
  </Step>
</Steps>

### 2.2 Verify Device Status

After adding device, verify:

<ChecklistTable>
  | Check | Expected | Action if Failed |
  |-------|----------|------------------|
  | Device Status | 🟢 Online | [Troubleshoot connectivity](#troubleshooting) |
  | Camera Channels | All discovered | [Manual channel configuration](#manual-channels) |
  | Live Stream | Playing | [Check streaming settings](#streaming) |
  | Recording | Active | [Configure recording schedule](#recording) |
  | Health Status | 🟢 Healthy | [Review health checks](#health) |
</ChecklistTable>

---

## Step 3: Feature Configuration

### 3.1 Video Streaming

<Tabs>
  <TabItem value="mainstream" label="Main Stream (High Quality)">
    **Recommended Settings:**
    - Resolution: 1920x1080 (1080p)
    - Frame Rate: 15-30 FPS
    - Bitrate: 2-4 Mbps
    - Codec: H.264 or H.265

    Use for: Recording, critical viewing
  </TabItem>

  <TabItem value="substream" label="Sub Stream (Preview)">
    **Recommended Settings:**
    - Resolution: 640x360 or 704x480
    - Frame Rate: 10-15 FPS
    - Bitrate: 512-1024 Kbps
    - Codec: H.264

    Use for: Live preview, bandwidth-limited scenarios
  </TabItem>
</Tabs>

### 3.2 Motion Detection

<ConfigWizard type="motion-detection" manufacturer="[manufacturer]" />

### 3.3 Event Configuration

Configure which events trigger alarms:

<EventConfigTable>
  | Event Type | Supported | Configuration |
  |------------|-----------|---------------|
  | Motion Detection | ✅ | [Configure](#motion) |
  | Line Crossing | ✅ | [Configure](#line-crossing) |
  | Intrusion Detection | ✅ | [Configure](#intrusion) |
  | Audio Detection | ⚠️ | Requires audio input |
  | Face Detection | ❌ | Not supported |
  | License Plate | ✅ | Requires AI license |
</EventConfigTable>

---

## Advanced Configuration

### API Integration

For programmatic device management:

<CodeBlock language="bash" title="Add device via API">
curl -X POST https://api.nxgen.cloud/v1/devices \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "manufacturer": "[Manufacturer]",
    "model": "[Model]",
    "ipAddress": "192.168.1.100",
    "port": 80,
    "credentials": {
      "username": "admin",
      "password": "secure_password"
    },
    "serverUnitId": "[manufacturer]-001",
    "customerId": "customer_id_here",
    "siteId": "site_id_here"
  }'
</CodeBlock>

[Full API documentation →](/api/devices)

### Bulk Configuration

For deploying multiple devices:

<CodePlayground
  language="javascript"
  title="Bulk device onboarding script"
  files={['bulk-onboard.js', 'devices.json']}
/>

---

## Troubleshooting

<DecisionTree rootNode={troubleshootingTree} />

### Common Issues

<Collapsible title="Device shows offline after adding">
**Symptoms:** Device status shows red/offline immediately after adding

**Possible causes:**
1. Incorrect IP address or port
2. Firewall blocking connection
3. Invalid credentials
4. Device in different subnet

**Solutions:**
1. Verify IP address is correct and reachable: `ping [device-ip]`
2. Check firewall allows ports 80/443
3. Confirm credentials in device web interface
4. Ensure GCXONE can reach device subnet (VPN or port forwarding)

[Detailed troubleshooting →](/troubleshooting/device-offline)
</Collapsible>

<Collapsible title="No video stream available">
[Solution steps...]
</Collapsible>

<Collapsible title="Events not appearing in GCXONE">
[Solution steps...]
</Collapsible>

---

## Device Capabilities Matrix

<DeviceCapabilityMatrix manufacturer="[Manufacturer]" model="[Model]" />

### Feature Comparison

Compare with similar devices:

<ComparisonTable devices={[
  { manufacturer: "[Manufacturer]", model: "[Model]" },
  { manufacturer: "[Competitor 1]", model: "[Model]" },
  { manufacturer: "[Competitor 2]", model: "[Model]" }
]} features={[
  "Resolution",
  "Frame Rate",
  "Night Vision",
  "PTZ",
  "Audio",
  "AI Analytics",
  "Price Range"
]} />

---

## Firmware & Updates

### Current Firmware

- **Latest Version:** v[X.Y.Z]
- **Release Date:** YYYY-MM-DD
- **Status:** ✅ Verified with GCXONE
- **Download:** [Manufacturer's website]

### Update Instructions

<Steps>
  <Step number={1}>
    Download firmware from manufacturer
  </Step>
  <Step number={2}>
    Backup current configuration
  </Step>
  <Step number={3}>
    Upload firmware via device web interface
  </Step>
  <Step number={4}>
    Wait for reboot (5-10 minutes)
  </Step>
  <Step number={5}>
    Verify new version and functionality
  </Step>
</Steps>

---

## Support & Resources

### Manufacturer Resources
- [Official Documentation](link)
- [Firmware Downloads](link)
- [Technical Support](link)
- [Community Forum](link)

### NXGEN Resources
- [Video Tutorial: Setting up [Manufacturer]](/tutorials/[manufacturer]-setup)
- [Webinar Recording](/webinars/[manufacturer]-integration)
- [Community Forum Discussion](/community/[manufacturer])

### Need Help?

<FeedbackWidget
  articleId="device-[manufacturer]-[model]"
  supportEmail="support@nxgen.io"
/>

---

## Related Devices

<RelatedDevices manufacturer="[Manufacturer]" currentModel="[Model]" />

---

**Last Updated:** YYYY-MM-DD
**Verified Firmware:** v[X.Y.Z]
**Certification:** ✅ NXGEN Certified
```

#### 2. Device Comparison Matrix Tool

Create interactive comparison tool:

```tsx
// DeviceComparison.tsx
interface ComparisonProps {
  category: 'ip-cameras' | 'nvr' | 'alarm-panels' | 'sensors';
  filters?: {
    manufacturer?: string[];
    priceRange?: [number, number];
    resolution?: string[];
    features?: string[];
  };
}

export function DeviceComparison({ category, filters }: ComparisonProps) {
  // Features:
  // - Side-by-side comparison (up to 5 devices)
  // - Filter by specs
  // - Sort by features
  // - Export comparison as PDF
  // - Share link
}
```

---

### Week 2-3: Device Documentation Transformation
**Priority: HIGHEST**

Standardize all 60+ device documentation pages:

#### Batch 1: IP Cameras (Week 2)
- [ ] Hikvision (most popular - do first)
- [ ] Dahua
- [ ] Axis
- [ ] Hanwha
- [ ] Uniview
- [ ] ...15 more

#### Batch 2: NVRs & Recorders (Week 3)
- [ ] Hikvision NVR
- [ ] Dahua NVR
- [ ] Milestone
- [ ] Nx Witness
- [ ] ...10 more

#### Batch 3: Alarm Panels & Sensors (Week 3)
- [ ] Ajax
- [ ] ADPRO
- [ ] Reconeyez
- [ ] ...10 more

#### Batch 4: Specialty Devices (Week 3)
- [ ] Gateways
- [ ] IoT Sensors
- [ ] Audio devices
- [ ] ...15 more

---

### Week 4: Configuration Wizards
**Priority: HIGH**

Build interactive configuration wizards for each device category:

#### 1. Camera Configuration Wizard
```tsx
interface CameraWizardSteps {
  step1: DeviceSelection;      // Choose manufacturer/model
  step2: NetworkSetup;          // IP, ports, credentials
  step3: VideoConfiguration;    // Resolution, FPS, bitrate
  step4: EventSetup;            // Motion, analytics
  step5: AdvancedOptions;       // NTP, HTTPS, etc.
  step6: TestAndSave;           // Verify and save
}
```

#### 2. NVR Onboarding Wizard
Guides through adding NVR and all connected cameras

#### 3. Alarm Panel Wizard
Configures alarm panel and zone mappings

#### 4. Bulk Device Wizard
Handles 10+ devices at once with templates

---

### Week 5: API & Integration Documentation
**Priority: MEDIUM**

#### 1. API Reference Documentation

Create comprehensive API docs:

```markdown
# GCXONE API Reference

## Authentication

All API requests require authentication via JWT token.

### Get Access Token

<Tabs>
  <TabItem value="curl" label="cURL">
    <CodeBlock language="bash">
    curl -X POST https://api.nxgen.cloud/v1/auth/token \
      -H "Content-Type: application/json" \
      -d '{
        "username": "your-email@company.com",
        "password": "your-password"
      }'
    </CodeBlock>
  </TabItem>

  <TabItem value="javascript" label="JavaScript">
    <CodeBlock language="javascript">
    const response = await fetch('https://api.nxgen.cloud/v1/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'your-email@company.com',
        password: 'your-password'
      })
    });
    const { token } = await response.json();
    </CodeBlock>
  </TabItem>

  <TabItem value="python" label="Python">
    <CodeBlock language="python">
    import requests

    response = requests.post(
        'https://api.nxgen.cloud/v1/auth/token',
        json={
            'username': 'your-email@company.com',
            'password': 'your-password'
        }
    )
    token = response.json()['token']
    </CodeBlock>
  </TabItem>
</Tabs>

## Endpoints

### Devices

#### POST /v1/devices

Create a new device.

**Request:**

<APIRequest
  method="POST"
  endpoint="/v1/devices"
  headers={{
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }}
  body={{
    manufacturer: 'string',
    model: 'string',
    ipAddress: 'string',
    port: 'number',
    credentials: {
      username: 'string',
      password: 'string'
    },
    customerId: 'string',
    siteId: 'string'
  }}
/>

**Response (201 Created):**

<APIResponse
  status={201}
  body={{
    id: 'device-abc123',
    manufacturer: 'Hikvision',
    model: 'DS-2CD2347G2-LU',
    status: 'online',
    cameras: [...]
  }}
/>

**Errors:**

<APIErrors errors={[
  { code: 400, description: 'Invalid request body' },
  { code: 401, description: 'Unauthorized - invalid or missing token' },
  { code: 403, description: 'Forbidden - insufficient permissions' },
  { code: 409, description: 'Device already exists' },
  { code: 422, description: 'Device unreachable or invalid credentials' }
]} />

**Try it:**

<APIPlayground
  endpoint="/v1/devices"
  method="POST"
  auth="bearer"
/>
```

#### 2. Integration Guides

Create guides for common integrations:
- [ ] REST API Integration Guide
- [ ] Webhook Setup Guide
- [ ] MQTT Integration Guide
- [ ] Third-Party VMS Integration
- [ ] Access Control Integration
- [ ] Video Analytics Integration

---

## Quality Standards

### Every Device Doc Must Have:

#### ✅ Completeness
- [ ] All sections from template included
- [ ] All screenshots current and accurate
- [ ] All capabilities documented
- [ ] Troubleshooting section complete
- [ ] Firmware version specified

#### ✅ Accuracy
- [ ] Tested with actual device
- [ ] Firmware version verified
- [ ] Screenshots match current UI
- [ ] All steps validated
- [ ] API examples tested

#### ✅ Usability
- [ ] Clear step-by-step instructions
- [ ] Visual aids (screenshots, diagrams)
- [ ] Configuration wizard provided
- [ ] Common issues addressed
- [ ] Support resources linked

#### ✅ Consistency
- [ ] Follows template structure
- [ ] Uses standard terminology
- [ ] Matches style guide
- [ ] Links work correctly
- [ ] Images optimized

---

## Deliverables

### Week 1
- [ ] Device documentation template
- [ ] Capability matrix structure
- [ ] Comparison tool framework
- [ ] First 5 device docs (pilot)

### Week 2
- [ ] 25 IP camera docs standardized
- [ ] Camera configuration wizard
- [ ] Comparison matrix populated

### Week 3
- [ ] 20 NVR/recorder docs standardized
- [ ] 15 alarm/sensor docs standardized
- [ ] NVR onboarding wizard
- [ ] Alarm panel wizard

### Week 4
- [ ] All 60+ devices standardized
- [ ] All wizards complete
- [ ] Bulk configuration tool
- [ ] Testing and QA

### Week 5
- [ ] API documentation complete
- [ ] Integration guides written
- [ ] Code examples tested
- [ ] API playground deployed

---

## Communication Protocol

```markdown
## Amazon Q - [Date]

**Completed:**
- Standardized 5 Hikvision camera docs
- Created camera configuration wizard (70% complete)

**In Progress:**
- Dahua device family (8 models)
- Testing wizard with real devices

**Blockers:**
- Need access to Axis test device for verification
- Waiting for API spec clarification from dev team

**Next:**
- Complete Dahua docs
- Finish camera wizard
- Start NVR documentation batch
```

---

## Success Criteria

Your work is successful when:
1. ✅ All 60+ device docs follow template
2. ✅ Installation success rate > 95%
3. ✅ Device onboarding time < 10 minutes
4. ✅ Configuration wizard completion > 80%
5. ✅ API documentation complete and tested

---

**Last Updated:** 2025-12-28
**Status:** Active - Ready for Week 1 tasks
