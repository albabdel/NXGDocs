---
title: Installer Guide
description: Technical guide for provisioning devices, site setup, and diagnostics.
tags: [installer, provisioning, hardware]
---

# Installer Guide

This guide is for **Installers** and **Technicians** responsible for setting up the physical hardware and connecting it to the GCXONE platform.

## Device Provisioning

### Step 1: Unbox and Power On
Connect the GCXONE Gateway to power and Ethernet. Ensure the **Power** and **Network** LEDs are solid green.

### Step 2: Register the Device
1.  Log in to the **Installer App** on your mobile device.
2.  Scan the QR code on the bottom of the gateway.
3.  Assign the device to a **Site**.

### Step 3: Update Firmware
The gateway will automatically check for updates upon connection. Do not unplug the device while the **Update** LED is flashing amber.

## Site Setup

### Adding Sensors
1.  Put the gateway into **Pairing Mode** via the app.
2.  Trigger the sensor (e.g., open the door contact).
3.  Name the sensor (e.g., "Front Door") and assign a Zone Type.

### Testing
Perform a **Walk Test** to verify all sensors are communicating correctly.
*   Go to **Diagnostics > Walk Test**.
*   Trigger each sensor.
*   Verify the signal strength (RSSI) is within acceptable limits (>-70dBm).

## Troubleshooting

| Issue                  | Possible Cause         | Solution                                                 |
| :--------------------- | :--------------------- | :------------------------------------------------------- |
| **Gateway Offline**    | No Internet connection | Check Ethernet cable and firewall settings (Port 443).   |
| **Sensor Not Pairing** | Low Battery            | Replace sensor battery and try again.                    |
| **Weak Signal**        | Interference           | Move the gateway closer to the sensor or add a repeater. |
