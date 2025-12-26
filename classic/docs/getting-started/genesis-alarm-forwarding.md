---
title: "Genesis Alarm Forwarding Configuration"
description: "Complete guide for configuring alarm forwarding in Genesis to Primary CMS, Traditional CMS, and Technological Forwarders"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 14
last_updated: 2025-12-21
---

# Genesis Alarm Forwarding Configuration

Genesis provides a unified, cloud-native platform for receiving, enriching, and forwarding alarms to any monitoring backend. Because different customers operate at different technological maturities—modern cloud CMS, legacy DC-09 receivers, hybrid infrastructures, or custom-built monitoring stacks—Genesis supports three categories of alarm forwarders.

## Overview

Genesis supports three categories of alarm forwarders:

1. **Primary CMS Forwarders** – A tightly integrated and certified connection with leading cloud CMS platforms. Currently, Genesis supports Evalink Talos as a native primary CMS.
2. **Traditional CMS Forwarders** – For customers using industry-standard or legacy receivers such as IMMIX, ATS, Sur-Gard, AmWin, LISA, and similar platforms.
3. **Technological Forwarders** – For modern, API-driven monitoring models using Webhooks, Email, File Transfer, or MQTT.

Each category enables a customer to route alarms according to their operational model: cloud-only, migration from legacy, hybrid use, or fully customized workflows.

:::info Multiple Forwarders
Genesis allows customers to enable one option per category, but they may combine categories depending on their monitoring strategy. For example: Talos (Primary) + AmWin (Traditional) + Webhook (Technological).
:::

## Architecture Overview

Genesis is designed as a modular alarm-processing pipeline, where device events pass through standardized internal layers before being forwarded to the customer's selected monitoring platform(s).

## Primary CMS System

Deep, system-level integration with a next-generation cloud-native CMS.

### Overview

The Primary CMS System is the preferred alarm forwarding pipeline for customers who require real-time, bi-directional, and high-reliability integration with an advanced cloud CMS.

This is not a generic protocol-based forwarder—it is a tightly coupled integration that synchronizes events, sites, assets, health, video clips, metadata, enriched AI signals, and operator workflows.

### Supported Primary CMS Systems

| CMS | Integration Type | Supported by Genesis |
|-----|-----------------|---------------------|
| Evalink Talos | Full cloud-native API integration | ✅ Supported |

### When to Use This

Use the Primary CMS System (Evalink Talos) integration in the following situations:

1. **Customer already uses Evalink Talos as their main monitoring backend**
   - Genesis becomes an extension of their existing Evalink environment.
   - All alarms, AI events, device health, and site details synchronize automatically from Genesis to Talos.
   - Operators work entirely inside Evalink with Genesis acting as the field intelligence layer.

2. **Customer wants to use Genesis together with Evalink, even if they do not have a standalone Evalink deployment**
   - Some customers prefer Evalink's operator console and workflow but rely on Genesis for tower/device management.
   - In this model, Evalink becomes the CMS front-end and Genesis system becomes the IoT/Video/AI processing engine.
   - Genesis provisions Evalink accounts, pushes events, and synchronizes sites on behalf of the customer.
   - No separate Evalink system is required—the integration makes the Genesis + Evalink experience seamless.

## Traditional / Industry Standard CMS Systems

Protocol-based forwarding for legacy or industry-standard Central Monitoring Stations.

### Overview

These integrations are for customers who use traditional CMS systems that operate on standard alarm receiver protocols. These systems are typically used by established monitoring stations that have been operating for years and rely on proven, industry-standard protocols.

### Supported Traditional CMS Systems

- **IMMIX** – Industry-standard alarm receiver protocol
- **ATS** – Advanced Technology Systems
- **Sur-Gard** – Sur-Gard alarm receiver protocol
- **AmWin** – AmWin monitoring software
- **LISA** – Legacy alarm receiver protocol
- Similar industry-standard platforms

### When to Use This

Use Traditional CMS Forwarders when:
- Migrating from legacy systems while maintaining compatibility
- Operating in hybrid environments with both cloud and legacy components
- Requiring industry-standard protocol compliance
- Integrating with existing monitoring station infrastructure

## Technological Alarm Forwarders

Modern, API-driven forwarding for custom monitoring workflows.

### Overview

Technological Forwarders provide flexible, API-driven alarm forwarding for customers who build custom monitoring solutions or integrate with modern platforms that use standard web technologies.

### Supported Technological Forwarders

- **Webhook Forwarder** – HTTP/HTTPS webhook integration
- **Email Forwarder** – Email-based alarm notifications
- **File Transfer Forwarder** – File-based alarm export
- **MQTT Forwarder** – MQTT protocol integration

### When to Use This

Use Technological Forwarders when:
- Building custom monitoring solutions
- Integrating with modern API-driven platforms
- Requiring flexible, programmable alarm routing
- Implementing custom workflows and automation

## Configuration - Alarm Forwarder

### Webhook Forwarder Configuration

Configure webhook forwarding to send alarms to custom HTTP endpoints.

#### Configuration Breakdown

- **Endpoint URL**: The HTTP/HTTPS URL where alarms will be sent
- **HTTP Method**: POST (default) or PUT
- **Headers**: Custom headers to include with requests
- **Authentication**: API key or bearer token authentication
- **Retry Logic**: Number of retry attempts for failed requests
- **Timeout**: Request timeout in seconds

### File Transfer Forwarder Configuration

Configure file-based forwarding to export alarms to file systems or network shares.

#### Configuration Breakdown

- **File Path**: Local or network path for alarm files
- **File Format**: JSON, XML, or CSV
- **File Naming**: Pattern for file names (e.g., `alarms-{timestamp}.json`)
- **Rotation**: File rotation settings (size, time-based)
- **Compression**: Optional file compression

### Email Forwarder Configuration

Configure email-based forwarding to send alarms via email.

#### Configuration Breakdown

- **SMTP Server**: SMTP server address and port
- **Authentication**: SMTP username and password
- **From Address**: Sender email address
- **To Addresses**: Recipient email addresses (comma-separated)
- **Subject Template**: Email subject line template
- **Body Template**: Email body template with alarm data

### MQTT Forwarder Configuration

Configure MQTT forwarding to publish alarms to MQTT brokers.

#### Configuration Breakdown

- **Broker URL**: MQTT broker address and port
- **Topic**: MQTT topic for alarm messages
- **QoS Level**: Quality of Service level (0, 1, or 2)
- **Client ID**: Unique MQTT client identifier
- **Authentication**: Username and password for broker
- **TLS/SSL**: Enable secure connection

## How the Categories Work Together

You can enable multiple forwarder categories simultaneously:

- **Primary CMS** (e.g., Talos) for main operator workflow
- **Traditional CMS** (e.g., AmWin) for legacy compatibility
- **Technological Forwarder** (e.g., Webhook) for custom integrations

Each forwarder operates independently, allowing you to route alarms to multiple destinations based on your operational needs.

## Use Case Summary

### 1. Existing Evalink Talos Customer (Cloud-Only Customer)

**Who is this for?**
- Customers already using Evalink Talos as their primary monitoring platform
- Organizations seeking seamless integration between Genesis and Talos

**Use Case Description**
- Genesis acts as the video/device intelligence layer
- All alarms, events, and metadata flow automatically to Talos
- Operators work entirely within the Talos interface
- Full bi-directional synchronization between platforms

**Typical Customer Example**
- Established monitoring station with existing Talos deployment
- Wants to add Genesis for enhanced video analytics and device management
- Requires seamless integration without operator retraining

### 2. Customer Migrating from AmWin/ATS/Legacy CMS to Talos

**Who is this for?**
- Customers transitioning from legacy systems to modern cloud platforms
- Organizations requiring gradual migration path

**Use Case Description**
- Run both Traditional CMS and Primary CMS forwarders simultaneously
- Gradually migrate sites from legacy to cloud platform
- Maintain operational continuity during transition
- Eventually phase out legacy forwarder

**Typical Customer Example**
- Monitoring station using AmWin for 10+ years
- Wants to modernize but cannot do "big bang" migration
- Needs parallel operation during transition period

### 3. Hybrid Monitoring Setup (Talos + IMMIX + Technological Services)

**Who is this for?**
- Large monitoring stations with diverse customer requirements
- Organizations serving multiple market segments

**Use Case Description**
- Use Primary CMS (Talos) for cloud-native customers
- Use Traditional CMS (IMMIX) for legacy customers
- Use Technological Forwarder (Webhook) for custom integrations
- Route alarms based on customer type or site configuration

**Typical Customer Example**
- Large monitoring station serving 1000+ sites
- Mix of modern and legacy customer requirements
- Some customers require custom API integrations

### 4. Highly Customized / Tech-Driven Monitoring Stations

**Who is this for?**
- Monitoring stations building custom monitoring solutions
- Organizations with advanced technical requirements

**Use Case Description**
- Use Technological Forwarders (Webhook, MQTT) for custom routing
- Build custom alarm processing and workflow systems
- Integrate with proprietary platforms and databases
- Implement advanced automation and AI processing

**Typical Customer Example**
- Tech-forward monitoring station with in-house development team
- Custom monitoring platform built on modern APIs
- Advanced automation and AI requirements

## Related Documentation

- [Evalink Talos Integration](/docs/getting-started/what-is-evalink-talos)
- [Alarm Management](/docs/alarm-management)
- [Platform Fundamentals](/docs/platform-fundamentals/alarm-flow)

## Need Help?

For assistance with alarm forwarding configuration, contact [GCXONE Support](/docs/support) or consult the [Troubleshooting Guide](/docs/troubleshooting).

