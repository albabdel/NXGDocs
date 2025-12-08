---
title: "Introduction to Workflows"
sidebar_label: "Introduction to Workflows"
tags: ['workflow', 'automation', 'configuration']
---

# Introduction to Workflows

Workflows, managed within the Talos Workflow module, are sets of predefined steps or scenarios that guide how a specific type of alarm is handled. They ensure alarms are processed consistently and efficiently.
Types: Workflows can be manual (guiding a human operator step-by-step) or fully automated (performing actions without human interaction).
Levels: Workflows can be:
Global: Apply to all sites.
Group: Apply to specific site groups.
Site-Specific.
Managed: Created once and assigned to multiple sites for easier maintenance and scalability. Managed workflows are generally recommended.
Structure and Conditions: A workflow consists of incoming conditions, settings, and steps. Incoming conditions dictate which alarm is assigned to the workflow, based on factors like alarm code, zone, partition, alarm value (Alarm or Restore), or a regular expression in the payload.
Steps and Actions: Steps define actions like sending emails/SMS/calls, checking device status, or requiring operator decisions (e.g., "Is the alarm verified? Yes/No").
Customization and Optimization: Workflows should be customized based on customer operating procedures, such as removing audio announcements for sites without loudspeakers. Workflows can automatically disarm a site when it is set to "test mode" in Talos, which conserves processing resources on GCXONE.
