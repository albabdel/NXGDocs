---
title: "Talos Roles and Permissions"
description: "Complete guide to creating and managing user roles, permissions, and user types in Evalink Talos"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:talos
sidebar_position: 4
last_updated: 2025-12-21
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Talos Roles and Permissions

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      User roles and permissions are essential for maintaining security and operational efficiency in Talos. This guide covers everything you need to know about creating roles, managing user types, and configuring permissions in Evalink Talos.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>👥</div>
      <h3 style={{color: 'white', margin: 0}}>Roles & Permissions</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Access Control</p>
    </div>
  </div>
</div>

## Overview

Talos provides a flexible role-based access control system that allows you to define exactly what users can see and do within the platform. This system is built on two main concepts:

1. **User Types** - General permission levels (like Company Admin, Manager, Operator)
2. **Roles** - Specific sets of permissions that can be customized

## Users & Roles Management

### Accessing User Management

To manage users and roles in Talos:

1. Navigate to **Settings**
2. Select **Users**
3. You'll see options for:
   - Managing existing users
   - Creating new roles
   - Configuring user types

## Creating and Modifying Roles

To make any changes to existing roles or create new roles specific for certain users, follow these steps:

### Step-by-Step Process

1. **Navigate to Settings**
   - Click on the **Settings** menu item

2. **Select Users**
   - Click on **Users** in the settings menu

3. **Add and Save Role**
   - Click **Add Role** or select an existing role to modify
   - Configure the role based on your requirements
   - Set all necessary permissions
   - Click **Save**

4. **Create a User Type for the Role**
   - After creating the role, create a corresponding User Type
   - Link the User Type to the role you just created
   - Configure any additional User Type settings

:::info Detailed Documentation
For detailed information about role creation and management, visit the [official Evalink Talos documentation on user roles](https://documentation.evalink.io/talos/manager/tags/user-role/).
:::

## Understanding User Types

User Types define a general level of permission. Talos comes with several default user types:

<div className="row margin-bottom--lg">
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444', height: '100%'}}>
      <div className="card__header">
        <h4>👑 Company Admin</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.85rem'}}>Full access to all features and settings</p>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #F59E0B', height: '100%'}}>
      <div className="card__header">
        <h4>👔 Manager</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.85rem'}}>Can manage workflows, sites, and users (with some restrictions)</p>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h4>👤 Operator</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.85rem'}}>Can manage alarms and workflows but not change company settings</p>
      </div>
    </div>
  </div>
  <div className="col col--3">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h4>🔒 Operator Minimal</h4>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.85rem'}}>Limited access, can only view and process assigned alarms</p>
      </div>
    </div>
  </div>
</div>

### Default User Types

| User Type | Permissions | Use Case |
|-----------|------------|----------|
| **Company Admin** | Full access to all features and settings | System administrators, IT managers |
| **Manager** | Can manage workflows, sites, and users (with restrictions) | Operations managers, team leads |
| **Operator** | Can manage alarms and workflows but not change company settings | Security operators, monitoring staff |
| **Operator Minimal** | Limited access, can only view and process assigned alarms | Junior operators, trainees |

## Understanding Roles

A **Role** is a set of specific permissions that dictate what a user can see and do. Unlike User Types, which are predefined, Roles can be fully customized.

### Role Permissions

When you create or edit a role, you'll see a long list of permissions you can check or uncheck. These permissions are organized by category:

**Common Permission Categories:**
- **Alarm**: Create, Delete, Update, View
- **Site**: Create, Delete, Update, View
- **Workflow**: Create, Delete, Update, View
- **User**: Create, Delete, Update, View
- **Company**: Update settings, View reports
- **Reports**: Generate, Export, View

**Example Permissions:**
- `Alarm:Create` - Can create new alarms
- `Alarm:Delete` - Can delete alarms
- `Site:Update` - Can update site settings
- `Workflow:Create` - Can create workflows
- `User:View` - Can view user information

### Creating Custom Roles

**Example: "Super Operator" Role**

An "Operator" role might be able to manage alarms but not change company settings. A "Super Operator" role could be an operator with some extra permissions, like:
- Deleting alarms
- Doing mass alarm actions
- Viewing advanced reports
- Managing certain site settings

**To create a custom role:**

1. Go to **Settings > Users**
2. Click **Add Role**
3. Give the role a descriptive name (e.g., "Super Operator")
4. Check the permissions you want to grant
5. Uncheck permissions you want to restrict
6. Click **Save**

## Workspaces

User types can also be linked to **Workspaces**. Workspaces are a way to group sites (e.g., by language, region, or client type).

### How Workspaces Work

You can assign operators to a specific workspace so they only see and manage alarms for those sites. This is useful if you have:
- Operators specializing in certain languages
- Regional teams managing specific areas
- Different client types requiring specialized handling

**Example:** You might have:
- **English Workspace**: Contains all English-speaking customer sites
- **French Workspace**: Contains all French-speaking customer sites
- **VIP Workspace**: Contains all VIP customer sites

Operators assigned to the English Workspace will only see alarms from English-speaking customers.

## Managing Users

### Viewing Users

In the **Company > Users** section, you can see:
- Everyone who has access to your Talos platform
- Their email addresses
- Their status (e.g., invited, active)
- The roles assigned to them

### Inviting New Users

To invite a new user:

1. Go to **Company > Users**
2. Click **Invite User**
3. Enter the user's email address
4. Assign them a **User Type**
5. Optionally assign them to a **Workspace**
6. Click **Send Invitation**

The user will receive an email invitation to join your Talos account.

### User Status

Users can have different statuses:

- **Invited**: User has been invited but hasn't accepted yet
- **Active**: User has accepted the invitation and can log in
- **Inactive**: User account is disabled (cannot log in)
- **Suspended**: User account is temporarily suspended

## Permission Best Practices

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>✅ Role and Permission Best Practices</h3>
  <ul>
    <li><strong>Principle of Least Privilege</strong>: Grant users only the minimum permissions they need to perform their job</li>
    <li><strong>Use Workspaces</strong>: Limit operator access to relevant sites using workspaces</li>
    <li><strong>Regular Audits</strong>: Periodically review user permissions to ensure they're still appropriate</li>
    <li><strong>Role Templates</strong>: Create role templates for common job functions to ensure consistency</li>
    <li><strong>Documentation</strong>: Document what each custom role is for and who should have it</li>
    <li><strong>Test Roles</strong>: Test new roles with a test user before applying to production users</li>
    <li><strong>Remove Unused Roles</strong>: Clean up roles that are no longer needed</li>
    <li><strong>Monitor Access</strong>: Regularly check who has access to sensitive features</li>
  </ul>
</div>

## Common Role Scenarios

### Scenario 1: Regional Operator

**Requirements:**
- Can only see alarms from sites in their region
- Can process alarms and update workflows
- Cannot modify site settings
- Cannot access company settings

**Solution:**
1. Create a "Regional Operator" role with limited permissions
2. Assign the role to a User Type
3. Create a Workspace for the region
4. Assign the user to the Workspace

### Scenario 2: Read-Only Auditor

**Requirements:**
- Can view all alarms and events
- Can generate reports
- Cannot modify anything
- Cannot delete data

**Solution:**
1. Create a "Read-Only Auditor" role
2. Grant only "View" and "Report" permissions
3. Deny all "Create," "Update," and "Delete" permissions
4. Assign to appropriate User Type

### Scenario 3: Site Manager

**Requirements:**
- Can manage sites and workflows for their assigned sites
- Can view and process alarms
- Cannot access company-wide settings
- Cannot manage users

**Solution:**
1. Create a "Site Manager" role
2. Grant Site and Workflow management permissions
3. Grant Alarm viewing and processing permissions
4. Deny Company and User management permissions
5. Use Workspaces to limit site access

## Troubleshooting Permission Issues

### User Cannot Access Feature

**Problem:** User reports they cannot see or access a feature they should have access to.

**Solutions:**
1. Check the user's assigned role
2. Verify the role has the necessary permissions
3. Check if the user is assigned to the correct workspace
4. Verify the user type has the required base permissions
5. Check if there are any site-level restrictions

### User Has Too Much Access

**Problem:** User can access features they shouldn't have access to.

**Solutions:**
1. Review the user's assigned role
2. Remove unnecessary permissions from the role
3. Consider creating a more restrictive role
4. Verify workspace assignments are correct
5. Check if the user has multiple roles that might be conflicting

### Permission Changes Not Taking Effect

**Problem:** Changes to roles or permissions don't seem to be applied.

**Solutions:**
1. Ensure you clicked "Save" after making changes
2. Have the user log out and log back in
3. Clear browser cache
4. Verify the changes were saved correctly
5. Check if there are conflicting permissions from multiple roles

## Related Articles

- [Getting to Know Evalink Talos - Complete Guide](/docs/getting-started/Talos/getting-to-know-evalink-talos-complete)
- [Talos Site Management](/docs/getting-started/Talos/talos-site-management)
- [Talos Workflows and Alarms](/docs/getting-started/Talos/talos-workflows-and-alarms)
- [What is Evalink Talos?](/docs/getting-started/what-is-evalink-talos)

## Need Help?

For comprehensive Evalink Talos documentation on roles and permissions, visit:
- [Official Evalink Talos User Role Documentation](https://documentation.evalink.io/talos/manager/tags/user-role/)
- [GCXONE Support](/docs/support)

