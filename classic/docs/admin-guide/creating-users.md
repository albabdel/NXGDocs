---
title: "Creating Users & Assigning Roles"
description: "Complete administrative guide for creating users, assigning roles, configuring access levels, and managing user accounts in GCXONE."
tags:
  - admin
  - configuration
  - beginner
  - GCXONE
sidebar_position: 8
last_updated: 2025-12-28
---


# Creating Users & Assigning Roles

User management in GCXONE allows administrators to invite new users, assign them specific roles, and restrict their access using Customer Groups and organizational hierarchies. This comprehensive administrative guide covers the complete user creation and management workflow.

---

## Overview

GCXONE uses **Role-Based Access Control (RBAC)** to ensure security and scalability. Instead of assigning permissions to individuals, you assign them to **Roles**, and then assign individuals to those roles.

| Benefit | Description |
| :--- | :--- |
| **Scalability** | Easily manage permissions for many users through role-based assignment |
| **Consistency** | Ensures users with similar responsibilities have consistent access |
| **Security** | Centralized permission management reduces security risks |
| **Flexibility** | Easy to modify permissions by updating roles rather than individual users |

---

## Step-by-Step User Creation Guide

### Step 1: Navigate to Users

1. Log in to the GCXONE platform as an administrator
2. Open **Settings** from the main sidebar
3. Click on the **Users** tab

### Step 2: Enter User Information

Click **Invite New User** to open the user invitation form.

**Required Fields:**

| Field | Description |
| :--- | :--- |
| **First Name** | User's first name |
| **Last Name** | User's last name |
| **Email Address** | Login ID - must be unique across the platform |

**Optional Fields:**

| Field | Description |
| :--- | :--- |
| **Phone Number** | For SMS alerts and notifications |
| **Address** | Street, Building, Zip, City, Country |

### Step 3: Configure Account Settings

**Role Assignment:**
- Select the role that defines what this user can access
- Each role determines which features and actions the user can access
- Review role permissions before assignment

**Customer Group (Optional):**
- Select a Customer Group to restrict visibility to specific customers
- If no group is selected, user has default access based on role

**Session Timeout:**
- Set timeout period (default: 30 minutes)
- Range: 30-1440 minutes (0.5-24 hours)

### Step 4: Send Invitation

Click **Submit**. The user receives two automated emails:

| Email | Purpose |
| :--- | :--- |
| **Email Confirmation** | Verifies the email is active |
| **Password Setup Link** | Allows user to create secure password |

---

## What Happens After Invitation?

1. User receives confirmation email and clicks verification link
2. User receives password setup email with secure link (expires in 24 hours)
3. User creates password (min 8 chars, mixed case, numbers, special chars)
4. Upon first login, user lands on Dashboard (if enabled) or first accessible section

---

## Multi-Organization Access

Users invited to multiple tenants using the same email address can access all organizations with a single identity.

| Feature | Description |
| :--- | :--- |
| **Single Identity** | One password for all organizations |
| **Tenant Selection** | Choose organization upon login |
| **Easy Switching** | Switch via Settings → Switch Tenant |
| **Separate Permissions** | Each tenant has independent role assignments |

---

## Managing Existing Users

### Viewing Users

Open **Settings** → **Users** to see all users including:
- Name and email
- Assigned role
- Status (Active/Inactive)

### Editing User Access

1. Open **Settings** → **Users**
2. Click the 3 dots of the user to edit
3. Update role or Customer Group
4. Click **Save**

Changes take effect immediately.

### Removing Users

**Deactivate (Recommended):**
- Sets user to Inactive
- Preserves audit history
- Allows reactivation

**Delete (Permanent):**
- Permanently removes account
- Cannot be restored
- Use only for mistakes or testing

---

## Roles and Access Levels

### Default Roles

| Role | Access Level | Use Case |
| :--- | :--- | :--- |
| **Company Admin** | Full access | IT Directors, Platform Owners |
| **Manager** | Supervisory access | Operations managers, team leads |
| **Operator** | Monitoring access | Security desk staff |
| **Operator Minimal** | Limited view | Dedicated alarm response |

### Access Levels

| Level | Visible Scope |
| :--- | :--- |
| **Service Provider** | All customers and sites in tenant |
| **Customer** | Specific customer account only |
| **Site** | Specific physical locations only |

---

## Best Practices

| Category | Practice |
| :--- | :--- |
| **User Creation** | Start with default roles; verify email addresses before sending |
| **Security** | Quarterly audits; immediate offboarding; no shared accounts |
| **Role Management** | Document custom roles; test before deployment; regular reviews |

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Invitation link expired** | Resend invitation from Users page |
| **Email not received** | Check Spam folder; verify email address |
| **Can't log in** | Ensure verification link was clicked first |
| **Missing features** | Verify role permissions; refresh browser |

---

## Related Articles

For more detailed information:

- [User Management Overview](/docs/getting-started/user-management/overview)
- [Roles and Access Levels](/docs/getting-started/user-management/roles-and-access-levels)
- [Creating and Configuring Roles](/docs/getting-started/user-management/creating-roles)
- [Customer Groups](/docs/getting-started/user-management/customer-groups)
- [Inviting Users](/docs/getting-started/user-management/inviting-users)
- [Managing Users](/docs/getting-started/user-management/managing-users)
- [Talos User Management](/docs/getting-started/user-management/talos-user-management)

---

## Need Help?

If you're experiencing issues with user management:

- Check our [Troubleshooting Guide](/docs/troubleshooting) for common issues
- Review the [User Management Overview](/docs/getting-started/user-management/overview) for concepts
- [Contact Support](/docs/support) for assistance
