---
title: "Quick Start Checklist"
description: "Complete checklist to guide customers through the initial setup and configuration of the GCXONE platform for seamless cloud-based security management"
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 13
last_updated: 2025-12-04
---

# GCXONE: Quick Start Checklist

This checklist is designed to guide customers through the initial setup and configuration of the **GCXONE** platform to ensure a seamless transition to cloud-based security management.

## Overview

The GCXONE Quick Start Checklist is organized into five phases that systematically guide you from network preparation through final validation. Each phase builds upon the previous one, ensuring a solid foundation for your security infrastructure.

:::tip Checklist Usage
Use this checklist as a working document. Check off each item as you complete it to track your progress and ensure nothing is missed during setup.
:::

## Phase 1: Network Readiness & Infrastructure

Before logging in, ensure your local network is prepared to communicate with the **GCXONE** cloud.

- [ ] **Internet Connectivity:** Ensure a stable, high-bandwidth connection for reliable video streaming.
- [ ] **IP Whitelisting:** Add **GCXONE** gateway IPs (e.g., `18.185.17.113`, `3.124.50.242`) to your firewall to allow direct access.
- [ ] **Port Forwarding:** Open necessary ports on your router, such as **HTTP/HTTPS (80/443)** for web access and **RTSP (554)** for video streaming.
- [ ] **Workstation Setup:** Verify monitoring PCs meet minimum requirements (e.g., 32GB RAM, i7 CPU, and NVIDIA graphics card).

:::info Network Requirements
For detailed network configuration information, see the [Firewall Configuration Guide](/docs/getting-started/firewall-configuration) and [IP Whitelisting Guide](/docs/getting-started/ip-whitelisting).
:::

![Network Readiness](./images/quick-start-1.png)

## Phase 2: Initial Platform Setup

Establish your organizational hierarchy within the **GCXONE** interface.

- [ ] **Tenant Access:** Log in to your dedicated **GCXONE** URL using provided administrator credentials.
- [ ] **Create Site:** Add your physical locations under the "Sites" tab, providing accurate addresses for mapping and synchronization with **Talos CMS**.
- [ ] **Add Users:** Define user roles (Admin, Operator, etc.) and assign appropriate permissions for live viewing and alarm handling.

:::tip Site Configuration
Accurate site addresses are crucial for proper synchronization with Talos CMS. Ensure addresses match exactly between both systems.
:::

![Initial Platform Setup](./images/quick-start-2.png)

## Phase 3: Device Onboarding

Connect your physical hardware (NVRs, IP Cameras, IoT sensors) to the platform.

- [ ] **Register Device:** Select your device type (e.g., Hikvision, Dahua, Axis) and enter the **IP address, port, and credentials**.
- [ ] **Server Unit ID:** Assign a **unique identification number** to every device to prevent alarm attribution conflicts.
- [ ] **Time Sync (NTP):** Configure all hardware to sync with the **GCXONE** NTP server (`time1.nxgen.cloud`) to ensure accurate event timestamps.
- [ ] **Discovery:** Run the "Discover" function to automatically pull camera sensors and I/O information into the platform.

:::warning Unique Server Unit IDs
Each device must have a unique Server Unit ID. Duplicate IDs can cause alarm attribution conflicts and make it impossible to identify which device triggered an event.
:::

![Device Onboarding](./images/quick-start-3.png)

## Phase 4: Critical Security Configurations

Optimize your hardware settings for intelligent alarm processing.

- [ ] **Alarm Transmission:** Enable the **"Notify Surveillance Center"** (or webhook) setting on your devices to push alarms to the cloud.
- [ ] **Recording Mode:** Set devices to **Continuous Recording** (or Motion & Alarm with 30-second pre/post buffers) to provide operators with full context.
- [ ] **Smart Events:** Prioritize analytics like **Intrusion Detection or Line Crossing** over basic motion detection to reduce false triggers.

:::tip Recording Configuration
For optimal alarm response, configure devices with at least 30 seconds of pre-alarm recording buffer. This ensures operators have full context when reviewing events.
:::

![Security Configurations](./images/quick-start-4.png)

## Phase 5: Validation & Go-Live

Verify that the integrated system is operating correctly.

- [ ] **Live Stream Check:** Confirm you can view real-time feeds from all added cameras in the Video Viewer.
- [ ] **Alarm Test:** Trigger a test event and verify it appears in the **Talos CMS** queue within 60–90 seconds.
- [ ] **Health Monitoring:** Confirm that automated health checks are active and reporting device status.

:::success Go-Live Checklist
Once all items in Phase 5 are checked, your GCXONE system is ready for production use. Monitor the system closely during the first 24-48 hours to ensure all components are functioning correctly.
:::

![Validation & Go-Live](./images/quick-start-5.png)

## Understanding the Setup Process

Setting up **GCXONE** is like **building a smart neighborhood**. 

1. **Infrastructure (Phase 1):** First, you need the infrastructure like roads and utilities (internet and open ports).
2. **Register Addresses (Phase 2):** Then, you register the addresses for each house (Site).
3. **Move In (Phase 3):** When the owners move in, they must follow the neighborhood rules, such as setting their clocks correctly (NTP) and making sure their security alarms talk to the local police station (Alarm Transmission).
4. **Neighborhood Rules (Phase 4):** Ensure all residents follow security protocols and recording standards.
5. **Final Walk-Through (Phase 5):** Finally, you do a final walk-through to make sure all the lights work and the neighborhood is safe.

## Quick Reference

### Essential IP Addresses

| Service | IP Address | Purpose |
| :------ | :--------- | :------ |
| **Primary Gateway** | `18.185.17.113` | Main GCXONE gateway |
| **Secondary Gateway** | `3.124.50.242` | Backup GCXONE gateway |
| **NTP Server** | `time1.nxgen.cloud` | Time synchronization |

### Required Ports

| Port | Protocol | Purpose |
| :--- | :------- | :------ |
| **80** | HTTP | Web access |
| **443** | HTTPS | Secure web access |
| **554** | RTSP | Video streaming |
| **123** | UDP | NTP time sync |

### Minimum Workstation Requirements

- **RAM:** 32GB minimum
- **CPU:** Intel i7 or equivalent
- **Graphics:** NVIDIA graphics card recommended
- **Network:** Stable, high-bandwidth connection

## Related Articles

- [NTP Server Configuration](/docs/getting-started/ntp-configuration)
- [Firewall Configuration Guide](/docs/getting-started/firewall-configuration)
- [IP Whitelisting Guide](/docs/getting-started/ip-whitelisting)
- [First-Time Login & Setup](/docs/getting-started/first-time-login)
- [GCXONE & Talos Integration](/docs/getting-started/gcxone-talos-interaction)

## Need Help?

If you're experiencing issues during setup, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
