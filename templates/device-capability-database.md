# Device Capability Database

This database tracks all device specifications, GCXONE compatibility, and support levels for the 60+ supported manufacturers.

## Database Schema

### Device Table
```json
{
  "deviceId": "string (unique)",
  "manufacturer": "string",
  "model": "string", 
  "category": "ip-camera|nvr|alarm-panel|sensor|gateway|access-control",
  "subCategory": "bullet|dome|ptz|thermal|fisheye|nvr-embedded|nvr-standalone",
  "releaseDate": "YYYY-MM-DD",
  "endOfLife": "YYYY-MM-DD",
  "status": "active|deprecated|discontinued"
}
```

### Specifications Table
```json
{
  "deviceId": "string (foreign key)",
  "specifications": {
    "video": {
      "maxResolution": "720p|1080p|4K|8K",
      "frameRates": ["15fps", "30fps", "60fps"],
      "codecs": ["H.264", "H.265", "MJPEG"],
      "streams": {
        "main": {"resolution": "1080p", "maxBitrate": "8Mbps"},
        "sub": {"resolution": "720p", "maxBitrate": "2Mbps"}
      }
    },
    "audio": {
      "supported": true,
      "type": "none|one-way|two-way",
      "codecs": ["G.711", "G.726", "AAC"]
    },
    "ptz": {
      "supported": true,
      "panRange": "360°",
      "tiltRange": "90°", 
      "zoomRange": "30x",
      "presets": 256,
      "tours": 8,
      "speed": "1-8"
    },
    "analytics": {
      "motionDetection": true,
      "lineCrossing": true,
      "intrusionDetection": true,
      "faceDetection": false,
      "licensePlate": false,
      "objectClassification": ["human", "vehicle"],
      "heatMapping": false
    },
    "physical": {
      "dimensions": "120x85x85mm",
      "weight": "450g",
      "mounting": ["wall", "ceiling", "pole"],
      "weatherRating": "IP67",
      "operatingTemp": "-30°C to +60°C",
      "power": {
        "type": "PoE|PoE+|12VDC|24VAC",
        "consumption": "8W",
        "backup": false
      }
    },
    "network": {
      "ethernet": "10/100Mbps",
      "wifi": "802.11n",
      "protocols": ["ONVIF", "RTSP", "HTTP", "HTTPS"],
      "encryption": ["WEP", "WPA", "WPA2"],
      "ports": [80, 443, 554, 8000]
    },
    "storage": {
      "local": {
        "supported": true,
        "type": "microSD|HDD|SSD",
        "maxCapacity": "256GB"
      },
      "network": {
        "nas": true,
        "cloud": false,
        "ftp": true
      }
    }
  }
}
```

### GCXONE Compatibility Table
```json
{
  "deviceId": "string (foreign key)",
  "compatibility": {
    "supportLevel": "full|partial|beta|unsupported",
    "certificationLevel": "certified|compatible|community",
    "lastTested": "YYYY-MM-DD",
    "testedFirmware": "v1.0.0",
    "gcxoneVersion": "v2.9.0",
    "features": {
      "discovery": {
        "supported": true,
        "method": "ONVIF|ISAPI|Proprietary",
        "reliability": "excellent|good|fair|poor"
      },
      "liveStreaming": {
        "supported": true,
        "mainStream": true,
        "subStream": true,
        "reliability": "excellent"
      },
      "playback": {
        "supported": true,
        "timeline": true,
        "export": true,
        "reliability": "excellent"
      },
      "ptzControl": {
        "supported": true,
        "presets": true,
        "tours": true,
        "reliability": "good"
      },
      "eventForwarding": {
        "supported": true,
        "motionEvents": true,
        "analyticsEvents": true,
        "ioEvents": true,
        "reliability": "excellent"
      },
      "twoWayAudio": {
        "supported": false,
        "reliability": "n/a"
      },
      "bulkConfiguration": {
        "supported": true,
        "templates": true,
        "reliability": "good"
      }
    },
    "knownIssues": [
      {
        "issue": "Motion events can cause excessive alarms",
        "severity": "medium",
        "workaround": "Use smart events instead",
        "status": "known"
      }
    ],
    "limitations": [
      "Two-way audio requires specific firmware version",
      "PTZ presets limited to 64 on older models"
    ]
  }
}
```

### Pricing Table
```json
{
  "deviceId": "string (foreign key)",
  "pricing": {
    "msrp": 299.99,
    "currency": "USD",
    "priceRange": "budget|mid-range|premium|enterprise",
    "lastUpdated": "YYYY-MM-DD",
    "regionalPricing": {
      "US": 299.99,
      "EU": 279.99,
      "UK": 249.99
    },
    "distributorPricing": {
      "volume1-10": 0.85,
      "volume11-50": 0.80,
      "volume51+": 0.75
    }
  }
}
```

### Documentation Table
```json
{
  "deviceId": "string (foreign key)",
  "documentation": {
    "integrationGuide": "/devices/hikvision/ds-2cd2347g2-lu",
    "quickStart": "/guides/hikvision-quick-start",
    "troubleshooting": "/troubleshooting/hikvision",
    "videoTutorial": "/tutorials/hikvision-setup",
    "apiReference": "/api/devices/hikvision",
    "lastUpdated": "YYYY-MM-DD",
    "completeness": "complete|partial|minimal",
    "quality": "excellent|good|fair|poor"
  }
}
```

### User Feedback Table
```json
{
  "deviceId": "string (foreign key)",
  "feedback": {
    "averageRating": 4.2,
    "totalReviews": 156,
    "ratings": {
      "5star": 89,
      "4star": 45,
      "3star": 15,
      "2star": 5,
      "1star": 2
    },
    "commonPraise": [
      "Easy to configure",
      "Excellent image quality",
      "Reliable performance"
    ],
    "commonComplaints": [
      "Complex web interface",
      "Firmware updates required"
    ],
    "deploymentStats": {
      "totalDeployments": 2847,
      "successRate": 0.94,
      "avgSetupTime": "12 minutes"
    }
  }
}
```

## Device Categories

### IP Cameras (200+ models)
- **Bullet Cameras:** Fixed lens, outdoor/indoor
- **Dome Cameras:** Vandal-resistant, ceiling mount
- **PTZ Cameras:** Pan/tilt/zoom functionality
- **Thermal Cameras:** Heat detection
- **Fisheye Cameras:** 360° coverage
- **Specialty:** License plate, facial recognition

### NVRs/Recorders (80+ models)
- **Embedded NVRs:** All-in-one solutions
- **Standalone NVRs:** Dedicated recording devices
- **Hybrid DVR/NVRs:** Analog + IP support
- **Enterprise NVRs:** High channel count, redundancy

### Alarm Panels (60+ models)
- **Wireless Panels:** Battery backup, cellular
- **Wired Panels:** Hardwired zones
- **Hybrid Panels:** Mixed wired/wireless
- **Commercial Panels:** Large zone capacity

### Sensors & Detectors (100+ models)
- **PIR Sensors:** Passive infrared motion
- **Dual-Tech Sensors:** PIR + microwave
- **Glass Break Detectors:** Acoustic/shock
- **Door/Window Contacts:** Magnetic switches
- **Environmental Sensors:** Smoke, flood, temperature

### Access Control (40+ models)
- **Card Readers:** Proximity, smart card
- **Biometric Readers:** Fingerprint, facial
- **Keypads:** PIN entry
- **Controllers:** Door control units

## Manufacturer Coverage

### Tier 1 (Full Support - 15 manufacturers)
- Hikvision, Dahua, Axis, Hanwha, Uniview
- Bosch, Avigilon, Milestone, Genetec
- Honeywell, Johnson Controls, Tyco

### Tier 2 (Good Support - 25 manufacturers)  
- Ajax, ADPRO, Reconeyez, Senstar, Ganz
- Camect, EagleEye, Teltonika, Vivotek
- Pelco, Panasonic, Sony, Samsung

### Tier 3 (Basic Support - 20+ manufacturers)
- Smaller/regional manufacturers
- Legacy systems
- Specialty devices

## Data Sources

### Primary Sources
- Manufacturer datasheets and specifications
- GCXONE compatibility testing lab results
- Field deployment feedback
- Support ticket analysis
- User surveys and ratings

### Update Frequency
- **Daily:** User feedback and ratings
- **Weekly:** Compatibility test results
- **Monthly:** New device additions
- **Quarterly:** Specification updates
- **Annually:** Full database review

## API Endpoints

### Device Search
```
GET /api/devices/search?manufacturer=hikvision&category=ip-camera
GET /api/devices/search?features=ptz,analytics&priceRange=mid-range
GET /api/devices/search?supportLevel=full&certificationLevel=certified
```

### Device Details
```
GET /api/devices/{deviceId}
GET /api/devices/{deviceId}/specifications
GET /api/devices/{deviceId}/compatibility
GET /api/devices/{deviceId}/feedback
```

### Comparison
```
POST /api/devices/compare
Body: ["device1", "device2", "device3"]
```

### Bulk Operations
```
GET /api/devices/bulk/specifications
POST /api/devices/bulk/update-compatibility
```

## Quality Assurance

### Testing Requirements
- All devices tested with actual hardware
- Compatibility verified with latest GCXONE version
- Documentation accuracy validated
- User feedback incorporated

### Review Process
- Monthly compatibility reviews
- Quarterly documentation updates
- Annual full database audit
- Continuous user feedback monitoring

### Metrics Tracking
- Device success rates
- Setup time averages
- Support ticket volumes
- User satisfaction scores