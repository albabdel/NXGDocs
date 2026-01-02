---
title: "Creating Sites"
description: "Complete guide for creating sites"
tags:
  - admin
  - configuration
  - beginner
  - GCXONE
sidebar_position: 1
last_updated: 2025-12-04
---


# Creating Sites

Learn how to set up and manage sites in the GCXONE Configuration App.

## Overview

Sites serve as the critical organizational layer between a **Customer** and the **Devices** being monitored. When a site is created in the GCXONE configuration portal, the platform utilizes a **forward sync** mechanism to automatically mirror the site data, including address and contact details, within the integrated **Evalink Talos CMS**. This hierarchy ensures that every alarm received is accurately attributed to a specific physical location for operator response.

## Prerequisites

* **Administrator permissions** for the configuration application.
* An active **Customer profile** already established in the system.
* The **physical address and accurate time zone** for the location to ensure proper event correlation.

## Step-by-Step Guide

### Step 1: Access Configuration App
Log in to the **GCXONE platform** and navigate to the **Configuration App**.

### Step 2: Select Customer
Select the target **Customer** from the tree-view menu on the left side of the screen.

### Step 3: Open Sites Tab and Add New Site
Open the **Sites tab** in the horizontal menu and click the **Add** button.

![Add Site Button](/img/admin-guide/creating-sites-add-button.png)

### Step 4: Enter Site Details
Enter the **Site ID (Name)** and fill in mandatory address fields (location may auto-populate via Google Maps integration).

### Step 5: Configure Time Zone
Configure the **Time Zone** to match the physical location of the devices.

### Step 6: Add Tags (Optional)
Add any relevant **Tags** (e.g., "Site Template" or "VIP") to help filter sites later.

### Step 7: Save the Site
Click **Save** to finalize the site.

![Save Site](/img/admin-guide/creating-sites-save.png)

## Expected Results

The new site will be visible in the GCXONE site list.

## Best Practices

* **Billing Efficiency:** You can create sites in an **"Inactive" status** during the setup phase; they will remain functional for configuration but typically do not incur billing charges until switched to "Active".
* **Custom Fields:** Use custom fields at the site level to store unique instructions for operators, such as the required frequency of security interventions.
* **Manual Sync:** If a site was previously created in Talos, you can sync it to GCXONE by creating a site with the **exact same name** in the Configuration App.

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
