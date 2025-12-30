# Device Comparison Matrix

This document defines the standardized comparison matrix for all GCXONE-supported devices.

## Device Categories

### IP Cameras
- **Resolution:** 720p, 1080p, 4K, 8K
- **Frame Rate:** 15fps, 30fps, 60fps
- **Night Vision:** IR, Starlight, Color Night Vision
- **PTZ:** Fixed, Pan/Tilt, Full PTZ
- **Audio:** None, One-way, Two-way
- **Analytics:** Basic Motion, AI Analytics, Facial Recognition
- **Power:** PoE, PoE+, 12V DC, 24V AC
- **Weatherproof:** Indoor, IP65, IP66, IP67
- **Price Range:** Budget (<$200), Mid-range ($200-500), Premium (>$500)

### NVRs/Recorders
- **Channels:** 4, 8, 16, 32, 64+
- **Storage:** 1TB, 2TB, 4TB, 8TB+
- **Recording:** Continuous, Motion, Schedule
- **Remote Access:** Web, Mobile App, Desktop Client
- **Analytics:** Basic, Advanced AI
- **Redundancy:** Single Drive, RAID 1, RAID 5
- **Price Range:** Entry (<$500), Professional ($500-2000), Enterprise (>$2000)

### Alarm Panels
- **Zones:** 8, 16, 32, 64+
- **Communication:** Ethernet, WiFi, Cellular
- **Protocols:** Contact ID, SIA, Proprietary
- **Expansion:** Wireless, Wired, Hybrid
- **Backup:** Battery, UPS
- **Certification:** UL Listed, EN Grade
- **Price Range:** Basic (<$300), Standard ($300-800), Advanced (>$800)

### Sensors & Detectors
- **Type:** PIR, Dual-Tech, Beam Break, Glass Break
- **Range:** Short (<10m), Medium (10-20m), Long (>20m)
- **Environment:** Indoor, Outdoor, Harsh
- **Power:** Battery, Wired, Solar
- **Wireless:** 433MHz, 868MHz, WiFi, LoRa
- **Pet Immunity:** None, Small Pets, Large Pets
- **Price Range:** Budget (<$50), Standard ($50-150), Premium (>$150)

## Comparison Matrix Template

```json
{
  "manufacturer": "string",
  "model": "string",
  "category": "ip-camera|nvr|alarm-panel|sensor",
  "specifications": {
    "resolution": "720p|1080p|4K|8K",
    "frameRate": "15fps|30fps|60fps",
    "nightVision": "none|ir|starlight|color",
    "ptz": "fixed|pan-tilt|full-ptz",
    "audio": "none|one-way|two-way",
    "analytics": "none|basic|ai|facial",
    "power": "poe|poe-plus|12v-dc|24v-ac",
    "weatherproof": "indoor|ip65|ip66|ip67",
    "priceRange": "budget|mid-range|premium"
  },
  "gcxoneSupport": {
    "liveStreaming": true,
    "playback": true,
    "ptzControl": true,
    "twoWayAudio": false,
    "motionDetection": true,
    "aiAnalytics": true,
    "eventForwarding": true,
    "bulkConfiguration": true
  },
  "certificationLevel": "certified|compatible|community",
  "supportLevel": "full|partial|beta",
  "lastVerified": "2025-12-28",
  "firmwareVersion": "v1.0.0",
  "notes": "Additional notes about compatibility or limitations"
}
```

## Interactive Comparison Features

### Filter Options
- **By Manufacturer:** Hikvision, Dahua, Axis, etc.
- **By Category:** Cameras, NVRs, Alarms, Sensors
- **By Price Range:** Budget, Mid-range, Premium
- **By Features:** PTZ, Audio, Analytics, etc.
- **By Support Level:** Certified, Compatible, Community

### Sort Options
- **By Price:** Low to High, High to Low
- **By Rating:** User ratings and reviews
- **By Popularity:** Most commonly deployed
- **By Release Date:** Newest first, Oldest first
- **By Compatibility:** Full support first

### Export Options
- **PDF Report:** Detailed comparison with specifications
- **CSV Export:** Spreadsheet format for analysis
- **Share Link:** Shareable comparison URL
- **Print View:** Printer-friendly format

## Implementation Notes

### Data Sources
- Device specifications from manufacturer datasheets
- GCXONE compatibility testing results
- User feedback and ratings
- Field deployment statistics
- Support ticket analysis

### Update Frequency
- **Monthly:** New device additions
- **Quarterly:** Specification updates
- **As Needed:** Compatibility changes
- **Annual:** Full review and cleanup

### Quality Assurance
- All devices tested with actual hardware
- Specifications verified against manufacturer docs
- Compatibility confirmed with latest GCXONE version
- User feedback incorporated into ratings