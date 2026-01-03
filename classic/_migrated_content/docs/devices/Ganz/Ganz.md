---
title: "Ganz"
sidebar_label: "Ganz"
sidebar_position: 9
description: "Configure Ganz devices to integrate seamlessly with GC-X-ONE platform for video surveillance and event management."
tags:
  - Ganz
  - IP Camera
  - ONVIF
  - Video Surveillance
  - GC-X-ONE
---

# Ganz

**Device Information:**
- **Device**: Ganz Device Model
- **Vendor**: Ganz
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Ganz-Devices für nahtlose Integration mit GC-X-ONE zur Videoüberwachung und zum Event-Management konfigurieren.
- Ergebnis: Erweiterte Funktionen für Live-Streaming, Event Detection und Alarm Management über die GC-X-ONE-Integration.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Netzwerkzugriff auf das Ganz-Device
- Administrative Rechte für die Device-Konfiguration
- Richtige Firewall-Konfiguration für HTTP/HTTPS und RTSP Ports
- Zugriff auf NTP-Server für Time Sync

# Device-Profil

- Typ: IP Camera/Video Surveillance Device
- Discovery: ONVIF Protocol
- Events: Motion Detection, Tampering, Line Crossing, Intrusion Detection
- Ports: HTTP/HTTPS (80/443), RTSP (554)
- Bekannte Besonderheiten: **Korrekte Time Synchronization** für genaue Event-Timestamps notwendig. **ONVIF** muss für Third-Party-Integration aktiviert sein. **Stream Configuration** beeinflusst Performance.

**Core Functions**

- Live: Supported
- Events: Supported (Motion, Tampering, Line Crossing, Intrusion)
- Stream Configuration: Supported (H.264/H.265)
- Time Sync: NTP Supported
- ONVIF: Supported

# Schritte

## Step 1 – Netzwerkkonfiguration

- UI-Pfad: **Ganz Device -> Network Settings**

- Netzwerkeinstellungen konfigurieren
  - Static IP vergeben oder DHCP nutzen.
  - Konfigurieren:
    - IP Address
    - Subnet Mask
    - Default Gateway
    - DNS Server
  - Port Forwarding einrichten, falls Internetzugriff benötigt wird.
  - Firewall so einstellen, dass HTTP/HTTPS und RTSP (typisch 80/443 und 554) erlaubt sind.
  - ![Ganz Network Configuration](./images/ganz%201.png)

- Erwartetes Ergebnis: Netzwerkverbindung zum Ganz-Device hergestellt.

## Step 2 – Time Settings konfigurieren

- UI-Pfad: **Ganz Device -> Time Settings**

- Time Sync einrichten
  - Zeitzone korrekt setzen.
  - NTP (Network Time Protocol) aktivieren und mit zuverlässigem Zeitserver synchronisieren (z. B. pool.ntp.org).
  - Sicherstellen, dass Kamera und VMS Server zeitlich synchron sind.
  - ![Ganz Time Settings](./images/ganz%202.png)

- Erwartetes Ergebnis: Zeiteinstellungen mit NTP-Sync für genaue Event-Timestamps konfiguriert.

## Step 3 – Alarm-/Event-Konfiguration

- UI-Pfad: **Ganz Device -> Alarm/Event Settings**

- Event Detection konfigurieren
  - Bewegungszonen in den Kameraeinstellungen definieren.
  - Alarm Input/Output konfigurieren (falls I/O vorhanden).
  - Event-Trigger aktivieren:
    - Motion Detection
    - Tampering
    - Line Crossing
    - Intrusion Detection
  - Benachrichtigungsmethoden setzen (E-Mail, Snapshot Upload oder VMS Alert).
  - Event-Trigger testen, um die Funktion zu verifizieren.
  - ![Ganz Alarm Setup 1](./images/ganz%203.png)
  - ![Ganz Alarm Setup 2](./images/ganz%204.png)
  - ![Ganz Alarm Setup 3](./images/ganz%205.png)
  - ![Ganz Alarm Setup 4](./images/ganz%206.png)

- Erwartetes Ergebnis: Event-Trigger konfiguriert und getestet.

## Step 4 – Live View Settings

- UI-Pfad: **Ganz Device -> Live View/Stream Settings**

- Stream Settings konfigurieren
  - Stream-Typ wählen (Main Stream/Sub-Stream).
  - Auflösung, Frame Rate und Kompression (H.264/H.265) für Performance optimieren.
  - ONVIF aktivieren, wenn Third-Party-Plattformen genutzt werden.
  - ![Ganz Stream Settings 1](./images/ganz%207.png)
  - ![Ganz Stream Settings 2](./images/ganz%208.png)

- Erwartetes Ergebnis: Live Stream für GC-X-ONE optimiert.

## Step 5 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration App -> Site -> Devices -> Add -> GanzAI**

- Device in GC-X-ONE konfigurieren
  - In GC-X-ONE einloggen.
  - Zur Configuration App wechseln.
  - Site -> Devices -> Add -> GanzAI auswählen.
  - Pflichtfelder eintragen:
    - Device Name
    - IP Address
    - Username und Password
    - Port-Konfiguration
  - **Discover** klicken.
  - **Save** klicken.
  - ![Ganz GC-X-ONE Configuration](./images/ganz%209.png)

- Erwartetes Ergebnis: Ganz-Device erfolgreich in GC-X-ONE hinzugefügt und erkannt.

## Step 6 – Integration verifizieren

- Checks
  - Live Stream erscheint in GC-X-ONE.
  - Event Detection und Alarm-Benachrichtigungen testen.
  - Time Sync funktioniert.
  - ONVIF-Kompatibilität prüfen.
  - Alle konfigurierten Event-Trigger funktionieren.

- Erwartetes Ergebnis: Vollständige Ganz-Integration mit GC-X-ONE.

# Troubleshooting

- Netzwerkprobleme
  - IP Address, Subnet Mask und Gateway prüfen.
  - Firewall-Einstellungen für Ports 80/443, 554 kontrollieren.
  - Port Forwarding für Remote Access korrekt konfigurieren.

- Time Sync-Probleme
  - NTP-Server erreichbar?
  - Zeitzone stimmt mit GC-X-ONE überein?
  - Kamera und VMS zeitlich synchron?

- Event Detection-Probleme
  - Motion-Zonen und Sensitivität testen.
  - Alarm I/O-Konfiguration prüfen.
  - Benachrichtigungen korrekt eingerichtet?
  - Event-Trigger aktiviert und getestet?

- Stream-Qualität
  - Auflösung, Frame Rate und Kompression anpassen.
  - Bandbreite prüfen.
  - Stream-Typ (Main/Sub-Stream) verifizieren.

- ONVIF-Kompatibilität
  - ONVIF auf dem Device aktivieren.
  - ONVIF-Profil-Kompatibilität mit GC-X-ONE prüfen.
  - Discovery-Einstellungen kontrollieren.

# Notes

- Time Synchronization ist entscheidend für korrekte Event-Timestamps.
- ONVIF sollte für Third-Party-Integration aktiviert sein.
- Stream Configuration beeinflusst Performance – auf verfügbare Bandbreite abstimmen.
- Alle Event-Trigger nach der Konfiguration testen.
- Firewall für benötigte Ports korrekt konfigurieren.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)

# Additional Resources

- NXGEN Help-desk: https://helpdesk.nxgen.io/portal/en/signin
