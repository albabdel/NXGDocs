---
title: "User Management Overview"
description: "Complete guide to managing users, roles, permissions, and access control in GCXONE and Talos platforms"
tags:
  - role:admin
  - category:configuration
  - difficulty:beginner
  - platform:both
sidebar_position: 1
last_updated: 2025-01-21
---

# User Management Overview

User management is a fundamental aspect of the NXGEN GCXONE and Talos platforms, allowing administrators to control who can access the system and what they can do within it. This comprehensive guide covers everything you need to know about managing users, roles, permissions, and access control.

![User Management Dashboard](./images/user-management-1.png)

## What is User Management?

User management in GCXONE and Talos enables you to:

- **Create and manage user accounts** for team members, operators, and customers
- **Define roles** with specific permissions and access levels
- **Control access** to customers, sites, and devices through Customer Groups
- **Invite users** to the platform with automated email workflows
- **Monitor and manage** active user sessions and access

## Key Concepts

### Roles and Permissions

Roles define what users can see and do within the platform. Each role contains a set of privileges (permissions) that determine access to specific features and sections.

![Roles Configuration](./images/user-management-2.png)

### Access Levels

Every role operates at one of three access levels that determine the scope of what users can see and manage:

- **Service Provider**: Access across the entire tenant, including all customers and sites
- **Customer**: Access limited to specific customer account(s) and their associated sites
- **Site**: Access limited to specific physical locations only

### Customer Groups

Customer Groups provide a flexible way to control which customers a user can access without creating separate roles for each customer. This is particularly useful when you have multiple customers and want to use standardized roles.

![Customer Groups](./images/user-management-3.png)

## Topics Covered

This user management section includes comprehensive guides on:

1. **[Understanding Roles and Access Levels](./roles-and-access-levels)** - Learn about the different role types and how access levels work
2. **[Creating and Configuring Roles](./creating-roles)** - Step-by-step guide to creating custom roles with specific permissions
3. **[Customer Groups](./customer-groups)** - How to use Customer Groups to restrict user access to specific customers
4. **[Inviting Users](./inviting-users)** - Complete workflow for inviting new users to the platform
5. **[Managing Existing Users](./managing-users)** - How to view, edit, and remove user accounts
6. **[Talos User Management](./talos-user-management)** - Platform-specific guides for Talos workflow management

## Quick Start

If you're new to user management, we recommend following this path:

1. **Start with Roles**: Understand the default roles and when to create custom ones
2. **Set Up Customer Groups**: If you have multiple customers, configure Customer Groups
3. **Invite Your First User**: Follow the user invitation workflow
4. **Review and Adjust**: Monitor user access and adjust as needed

## Best Practices

:::tip Best Practice
**Start with Default Roles**: Before creating custom roles, review the default roles (Company Admin, Manager, Operator, etc.) to see if they meet your needs.
:::

:::tip Best Practice
**Use Customer Groups for Scalability**: Instead of creating separate roles for each customer, use Customer Groups to assign the same role to different users with different customer access.
:::

:::warning Important
**Test Role Changes**: When modifying roles, remember that changes take effect immediately for all users assigned to that role. Test changes in a non-production environment first.
:::

## Related Documentation

- [Role-Based Access Control (RBAC)](/docs/admin-guide/rbac)
- [Permissions Matrix](/docs/admin-guide/permissions-matrix)
- [Security Best Practices](/docs/admin-guide/security)

## Need Help?

For assistance with user management, contact [GCXONE Support](/docs/support) or consult the [Troubleshooting Guide](/docs/troubleshooting).

