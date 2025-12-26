---
title: "Creating Users & Assigning Roles"
description: "Complete guide for Creating Users & Assigning Roles"
tags:
  - role:admin
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 8
last_updated: 2025-12-04
---

# Creating Users & Assigning Roles

User management in GCXONE allows administrators to invite new users, assign them specific roles, and restrict their access using Customer Groups and organizational hierarchies.

## Inviting a New User

1.  **Navigate to Users**: Open **Settings** → **Users** and click **Invite new user**.
2.  **User Information**: Enter the first name, last name, and email address. Phone number and physical address are optional.
3.  **Account Settings**:
    -   **Role**: Assign a role (e.g., Operator, Manager) that defines their permissions.
    -   **Customer Group**: Optional. Assign to restrict the user to specific customer(s). Leaving this blank gives access to all customers within their role's scope.
    -   **Session Timeout**: Set the inactivity logout period (range: 30–1440 minutes).
4.  **Send Invitation**: Click **Submit**. The user will receive two emails: one for email verification and one for password setup.

## Account Setup Process
1.  **Verification**: The user clicks the link in the "Email confirmation" message.
2.  **Password**: The user clicks the link in the "Changing your password" email.
3.  **Login**: Upon first login, users land on the Dashboard (if permitted) or the first accessible app (typically Configuration).

## Multi-Organization Access
Users invited to multiple tenants use the same email address. Upon login, they are prompted to select which organization to access. They can switch between tenants anytime via **Settings** → **Switch Tenant**.

## Managing Existing Users
-   **Edit Access**: Administrators can modify a user's role or Customer Group from the user list actions menu (three dots).
-   **Delete User**: Permenantly removes access. This also deletes associated contacts and logs for that user's specific actions if they were the primary contact.

---

## Workspaces
Workspaces route alarms and restrict which operators can handle certain alarms (e.g., Standard vs. VIP workspace). A user can be restricted to specific work groups, site groups, or site types.

## Auto-feed
Alarms can be forced to be automatically assigned to a user (auto-feed) using pre-configured filters. This ensures high-priority alarms (like Fire) are immediately delivered to the correct specialist.
