---
title: "Configuring the Blacklist"
sidebar_label: "Configuring the Blacklist"
tags: ["ai", "blacklist", "false alarm filtering", "configuration"]
---

# Configuring the Blacklist

GCXONE utilizes advanced AI analytics, which separates object identification from the alarm decision.
AI Workflow: The AI system operates in two distinct phases: identification (detecting objects like person, car, truck, etc.) and decision (classifying the event as a real or false alarm).
Decision Parameters: The decision (real/false classification) is entirely dependent on the configuration parameters defined in the priority list (custom properties). If an identified object (e.g., "person") is configured in the priority list as a target, the event is classified as a real alarm, even if the person is stationary.
Troubleshooting AI Issues: When an event detected by AI is incorrectly classified as a false alarm, the troubleshooting approach involves checking the three relevant custom parameters to see why the automated decision was made.
