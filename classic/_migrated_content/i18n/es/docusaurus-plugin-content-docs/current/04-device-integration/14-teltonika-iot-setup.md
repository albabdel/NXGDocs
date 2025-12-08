---
title: "Teltonika IoT Setup"
sidebar_label: "Teltonika IoT Setup"
tags: ["teltonika", "iot", "setup", "integration", "sensors"]
---

# Teltonika IoT Setup

Primary Purpose: Teltonika devices (IoT routers/sensors) are integrated primarily for dashboard data and event polling, not for streaming video or audio.
Data Points: Provides insights into metrics like battery voltage, charger state, and daily yield.
Critical Filtering: Due to high frequency of data changes (e.g., voltage changes every second), GCXONE uses Custom Alarm Rules (added as additional properties) to set specific thresholds (e.g., voltage low: 12.7V). Only events violating these rules are processed as alarms.
