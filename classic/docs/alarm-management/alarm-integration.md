---
title: "Alarm Integration with Third-Party"
description: "Complete guide for Alarm Integration with Third-Party"
tags:
  - admin
  - configuration
  - advanced
  - GCXONE
sidebar_position: 15
last_updated: 2025-12-04
---


# Alarm Integration with Third-Party

GCXONE provides a unified, cloud-native platform for receiving, enriching, and forwarding alarms to any monitoring backend. The system supports three distinct categories of alarm forwarders to accommodate various technological maturities.

## Forwarder Categories

### 1. Primary CMS Forwarders
Tightly integrated and certified connections with leading cloud CMS platforms.
-   **Supported**: Evalink Talos (Full cloud-native API integration).
-   **When to Use**: When real-time, bi-directional synchronization of events, health, and video clips is required.

### 2. Traditional CMS Forwarders
Protocol-based forwarding for legacy or industry-standard Central Monitoring Stations.
-   **Supported Protocols**: SMTP (IMMIX), SIA DC-09 (ATS, AmWin, LISA).
-   **When to Use**: For integration with established hardware receivers or legacy monitoring infrastructures.

### 3. Technological Forwarders
Modern, API-friendly distribution channels for custom cloud workflows.
-   **Options**: Webhooks (HTTP POST), Email (SMTP), File Transfer (FTP/SFTP), MQTT.
-   **When to Use**: To integrate with automation platforms (Node-RED, Azure Logic Apps) or custom-built monitoring stacks.

---

## Configuration Overview

Forwarders can be configured at the **Service Provider**, **Customer**, **Site**, or **Device** level. 

### Webhook Forwarding Template
Webhooks enable real-time delivery to any HTTPS endpoint with customizable payloads.
```json
"webhook": {
  "type": "webhook",
  "properties": {
    "url": "https://customer-endpoint.com/alarms",
    "method": "POST",
    "auth": { "type": "bearer", "token": "YOUR_TOKEN" },
    "payloadTemplate": "{ /"event/": /"{{eventType}}/", /"site/": /"{{siteName}}/" }"
  }
}
```

## Hybrid Monitoring Use Case
Large enterprises often run multiple systems in parallel. GCXONE can feed multiple forwarders simultaneously:
-   **Talos**: For advanced cloud workflow and AI alarms.
-   **IMMIX**: For remote guarding workflows via SMTP.
-   **Webhooks**: For internal automation and reporting.

> [!TIP]
> Customers may enable up to 3 forwarders at the same time: 1 Primary, 1 Traditional, and 1 Technological.
