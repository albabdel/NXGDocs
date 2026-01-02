---
title: "Site Groups Management"
description: "Complete guide for Site Groups Management"
tags:
  - admin
  - configuration
  - intermediate
  - GCXONE
sidebar_position: 7
last_updated: 2025-12-04
---


# Site Groups & Hierarchy Management

GCXONE uses a hierarchical approach to organize customer locations, allowing for efficient management of large-scale deployments across multiple regions and organizational departments.

## The GCXONE Hierarchy

Organization within the platform follows a structured path:
1.  **Tenant / Service Provider**: The top-level entity managing all downstream hardware and users.
2.  **Organizational Unit (OU)**: High-level grouping for major clients or divisions (e.g., "Supermarket Chain HQ").
3.  **Site Group**: Regional or functional groupings within an OU (e.g., "North Holland Stores").
4.  **Site**: The individual physical location generating alarms and video streams.
5.  **Device**: Hardware connected to the site (NVR, Camera, I/O).
6.  **Sensor/Channel**: The specific data source (e.g., Camera 01, Motion Sensor A).

## Using Site Groups

Site Groups are not mandatory but are highly recommended for sites with high camera counts or regional management needs.

### Benefits of Grouping
-   **Simplified Reporting**: Generate an alarm list or health report for an entire group at once.
-   **Workflow Application**: Apply a specific holiday schedule or escalation scenario to all sites in a group (e.g., all stores in a city undergoing local festivities).
-   **Technical Categorization**: Group sites by the type of hardware deployed (e.g., "Teltonika Router Sites") to simplify maintenance workflows.

### Inheritance Logic
When GCXONE searches for a setting (like a "Guard" contact or a "Business Hours" schedule), it starts at the **Site** level and works its way up the hierarchy.
-   If a site-specific contact is not found, the system checks the **Site Group**.
-   If still not found, it checks the **Organizational Unit**.
-   Finally, it falls back to the **Global (Tenant)** settings.

---

> [!TIP]
> Use **Service Companies** to link independent maintenance teams (e.g., "Local Electrician") to multiple site groups regardless of their customer affiliation.
