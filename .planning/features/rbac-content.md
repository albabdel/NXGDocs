# RBAC Feature Documentation Extract

**Source:** RBAC-Documentation-v2 (3).docx  
**Platform:** GCXONE Security Management Platform  
**Date:** February 2026

---

## 1. High-Level Overview

Role-Based Access Control (RBAC) is the core access control system in GCXONE. It enables administrators to manage user permissions through roles that combine three elements:

1. **Role Information & Users** - Basic role details (name, description, default role toggle) and assigned users
2. **Module Privileges** - Which platform modules users can access and which specific capabilities are enabled (determines WHAT a user can do)
3. **Entity Assignment** - Which customers, sites, devices, and sensors users can access (determines WHERE a user can operate)

**Key Innovation:** Entity access can now be configured at both the role level AND the individual user level, allowing two users to share the same role/privileges while accessing completely different customers or sites.

---

## 2. Key Capabilities/Functionality

### Pain Points Addressed
- "I have to jump between multiple pages to see what access a role actually grants"
- "Creating a new role takes forever with too many configuration steps"
- "I can't quickly tell what permissions my users have"
- "Two users in the same role need access to different customers, but I have to create separate roles for each"

### New Features

| Feature | Description |
|---------|-------------|
| **Guided Role Wizard** | Step-by-step flow for Role Information, User Assignment, Module Privileges, and Entity Access in a single process |
| **Per-Module Privileges** | Granular control at module level (Dashboard, Configuration, Video Activity Search, Marketplace, Video Viewer, Alarm Manager, Map) with capability toggles within each |
| **Dual-Level Entity Access** | Configure entity access at role level AND individual user level - same role, different entity access |
| **Include Children Toggle** | Automatically include all current AND future sub-entities under a selected parent |
| **User Assignment During Creation** | Select users directly within the role creation wizard |
| **Edit Entity Access** | Dedicated interface for per-user entity access with Override and Merge modes |
| **Entity Groups** | Save named collections of entities as reusable templates |
| **Default Role Toggle** | Mark a role as default so new users are automatically assigned upon invitation |

### Default Roles

| Role | Description |
|------|-------------|
| **Super Admin** | Full platform access, complete control over all modules/users/roles/settings. One per tenant, cannot be deleted |
| **Admin** | Manage users, roles, configuration, reports. Cannot access billing or delete critical components |
| **Operator** | Day-to-day monitoring, alarm processing, view dashboards and reports. Limited admin capabilities |
| **Installer** | Manage devices, sensors, network configuration. Cannot manage users/roles |
| **End User** | Read-only access to dashboards and basic configuration. Arm/disarm for assigned devices/sites |

### Module Privileges

Each module has an Access Page toggle plus granular capabilities:

| Module | Key Capabilities |
|--------|-----------------|
| **Dashboard** | Access Page, Accounts filter, Capability filter |
| **Management Insights** | Enable Role, Edit Role, analytics capabilities |
| **Configuration** | Mobile Users, Roles, SubAnalytics, Health Check, Customer Groups, Sensor Table, Audits, IoT, Customer/Site management |
| **Video Activity Search** | Edit Saved, Use Filter, Live, Playback, Alarm Filter |
| **Marketplace** | Pulse View, Roles, Time Sync, Health Check, Timer Count, Zen Mode, Bulk Import |
| **Video Viewer** | Video Controls, capability toggles |
| **Alarm Manager** | Video Controls, capability toggles |
| **Map** | Edit Map, Add Sensor, Add IO, Live Stream View, Wall Monitor, View Dashboard |
| **Talos** | Admin module access or alarm handling only |

### Entity Access Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **No Entity Access** | Users have no entity access by default; assigned per user via Edit Entity Access | Shared role with individual entity assignments |
| **Selected Entities** | Restricted to specifically selected entities (with or without children) | Specific sub-lists or tenants with identical access |
| **Full Access** | Default to full access for all Customers, Sites, Devices, Sensors | Admin or super-user roles |

### Edit Entity Access: Override vs Merge

| Mode | Behavior |
|------|----------|
| **Override** | User's custom entity selection REPLACES role-level defaults |
| **Merge** | Selected entities are ADDED on top of role's existing assignments |

---

## 3. Target Audience

- **IT Directors & Platform Owners** - Need complete control over platform access
- **Operations Managers / Team Leads / Supervisors** - Oversight capabilities, user management
- **Security Desk Staff / Monitoring Center Operators** - Day-to-day alarm processing and monitoring
- **Field Technicians / Installers** - Device management and network configuration
- **Client-Side Personnel (End Users)** - Basic site interaction and viewing

---

## 4. Screenshots and Diagrams Mentioned

| Figure | Description |
|--------|-------------|
| **Figure 1** | Role Management page showing all default roles with descriptions |
| **Figure 2** | Entity tree with Include Children toggles (blue sliders) enabled on selected sites |
| **Figure 3** | Role Management page with Configure New Role and Edit Entity Access buttons |
| **Figure 4** | Role Information step showing name, description, and Default Role toggle |
| **Figure 5** | User selection grid - click to select, gold border indicates selection |
| **Figure 6** | Dashboard module - Access Page toggle with Accounts and Capability filters |
| **Figure 7** | Management Insights module - Enable Role and Edit Role capabilities |
| **Figure 8** | Configuration module - granular access settings |
| **Figure 9** | Video Activity Search - filter types, search categories, and capabilities |
| **Figure 10** | Alarm Manager module - Video Controls and Capability settings |
| **Figure 11** | Marketplace module - Control subscriptions and billing |
| **Figure 12** | Talos module - Select admin module or alarm handling access |
| **Figure 13** | Map module - Edit Map, Add Sensor, IO management, Live Stream View |
| **Figure 14** | Full Access toggle enabled - users get unrestricted entity access |
| **Figure 15** | No Entity Access mode - entities assigned per user via Edit Entity Access |
| **Figure 16** | Selected Entities mode - tree view with Include Children toggles per site |
| **Figure 17** | Edit Entity Access - entity tree (left) with user selection and Override/Merge tabs (right) |
| **Figure 18** | Override mode - user selected with entity tree showing role and user entity tabs |
| **Figure 19** | Entity Group Management page showing all configured groups |
| **Figure 20** | Entity Group Information step - enter name and description |
| **Figure 21** | Entity selection step - check entities and enable Include Children toggles |
| **Figure 22** | Select Entity Group dropdown in Role entity assignment |
| **Figure 23** | Select Entity Group dropdown in Edit Entity Access |

### Entity Hierarchy Diagram

```
Service Provider (Tenant/Account)
└── Customer (Organization)
    └── Site (Physical Location)
        └── Device (Hardware)
            └── Sensor (Camera/Detector)
```

---

## 5. Related Existing Documentation

| File | Description |
|------|-------------|
| `getting-started_talos_roles-and-permissions.mdx` | Talos-specific roles & permissions (already has "What's New" section) |
| `getting-started_user-management_roles-and-access-levels.mdx` | GCXONE roles and access levels (already has "What's New" section) |
| `getting-started_user-management_creating-roles.mdx` | Creating roles documentation |
| `classic/static/pdfs/platform-fundamentals/roles-permissions.pdf` | Classic PDF documentation |

---

## 6. Documentation Recommendation

This is a **MAJOR feature** that should be documented as:

1. **Single Release Item** - RBAC Enhancement (combining all new capabilities)
2. **New Documentation Article** - Consider a comprehensive "Role-Based Access Control Guide" covering:
   - Role Management (create/edit/delete)
   - Module Privileges configuration
   - Entity Access (three modes, Include Children)
   - Edit Entity Access (per-user customization)
   - Entity Groups (reusable templates)
   - Step-by-step examples (Regional Admins, View-Only Operator, Installer, Mobile App)

The existing articles (`talos_roles-and-permissions.mdx` and `user-management_roles-and-access-levels.mdx`) already have "What's New" sections with some RBAC features listed, but the full capability set documented here is much more comprehensive and may warrant a dedicated article.
