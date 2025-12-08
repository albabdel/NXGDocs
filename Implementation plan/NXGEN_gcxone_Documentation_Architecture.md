# NXGEN GCXONE Documentation Architecture
## Complete Knowledge Base Structure & Tree View

**Version:** 1.0  
**Last Updated:** December 2025  
**Purpose:** Single source of truth for all NXGEN GCXONE platform documentation

---

## Documentation Philosophy

This knowledge base follows industry best practices for technical documentation:
- **User-centric organization** - Content organized by user role and task
- **Progressive disclosure** - Information from basic to advanced
- **Searchable & discoverable** - Clear taxonomy and metadata
- **Multilingual support** - English, German, French (AI translation)
- **Living documentation** - CMS-driven, continuously updated

---

## Table of Contents

1. [Complete Tree Structure](#complete-tree-structure)
2. [Folder Descriptions & Content Guidelines](#folder-descriptions)
3. [Article Templates](#article-templates)
4. [Content Strategy](#content-strategy)
5. [Implementation Roadmap](#implementation-roadmap)

---

## Complete Tree Structure

```
NXGEN GCXONE Documentation Portal
│
├── 🏠 HOME / LANDING PAGE
│   ├── Quick Start Guide
│   ├── What's New (Release Notes)
│   ├── Popular Articles (Dynamic)
│   └── Search Functionality
│
├── 📚 1. GETTING STARTED
│   ├── 1.1 Platform Overview
│   │   ├── What is NXGEN GCXONE?
│   │   ├── What is Evalink Talos?
│   │   ├── How GCXONE and Talos Interact
│   │   ├── Key Benefits & Value Propositions
│   │   ├── Platform Architecture Overview
│   │   └── System Requirements & Prerequisites
│   │
│   ├── 1.2 Infrastructure & Network Requirements
│   │   ├── Cloud Architecture Overview
│   │   ├── Required Ports & Endpoints
│   │   ├── IP Whitelisting Requirements
│   │   ├── Firewall Configuration Guide
│   │   ├── Network Bandwidth Requirements
│   │   └── NTP Server Configuration (timel.nxgen.cloud)
│   │
│   ├── 1.3 Access & Authentication
│   │   ├── User Roles & Permissions Overview
│   │   ├── First Time Login
│   │   ├── Password Management
│   │   ├── Multi-Factor Authentication
│   │   └── Workspace Configuration
│   │
│   └── 1.4 Onboarding Package
│       ├── Quick Start Checklist
│       ├── Initial Setup Workflow
│       ├── Common Troubleshooting (Cookies, Browser Requirements)
│       └── Getting Help & Support
│
├── 📊 2. PLATFORM FUNDAMENTALS
│   ├── 2.1 GCXONE Platform Architecture
│   │   ├── Microservices Architecture Explained
│   │   ├── Proxy Architecture & Communication Flow
│   │   ├── Device Protocol Overview
│   │   ├── Cloud Infrastructure (AWS, Kubernetes)
│   │   ├── Auto-Scaling & Performance
│   │   └── Security & Data Protection
│   │
│   ├── 2.2 Hierarchy & Data Organization
│   │   ├── Tenant → Customer → Site → Device → Sensor Model
│   │   ├── Multi-Tenant Architecture
│   │   ├── Site Management Best Practices
│   │   └── Device Organization Strategies
│   │
│   ├── 2.3 GCXONE & Talos Integration
│   │   ├── Alarm Flow: Device → GCXONE → Talos
│   │   ├── Site Synchronization
│   │   ├── Event Processing & Analytics
│   │   ├── Follow-up Alarm Mechanism
│   │   └── Token Configuration & Setup
│   │
│   └── 2.4 System Health & Monitoring
│       ├── Site Pulse / Lifecheck Overview
│       ├── Device Health Monitoring
│       ├── Event Polling Configuration
│       ├── Timeout Alarms
│       └── System Status Dashboard
│
├── 🎛️ 3. ADMIN & CONFIGURATION GUIDE
│   ├── 3.1 Dashboard Overview
│   │   ├── GCXONE Dashboard Widgets Explained
│   │   │   ├── Active Sites Widget
│   │   │   ├── Alarm Volume Analytics
│   │   │   ├── Device Health Status
│   │   │   ├── Sites Without Images
│   │   │   ├── Blocked Devices
│   │   │   └── Performance Metrics
│   │   ├── Talos Operator Dashboard
│   │   └── Dashboard Customization
│   │
│   ├── 3.2 Customer & Site Management
│   │   ├── Creating Customers
│   │   ├── Creating Customer Groups
│   │   ├── Creating Sites
│   │   ├── Site Groups Management
│   │   ├── Site Configuration Settings
│   │   └── Site Types & Classification
│   │
│   ├── 3.3 User Management
│   │   ├── Creating Users & Assigning Roles
│   │   ├── Role-Based Access Control (RBAC)
│   │   ├── User Permissions Matrix
│   │   ├── Workspace Assignment
│   │   ├── User Groups Management
│   │   └── Auto-Feed Configuration
│   │
│   ├── 3.4 Custom Properties
│   │   ├── Understanding Custom Properties
│   │   ├── Custom Property Hierarchy (Tenant/Customer/Site/Device/Camera)
│   │   ├── Event Clip Recording Configuration
│   │   ├── Device-Specific Custom Properties
│   │   ├── Teltonika Custom Alarm Rules
│   │   └── Best Practices & Use Cases
│   │
│   └── 3.5 Advanced Configuration
│       ├── Time Zone Management
│       ├── Multi-Language Support
│       ├── Custom Alarm Codes
│       ├── Notification Settings
│       └── API Configuration
│
├── 🔧 4. DEVICE CONFIGURATION GUIDE
│   ├── 4.1 General Device Onboarding
│   │   ├── Standard Device Onboarding Process
│   │   ├── Device Discovery Mechanism
│   │   ├── Supported Device Types Overview
│   │   ├── Device Naming Conventions
│   │   └── Troubleshooting Device Discovery
│   │
│   ├── 4.2 ADPRO (XT/iFT Gateway)
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Adding ADPRO Device
│   │   │   ├── Required Parameters (Receiver IP, Port, Account ID)
│   │   │   ├── Server Unit ID Configuration
│   │   │   └── Custom Properties for iFT Gateway
│   │   ├── Installer Configuration (Device-Side)
│   │   │   ├── DC9 Integration Setup
│   │   │   ├── Alarm Behavior Configuration (Armed/Disarmed)
│   │   │   ├── Transmission Settings
│   │   │   └── Network Configuration
│   │   ├── Operator View
│   │   │   ├── Alarm Presentation
│   │   │   ├── Event Types
│   │   │   └── Video Clip Availability
│   │   └── Troubleshooting
│   │       ├── Common Issues
│   │       ├── Server Unit ID Duplication
│   │       └── Support Escalation
│   │
│   ├── 4.3 Hikvision (NVR/Cameras)
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Cloud Mode Setup (HikProConnect)
│   │   │   ├── Local Mode Setup
│   │   │   ├── Required Parameters
│   │   │   ├── Encryption Key Configuration
│   │   │   └── Custom Properties
│   │   ├── Installer Configuration (Device-Side)
│   │   │   ├── NTP Server Configuration (timel.nxgen.cloud)
│   │   │   ├── Smart Event Configuration
│   │   │   ├── "Notify Surveillance Center" Settings
│   │   │   ├── Network Configuration (Ports)
│   │   │   ├── UPnP / Port Forwarding
│   │   │   └── Smart Codec Considerations
│   │   ├── Operator View
│   │   │   ├── Live Video Features
│   │   │   ├── PTZ/Preset Control
│   │   │   ├── Playback & Timeline
│   │   │   ├── I/O Control
│   │   │   └── GCXONE Audio (SIP)
│   │   └── Troubleshooting
│   │       ├── 5-Minute Live View Limit
│   │       ├── Server Unit ID Conflicts
│   │       ├── Motion Detection vs Smart Events
│   │       └── Common Connectivity Issues
│   │
│   ├── 4.4 Dahua (NVR/Cameras)
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Cloud Mode Setup (DoLynk)
│   │   │   ├── Local Mode Setup
│   │   │   ├── Required Parameters (Serial Number, Password)
│   │   │   ├── DoLynk Sharing Configuration
│   │   │   └── Custom Properties
│   │   ├── Installer Configuration (Device-Side)
│   │   │   ├── NTP Server Configuration (timel.nxgen.cloud)
│   │   │   ├── Smart Event Configuration
│   │   │   ├── Network Configuration (Ports: 37777, 554, etc.)
│   │   │   ├── P2P Streaming Setup
│   │   │   └── DoLynk Care Account Setup
│   │   ├── Local Mode Prerequisites
│   │   │   ├── Microsoft Redistributables
│   │   │   ├── .NET Framework 4.8
│   │   │   ├── NodeJS (V18)
│   │   │   └── Installation Guide
│   │   ├── Operator View
│   │   │   ├── Live Stream Features
│   │   │   ├── Playback & Timeline
│   │   │   ├── PTZ Control
│   │   │   ├── I/O Management
│   │   │   └── Two-Way Audio
│   │   └── Troubleshooting
│   │       ├── Time Synchronization Issues
│   │       ├── DoLynk Connection Problems
│   │       └── Local Mode Installation Errors
│   │
│   ├── 4.5 Hanwha-Techwin / NX Witness
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Adding Hanwha Device
│   │   │   ├── Required Parameters
│   │   │   └── Custom Properties
│   │   ├── Installer Configuration (Device-Side)
│   │   │   ├── Webhook Configuration for Events
│   │   │   ├── Hanwha Proxy URL Setup
│   │   │   ├── Payload Configuration (Camera ID, Event Name)
│   │   │   ├── Basic Authentication
│   │   │   └── Network Requirements
│   │   ├── Operator View
│   │   │   ├── Live Video
│   │   │   ├── Playback & Timeline
│   │   │   ├── ARM/DISARM
│   │   │   └── GCXONE Audio (SIP)
│   │   ├── Limitations
│   │   │   ├── No PTZ/Presets Support
│   │   │   ├── No I/O Support
│   │   │   ├── No Local Mode
│   │   │   └── Limited Event Log
│   │   └── Troubleshooting
│   │       ├── Webhook Configuration Issues
│   │       └── Event Reception Problems
│   │
│   ├── 4.6 Milestone VMS
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Adding Milestone Device
│   │   │   ├── Required Ports (443, 7563, 8081, 22331)
│   │   │   ├── Required Parameters
│   │   │   ├── Custom Properties
│   │   │   └── Base URL Configuration
│   │   ├── Installer Configuration (Device-Side)
│   │   │   ├── Port Configuration
│   │   │   ├── Network Setup
│   │   │   └── Event Subscription
│   │   ├── Operator View
│   │   │   ├── Live Video (TCP JPEG/Raw)
│   │   │   ├── Playback & Timeline
│   │   │   ├── Events & Alarms
│   │   │   ├── ARM/DISARM
│   │   │   ├── PTZ/Presets
│   │   │   ├── I/O Management
│   │   │   └── GCXONE Audio (SIP)
│   │   ├── Health Monitoring
│   │   │   ├── Basic Camera Health
│   │   │   ├── Basic+ Camera Health
│   │   │   └── Advanced Health (Not Supported)
│   │   └── Troubleshooting
│   │       ├── Streaming Protocol Issues (No RTSP)
│   │       ├── Event Integration Problems
│   │       └── Port Configuration Errors
│   │
│   ├── 4.7 Axxon VMS
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   ├── Installer Configuration (Device-Side)
│   │   ├── Operator View
│   │   ├── Limitations (No I/O Support)
│   │   └── Troubleshooting
│   │       ├── Password Special Characters Issue
│   │       └── Alarm Polling Reliability
│   │
│   ├── 4.8 Camect AI Video Recorders
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── HLS Stream URL Configuration
│   │   │   └── Per-Camera Stream Setup
│   │   ├── Operator View
│   │   │   ├── Live Video (HLS)
│   │   │   ├── Events
│   │   │   ├── ARM/DISARM
│   │   │   ├── PTZ/Presets
│   │   │   ├── GCXONE Audio
│   │   │   └── Event Acknowledgement
│   │   ├── Limitations (No Playback/Timeline)
│   │   └── Troubleshooting
│   │
│   ├── 4.9 Axis IP Cameras
│   │   ├── Overview & Capabilities
│   │   ├── Admin Configuration (GCXONE)
│   │   ├── Installer Configuration (Device-Side)
│   │   ├── Site Pulse Configuration
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │
│   ├── 4.10 Heitel (Legacy Device)
│   │   ├── Overview & Legacy Status
│   │   ├── Onboarding Process (Ticket Required)
│   │   ├── HTConnect Prerequisites
│   │   ├── Network Requirements
│   │   │   ├── Gateway IP Whitelisting
│   │   │   ├── Port 3333 Configuration
│   │   │   └── Firewall Setup
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │       ├── Manual Intervention Requirements
│   │       └── Legacy Device Limitations
│   │
│   ├── 4.11 Reconeyez PIR Cam
│   │   ├── Overview & Capabilities
│   │   ├── Current Integration Flow
│   │   │   ├── Customer Portal Configuration
│   │   │   ├── FTP Image Upload
│   │   │   ├── SIA DC-09 Alarm Transmission
│   │   │   ├── Talos Workflow Conversion
│   │   │   └── GCXONE Analytics Processing
│   │   ├── Future State (Direct Integration)
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │
│   ├── 4.12 Teltonika IoT (Routers/Sensors)
│   │   ├── Overview & Purpose (Dashboard Data/Event Polling)
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Adding Teltonika Device
│   │   │   ├── Event Polling Configuration
│   │   │   └── Custom Alarm Rules
│   │   ├── Custom Alarm Rules Configuration
│   │   │   ├── Understanding Threshold-Based Filtering
│   │   │   ├── Voltage Monitoring Rules
│   │   │   ├── Battery Status Rules
│   │   │   └── Best Practices
│   │   ├── Operator View
│   │   │   ├── Dashboard Data Points
│   │   │   ├── Battery Voltage
│   │   │   ├── Charger State
│   │   │   └── Daily Yield Metrics
│   │   └── Troubleshooting
│   │
│   ├── 4.13 GCXONE Audio (SIP Twilio)
│   │   ├── Overview & Purpose
│   │   ├── Admin Configuration (GCXONE)
│   │   │   ├── Adding GCXONE Audio Device
│   │   │   ├── SIP URL Configuration
│   │   │   ├── Username & Password
│   │   │   └── Audio Toggle Verification
│   │   ├── Installer Configuration
│   │   │   ├── IP Speaker Setup
│   │   │   ├── SIP Configuration
│   │   │   └── Network Requirements (Port 443)
│   │   ├── Operator View
│   │   │   ├── Remote Announcements
│   │   │   ├── Two-Way Audio Communication
│   │   │   └── Audio Controls
│   │   └── Troubleshooting
│   │
│   ├── 4.14 Avigilon
│   │   ├── Overview & Capabilities
│   │   ├── Configuration Guide
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │
│   ├── 4.15 InnoVi
│   │   ├── Overview & Capabilities
│   │   ├── Configuration Guide
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │
│   └── 4.16 Additional Supported Devices
│       ├── Device Compatibility Matrix
│       ├── Request New Device Integration
│       └── Custom Integration Process
│
├── ⚡ 5. FEATURES OVERVIEW & GUIDES
│   ├── 5.1 AI Analytics & False Alarm Reduction
│   │   ├── What is AI Analytics?
│   │   ├── Benefits (80% False Alarm Reduction)
│   │   ├── How It Works
│   │   │   ├── Human Detection
│   │   │   ├── Vehicle Detection
│   │   │   └── AI Processing Pipeline
│   │   ├── Configuration Requirements
│   │   ├── Best Practices
│   │   └── Operator Experience
│   │
│   ├── 5.2 Event Clip Recording
│   │   ├── Overview & Benefits
│   │   ├── How to Enable
│   │   │   ├── Custom Properties Configuration
│   │   │   ├── Supported Devices (ADPRO, Dahua, Hikvision, Milestone)
│   │   │   ├── Pre/Post-Alarm Recording (-5 to +5 seconds)
│   │   │   └── Alarm Code Configuration
│   │   ├── Operator View
│   │   │   ├── Video Clip Availability
│   │   │   └── Rich Context for Alarms
│   │   ├── Prerequisites
│   │   └── Troubleshooting
│   │
│   ├── 5.3 Site Pulse / Lifecheck (Heartbeat)
│   │   ├── Overview & Purpose
│   │   ├── How to Enable/Implement
│   │   │   ├── Configuration Per Device Type
│   │   │   ├── Heartbeat Intervals (10/30/60 min)
│   │   │   └── GCXONE Receiver Configuration
│   │   ├── Supported Devices
│   │   │   ├── ADPRO
│   │   │   ├── Axis IP Cameras
│   │   │   ├── GCXONE Audio
│   │   │   ├── Milestone
│   │   │   └── Hanwha
│   │   ├── Operator View
│   │   │   ├── Timeout Alarms
│   │   │   └── System Status Indication
│   │   ├── Benefits
│   │   │   ├── Power Failure Detection
│   │   │   ├── Network Outage Alerts
│   │   │   └── Proactive Monitoring
│   │   └── Troubleshooting
│   │
│   ├── 5.4 Auto-Streaming
│   │   ├── Overview & Benefits
│   │   ├── How to Enable/Implement
│   │   │   ├── Customer Self-Setup Guide
│   │   │   ├── Configuration Parameters
│   │   │   └── Stream Quality Settings
│   │   ├── Prerequisites
│   │   ├── Operator View
│   │   └── Troubleshooting
│   │
│   ├── 5.5 Email/SMS Sharing
│   │   ├── Overview
│   │   ├── How to Configure
│   │   │   ├── Email Settings
│   │   │   ├── SMS Settings
│   │   │   ├── Alarm Image Attachment
│   │   │   └── Video Clip Sharing
│   │   ├── Use Cases
│   │   └── Troubleshooting
│   │
│   ├── 5.6 Ad-Hoc Features
│   │   ├── Platform-Level Ad-Hoc Capabilities
│   │   ├── Use Cases & Examples
│   │   └── How to Implement
│   │
│   ├── 5.7 PTZ & Preset Control
│   │   ├── Overview
│   │   ├── Supported Devices
│   │   ├── Configuration Guide
│   │   ├── Operator Usage
│   │   └── Best Practices
│   │
│   ├── 5.8 I/O Management (Inputs/Outputs)
│   │   ├── Overview
│   │   ├── Automatic I/O Discovery
│   │   ├── Manual I/O Configuration
│   │   ├── Operator Control
│   │   └── Use Cases
│   │
│   ├── 5.9 ARM/DISARM Functionality
│   │   ├── Overview
│   │   ├── Software ARM/DISARM
│   │   ├── Schedule-Based ARM/DISARM
│   │   ├── Test Mode Configuration
│   │   ├── Operator Controls
│   │   └── Integration with Workflows
│   │
│   ├── 5.10 Live Video & Playback
│   │   ├── Live Video Streaming
│   │   │   ├── Streaming Protocols
│   │   │   ├── P2P Streaming
│   │   │   ├── Multi-Camera View
│   │   │   └── Performance Optimization
│   │   ├── Playback & Timeline
│   │   │   ├── Timeline Navigation
│   │   │   ├── Event Markers
│   │   │   ├── Export Functionality
│   │   │   └── Speed Controls
│   │   └── Troubleshooting
│   │
│   ├── 5.11 NOVA (Marketplace)
│   │   ├── Overview
│   │   ├── How to Access Marketplace
│   │   ├── Enabling NOVA Features
│   │   ├── Configuration Guide
│   │   └── Available Integrations
│   │
│   ├── 5.12 Local Mode Capabilities
│   │   ├── What is Local Mode?
│   │   ├── Benefits & Use Cases
│   │   ├── Installation Requirements
│   │   │   ├── Software Prerequisites
│   │   │   ├── Operator Workstation Setup
│   │   │   └── Network Requirements
│   │   ├── Supported Features
│   │   │   ├── Advanced Streaming
│   │   │   ├── Two-Way Audio
│   │   │   └── Encrypted Streams
│   │   ├── Configuration Guide
│   │   └── Troubleshooting
│   │
│   ├── 5.13 Event Polling
│   │   ├── When to Use Event Polling
│   │   ├── Configuration Guide
│   │   ├── Polling Intervals
│   │   ├── Supported Devices (Teltonika)
│   │   └── Best Practices
│   │
│   ├── 5.14 GCXONE Bridge (STOS)
│   │   ├── Overview & Purpose
│   │   ├── Installation Guide
│   │   ├── Configuration
│   │   ├── Use Cases
│   │   └── Troubleshooting
│   │
│   └── 5.15 Additional Features
│       ├── Feature Request Process
│       └── Beta Features Program
│
├── 🎯 6. ALARM MANAGEMENT (TALOS)
│   ├── 6.1 Talos Platform Overview
│   │   ├── What is Evalink Talos?
│   │   ├── Architecture & Reliability
│   │   ├── Microservices Infrastructure
│   │   ├── AWS Multi-Region Deployment
│   │   └── Role in Alarm Flow
│   │
│   ├── 6.2 Alarm Flow & Processing
│   │   ├── Alarm Definition
│   │   ├── Complete Alarm Journey
│   │   │   ├── Device → GCXONE → Talos
│   │   │   ├── Analytics Processing
│   │   │   ├── Follow-up Alarm Mechanism
│   │   │   └── Operator Presentation
│   │   ├── Alarm Priority System
│   │   ├── Critical Alarm Handling (60-90 sec)
│   │   └── Real vs False Alarm Classification
│   │
│   ├── 6.3 Operator Interface
│   │   ├── Three-Screen Setup
│   │   │   ├── Alarm Receiving Screen
│   │   │   ├── Video Screen
│   │   │   └── Dashboard/Overview Screen
│   │   ├── Alarm List View
│   │   │   ├── Sorting Options (Priority/Time)
│   │   │   ├── Alarm Details
│   │   │   └── Quick Actions
│   │   ├── Video Clip Handling
│   │   │   ├── Live Video Access
│   │   │   ├── Recorded Clips
│   │   │   └── Event Context
│   │   └── Operator Controls
│   │
│   ├── 6.4 Workflows
│   │   ├── What are Workflows?
│   │   ├── Workflow Types
│   │   │   ├── Manual Workflows
│   │   │   └── Automated Workflows
│   │   ├── Workflow Levels
│   │   │   ├── Global Workflows
│   │   │   ├── Group Workflows
│   │   │   ├── Site-Specific Workflows
│   │   │   └── Managed Workflows (Recommended)
│   │   ├── Creating Workflows
│   │   │   ├── Incoming Conditions
│   │   │   ├── Workflow Steps
│   │   │   ├── Actions (Email/SMS/Calls)
│   │   │   ├── Operator Decision Points
│   │   │   └── Status Checks
│   │   ├── Workflow Customization
│   │   │   ├── Customer-Specific Procedures
│   │   │   ├── Test Mode Integration
│   │   │   ├── Audio Announcement Optimization
│   │   │   └── Resource Conservation
│   │   ├── Default Workflows
│   │   │   ├── Standard Alarm Workflow
│   │   │   ├── Intrusion Detection Workflow
│   │   │   ├── Fire Alarm Workflow
│   │   │   └── Technical Alarm Workflow
│   │   └── Best Practices
│   │
│   ├── 6.5 Operator Roles & Shift Management
│   │   ├── Night Shift Responsibilities
│   │   │   ├── Critical Alarms (Intrusion, Fire)
│   │   │   ├── Immediate Response Protocol
│   │   │   └── Deferred Technical Issues
│   │   ├── Day Shift Responsibilities
│   │   │   ├── Technical Alarms
│   │   │   ├── Maintenance Tasks
│   │   │   ├── Workflow Adjustments
│   │   │   └── Customer Interaction
│   │   └── Shift Handover Process
│   │
│   ├── 6.6 Alarm Supervision
│   │   ├── What is Alarm Supervision?
│   │   ├── Use Cases
│   │   │   ├── Devices Without Heartbeat
│   │   │   ├── Guard Check-in Monitoring
│   │   │   ├── QR Code Scan Verification
│   │   │   └── Custom Check-in Signals
│   │   ├── Configuration Guide
│   │   └── Timeout Alarm Handling
│   │
│   ├── 6.7 Workspace & Routing
│   │   ├── Workspace Configuration
│   │   ├── Alarm Routing Rules
│   │   ├── Standard vs VIP Workspaces
│   │   ├── User Restrictions
│   │   │   ├── Work Groups
│   │   │   ├── Site Groups
│   │   │   └── Site Types
│   │   ├── Auto-Feed Configuration
│   │   └── Blocking Prevention
│   │
│   ├── 6.8 Talos Configuration (Admin)
│   │   ├── Token Setup & Management
│   │   ├── Tenant Attachment Process
│   │   ├── Site Synchronization Configuration
│   │   ├── Custom Properties for Talos
│   │   └── Integration Settings
│   │
│   └── 6.9 Talos Operator Guide
│       ├── Handling Incoming Alarms
│       ├── Video Verification Process
│       ├── Following Workflow Steps
│       ├── Making Operator Decisions
│       ├── Documenting Actions & Comments
│       ├── Escalation Procedures
│       └── Performance Metrics
│
├── 📈 7. REPORTING & ANALYTICS
│   ├── 7.1 Report Templates
│   │   ├── Alarm Listing Report
│   │   │   ├── Time-Based Filters
│   │   │   ├── Alarm Type Filters
│   │   │   ├── Location Filters
│   │   │   └── Export Options
│   │   ├── Workflow Report
│   │   │   ├── Workflow Execution Details
│   │   │   ├── Step Outcomes
│   │   │   ├── Operator Comments
│   │   │   └── Performance Analysis
│   │   ├── Event Log Report
│   │   │   ├── All System Events
│   │   │   ├── ARM/DISARM Actions
│   │   │   ├── System Messages
│   │   │   └── Audit Trail
│   │   └── Site Documentation Report
│   │       ├── Configuration Summary
│   │       ├── Device Status
│   │       ├── Health Metrics
│   │       └── Contact Information
│   │
│   ├── 7.2 Custom Reports
│   │   ├── Creating Custom Templates
│   │   ├── Field Selection
│   │   ├── Layout Customization (Angular)
│   │   ├── Advanced Filters
│   │   └── Data Source Integration
│   │
│   ├── 7.3 Audit Logs
│   │   ├── What are Audit Logs?
│   │   ├── Accessing Audit Trail
│   │   ├── Information Logged
│   │   │   ├── User Actions
│   │   │   ├── Configuration Changes
│   │   │   ├── Timestamps
│   │   │   └── Status Updates
│   │   ├── Use Cases
│   │   │   ├── Accountability
│   │   │   ├── Troubleshooting
│   │   │   ├── Compliance
│   │   │   └── Security Monitoring
│   │   └── Best Practices
│   │
│   ├── 7.4 Dashboard Analytics
│   │   ├── Real-Time Metrics
│   │   ├── Performance Indicators
│   │   ├── Trend Analysis
│   │   └── Custom Widgets
│   │
│   └── 7.5 Scheduled Reports
│       ├── Report Scheduling
│       ├── Email Distribution
│       ├── Automated Generation
│       └── Report Management
│
├── 👥 8. OPERATOR GUIDE
│   ├── 8.1 Operator Dashboard
│   │   ├── Dashboard Overview
│   │   ├── Active Alarms Widget
│   │   ├── Quick Actions
│   │   └── Status Indicators
│   │
│   ├── 8.2 Alarm Handling
│   │   ├── Prerequisites
│   │   │   ├── Two-Tab Setup
│   │   │   ├── Attachment-Enabled Tab
│   │   │   ├── Non-Attachment Tab
│   │   │   └── Browser Configuration
│   │   ├── Receiving Alarms
│   │   │   ├── Alarm Notification
│   │   │   ├── Alarm Details Review
│   │   │   └── Priority Assessment
│   │   ├── Alarm Verification
│   │   │   ├── Video Review
│   │   │   ├── Image Analysis
│   │   │   ├── AI Analytics Results
│   │   │   └── Context Evaluation
│   │   ├── Following Workflows
│   │   │   ├── Step-by-Step Guidance
│   │   │   ├── Decision Making
│   │   │   ├── Action Execution
│   │   │   └── Documentation
│   │   └── Alarm Resolution
│   │       ├── Closing Alarms
│   │       ├── Comments & Notes
│   │       └── Status Updates
│   │
│   ├── 8.3 Video & Playback Operations
│   │   ├── Accessing Live Video
│   │   ├── Multi-Camera View
│   │   ├── Playback Navigation
│   │   ├── Timeline Usage
│   │   └── Export & Sharing
│   │
│   ├── 8.4 PTZ Control
│   │   ├── PTZ Interface
│   │   ├── Camera Movement
│   │   ├── Preset Positions
│   │   └── Best Practices
│   │
│   ├── 8.5 Communication Tools
│   │   ├── GCXONE Audio (Two-Way)
│   │   ├── Remote Announcements
│   │   ├── SMS/Email Notifications
│   │   └── Call Functionality
│   │
│   ├── 8.6 I/O Control
│   │   ├── Input Status Monitoring
│   │   ├── Output Activation
│   │   └── Use Cases
│   │
│   └── 8.7 Escalation & Support
│       ├── When to Escalate
│       ├── Escalation Procedures
│       ├── Contact Information
│       └── Emergency Protocols
│
├── 🔧 9. INSTALLER GUIDE
│   ├── 9.1 Pre-Installation Planning
│   │   ├── Site Survey
│   │   ├── Network Assessment
│   │   ├── Equipment Requirements
│   │   └── Customer Requirements Document
│   │
│   ├── 9.2 Network Configuration
│   │   ├── Firewall Rules
│   │   ├── Port Forwarding
│   │   ├── UPnP Configuration
│   │   ├── IP Whitelisting
│   │   └── Bandwidth Considerations
│   │
│   ├── 9.3 Device Installation & Setup
│   │   ├── Physical Installation
│   │   ├── Network Connection
│   │   ├── Initial Device Configuration
│   │   ├── Camera Placement & Positioning
│   │   └── Testing & Verification
│   │
│   ├── 9.4 Device-Side Configuration (by Type)
│   │   ├── ADPRO Configuration
│   │   ├── Hikvision NVR Configuration
│   │   ├── Dahua NVR Configuration
│   │   ├── Hanwha Camera Configuration
│   │   ├── Milestone VMS Configuration
│   │   ├── Other Devices
│   │   └── Configuration Checklists
│   │
│   ├── 9.5 Integration Testing
│   │   ├── Connectivity Tests
│   │   ├── Event Generation Tests
│   │   ├── Video Stream Verification
│   │   ├── Two-Way Audio Testing
│   │   └── End-to-End Alarm Testing
│   │
│   ├── 9.6 Handover & Documentation
│   │   ├── Installation Documentation
│   │   ├── Customer Training
│   │   ├── Handover Checklist
│   │   └── Post-Installation Support
│   │
│   └── 9.7 Best Practices
│       ├── Cable Management
│       ├── Labeling Standards
│       ├── Configuration Backup
│       └── Maintenance Planning
│
├── 🛠️ 10. TROUBLESHOOTING
│   ├── 10.1 General Troubleshooting Approach
│   │   ├── Systematic Problem Diagnosis
│   │   ├── Layer-by-Layer Analysis
│   │   ├── Log Analysis
│   │   └── Escalation Decision Tree
│   │
│   ├── 10.2 Common Issues & Solutions
│   │   ├── Login & Authentication Issues
│   │   │   ├── Password Reset
│   │   │   ├── Third-Party Cookies (Chrome/Edge)
│   │   │   ├── Browser Compatibility
│   │   │   └── Session Timeout
│   │   ├── Device Connectivity Issues
│   │   │   ├── Device Offline
│   │   │   ├── Discovery Failures
│   │   │   ├── Network Unreachable
│   │   │   └── Port Blocking
│   │   ├── Video Streaming Issues
│   │   │   ├── No Video Feed
│   │   │   ├── Poor Video Quality
│   │   │   ├── 5-Minute Stream Limit
│   │   │   ├── Buffering/Lag
│   │   │   └── Codec Issues
│   │   ├── Alarm Reception Issues
│   │   │   ├── No Alarms Received
│   │   │   ├── Duplicate Alarms
│   │   │   ├── Delayed Alarms
│   │   │   └── Missing Images/Clips
│   │   ├── Event Processing Issues
│   │   │   ├── Events Not Appearing
│   │   │   ├── Incorrect Timestamps
│   │   │   ├── Analytics Not Working
│   │   │   └── Event Polling Failures
│   │   └── Performance Issues
│   │       ├── Slow Dashboard Loading
│   │       ├── High Latency
│   │       ├── System Unresponsive
│   │       └── Resource Limitations
│   │
│   ├── 10.3 Device-Specific Troubleshooting
│   │   ├── ADPRO
│   │   │   ├── Server Unit ID Duplication
│   │   │   ├── Alarms from Disarmed Devices
│   │   │   └── Time-Based Image Issues
│   │   ├── Hikvision
│   │   │   ├── 5-Minute Live View Limit
│   │   │   ├── Server Unit ID Conflicts
│   │   │   ├── Smart Event Configuration
│   │   │   └── UPnP Issues
│   │   ├── Dahua
│   │   │   ├── Time Synchronization
│   │   │   ├── DoLynk Connection
│   │   │   └── Local Mode Installation
│   │   ├── Hanwha
│   │   │   ├── Webhook Configuration
│   │   │   └── Event Reception
│   │   ├── Milestone
│   │   │   ├── Streaming Protocol Issues
│   │   │   └── Port Configuration
│   │   ├── Axxon
│   │   │   ├── Password Special Characters
│   │   │   └── Alarm Polling Reliability
│   │   ├── Heitel
│   │   │   ├── Legacy Device Limitations
│   │   │   └── HTConnect Issues
│   │   └── Other Devices
│   │       └── Device-Specific Issues
│   │
│   ├── 10.4 Network & Infrastructure Troubleshooting
│   │   ├── Firewall Blocking
│   │   ├── Port Accessibility
│   │   ├── DNS Resolution
│   │   ├── Bandwidth Limitations
│   │   └── Proxy/VPN Issues
│   │
│   ├── 10.5 Diagnostic Tools
│   │   ├── Network Diagnostics
│   │   ├── Log Viewers
│   │   ├── Connection Testers
│   │   └── Debug Mode
│   │
│   └── 10.6 Support Escalation
│       ├── L1 Support Process
│       ├── L2 Escalation Criteria
│       ├── Required Information Checklist
│       │   ├── Site Name
│       │   ├── Device Name
│       │   ├── Error Screenshots
│       │   ├── Log Files
│       │   └── Steps to Reproduce
│       ├── Ticket Creation Best Practices
│       └── Escalation Contacts
│
├── 📚 11. KNOWLEDGE BASE & REFERENCE
│   ├── 11.1 Technical Specifications
│   │   ├── System Requirements
│   │   ├── Supported Browsers
│   │   ├── Mobile App Requirements
│   │   ├── Bandwidth Requirements
│   │   └── Storage Requirements
│   │
│   ├── 11.2 Network Reference
│   │   ├── Complete Port List
│   │   ├── IP Address Reference
│   │   ├── NTP Server Details
│   │   ├── Gateway Addresses
│   │   └── Domain Whitelist
│   │
│   ├── 11.3 API Documentation
│   │   ├── API Overview
│   │   ├── Authentication
│   │   ├── Endpoints Reference
│   │   ├── Request/Response Formats
│   │   └── Code Examples
│   │
│   ├── 11.4 Best Practices Library
│   │   ├── Deployment Best Practices
│   │   ├── Security Best Practices
│   │   ├── Performance Optimization
│   │   ├── Naming Conventions
│   │   └── Configuration Standards
│   │
│   ├── 11.5 Glossary
│   │   ├── Technical Terms
│   │   ├── Acronyms & Abbreviations
│   │   ├── Industry Terminology
│   │   └── NXGEN-Specific Terms
│   │
│   └── 11.6 FAQ
│       ├── General FAQs
│       ├── Technical FAQs
│       ├── Billing & Licensing FAQs
│       └── Support FAQs
│
├── 🔄 12. RELEASE NOTES & UPDATES
│   ├── 12.1 Latest Release Notes
│   ├── 12.2 Version History
│   ├── 12.3 Known Issues
│   ├── 12.4 Upcoming Features
│   └── 12.5 Deprecation Notices
│
└── 📞 13. SUPPORT & RESOURCES
    ├── 13.1 Getting Help
    │   ├── Support Portal
    │   ├── Ticket Submission
    │   ├── Email Support
    │   └── Emergency Contacts
    │
    ├── 13.2 Training Resources
    │   ├── Video Tutorials
    │   ├── Webinar Recordings
    │   ├── Training Schedule
    │   └── Certification Programs
    │
    ├── 13.3 Community & Forums
    │   ├── User Community
    │   ├── Feature Requests
    │   └── Beta Testing Program
    │
    └── 13.4 Additional Resources
        ├── Partner Portal
        ├── Integration Partners
        └── Third-Party Tools
```

---

## Folder Descriptions & Content Guidelines

### 1. GETTING STARTED
**Purpose:** Onboard new users quickly with essential information  
**Target Audience:** All users (first-time)  
**Content Type:** Quick reference, checklists, overview content  
**Depth:** High-level, minimal technical detail

**Key Articles:**
- Platform Overview: What GCXONE/Talos are, how they work together
- Infrastructure Requirements: Starter pack with IPs, ports, whitelisting needs
- Access & Authentication: Login procedures, role basics
- Onboarding Package: Quick start checklist, common initial issues

### 2. PLATFORM FUNDAMENTALS
**Purpose:** Deep technical understanding of architecture  
**Target Audience:** Admins, technical users, integrators  
**Content Type:** Technical explanations, architecture diagrams  
**Depth:** Detailed technical content

**Key Articles:**
- Microservices & Proxy Architecture (with the "switchboard" analogy)
- Device Protocol Overview
- GCXONE-Talos Integration Flow
- Health Monitoring Systems

### 3. ADMIN & CONFIGURATION GUIDE
**Purpose:** Complete guide for system administrators  
**Target Audience:** CMS Admins, Customer Admins  
**Content Type:** Step-by-step procedures, configuration guides  
**Depth:** Comprehensive with screenshots

**Key Articles:**
- Dashboard Widgets (explain utility, not just appearance)
- Customer/Site/User Management
- Custom Properties (detailed examples for each use case)
- RBAC & Permissions Matrix

### 4. DEVICE CONFIGURATION GUIDE
**Purpose:** Complete reference for all supported devices  
**Target Audience:** Admins, Installers  
**Content Type:** Multi-perspective configuration guides  
**Structure:** Each device has 3 sections:
- **Admin Configuration (GCXONE)** - What to do in GCXONE platform
- **Installer Configuration (Device-Side)** - What to do on the NVR/camera/device
- **Operator View** - What operators will see and can do

**Key Features:**
- Consistent structure across all devices
- Prerequisites clearly stated
- Limitations documented
- Links between Admin and Installer sections

### 5. FEATURES OVERVIEW & GUIDES
**Purpose:** Catalog and explain all platform features  
**Target Audience:** All users  
**Content Type:** Feature descriptions + configuration guides  
**Structure:** For each feature:
- Overview & Benefits
- How to Enable/Implement
- Prerequisites
- Operator View
- Troubleshooting

**Key Articles:**
- AI Analytics (with false alarm reduction metrics)
- Event Clip Recording
- Site Pulse/Lifecheck
- Auto-Streaming
- All marketplace features

### 6. ALARM MANAGEMENT (TALOS)
**Purpose:** Complete Talos platform documentation  
**Target Audience:** Operators, Workflow Managers, Admins  
**Content Type:** Operational procedures, workflow guides  
**Depth:** Detailed operational content

**Key Articles:**
- Complete Alarm Flow Journey
- Operator Interface (3-screen setup)
- Workflow Creation & Management
- Shift Responsibilities (Night vs Day)
- Configuration (Token setup, Talos-specific settings)

**Note:** Keep separate from Evalink's documentation. Only cover what customers need to configure/use, not deep Evalink internals.

### 7. REPORTING & ANALYTICS
**Purpose:** Enable data-driven decision making  
**Target Audience:** Admins, Managers  
**Content Type:** Report templates, customization guides  
**Depth:** Practical with examples

### 8. OPERATOR GUIDE
**Purpose:** Daily operational procedures for monitoring staff  
**Target Audience:** Security operators  
**Content Type:** Step-by-step operational guides  
**Depth:** Task-focused, practical

**Key Articles:**
- Prerequisites (two-tab setup, attachments)
- Alarm Handling Workflow
- Video Operations
- PTZ Control
- Communication Tools

**Note:** This section is heavily linked FROM the Admin Guide to show "what operators will see" based on configuration.

### 9. INSTALLER GUIDE
**Purpose:** Physical installation and device-side configuration  
**Target Audience:** Installation technicians  
**Content Type:** Installation procedures, device configuration  
**Depth:** Practical, field-ready

**Note:** Separate from Admin Guide. Customers with split roles (like VLG who are admins but not installers) only need Admin Guide. Customers with combined roles (like C-Contact) need both, with clear links between them.

### 10. TROUBLESHOOTING
**Purpose:** Quick problem resolution  
**Target Audience:** All users, support staff  
**Content Type:** Problem-solution format  
**Structure:** 
- Symptom → Cause → Solution
- Quick diagnosis flow
- When to escalate

**Key Sections:**
- Common Issues (organized by category)
- Device-Specific Issues
- Network/Infrastructure Issues
- Support Escalation Process (L1/L2 requirements)

### 11. KNOWLEDGE BASE & REFERENCE
**Purpose:** Quick reference materials  
**Target Audience:** All users  
**Content Type:** Tables, lists, definitions  
**Depth:** Concise reference data

### 12. RELEASE NOTES & UPDATES
**Purpose:** Track changes and communicate updates  
**Target Audience:** All users  
**Content Type:** Version notes, change logs  
**Depth:** Concise, dated entries

### 13. SUPPORT & RESOURCES
**Purpose:** Access to help and learning  
**Target Audience:** All users  
**Content Type:** Links, contact info, training materials  
**Depth:** Directory-style

---

## Article Templates

### Device Configuration Article Template

```markdown
# [Device Name] Configuration Guide

**Last Updated:** [Date]  
**Applies To:** GCXONE v[X.X] and later  
**Prerequisites:** [List specific requirements]

## Overview
- Brief description
- Key capabilities
- Integration method

## Admin Configuration (GCXONE Platform)
### Adding the Device
1. Step-by-step with screenshots
2. Required parameters table
3. Optional parameters

### Custom Properties
- Property name, type, value
- When to use
- Effect on functionality

### Verification
- How to verify successful connection
- Expected behavior

## Installer Configuration (Device-Side)
### Prerequisites
- Network requirements
- Ports needed
- Account requirements

### Device Configuration Steps
1. Detailed device-side setup
2. Screenshots of device interface
3. Settings to enable/disable

### Network Configuration
- Port forwarding
- Firewall rules
- UPnP settings

### Integration Setup
- Event forwarding
- Webhook configuration (if applicable)
- NTP configuration

### Testing
- How to test connectivity
- Test event generation
- Verify video streams

## Operator View
### Available Functions
- What operators can see
- What operators can control
- Limitations

### Typical Workflow
- How alarms appear
- Video access
- Control options

## Supported Features
- Live Video: ✓/✗
- Playback: ✓/✗
- PTZ: ✓/✗
- I/O: ✓/✗
- ARM/DISARM: ✓/✗
- GCXONE Audio: ✓/✗
- Events: ✓/✗
- Health Monitoring: ✓/✗

## Limitations & Known Issues
- List specific limitations
- Known problems
- Workarounds

## Troubleshooting
### Common Issues
1. Issue → Solution format
2. Diagnostic steps
3. When to escalate

## Related Articles
- Link to Feature guides
- Link to Troubleshooting
- Link to Best Practices

## Support
- How to get help
- Required information for tickets
```

### Feature Article Template

```markdown
# [Feature Name]

**Last Updated:** [Date]  
**Availability:** [All accounts / Marketplace / On request]  
**Supported Devices:** [List]

## Overview
### What is [Feature]?
Clear, non-technical explanation

### Benefits
- Bullet points of key benefits
- Business value
- Use cases

### How It Works
Technical explanation of the mechanism

## Prerequisites
- Account requirements
- Device requirements
- Network requirements
- Custom properties needed

## How to Enable/Implement

### For Administrators
Step-by-step configuration in GCXONE:
1. Navigate to...
2. Configure...
3. Verify...

### For Installers (if applicable)
Device-side configuration:
1. Access device...
2. Enable...
3. Test...

## Operator Experience
### What Operators Will See
- Interface changes
- New capabilities
- Workflow modifications

### How to Use
Operational procedures

## Configuration Examples
Real-world examples with screenshots

## Best Practices
- Recommended settings
- Common mistakes to avoid
- Optimization tips

## Troubleshooting
Common issues and solutions

## Related Articles
- Related features
- Device compatibility
- Advanced configuration

## FAQ
Common questions about this feature
```

### Troubleshooting Article Template

```markdown
# Troubleshooting: [Issue Category]

**Symptoms:**
- What the user sees/experiences
- Error messages
- Unexpected behavior

**Common Causes:**
1. Cause 1
2. Cause 2
3. Cause 3

## Quick Diagnosis
Decision tree or flowchart:
- Is X happening? → Yes: Check Y / No: Check Z
- Fastest way to identify root cause

## Solutions

### Solution 1: [Cause Name]
**When this applies:**
[Conditions]

**Steps to resolve:**
1. Step-by-step
2. With verification
3. Expected outcome

**Verification:**
How to confirm it's fixed

### Solution 2: [Cause Name]
[Same structure]

## Prevention
How to avoid this issue in the future

## When to Escalate
- Conditions requiring L2 support
- Information needed for ticket
- Who to contact

## Related Issues
Links to similar problems
```

---

## Content Strategy

### Writing Guidelines

1. **Clarity First**
   - Use simple, direct language
   - Define technical terms on first use
   - Short sentences (15-20 words max)
   - Active voice

2. **Structure**
   - Use descriptive headings
   - Break content into scannable sections
   - Lead with most important information
   - Use numbered lists for procedures
   - Use bullet points for features/options

3. **Visual Elements**
   - Screenshots for every UI procedure
   - Annotated images (arrows, highlights)
   - Diagrams for complex concepts
   - Tables for comparisons/reference data
   - Videos for complex procedures

4. **User-Centric**
   - Focus on user goals and tasks
   - "How to" rather than "About"
   - Provide context for why
   - Include real-world examples

5. **Consistency**
   - Standard terminology
   - Consistent structure within article types
   - Standard screenshot style
   - Cross-reference appropriately

### Navigation & Discoverability

1. **Search Optimization**
   - Clear, keyword-rich titles
   - Meta descriptions for each article
   - Tags and categories
   - Related articles section

2. **Cross-Linking Strategy**
   - Admin guides link to Operator View
   - Feature guides link to Device Configuration
   - All articles link to Troubleshooting
   - Prerequisites link to requirement articles

3. **Progressive Disclosure**
   - Overview → Details → Advanced
   - Summary at top with "Read more" sections
   - Collapsible sections for optional content

### Multilingual Support

1. **Translation Priority**
   - English (primary)
   - German (high priority - many customers)
   - French (growing market)

2. **AI Translation Approach**
   - Write clear English first
   - Use AI translation tool
   - Technical terms remain in English
   - Review translations for accuracy

3. **Language-Specific Content**
   - Some content may need localization beyond translation
   - Screenshots in English (universal)
   - Video narration could be multilingual

### Maintenance Strategy

1. **Content Ownership**
   - Each section assigned to SME
   - Technical Writer coordinates
   - Regular review schedule

2. **Version Control**
   - Date stamps on all articles
   - "Applies to version X" labels
   - Archive old versions
   - Highlight recent updates

3. **Feedback Loop**
   - Comment system for users
   - Support ticket analysis
   - Regular content audits
   - User surveys

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up CMS platform with article editing capability
- [ ] Create article templates
- [ ] Implement search functionality
- [ ] Set up translation system
- [ ] Create folder structure

### Phase 2: Core Content (Weeks 3-6)
Priority order based on user needs:

**Week 3:**
- [ ] Getting Started section (complete)
- [ ] Platform Fundamentals (complete)
- [ ] Common Troubleshooting articles

**Week 4:**
- [ ] Admin & Configuration Guide (Dashboard, Users, Custom Properties)
- [ ] Top 5 device configurations (Hikvision, Dahua, ADPRO, Milestone, Hanwha)

**Week 5:**
- [ ] Top 10 Features (AI Analytics, Event Clips, Site Pulse, Auto-Streaming, etc.)
- [ ] Operator Guide (core articles)
- [ ] Installer Guide (core articles)

**Week 6:**
- [ ] Remaining device configurations
- [ ] Alarm Management (Talos) section
- [ ] Reporting & Analytics

### Phase 3: Specialized Content (Weeks 7-8)
- [ ] Advanced features
- [ ] Remaining devices
- [ ] API Documentation
- [ ] Knowledge Base & Reference
- [ ] FAQ compilation

### Phase 4: Enhancement (Weeks 9-10)
- [ ] Video tutorials (top 10 topics)
- [ ] Interactive diagrams
- [ ] Advanced troubleshooting
- [ ] Best practices library
- [ ] Release notes compilation

### Phase 5: Polish & Launch (Weeks 11-12)
- [ ] Comprehensive review
- [ ] Cross-linking verification
- [ ] Search optimization
- [ ] User acceptance testing
- [ ] Soft launch with select customers
- [ ] Gather feedback
- [ ] Official launch

### Ongoing
- [ ] Weekly content reviews
- [ ] Monthly analytics review
- [ ] Quarterly content audits
- [ ] Continuous improvement based on feedback

---

## Success Metrics

### Quantitative
- Time to find information (target: <30 seconds)
- Search success rate (target: >90%)
- Article views by section
- Support ticket reduction (target: 30% reduction in 6 months)

### Qualitative
- User satisfaction surveys
- Support team feedback
- Customer feedback
- Content completeness audit

---

## Technical Implementation Notes

### CMS Requirements
- Article editing without code deployment
- Sidebar/navigation customization
- Search with filters
- AI translation integration
- Multi-language support
- Version control
- User comments (optional)
- Analytics integration

### Access Control
**Current State:** Portal embedded in GCXONE (requires GCXONE login)

**Considerations:**
- Public vs. Private access decision needed
- If private: downloadable PDFs required for installers without GCXONE access
- If public: need IP protection strategy
- Hybrid approach: Public getting started + Private detailed config

**Recommendation:** Discuss with Sales/Management to finalize access model before implementing download functionality.

### SEO & Search
- Metadata for all articles
- Keyword optimization
- Related articles algorithm
- Popular articles tracking
- Search analytics

---

## Collaboration & Workflow

### Roles & Responsibilities

**Technical Writer (Primary)**
- Content creation
- Structure maintenance
- Style guide enforcement
- Review coordination

**SMEs (Subject Matter Experts)**
- Technical accuracy review
- Content contributions
- Use case validation
- Feature documentation

**Support Team**
- Feedback from tickets
- Common issues identification
- Article testing
- User perspective

**Product Team**
- Feature documentation requirements
- Release notes
- Roadmap visibility
- Beta features

### Review Process
1. Technical Writer creates draft
2. SME technical review
3. User perspective review (Support/CSM)
4. Final editorial review
5. Publish with version stamp

---

## Notes from Working Session

Key decisions from transcript:
- **Installer/Admin split:** Keep separate where possible, with links between them
- **Operator guide:** Separate section, heavily linked from Admin guide
- **Talos documentation:** Platform essentials only (token setup, configuration), not deep Evalink internals
- **Feature list:** Comprehensive list needed, to be finalized during review
- **Prerequisites:** Use existing starter pack document as foundation
- **Dashboard section:** Focus on utility and use cases, not just description
- **Custom properties:** Detail which properties talk to Talos (internal section)
- **Public vs Private:** To be decided with management - affects download functionality

---

## Conclusion

This documentation architecture provides:
- **Single source of truth** for all NXGEN GCXONE information
- **Role-based organization** for efficient navigation
- **Scalable structure** that accommodates growth
- **Clear implementation plan** with phases and priorities
- **Comprehensive coverage** from onboarding to advanced configuration

The structure follows industry best practices while being tailored to NXGEN's specific needs: multiple user roles, complex device ecosystem, GCXONE-Talos integration, and multilingual requirements.

**Next Steps:**
1. Review and approve this structure
2. Finalize public/private access decision
3. Begin Phase 1 implementation
4. Start content creation for Phase 2 priorities
