---
title: "Uniview"
sidebar_label: "Uniview"
sidebar_position: 14
description: "Configure Uniview devices to integrate seamlessly with GC-X-ONE platform for video surveillance and monitoring."
tags:
  - Uniview
  - IP Camera
  - Video Surveillance
  - ONVIF
  - GC-X-ONE
---

# Uniview

**Device Information:**
- **Device**: Uniview Device Model
- **Vendor**: Uniview
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Uniview-Devices so konfigurieren, dass sie sich nahtlos mit GC-X-ONE für Videoüberwachung und Monitoring verbinden.
- Ergebnis: Erweiterte Funktionen durch Netzwerkkonfiguration, Time Sync und Alarm Management über die GC-X-ONE-Integration.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Administrative Rechte für die Uniview-Device-Konfiguration
- Netzwerkzugriff auf das Device
- Korrekte Firewall-Konfiguration für die Gerätekommunikation

# Device-Profil

- Typ: IP Camera/Video Surveillance Device
- Discovery: ONVIF/HTTP Protocol
- Events: Alarm-basierte Benachrichtigungen und Alerts
- Ports: HTTP/HTTPS, RTSP
- Bekannte Besonderheiten: Erfordert **korrekte Netzwerkkonfiguration** für die Gerätekommunikation. **Time Synchronization** via NTP ist entscheidend für korrekte Logs. **Alarm Configuration** nötig für Event-Benachrichtigungen.

**Core Functions**

- Live: Supported
- Events: Supported (Alarm-basiert)
- Time Sync: NTP Supported
- Network Configuration: Supported
- Basic Setup: Supported

# Schritte

## Step 1 – Netzwerkkonfiguration

- UI-Pfad: **Uniview Device -> Network Settings**

- Netzwerkeinstellungen konfigurieren
  - Netzwerkeinstellungen so setzen, dass das Device mit anderen Geräten oder Servern kommunizieren kann.
  - IP-Adresse (statisch oder DHCP), Subnet Mask, Default Gateway, DNS Server und ggf. Proxy konfigurieren.
  - Saubere Netzwerkkonfiguration stellt sicheren und zuverlässigen Zugriff auf lokale Ressourcen und Internet sicher.
  - ![Uniview Network Configuration](./images/Uniview%201.png)
  - ![Uniview Network Configuration 2](./images/Uniview%202.png)

- Erwartetes Ergebnis: Netzwerkverbindung für die Gerätekommunikation hergestellt.

## Step 2 – Time Configuration

- UI-Pfad: **Uniview Device -> Time Settings**

- Zeiteinstellungen setzen
  - Korrekte Zeit, Datum und Zeitzone konfigurieren.
  - Time Sync üblicherweise über NTP-Server.
  - Exakte Zeit ist entscheidend für Logging, Security-Protokolle (SSL/TLS) und geplante Tasks.
  - ![Uniview Time Settings](./images/Uniview%203.png)
  - ![Uniview Time Settings 2](./images/Uniview%204.png)

- Erwartetes Ergebnis: Time Sync mit NTP-Servern konfiguriert.

## Step 3 – Alarm Configuration

- UI-Pfad: **Uniview Device -> Alarm Settings**

- Alarm Settings konfigurieren
  - Alarme ermöglichen Alerts/Benachrichtigungen bei bestimmten Ereignissen oder Zuständen (z. B. Systemfehler, hohe Auslastung, Connectivity Issues).
  - Je nach System können visuelle Indikatoren, Sounds oder Benachrichtigungen per E-Mail/SMS ausgelöst werden.
  - ![Uniview Alarm Settings](./images/Uniview%205.png)

- Erwartetes Ergebnis: Alarm-Benachrichtigungen für Event Detection konfiguriert.

## Step 4 – Basic Setup

- UI-Pfad: **Uniview Device -> Basic Settings**

- Basic Settings konfigurieren
  - Grundlegende Einrichtung des Devices für den Betrieb.
  - Dazu gehören z. B. Sprache/Region, User Accounts, grundlegende Security (Firewall/Antivirus), I/O-Geräte und erste Software-Einstellungen.
  - ![Uniview Basic Settings](./images/Uniview%206.png)

- Erwartetes Ergebnis: Basisgerätkonfiguration abgeschlossen.

## Step 5 – Device in GC-X-ONE konfigurieren

- UI-Pfad: **GC-X-ONE -> Configuration App -> Site -> Devices -> Add**

- Device in GC-X-ONE hinzufügen
  - In GC-X-ONE anmelden.
  - Zur Configuration App navigieren.
  - Site -> Devices -> Add auswählen.
  - Pflichtfelder ausfüllen.
  - **Discover** klicken.
  - **Save** klicken.
  - ![Uniview GC-X-ONE Configuration](./images/Uniview%207.png)

- Erwartetes Ergebnis: Uniview-Device erfolgreich in GC-X-ONE hinzugefügt und erkannt.

## Step 6 – Integration verifizieren

- Checks
  - Netzwerkverbindung funktioniert.
  - Time Sync mit NTP-Servern testen.
  - Alarm-Benachrichtigungen funktionieren.
  - Basic Settings korrekt angewendet.
  - Device Discovery in GC-X-ONE bestätigt.

- Erwartetes Ergebnis: Vollständige Uniview-Integration mit GC-X-ONE.

# Troubleshooting

- Netzwerkprobleme
  - IP-Adresse, Subnet Mask und Gateway prüfen.
  - DNS-Einstellungen prüfen.
  - Proxy-Einstellungen (falls verwendet) kontrollieren.
  - Lokalen Netzwerkzugriff und Internetverbindung testen.

- Time Sync-Probleme
  - NTP-Server erreichbar?
  - Zeitzone korrekt eingestellt?
  - Netzwerk erlaubt NTP-Traffic?
  - Zeitkonfiguration für Logging/Security prüfen.

- Alarmkonfiguration
  - Alarm-Trigger und Schwellwerte prüfen.
  - Benachrichtigungswege (E-Mail, SMS) korrekt konfiguriert?
  - Alarmauslösung für verschiedene Szenarien testen.
  - Visuelle und akustische Indikatoren prüfen.

- Basic Setup-Probleme
  - Sprache/Region korrekt?
  - User Accounts sauber eingerichtet?
  - Security-Konfiguration (Firewall/Antivirus) korrekt gesetzt?
  - I/O-Geräte-Konfiguration prüfen.

- GC-X-ONE Integration
  - Device Credentials und Verbindungsdetails prüfen.
  - Discovery-Prozess kontrollieren.
  - Netzwerk-Konnektivität zwischen Device und GC-X-ONE sicherstellen.
  - Kompatibilität mit GC-X-ONE bestätigen.

# Notes

- Saubere Netzwerkkonfiguration ist essenziell für die Kommunikation.
- Time Sync via NTP ist entscheidend für korrekte Logs und Security-Protokolle.
- Alarmkonfiguration ermöglicht Event-basierte Benachrichtigungen.
- Basic Setup umfasst die Grundvorbereitung des Devices für den Betrieb.
- Alle Konfigurationen nach Umsetzung testen.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)

# Additional Resources

- NXGEN Help-desk: https://helpdesk.nxgen.io/portal/en/signin
