---
title: "User Management Guide"
description: "Complete guide for user management in GCXONE including roles, access levels, customer groups, and user invitations"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 10
last_updated: 2025-01-21
---

# User Management Guide

:::info Enhanced Documentation Available
**A comprehensive, enhanced user management section is now available** with detailed guides, step-by-step instructions, and visual aids. 

👉 **[View the complete User Management section](/docs/getting-started/user-management/overview)**
:::

This guide covers the complete user management system in NXGEN GCXONE, including creating roles, configuring privileges, setting up customer groups, and inviting users to the platform.

## Quick Navigation

For detailed guides with images and step-by-step instructions, visit:

- **[User Management Overview](/docs/getting-started/user-management/overview)** - Complete introduction and navigation
- **[Understanding Roles and Access Levels](/docs/getting-started/user-management/roles-and-access-levels)** - Learn about roles and permissions
- **[Creating and Configuring Roles](/docs/getting-started/user-management/creating-roles)** - Step-by-step role creation guide
- **[Customer Groups](/docs/getting-started/user-management/customer-groups)** - Using Customer Groups for access control
- **[Inviting Users](/docs/getting-started/user-management/inviting-users)** - Complete user invitation workflow
- **[Managing Existing Users](/docs/getting-started/user-management/managing-users)** - View, edit, and manage users
- **[Talos User Management](/docs/getting-started/user-management/talos-user-management)** - Talos-specific user management

## Topics Covered

1. Understanding Roles and Access Levels
2. Creating and Configuring Roles
3. Customer Groups
4. Inviting Users
5. Managing Existing Users

## Understanding Roles and Access Levels

### What Are Roles?

Roles define what users can see and do within the platform. Each role contains a set of privileges (permissions) that determine access to specific features and sections of the application.

### Common Role Types

GCXONE provides default roles with predefined permissions, and you can create custom roles to fit specific operational needs:

- **Company Admin**: Full access to all features and settings, including configuring settings for all types of users
- **Manager**: Supervises operators with permissions to view most objects but limited access to settings
- **Operator**: Focuses on day-to-day operational access for monitoring and alarm processing
- **Operator Minimal**: Limited view permissions, strictly for processing alarms
- **End User**: Custom role with limited access for customers to view and control their own sites

### Access Levels Explained

Every role operates at one of three access levels that determine the scope of what users can see and manage within the GCXONE hierarchy (Tenant → Customer → Site → Device → Sensor):

| Access Level | Description | Use Case |
|--------------|-------------|----------|
| **Service Provider** | Access across the entire tenant, including all customers and sites | Platform administrators who manage the entire organization |
| **Customer** | Access limited to specific customer account(s) and their associated sites | Account managers or operators who work with specific customers |
| **Site** | Access limited to specific physical locations only | Installers or technicians who work at particular sites |

:::info Key Point
A Customer can have multiple sites under it. The access level determines the boundary of what a user can see and manage within the hierarchy.
:::

## Creating and Configuring Roles

### Step 1: Navigate to Roles

1. Open **Settings**
2. Click on the **Roles** tab
3. Click **Configure new role** to create a new role

### Step 2: Define the Role

1. Enter a **Role Name** (e.g., "End User", "Installer", "Operator")
2. Add a brief **Description** explaining the role's purpose

### Step 3: Configure Privileges

Select the specific privileges you want to assign to this role. Permissions in GCXONE are categorized by:

- **App**: Which applications the user can access
- **Category**: Specific sections within applications
- **Action**: What operations the user can perform (view, create, edit, delete)

#### Example Configurations

- **Company Admin Role**: Enable all privileges across all categories
- **Operator Role**: Enable monitoring, alarm processing, and device management; disable system configuration
- **End User Role**: Enable only Configuration and Dashboard for site control
- **Installer Role**: Enable device setup, mobile towers, and sensors; disable reporting and user management

### Step 4: Set Access Level

Choose the appropriate access level for this role:

- **Service Provider**: For tenant-wide access
- **Customer**: For customer-specific access (can be further refined with Customer Groups)
- **Site**: For site-specific access

### Step 5: Configure Session Timeout

Set the session timeout duration (in minutes, default is 30 minutes):

- **Range**: 30-1440 minutes (0.5-24 hours)
- If GCXONE is unattended for the set time, the user is automatically logged out

:::important Session Timeout
Session timeouts are configured at the role level, not per individual user. All users assigned to this role will have the same session timeout setting.
:::

### Step 6: Save the Role

Click **Save** to finalize the role setup. It will immediately be available for user assignment.

## Editing Existing Roles

Roles can be modified at any time:

1. Open **Settings**
2. Click on the **Roles** tab
3. Select the role you want to modify
4. Click **Edit**
5. Update privileges, access level, or session timeout as needed
6. Click **Save**

:::warning Important
Changes to roles take effect immediately and will apply to all users assigned to that role.
:::

## Deleting Roles

Roles that are no longer needed can be deleted. Ensure no active users are assigned to a role before deleting it, or reassign those users to a different role first.

## Customer Groups

### What Are Customer Groups?

Customer Groups provide a flexible way to control which customers a user can access without creating separate roles for each customer. This is particularly useful when you have multiple customers and want to use standardized roles.

### Purpose and Benefits

Customer Groups provide a mechanism to restrict the visibility and access of specific users to a subset of data within a tenant. This is particularly useful for:

#### Segregating Customer Data

If a monitoring station (Service Provider) handles multiple installers, you can group customers by installer. Users assigned to "Customer Group A" will not see sites or data from "Customer Group B".

#### Production vs. Test Sites

Separate production sites from test/trial sites. Prevent operators from viewing or acting on test alarms by restricting them to the "Production" Customer Group.

#### Without Customer Groups

- Users at Service Provider level would see all customers by default
- You would need to create separate roles for each customer or segment
- Managing permissions becomes complex as you scale

#### With Customer Groups

- Create one unified role (e.g., "End User" or "Operator")
- Assign different Customer Groups to different users
- Each user sees only their designated customer(s)
- Role permissions remain consistent across all customers

### Creating a Customer Group

1. Open **Configuration**
2. Click on the **Customer Groups** tab in the horizontal menu
3. Click **Add New**
4. Enter a descriptive **Name** (typically the customer's name or a descriptive label like "All Production Sites")
5. Add a **Description** (e.g., "End user Customer group for the customer")
6. Toggle the group to **Active**
7. **Select customers**: Choose which customer(s) should be included in this group
8. Click **Create**

:::important Access Rule
GCXONE does not support an "exclusion" policy (e.g., "See everything except Site X"). Access must be positively defined via Customer Groups. If a user is set up at the Service Provider level, they have access to all customers by default unless explicitly restricted by assigning them to a specific Customer Group.
:::

### Example Setup

Let's say you have these customers:
- Customer 1
- Customer 2
- Customer 3
- Customer 4
- Customer 5

You would create a Customer Group for each:
- Customer Group: "Customer X" → Contains customer "Customer 1"
- Customer Group: "Customer Y" → Contains customer "Customer 2, Customer 3, Customer 4, Customer 5"

And so on...

### Customer Groups vs. Access Levels

- **Access Level** (set in Role): Defines the type of access (Service Provider/Customer/Site)
- **Customer Group** (assigned to User): Restricts which specific customers the user can see

Think of it this way: The role's access level sets the boundary, and the Customer Group applies the filter within that boundary.

### Editing Customer Groups

Customer Groups can be modified after creation:

1. Navigate to **Customer Groups**
2. Click the **Actions** menu (three dots) next to the group
3. Select **Edit**
4. Add or remove customers as needed
5. Save changes

## Inviting Users

### Step 1: Navigate to Users

1. Open the **Settings**
2. Click on the **Users**
3. Click **Invite new user** to start adding a new user

### Step 2: Enter User Information

Fill in the required fields:

**Personal Information:**
- First Name
- Last Name
- Email Address
- Phone Number (optional)

**Address Information (optional):**
- Street Name
- Building Number
- Zip Code
- City
- Country

### Step 3: Configure Account Settings

**Role Assignment:**
- Select the role that defines what this user can access
- Example: "End User", "Admin", "Operator", etc.

**Customer Group (optional):**
- If you want to restrict this user to specific customer(s), select a Customer Group
- If no Customer Group is selected, the user will have the default access defined in their role

**Session Timeout:**
- Set the session timeout period (default: 30 minutes)
- Range: 30-1440 minutes (0.5-24 hours)

### Step 4: Send Invitation

Click **Submit**. The user will receive two emails:

1. **Email confirmation**: To verify their email address
2. **Password setup link**: A link to set up their password for the account

### What Happens Next?

1. The user receives an email titled "Changing your password for the nxgen NXGEN application"
2. They click the password reset link in the email
3. They create a new password for their account
4. Upon first login, they are directed to the appropriate section based on their role:
   - If Dashboard is enabled in their role → They land on Dashboard
   - If Dashboard is not enabled → They land on the first accessible section (e.g., Configuration)

### Multi-Organization Access

If a user is invited to multiple organizations (tenants):

- They use the same email address for all organizations
- Upon login, they'll see a prompt to select which organization to access
- They can switch between organizations anytime using the **Switch Tenant** option in Settings

## Managing Existing Users

### Viewing Users

Open **Settings** and click on the **Users** tab to see all users in your organization, including:

- Name and email
- Assigned role
- Status (Active/Inactive)

### Editing User Access

To modify a user's role or Customer Group:

1. Open **Settings**
2. Click on the **Users** tab
3. Click on the **3 dots** of the user you want to edit
4. Update their role or Customer Group assignment
5. Click **Save**

Changes take effect immediately.

### Removing Users

To remove a user's access:

1. Open **Settings**
2. Click on the **Users** tab
3. Click on the **3 dots** of the user you want to remove
4. Click **Delete User**
5. Confirm the deletion

## Related Documentation

- [Role-Based Access Control (RBAC)](/docs/admin-guide/rbac)
- [Permissions Matrix](/docs/admin-guide/permissions-matrix)
- [Creating Users](/docs/admin-guide/creating-users)

## Need Help?

For assistance with user management, contact [GCXONE Support](/docs/support) or consult the [Troubleshooting Guide](/docs/troubleshooting).

