---
title: "User Permissions Matrix"
description: "Complete guide for User Permissions Matrix"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 10
last_updated: 2025-12-04
---

# User Permissions Matrix

The following matrix provides a detailed breakdown of the default permissions assigned to common roles within the GCXONE platform. Use this as a reference when creating custom roles or adjusting existing privileges.

## Core Permissions Matrix

| Application Category     | Action            | Admin | Manager | Operator | End User |
| ------------------------ | ----------------- | :---: | :-----: | :------: | :------: |
| **Configuration**        | View              |   ✅   |    ✅    |    ✅     |    ✅     |
|                          | Create/Edit       |   ✅   |    ⚠️    |    ❌     |    ❌     |
|                          | Delete            |   ✅   |    ❌    |    ❌     |    ❌     |
| **Video Viewer (Salvo)** | Live View         |   ✅   |    ✅    |    ✅     |    ✅     |
|                          | Playback          |   ✅   |    ✅    |    ✅     |    ✅     |
|                          | PTZ Control       |   ✅   |    ✅    |    ✅     |    ✅     |
|                          | Manual Event      |   ✅   |    ✅    |    ✅     |    ❌     |
| **Alarm Queue**          | View              |   ✅   |    ✅    |    ✅     |    ❌     |
|                          | Process Alarm     |   ✅   |    ✅    |    ✅     |    ❌     |
|                          | Close Alarm       |   ✅   |    ✅    |    ✅     |    ❌     |
| **Dashboard**            | View              |   ✅   |    ✅    |    ✅     |    ✅     |
|                          | Configure Widgets |   ✅   |    ⚠️    |    ❌     |    ❌     |
| **Settings**             | User Mgmt         |   ✅   |    ❌    |    ❌     |    ❌     |
|                          | Role Mgmt         |   ✅   |    ❌    |    ❌     |    ❌     |
|                          | Site Groups       |   ✅   |    ✅    |    ❌     |    ❌     |
|                          | Audit Logs        |   ✅   |    ⚠️    |    ❌     |    ❌     |

**Legend:**
-   ✅ **Full Access**: User can perform all actions in this category.
-   ⚠️ **Limited Access**: User can perform certain actions or view restricted data.
-   ❌ **No Access**: Feature is hidden or disabled for this role.

## Privilege Categories

Permissions in GCXONE are granularly assigned across four dimensions:
1.  **App**: Access to high-level modules (e.g., Configuration, Video Viewer, Search).
2.  **Category**: Specific sections within an app (e.g., Users, Sites, Devices).
3.  **Action**: The operational permission (View, Create, Edit, Delete).
4.  **API**: Permission to use specific backend service endpoints for automation.

---

> [!TIP]
> When creating an **Installer** role, enable "View" and "Edit" for **Configuration > Devices & Sensors**, but disable access to **Settings > Users** and **Alarm Queue** to focus their access on deployment and verification.
