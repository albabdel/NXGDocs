---
title: "Understanding Custom Properties"
description: "Complete guide for Understanding Custom Properties"
tags:
  - role:admin
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 11
last_updated: 2025-12-04
---

# Understanding Custom Properties & Groups

GCXONE provides a flexible mechanism to categorize sites and restrict user visibility using **Customer Groups** and **Custom Fields**.

## Customer Groups (Visibility Filtering)

Customer Groups allow you to control which specific customers a user can access without creating unique roles for every client. This is essential for segregating data in multi-tenant environments.

### Key Benefits
-   **Data Segregation**: Prevent users (e.g., an installer for Company A) from seeing sites belonging to Company B.
-   **Environment Separation**: Isolate production sites from test/trial sites to avoid operator confusion during maintenance.
-   **Scalability**: Assign a single "Operator" role to multiple users, then filter their view simply by changing their Customer Group assignment.

> [!IMPORTANT]
> GCXONE uses a **Positive Definition** policy. Users at the Service Provider level see everything by default unless explicitly restricted by a Customer Group.

## Custom Fields

Custom Fields are user-defined variables that store site-specific metadata used in workflows and reporting.

### Supported Field Types
-   **Text**: Any character sequence (e.g., "License Plate", "Gate Code").
-   **Number**: Positive or negative integers.
-   **Select One / Multiple**: Dropdown lists for standardized inputs (e.g., "Customer Tier", "Security Level").

### Configuration Scope
-   **Sites**: The field appears on the settings page of every individual site.
-   **Site Groups**: The field is set at the group level and inherited by or displayed for all sites in that group.

## Audit and Public Display
A custom field can be marked as **Public** to include it in PDF/Email reports, or as **Hidden** to store sensitive information (like master override codes) that is only visible to specific administrative roles.
