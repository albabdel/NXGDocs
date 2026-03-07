---
title: "Local Mode Configuration"
description: "Step-by-step guide to installing and configuring Local Mode on operator workstations"
tags:
  - role:installer
  - category:configuration
  - difficulty:intermediate
  - platform:GCXONE
sidebar_position: 2
last_updated: 2025-12-21
---

# Local Mode Configuration

To leverage P2P streaming and local SDK features, the Local Mode service must be installed on every operator workstation.

## Installation Steps

1.  **Download the Installer**: Obtain the latest Genesis Installer (v.2.8.2 or later).
2.  **Run as Administrator**: Right-click `Genesis-Installer.exe` and select **Run as Administrator**.
3.  **Follow On-Screen Instructions**: Complete the wizard to install the Local Mode service components.
4.  **Verify Service**: Ensure the Genesis Local Mode service is running in the Windows Services manager (Services.msc).

## Enabling Local Mode in GCXONE

Once the service is installed locally, you must ensure it is enabled in your platform settings:

1.  Navigate to the **Configuration App**.
2.  Go to **Sites** and select your target site.
3.  Under the **Settings** or **General** tab, ensure the **Enable Local Mode** toggle is active (if applicable for your specific deployment profile).

## Troubleshooting Connectivity

If Local Mode features (like P2P streaming) are not working:
-   **Ping Test**: Verify the workstation can reach the NVR/Device IP.
-   **Port Check**: Ensure local firewalls allow traffic on the device's SDK ports (e.g., 80, 8000, 37777).
-   **Service Refresh**: Restart the Genesis Local Mode service on the workstation.

> [!IMPORTANT]
> Local Mode settings are NOT required for Genesis Audio (SIP) calls, as they are initiated directly via the cloud.
