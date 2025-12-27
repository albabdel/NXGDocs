---
title: "Understanding Roles and Access Levels"
description: "Learn about roles, permissions, and access levels in GCXONE - the foundation of user management"
tags:
  - role:admin
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 2
last_updated: 2025-01-21
---

# Understanding Roles and Access Levels

Roles and access levels form the foundation of user management in GCXONE. Understanding these concepts is essential for properly configuring user permissions and access control.

![Roles Overview](./images/user-management-4.png)

## What Are Roles?

Roles define what users can see and do within the platform. Each role contains a set of **privileges** (permissions) that determine access to specific features and sections of the application.

Think of a role as a template that defines:
- Which applications the user can access
- Which sections within applications are available
- What operations the user can perform (view, create, edit, delete)

## Common Role Types

GCXONE provides default roles with predefined permissions, and you can create custom roles to fit specific operational needs:

### Company Admin

**Full access** to all features and settings, including configuring settings for all types of users.

- ✅ All applications and features
- ✅ User and role management
- ✅ System configuration
- ✅ All customers and sites

**Use Case**: Platform administrators who manage the entire organization.

### Manager

**Supervises operators** with permissions to view most objects but limited access to settings.

- ✅ View most objects and data
- ✅ Monitor operations
- ⚠️ Limited access to system settings
- ✅ Reporting and analytics

**Use Case**: Supervisors who need oversight capabilities without full administrative access.

### Operator

**Day-to-day operational access** for monitoring and alarm processing.

- ✅ Monitor live views
- ✅ Process alarms
- ✅ Device management
- ❌ System configuration
- ❌ User management

**Use Case**: Security operators who handle day-to-day monitoring and alarm response.

### Operator Minimal

**Limited view permissions**, strictly for processing alarms.

- ✅ View alarms
- ✅ Process alarms
- ❌ Limited device access
- ❌ No configuration access

**Use Case**: Operators who only need to process alarms without broader system access.

### End User

**Custom role** with limited access for customers to view and control their own sites.

- ✅ View their own sites
- ✅ Control devices at their sites
- ✅ Dashboard access
- ❌ Other customers' data
- ❌ System configuration

**Use Case**: Customers who need to monitor and control their own sites.

![Role Types Comparison](./images/user-management-5.png)

## Access Levels Explained

Every role operates at one of three **access levels** that determine the scope of what users can see and manage within the GCXONE hierarchy:

**Tenant → Customer → Site → Device → Sensor**

| Access Level | Description | Use Case |
|--------------|-------------|----------|
| **Service Provider** | Access across the entire tenant, including all customers and sites | Platform administrators who manage the entire organization |
| **Customer** | Access limited to specific customer account(s) and their associated sites | Account managers or operators who work with specific customers |
| **Site** | Access limited to specific physical locations only | Installers or technicians who work at particular sites |

![Access Levels Hierarchy](./images/user-management-6.png)

:::info Key Point
A Customer can have multiple sites under it. The access level determines the boundary of what a user can see and manage within the hierarchy.
:::

### How Access Levels Work

**Service Provider Level:**
- Users see all customers and sites in the tenant
- Can manage tenant-wide settings
- Typically used for administrators and support staff

**Customer Level:**
- Users see only assigned customer(s) and their sites
- Cannot see other customers' data
- Can be further restricted using Customer Groups
- Typically used for account managers

**Site Level:**
- Users see only specific sites
- Cannot see other sites even under the same customer
- Typically used for installers and technicians

## Permissions Structure

Permissions in GCXONE are organized hierarchically:

### App Level
Which applications the user can access:
- Dashboard
- Configuration
- Monitoring
- Reporting
- Settings

### Category Level
Specific sections within applications:
- Device Management
- Alarm Processing
- User Management
- System Settings

### Action Level
What operations the user can perform:
- **View**: Read-only access
- **Create**: Add new items
- **Edit**: Modify existing items
- **Delete**: Remove items

![Permissions Structure](./images/user-management-7.png)

## Role vs. Access Level vs. Customer Group

It's important to understand how these three concepts work together:

| Concept | Purpose | Set At |
|---------|---------|--------|
| **Role** | Defines what features and actions are available | Role configuration |
| **Access Level** | Defines the scope (Service Provider/Customer/Site) | Role configuration |
| **Customer Group** | Restricts which specific customers are visible | User assignment |

:::tip Understanding the Relationship
Think of it this way:
- **Role** = What you can do (permissions)
- **Access Level** = How broad your view is (scope)
- **Customer Group** = Which specific customers you see (filter)
:::

## Example Scenarios

### Scenario 1: Service Provider Administrator

- **Role**: Company Admin
- **Access Level**: Service Provider
- **Customer Group**: None (sees all customers)
- **Result**: Full access to everything in the tenant

### Scenario 2: Customer Account Manager

- **Role**: Manager
- **Access Level**: Customer
- **Customer Group**: "Customer A Group"
- **Result**: Can manage Customer A's sites but not Customer B's

### Scenario 3: Site Technician

- **Role**: Operator
- **Access Level**: Site
- **Customer Group**: N/A (site-level doesn't use Customer Groups)
- **Result**: Can only access the specific site assigned

## Next Steps

Now that you understand roles and access levels, you're ready to:

1. **[Create and Configure Roles](./creating-roles)** - Learn how to create custom roles
2. **[Set Up Customer Groups](./customer-groups)** - Understand how to use Customer Groups
3. **[Invite Users](./inviting-users)** - Start adding users to your platform

## Related Documentation

- [Creating and Configuring Roles](./creating-roles)
- [Customer Groups](./customer-groups)
- [Permissions Matrix](/docs/admin-guide/permissions-matrix)

