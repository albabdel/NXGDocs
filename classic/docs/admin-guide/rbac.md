---
title: "Role-Based Access Control (RBAC)"
description: "Complete guide for Role-Based Access Control (RBAC)"
tags:
  - admin
  - configuration
  - intermediate
  - GCXONE
sidebar_position: 9
last_updated: 2025-12-04
---


# Role-Based Access Control (RBAC)

RBAC in GCXONE ensures that users have the precise level of access required for their operational duties, from tenant-wide administration to site-specific monitoring.

## Understanding Roles

Roles define what users can see and do within the platform. Each role contains a set of privileges (permissions) categorized by Application, Category, and Action (View, Create, Edit, Delete).

### Common Role Types
-   **Company Admin**: Full access to all features, including system-wide configuration and user management.
-   **Manager**: Supervises operations with broad view permissions but limited access to core settings.
-   **Operator**: Optimized for day-to-day alarm processing and live monitoring.
-   **End User**: Highly restricted role allowing customers to view and control only their own sites.

## Access Levels

Every role operates at one of three access levels, defining the boundary of visibility within the system hierarchy:

| Access Level         | Description               | Scope                                      |
| -------------------- | ------------------------- | ------------------------------------------ |
| **Service Provider** | Tenant-wide access.       | All Customers and all Sites.               |
| **Customer**         | Account-specific access.  | Only assigned Customer(s) and their sites. |
| **Site**             | Location-specific access. | Only assigned physical locations.          |

## Session Management

Session timeouts are configured at the **Role level**, ensuring consistent security policies across user types.
-   **Range**: 30 to 1440 minutes (up to 24 hours).
-   **Behavior**: If the GCXONE interface is unattended for the set duration, the user is automatically logged out.

## Configuration Steps

1.  **Define Role**: Give the role a descriptive name (e.g., "Installer") and set the scope (Access Level).
2.  **Assign Privileges**: Select the specific app categories (e.g., "Configuration", "Dashboard") and permitted actions.
3.  **Set Timeout**: Define the session expiration for all users assigned to this role.
4.  **Assigned to Users**: Map the role to individual accounts via the **Users** tab.

> [!IMPORTANT]
> Changes to a role's permissions or access levels take effect immediately for all users assigned to that role.
