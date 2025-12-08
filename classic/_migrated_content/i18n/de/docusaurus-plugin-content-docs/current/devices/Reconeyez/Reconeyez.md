---
title: "Reconeyez"
sidebar_label: "Reconeyez"
sidebar_position: 11
description: "Configure Reconeyez devices to integrate with GC-X-ONE platform for event-driven video surveillance and monitoring."
tags:
  - Reconeyez
  - Event Camera
  - Battery Powered
  - Mobile Connectivity
  - GC-X-ONE
---

# Reconeyez

**Device Information:**
- **Device**: Reconeyez Device Model
- **Vendor**: Reconeyez
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Zusammenfassung

- Zweck: Reconeyez-Devices für ereignisgesteuerte Videoüberwachung und Monitoring in GC-X-ONE konfigurieren.
- Ergebnis: Erweiterte Funktionen mit mobiler Konnektivität, Event-basiertem Capture und Cloud-Integration über GC-X-ONE.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Gültige SIM-Karte mit Datenplan (für LTE) oder Wi-Fi-Zugang
- Zugriff auf Reconeyez Mobile App oder Cloud Platform
- Device ID aus dem Reconeyez Client (als Serial Number genutzt)
- Netzwerkverbindung, die ausgehende Verbindungen zur Cloud erlaubt

# Device-Profil

- Typ: Battery-Powered Event Camera
- Discovery: Device ID/Serial Number basiert
- Events: Motion Detection, Alarm Triggers, Scheduled Captures
- Connectivity: LTE/4G, Wi-Fi, Bluetooth
- Bekannte Besonderheiten: **Device ID aus dem Client ist Pflicht** und wird als Serial Number verwendet. **Event-driven Capture** statt kontinuierlichem Streaming. **Power Conservation** limitiert Live-Video. **Webhook-Konfiguration** für Plattformintegration erforderlich.

**Core Functions**

- Event Capture: Supported (10-15 Sekunden Clips)
- Snapshots: Supported (Intervall und Anzahl konfigurierbar)
- Cloud Integration: Supported via Reconeyez Cloud
- Mobile Connectivity: Supported (LTE/4G, Wi-Fi)
- API Integration: Supported für Event-Forwarding

# Schritte

## Step 1 – Netzwerkkonfiguration

- UI-Pfad: **Reconeyez Device -> Network Settings**

- Konnektivitätsoptionen konfigurieren
  - **Für LTE/4G**:
    - SIM-Karte mit gültigem Datenplan einsetzen.
    - Auf ausreichende Signalstärke achten.
  - **Für Wi-Fi**:
    - Netzwerkeinstellungen über Mobile App oder Cloud Platform setzen.
    - SSID und Passwort konfigurieren.
    - Wi-Fi-Abdeckung und Signal prüfen.
  - **Allgemein**:
    - Devices verbinden sich automatisch mit der Reconeyez Cloud (wenig manuelle IP-Konfig notwendig).
    - Firewall/Proxy so einstellen, dass ausgehende Cloud-Verbindungen erlaubt sind.
    - Netzwerk-Konnektivität zur Cloud verifizieren.

- Erwartetes Ergebnis: Netzwerkverbindung für Cloud-Kommunikation hergestellt.

## Step 2 – Event-Konfiguration

- UI-Pfad: **Reconeyez Cloud Portal/Mobile App -> Event Settings**

- Event-driven Capture konfigurieren
  - Reconeyez Cloud Portal oder Mobile App öffnen.
  - Event-Trigger für Video Capture konfigurieren.
  - Snapshots oder Video-Clips (typisch 10–15 Sekunden) bei Event-Trigger festlegen.
  - Anzahl der Fotos und Zeitintervall für Snapshots setzen.
  - Event-Detection-Parameter und Sensitivität konfigurieren.
  
  ![Reconeyez Event Configuration 1](./images/Reconeyez%201.png)
  
  ![Reconeyez Event Configuration 2](./images/Reconeyez%202.png)

- Erwartetes Ergebnis: Event Capture-Einstellungen für optimale Überwachung gesetzt.

## Step 3 – Platform Integration Setup

- UI-Pfad: **Reconeyez Platform -> Integration Settings**

- Third-Party-Integration konfigurieren
  - API-Zugriff für Event-Forwarding und Video-Zugriff einrichten.
  - E-Mail-/FTP-Benachrichtigungen zu externen Systemen konfigurieren.
  - Integration zur Leitstelle via SIA oder Contact ID einrichten.
  - Optional Cloud-to-Cloud-Integration konfigurieren.
  - In GC-X-ONE einen Workflow konfigurieren, der den Webhook für Event Notifications setzt.
  
  ![Reconeyez Platform Integration](./images/Reconeyez%203.png)

- Erwartetes Ergebnis: Plattformintegration für Event-Weiterleitung konfiguriert.

## Step 4 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration App -> Site -> Devices -> Add -> Reconeyez**

- Reconeyez Device registrieren
  - In GC-X-ONE einloggen.
  - Zur Configuration App wechseln.
  - Site -> Devices -> Add -> Reconeyez wählen.
  - Pflichtfelder ausfüllen:
    - **Device Name**: Beschreibender Name
    - **Serial Number**: Device ID aus dem Reconeyez Client (Pflicht)
    - **Connection details**: Netzwerk- und Authentifizierungsparameter
    - **Integration settings**: Webhook- und API-Konfiguration
  - **Discover** klicken, um das Device zu erkennen.
  - Erfolgreiche Discovery prüfen.
  - **Save** klicken, um die Registrierung abzuschließen.
  
  ![Reconeyez GC-X-ONE Configuration](./images/Reconeyez%204.png)

- **Wichtiger Hinweis**: Device ID aus dem Client wird als Serial Number verwendet und ist Pflicht.

- Erwartetes Ergebnis: Reconeyez Device erfolgreich in GC-X-ONE hinzugefügt und konfiguriert.

## Step 5 – Integration verifizieren

- Checks
  - Netzwerkverbindung (LTE/4G oder Wi-Fi) funktionsfähig?
  - Event-driven Video Capture testen.
  - Snapshots werden im konfigurierten Intervall erstellt?
  - Cloud-Plattform-Integration funktioniert?
  - Webhook-Benachrichtigungen an GC-X-ONE testen.
  - API-Zugriff für Event-Forwarding prüfen.
  - Historische Event-Review möglich?
  - Live-Status-Monitoring funktioniert?

- Erwartetes Ergebnis: Vollständige Reconeyez-Integration mit GC-X-ONE.

# Troubleshooting

- Netzwerkprobleme
  - SIM-Karte korrekt eingelegt und aktiviert?
  - Mobile Signalstärke für LTE/4G prüfen.
  - Wi-Fi-Credentials korrekt und Signal ausreichend?
  - Firewall-Einstellungen für ausgehende Cloud-Verbindungen prüfen.
  - Internetverbindung und DNS testen.

- Event Capture-Probleme
  - Event-Trigger korrekt konfiguriert?
  - Batteriestand für optimale Performance prüfen.
  - Beleuchtung/Positionierung für Motion Detection geeignet?
  - Snapshot-Intervall und Anzahl testen.
  - Speicherplatz für aufgezeichnete Events prüfen.

- Plattform-Integration
  - API-Credentials und Berechtigungen prüfen.
  - Webhook-Konfiguration in GC-X-ONE verifizieren.
  - E-Mail-/FTP-Benachrichtigungen testen.
  - SIA/Contact ID-Konfiguration bestätigen.
  - Cloud-to-Cloud-Integration korrekt eingerichtet?

- Device Registration
  - Device ID korrekt als Serial Number eingetragen?
  - Discovery-Prozess in GC-X-ONE prüfen.
  - Alle Pflichtfelder ausgefüllt?
  - Device-Kompatibilität mit GC-X-ONE bestätigt?

- Power/Performance
  - Batteriestand überwachen.
  - Event-Trigger-Sensitivität optimieren, um Strom zu sparen.
  - Capture-Frequenz und Energieverbrauch ausbalancieren.
  - Live-Video-Limits wegen Stromsparfunktionen beachten.

# Notes

- Reconeyez-Devices sind auf Event-driven Capture optimiert, nicht auf Dauerstreaming.
- Live-Video ist aufgrund von Power Conservation bei batteriebetriebenen Geräten limitiert.
- Device ID aus dem Reconeyez Client ist Pflicht und wird als Serial Number in GC-X-ONE genutzt.
- Devices verbinden sich automatisch mit der Reconeyez Cloud mit minimaler Konfiguration.
- Event-Clips sind typischerweise 10–15 Sekunden lang, um Speicher und Übertragung zu optimieren.
- Webhook-Konfiguration in GC-X-ONE ist essenziell für Event-Benachrichtigungen.
- Mobile Connectivity-Optionen: LTE/4G, Wi-Fi, Bluetooth.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
