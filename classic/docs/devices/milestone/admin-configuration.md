---
title: "Milestone Admin Configuration"
description: "Complete guide for Milestone Admin Configuration"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
  - device:milestone
sidebar_position: 2
last_updated: 2025-12-04
---

# Milestone Admin Configuration

Configure the Milestone XProtect VMS integration for GCXONE.

## Prerequisites

- Milestone XProtect Server running and accessible.
- Milestone Mobile Server (required for WebSocket communication).
- Integrated User account in Milestone with sufficient privileges.
- Knowledge of the `baseUrl` and WebSocket endpoints for your Milestone installation.

## Configuration Steps

### 1. Milestone Server Preparation
Ensure the Milestone Mobile Server is installed and configured. This service provides the WebSocket interface used by GCXONE for real-time video streaming.

### 2. User Permissions
Create or identify a user in Milestone XProtect Management Client. This user must have:
- **View** permissions for the desired cameras.
- **PTZ** control permissions if applicable.
- **Playback** permissions for timeline features.

### 3. Add Device to GCXONE
In the GCXONE Configuration App:
1. Select **Milestone** as the device type.
2. Enter the **Base URL** (the address of your Milestone server).
3. Provide the **Username** and **Password**.
4. Configure any custom properties if required (Websocket endpoints).
5. Click **Discover** and **Save**.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
