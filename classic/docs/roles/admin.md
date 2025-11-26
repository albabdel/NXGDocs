---
title: Admin Guide
description: Complete guide for System Administrators to manage users, sites, and global settings.
tags: [admin, configuration, user-management]
---

# Admin Guide

As a **System Administrator**, you have full control over the GCXONE organization. This guide covers the essential tasks for managing your environment.

## User Management

### Inviting Users
1.  Navigate to **Settings > Users**.
2.  Click **Invite User**.
3.  Enter the email address and select a Role (Admin, Operator, Installer).
4.  Click **Send Invitation**.

### Managing Roles & Permissions
GCXONE uses a Role-Based Access Control (RBAC) model:

| Role          | Description                                                               |
| :------------ | :------------------------------------------------------------------------ |
| **Admin**     | Full access to all settings, users, and billing.                          |
| **Manager**   | Can manage sites and view reports, but cannot change global settings.     |
| **Operator**  | Can view and process alarms. Read-only access to site configuration.      |
| **Installer** | Can provision devices and view diagnostics. Restricted to assigned sites. |

## Site Configuration

### Creating a Site
A "Site" represents a physical location (e.g., "Main Office", "Warehouse A").
1.  Go to **Sites > Create New**.
2.  Enter the Site Name and Address.
3.  Assign a Time Zone.

### Global Settings
*   **Security Policies**: Enforce 2FA for all users under **Settings > Security**.
*   **Audit Logs**: View a chronological record of all system actions in the **Audit Log** section.

## Billing & Subscriptions
Manage your subscription plan and view invoices in the **Billing** portal. You can upgrade your plan to add more devices or retention storage at any time.
