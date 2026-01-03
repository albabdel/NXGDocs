---
title: "Camect"
sidebar_label: "Camect"
sidebar_position: 5
description: "Configure Camect to stream and send events to GC-X-ONE."
tags:
  - Camect
  - Hub
  - NVR
  - AI Detection
  - GC-X-ONE
---

# Camect

**Device Information:**
- **Device**: Camect Hub Model
- **Vendor**: Camect
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0  

# Zusammenfassung
- Zweck: Camect für Streaming und Event-Weiterleitung an GC-X-ONE konfigurieren.
- Ergebnis: Live View und Alerts erscheinen in GC-X-ONE (Video Activity).
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen
- Netzwerk: Erreichbare IP, korrektes VLAN und Ports (80/443/554/RTSP/TCP je nach Nutzung).
- Time Sync: Camect-Zeitzone an GC-X-ONE anpassen, NTP aktivieren.
- Access: Admin-Zugriff auf Camect UI und GC-X-ONE Config App.
- IP-Allowlist: Aktualisieren, falls Whitelisting aktiv ist.
- Test-Account: Dedizierten User für GC-X-ONE anlegen.

# Device-Profil
- Typ: Hub/NVR
- Discovery: Proprietary (Camect)
- Events: AI-Objekte (gemäß Camect-Regeln)
- Ports: 80/443/554 + Monitoring TCP
- Bekannte Besonderheiten: **Detect alerts** aktivieren und **Monitoring -> NXGEN** setzen, damit GC-X-ONE Events erhält.

**Core Functions**
- Cloud Mode: Supported
- Discovery: Supported
- Live: Supported
- Playback: Supported
- Timeline: Supported
- Events: Supported
- ARM / DISARM: Supported
- Audio (SIP): Supported
- PTZ/Presets: Supported

# Schritte

## Step 1 – Camect vorbereiten (Users, Time, RTSP)
- UI-Pfad: **Users**
- Vorgehen
  - Lokalen User (z. B. `NXG`) mit Passwort anlegen.
  - Berechtigungen vergeben: **Live view, Query Cameras, Pan/Tilt Cameras, View alerts, View footage, Share cameras, Change operating modes**.
- Time/NTP
  - Zeitzone setzen. NTP aktivieren. Speichern.
- RTSP
  - Sicherstellen, dass RTSP am Hub aktiviert ist.
- Erwartetes Ergebnis: Dedizierter User existiert; Zeit korrekt; RTSP eingeschaltet.
![Camect User Setup](./images/Camect%201.gif)

## Step 2 – Alerts und Monitoring konfigurieren
- UI-Pfad: **Hub Settings -> Alert**
- Vorgehen
  - **Detect alerts** aktivieren.
  - Unter **Detect objects in alerts** die Objekte wählen.
  - Benötigte Alert-Typen auswählen.
- Events für GC-X-ONE bereitstellen
  - **Add Monitoring** klicken und **NXGEN** wählen.
  - Auf der NXGEN-Seite setzen:
    - **Site ID** = 1 (oder wie bereitgestellt).
    - **TCP address** = `3.122.169.231:10520` (oder wie bereitgestellt).
  - Für jede Kamera **Add camera** wählen, die weitergeleitet werden soll.
- Erwartetes Ergebnis: Camect erzeugt Alerts und leitet sie an GC-X-ONE weiter.
![Camect Monitoring Setup](./images/Camect%203.gif)

![Camect Camera Addition](./images/Camect%204.gif)

- Alerts prüfen
  - **Detect alerts** aktiv lassen.
  - Objekte unter **Detect objects in alerts** wählen.
  - Erforderliche Alert-Typen auswählen.
  
  ![Camect Alert Detection](./images/Camect%202.gif)

## Step 2c – Secondary Stream aktivieren (empfohlen)
- UI-Pfad: **Camera -> Settings -> Information -> Edit Substream**
- Vorgehen
  - **Substream** von `0` auf `1` stellen. Speichern.
- Zweck
  - Einen flüssigen Substream für Live View bereitstellen.
![Camect Substream Configuration](./images/Camect%205.gif)

## Step 3 – Device in GC-X-ONE hinzufügen
- UI-Pfad: **GC-X-ONE -> Customer -> Site -> Devices -> Add Device**
- Vorgehen
  - **Camect** auswählen.
  - Felder ausfüllen: **Host/Serial, Username, Password, Ports, Time Zone**.
  - **Discover** klicken. Gefundene Sensoren und I/O prüfen.
  - **Save** klicken.
- Erwartetes Ergebnis: GC-X-ONE listet Sensoren unter dem Camect-Device.
![Camect Device Configuration](./images/CAMECT%20ADDING%20DEVICE.png)

## Step 4 – Verifizieren
- Checks
  - Test-Alert senden. Er erscheint in **Video Activity**.
  - **Live** öffnet ohne Ruckeln.
  - PTZ-Presets bewegen sich, falls aktiviert.

# Troubleshooting
- Keine Events in Video Activity
  - Sicherstellen, dass **Detect alerts** aktiv ist.
  - **Monitoring -> NXGEN** mit korrekter **TCP address** und **Site ID** konfigurieren.
  - Kamera unter NXGEN Monitoring hinzufügen.
  - Time Sync/NTP prüfen.
- Discovery schlägt fehl
  - Credentials, Ports und Erreichbarkeit verifizieren.
- Live View ruckelt
  - Substream aktivieren (auf `1` setzen).
- Keine PTZ-Steuerung
  - Berechtigung **Pan/Tilt Cameras** für den GC-X-ONE User vergeben.

# Notes
- Least Privilege: Dedizierten User aus Step 1 verwenden.

# Change log
- 2025-09-02 v1.0.0 Initial GC-X-ONE aligned doc.

# Summary video
<!-- Video: Camect Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
- External: ([Camect website](https://camect.com/welcome/))
