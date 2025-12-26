---
title: "Getting to Know Evalink Talos - Complete Guide"
description: "Comprehensive guide to understanding and using Evalink Talos, the cloud-based alarm management platform with microservices architecture"
tags:
  - role:all
  - category:overview
  - difficulty:beginner
  - platform:talos
sidebar_position: 1
last_updated: 2025-12-21
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting to Know Evalink Talos - Complete Guide

<div className="row margin-bottom--lg">
  <div className="col col--8">
    <p className="text--lg">
      Evalink Talos is a sophisticated, cloud-based alarm management platform designed for monitoring stations and security service providers. Built on Amazon Web Services (AWS) with global redundancy, Talos provides enterprise-grade reliability and scalability for managing security alarms across multiple sites and customers.
    </p>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', padding: '1.5rem', textAlign: 'center'}}>
      <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🚨</div>
      <h3 style={{color: 'white', margin: 0}}>Evalink Talos</h3>
      <p style={{color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.9rem'}}>Cloud-Based Alarm Management</p>
    </div>
  </div>
</div>

## What is Evalink Talos?

Evalink Talos is an online platform for managing security alarms. It's a software service that you access over the internet, built to be very reliable using Amazon Web Services (AWS) with servers in America, Europe, and Asia. These servers are in different "availability zones," which means if one area has a problem, the others can keep the system running.

### Microservices Architecture

Talos is made up of many small, independent parts called **"microservices."** Each feature, like how sites are handled, or how alarms are processed, is its own microservice. These parts talk to each other but can work on their own. This design helps keep the platform highly available. If one small part has an issue, the rest of the system should operate normally.

This setup also makes it easier for the Evalink team to update the system, add new features, or fix problems quickly and remotely.

<div className="card shadow--md" style={{background: 'var(--ifm-color-emphasis-50)', border: '2px solid var(--ifm-color-primary)', marginBottom: '2rem', padding: '1.5rem'}}>
  <h3 style={{marginTop: 0}}>🔄 Platform Updates</h3>
  <p style={{marginBottom: 0}}>
    When there's an update, especially a bigger one that changes how things look or work, the platform might ask you to <strong>reload the page</strong>. Once you reload, the new updates are applied automatically.
  </p>
</div>

## How to See What's New

If you want to check for the latest releases and see what has changed in Talos:

1. Click on your **Profile icon**. This is usually in the top right corner of the screen.
2. In the menu that opens, look for an option called **"What's new"**. Clicking this will show you information about recent updates.

## The Main Dashboard

When you first log into Talos, you'll usually see a dashboard. This page gives you a quick overview of important information. You might see things like:

- A summary of incoming alarms
- A list of alarms that are assigned to you or your team
- Other key numbers, charts, or integration statuses

The main dashboard often shows how many alarms are coming in and if any are specifically assigned to you or your team.

## Understanding "Sites" in Talos

In Talos, a **"site"** is basically anything that can create an alarm that you need to monitor. It's a flexible term.

A site could be:
- A physical building, like an office, a factory, or a store
- A specific area within a building, like one floor
- A personal panic button that someone carries

If it can send an alarm signal, and you need to keep track of it, Talos calls it a site.

### Site Status: Active vs. Inactive

Sites in Talos can have different statuses, which affect how they work and how they are billed.

<div className="row margin-bottom--lg">
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #EF4444', height: '100%'}}>
      <div className="card__header">
        <h3>❌ Inactive Site</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Talos will <strong>not accept any new alarms</strong> from it</li>
          <li>You won't see any new alarms for this site</li>
          <li>You are usually <strong>not charged</strong> for sites that are marked as inactive</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>✅ Active Site</h3>
      </div>
      <div className="card__body">
        <ul style={{fontSize: '0.9rem'}}>
          <li>Fully operational</li>
          <li>Can send alarms, those alarms will be processed</li>
          <li>The site counts towards your billing</li>
        </ul>
      </div>
    </div>
  </div>
</div>

### Good Practice for Adding New Sites

Let's say you know you're going to connect 100 new customer locations next week. A good approach is to create these 100 sites in Talos this week but set them all as **inactive**. You can get them all set up in the system, but you won't be charged for them while you're waiting for the actual migration or connection. Then, when you're ready to bring them online, you simply switch their status to **"active."**

### Using "Test Mode" for Sites

Sometimes, you'll need to put a site into **"test mode."** This is useful if you know there's going to be a lot of activity that isn't real (like technicians working on sensors) or if you're testing new configurations.

When a site is in test mode, you can configure Talos to:
- Treat certain types of alarms from that site as "test alarms." These are often ignored for normal operator queues or logged differently
- Still allow other critical alarm types from that same site to come through as real, actionable alarms

**Example of Test Mode:**

Imagine a factory is replacing all its motion sensors over a weekend. You expect many motion detection alarms during this work, and they aren't real intrusions. However, the factory's fire alarm system must remain fully operational.

You can put the factory site into a specific test mode where Talos is told: "For this weekend, ignore all motion detection alarms from the factory because of the sensor upgrade. But, if any fire alarms come in, treat those as urgent and real."

This way, operators aren't distracted by the test motion signals but will still respond immediately to a genuine fire alert.

## Exploring Sites and Connections

### The "Sites" Page: Your Customer List

After the main dashboard and the alarms page, the **"Sites"** page is another important area.

- This page shows you a list of all your customer sites
- You can filter this list to see sites that are "active," "inactive," or in "test mode"
- You can also use search and other filters (like "installer company," if you use that feature) to find specific sites quickly

The table showing your sites can often be customized. You can usually click on an icon (often three dots or a settings gear) to change which columns are visible, like adding specific custom fields or changing the order of information. This lets operators or administrators set up a view that works best for them.

### Virtual Devices: Understanding Connections

Within the "Sites" page, there's often a tab or section called **"Virtual Devices."**

This area lists all the "receivers" or connections for all your customers. These aren't physical hardware boxes in your office; they are virtual connection points in the Talos cloud.

You'll see an overview of these connections, including their current status (e.g., connected, disconnected).

**Status is often shown with icons:**
- **🟢 Green** usually means connected and healthy
- **🔴 Red** might indicate a disconnected device

You can filter this list to quickly see, for example, all disconnected devices that might need attention.

When you click on a specific virtual device (a specific connection), you can see more details, like the receiver account number. If you click on an icon next to the device entry, it will often take you directly to the site or customer associated with that connection.

### Understanding Connection Paths (Single Path vs. Dual Path)

When looking at a virtual device's details, you might see information about its connection paths:

**Single Path (SP):** The device communicates through one channel only (e.g., only Ethernet). If that channel is connected, the device is considered connected.

**Dual Path (DP):** The device has two communication channels (e.g., Ethernet and a mobile/cellular backup). For the device to be considered fully connected, both paths might need to be active, or it might show the status of each path individually.

For example, a device might show:
- Ethernet: Connected (Green)
- Mobile: Connected (Green)
- Overall Device Status: Connected (Green)

If one path drops (e.g., Ethernet goes down, but Mobile is still up), the status would change, alerting you to a potential issue while the backup path keeps it online.

You can usually search this virtual device list by the account number if you need to find a specific connection quickly.

## Organizing Sites: Levels of Grouping

While a "site" is the basic level for an alarm-generating entity, Talos allows you to group sites for better organization, reporting, and for applying workflows to multiple sites at once.

<div className="row margin-bottom--lg">
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #8B5CF6', height: '100%'}}>
      <div className="card__header">
        <h3>📍 Sites</h3>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>The lowest, most basic level – your individual customer locations</p>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #06B6D4', height: '100%'}}>
      <div className="card__header">
        <h3>🏢 Site Groups</h3>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>You can group multiple sites together. For example, if a customer is a supermarket chain, a site group could represent all their stores in a specific region (e.g., "North Holland Stores")</p>
      </div>
    </div>
  </div>
  <div className="col col--4">
    <div className="card shadow--md" style={{borderTop: '4px solid #10B981', height: '100%'}}>
      <div className="card__header">
        <h3>🏛️ Organizational Units</h3>
      </div>
      <div className="card__body">
        <p style={{fontSize: '0.9rem'}}>This is often a higher level of grouping. The supermarket chain itself could be an "Organizational Unit." Site groups (regions) would then fall under this main organizational unit</p>
      </div>
    </div>
  </div>
</div>

This grouping is flexible and not mandatory. However, it helps a lot when you need to:
- Get an overview of all connections in a specific region
- Generate reports for a particular customer or group of sites
- Apply certain scenarios or workflows to all sites within a group (e.g., a holiday schedule for all stores in a particular city)

### Service Companies: A Special Type of Group

There's also a concept called **"Service Companies."**

- A **Service Company** is an independent group you can define, like a specific electrician, a guard service, or a maintenance company
- You can then link this Service Company to multiple different sites, even if those sites belong to different customers

**Example:** The same electrician might be responsible for five different customer sites in a particular area. You can create a "Service Company" entry for this electrician and link them to all five sites.

**Benefit:** If Talos detects a technical issue (like a power outage reported by a site's alarm panel), a workflow could be set up to automatically send a notification (like an SMS or email) to the linked Service Company (the electrician) to go and check on that site.

## Creating a Site

### Site Creation Options

There are two ways to create a site in Evalink Talos:

1. **From scratch**
2. **From a template**

Creating a site from a template is useful when you need to create multiple sites that share a common set of parameters – for example, use the same types of integrations, have the same working hours, monitor the same set of site statuses, forward alarms to a common monitoring station, etc.

All these settings can be applied to the site automatically during the site creation, with a possibility to edit them afterwards.

:::info Site Templates
Site Templates are configured on a global level under **Company > Settings > Sites**. Only Administrator and Manager have the permissions to create and manage Site Templates.
:::

### Setting Site ID

When creating a site, there are the following options for specifying the Site ID (the name of the site):

**Typing the Site ID manually:**
- This option is always available when creating a site from scratch
- When creating a site from a template, it is possible to manually enter the Site ID if the template provides the Site ID input Field and is not configured to create an auto-generated Site ID

**Setting an auto-generated Site ID:**
- You can have Evalink Talos generate the Site ID as a random-looking numeric value
- The Site ID value is generated based on a **sequence** – a user-defined configuration that specifies the start value of the number (for example, 51500000) and the optional constant prefix and suffix that are added to the number (for example, VdS- or -ArmStatus)
- For each new created site, the last assigned value from the sequence is incremented by 1. For example, after a site with Site ID 51500000 is created, other sites that are created using the sequence will have Site IDs 51500001, 51500002, etc.

Auto-generated Site IDs can be applied both to the sites created from scratch and to the sites created from a template.

:::info Site ID Sequences
Site ID sequences are configured on a global level under **Company > Settings > Sites**. Same as with site templates, sequences can be created and managed by Administrator and Manager only.
:::

### Create a Site from Scratch

To create a site from scratch:

1. On the **Sites** page, click the **Create Site** button
2. In the dialog that opens:
   - Select the **Basic** option (Basic is the default option if no templates have been configured for the Company yet)
   - In the **Site ID** field, type the site ID (the name of the site)
     - The site name must be unique within the Company and can contain letters, digits, special symbols and emoji
     - To generate a Site ID automatically, click the **Sequence** button in the **Site ID** field and select the desired sequence from the list
   - If you want the site to be in **Active** status after creation, leave the **Activate Site** checkbox selected. Otherwise, clear the checkbox
   - Click **Create**

### Create a Site from Template

:::tip Note
If the Site ID field is present on the form (always mandatory), and the Site Template includes Site ID auto-generation, the auto-generated Site ID takes precedence over the manually entered one. During the site creation, there is no way to find out if Site ID auto-generation is included in the Site Template, but it is possible to edit the Site ID on the site Settings page afterwards.
:::

## Edit the Site Settings

To edit the site settings:

1. Go to the **Sites** page, select the site from the list
2. On the **Overview** page that opens, scroll down to the middle of the page and click **Settings**
3. On the **Settings** subpage that opens, enter or edit the following information:
   - In the **Site** pane, specify the **Site ID** and select a **Site Group** for the site
   - In the **Address** pane, specify the company details for the site
   - In the **Time Zone** pane, select the **Time Zone** for the site
   - In the **Custom Fields** pane, specify the values for custom fields, or click **Configure** to setup a new custom field

### Custom Fields

A custom field is a variable that stores information related to a site and used in workflows. Custom fields can also be created for site groups.

**Example:** For a company that monitors vehicles, you can create a **License plate** custom field. Then, you can specify a License plate number for each monitored vehicle and use it in your workflows.

Custom Fields are created on a global level. After a custom field is created, it appears on the **Settings** page of all sites (or site groups) created under the Company account.

To configure a custom field:

1. Go to the **Company > Settings > Sites**
   - You can go to this page directly from the **Settings** page of a particular site (or site group) by clicking on the **Configure** shortcut in the **Custom Fields** area of the page
2. On the **Company > Settings > Sites** page, click **Add Custom Field**
3. In the dialog that opens, specify:
   - **Name** – the custom field ID to be used by Evalink Talos internally
   - **Type** – determines what type of data is stored in the field (Text, Number, Select One, Select Multiple)
   - **Display** – the custom field name to be displayed in Evalink Talos UI
   - **Scope** – determines if the custom field value is set for sites only or for site groups only
   - **Validation pattern** (optional) – an expression for user input validation
   - **Public checkbox** (optional) – to include custom field information in PDF and email reports
   - **Operator checkbox** (optional) – to display the custom field to the Operator
   - **Hidden checkbox** (optional) – to hide the custom field value from the Overview pages
4. Click **Submit**

By default, custom fields are displayed on the site / site group **Settings** and **Overview** pages in the order in which they were added. To reorder custom fields, go to **Company > Settings > Sites** page and move the custom fields as desired by clicking on ↑ and ↓ (arrow) buttons to the right of each custom field.

:::warning Custom Field Management
Name and Type of an existing custom field cannot be edited. To delete a custom field, first erase all the custom field values specified for all sites / site groups.
:::

## Related Articles

- [What is Evalink Talos?](/docs/getting-started/what-is-evalink-talos)
- [GCXONE-Talos Interaction](/docs/getting-started/gcxone-talos-interaction)
- [Talos Site Management](/docs/getting-started/Talos/talos-site-management)
- [Talos Workflows and Alarms](/docs/getting-started/Talos/talos-workflows-and-alarms)
- [Talos Roles and Permissions](/docs/getting-started/Talos/talos-roles-and-permissions)

## Need Help?

For comprehensive Evalink Talos documentation, visit the [official Evalink Talos documentation](https://documentation.evalink.io/) or contact [GCXONE Support](/docs/support).

