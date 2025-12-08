---
title: "Protocol Flavors Reference"
sidebar_label: "Protocol Flavors Reference"
tags: ["internal", "architecture", "protocols", "api", "reference"]
---

# Protocol Flavors Reference

The microservice architecture is necessary because devices utilize multiple protocol flavors:
Protocol Type
Usage Examples
Notes
HTTP/REST/Open API
Used for basic request/response functions like getting device information, camera lists, or PTZ control (for Hikvision/Hik-Connect Pro).
REST is not suitable for streaming modes.
SDK
Required for complex functions like live stream, playback, downloading video files, searching video files, and two-way audio (e.g., Hik-Connect Pro/Hikvision use C# based SDK or .NET HcNetSDK).
SDK-based integration often provides a TCP layer for streaming.
TCP/Native TCP
Used by older/legacy devices or for specific alarm transmission protocols. ADPRO pushes events via TCP to the GCXONE ADPRO Receiver.
Webhooks/HTTP
Axis Pushes events via HTTP/WebHook to the GCXONE proxy. Hanwha configuration involves adding HTTP requests (webhooks) to the camera rule to push events.
Websocket Subscription
Axxon events are pulled by GCXONE via a websocket subscription.
SIA DC-09
Used for alarm transmission from devices like Reconeyez, typically routed through Talos/Virtual SIA DC-09 Receiver.
Requires receiver IP address, port, and account ID of each site.
