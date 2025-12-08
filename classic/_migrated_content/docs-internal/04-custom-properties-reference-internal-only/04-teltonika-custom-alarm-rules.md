---
title: "Teltonika Custom Alarm Rules"
sidebar_label: "Teltonika Custom Alarm Rules"
tags: ["internal", "custom properties", "teltonika", "iot", "alarm rules"]
---

# Teltonika Custom Alarm Rules

Primary Purpose: Teltonika devices (IoT routers/sensors) are integrated primarily for dashboard data and event polling, not for streaming video or audio.
Data Points: Provides insights into metrics like battery voltage, charger state, and daily yield.
Critical Filtering: Due to high frequency of data changes (e.g., voltage changes every second), GCXONE uses Custom Alarm Rules (added as additional properties) to set specific thresholds (e.g., voltage low: 12.7V). Only events violating these rules are processed as alarms.
