---
title: "Quick Start Checklist"
description: "Practical checklist to take GCXONE from first login to production readiness."
tags:
  - role:all
  - category:configuration
  - difficulty:beginner
  - platform:GCXONE
sidebar_position: 13
last_updated: 2025-12-04
---

# Quick Start Checklist

This checklist guides a first-time administrator from zero to a production-ready **GCXONE** deployment. Work through the sections in order; each ends with an outcome so you know when to move on.

## 1. Account Access and Login

- Sign in at your dedicated GCXONE URL with the admin account provided during provisioning.
- Change the temporary password and enable multi-factor authentication if your organization requires it.
- Confirm you reach the main dashboard without errors.

Outcome: You can log in and reach the dashboard.

## 2. Organization and Workspace Setup

- Verify organization name, timezone, and data retention or regional settings match production expectations.
- Confirm the default workspace exists for your primary site; create additional workspaces if locations should be isolated.
- Set naming conventions for sites and devices that match Talos CMS records.

Outcome: Your workspace matches your real-world setup.

## 3. User and Role Setup

- Add administrators, operators, and viewers who will manage monitoring and response.
- Assign roles based on responsibility, limiting operators to only the sites and devices they own.
- If using SSO, map identity provider groups to GCXONE roles and validate a test sign-in.

Outcome: Every user can see and do only what they need.

## 4. Sites, Network, and Device Configuration

- Confirm the network can reach GCXONE: allow outbound HTTPS (443), RTSP (554), HTTP (80 if used), and NTP (123) to `time1.nxgen.cloud`; whitelist the primary gateway `18.185.17.113`.
- Ensure workstations running the console meet requirements (for example, i7 CPU, 32 GB RAM, modern GPU).
- Create or import sites and verify addresses match your Talos CMS records exactly.
- Register NVRs and cameras with IP, port, and credentials, and assign a unique unit ID to every device.
- Run auto-discovery to map camera channels and label them by location.

Reference: network endpoints

| Purpose | Address / Port |
| :--- | :--- |
| Primary gateway | `18.185.17.113` |
| NTP server | `time1.nxgen.cloud` (`123`) |
| Secure dashboard | `443 (HTTPS)` |
| Video stream | `554 (RTSP)` |

Outcome: The platform reflects your network and hardware correctly.

## 5. Permissions Validation

- Log in as a non-admin role and confirm they see only assigned sites and devices.
- Verify restricted users cannot edit protected entities or change system settings.
- Confirm alerts and dashboards respect role permissions.

Outcome: Access control behaves as expected.

## 6. Alerting and Notifications

- Enable alarm transmission or webhooks (for example, “Notify Surveillance Center”) on devices that should send events.
- Configure alert rules for critical events such as intrusion detection or line crossing for your pilot site.
- Add notification channels (email or integrations) for the on-call responders.
- Trigger a test alert and confirm it is delivered and visible in Talos CMS within 90 seconds.

Outcome: You receive alerts when something matters.

## 7. Dashboards and Views

- Open the default dashboards for live video and alarms.
- Build saved views that group cameras by site or priority; share at least one team dashboard.
- Confirm timelines and live feeds refresh without errors.

Outcome: Important data is visible at a glance.

## 8. Health Check and First Test

- Confirm device status shows healthy and time is synced through `time1.nxgen.cloud`.
- Trigger a known event on-site and watch the full flow: device → GCXONE → Talos CMS → notification.
- Review logs or activity history for errors or missed events.

Outcome: End-to-end flow works.

## 9. Go Live Readiness

- All users can log in and roles are validated.
- Critical sites and devices are onboarded and reporting health.
- Alerts and dashboards are verified with a successful end-to-end test.
- No blocking errors remain.

Outcome: The system is ready for day-one use.

## 10. What to Do Next

- Harden access: finalize MFA or SSO policies and rotate initial credentials. See [Password Management](/docs/getting-started/password-management).
- Reduce noise: tune smart event thresholds and schedules once the pilot runs for a day. See [IP Whitelisting](/docs/getting-started/ip-whitelisting) for stable connectivity.
- Expand coverage: onboard remaining sites, set retention rules, and standardize naming.
- Integrate workflows: connect notifications to ticketing or chat for faster response.
