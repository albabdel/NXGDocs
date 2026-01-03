---
title: "Hikvision"
sidebar_label: "Hikvision"
sidebar_position: 10
description: "Configure Hikvision device to integrate seamlessly with GC-X-ONE platform for video surveillance tasks."
tags:
  - Hikvision
  - IP Camera
  - NVR
  - ISAPI
  - GC-X-ONE
---

# Hikvision

**Device Information:**
- **Device**: Hikvision Device Model
- **Vendor**: Hikvision
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Hikvision-Device für nahtlose Integration mit GC-X-ONE zur Videoüberwachung konfigurieren.
- Ergebnis: Verbesserte Funktionalität mit Datensicherheit und Performance für stabiles Management und Monitoring.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Hikvision-Device mit Continuous Recording eingerichtet.
- IP 35.156.60.98 (Hikvision Receiver) auf Whitelist setzen.
- Local Mode installiert (für P2P-Streaming, Audio, verschlüsselten Stream).

# Device-Profil

- Typ: IP Camera/NVR
- Discovery: ISAPI Protocol
- Events: Basic Events (Video Tampering), Smart Events (Line Crossing, Intrusion Detection)
- Ports: HTTP/HTTPS, RTSP
- Bekannte Besonderheiten: **Motion Events vermeiden** – sie können zu vielen Alarmen führen. **RTSP- und WEB-Authentication** auf Digest setzen, um die Sicherheit zu erhöhen.

**Core Functions**

- Live: Supported
- Playback: Supported
- Events: Supported (Basic und Smart Events)
- PTZ/Presets: Supported
- Audio: Supported (Two-way Audio)
- Authentication: Digest (Recommended)

# Schritte

## Step 1 – System Configuration (Time Management)

- UI-Pfad: **Configuration -> System -> System Settings -> Time Settings**

- Vorgehen
  - Im Hikvision-Portal mit den benötigten Credentials einloggen.
  - Zur **Configuration**-Page wechseln, dann **System** wählen.
  - Zu **System Settings** und **Time Settings** gehen.
  - **Time Zone** wählen und **NTP** aktivieren.
  - Wenn unterstützt, **DST** aktivieren.

- Zweck
  - NTP synchronisiert die Uhren der Geräte über das Netzwerk.
  - DST nutzt das Tageslicht in den Sommermonaten besser aus.

- Erwartetes Ergebnis: Zeitzone mit NTP und DST konfiguriert.
![Hikvision Time Configuration](./images/Hik%201.png)

![Hikvision NTP Settings](./images/Hik%202.png)

## Step 2 – User Management

- UI-Pfad: **Configuration -> System -> User management -> Add**

- Vorgehen
  - Zur **Configuration**-Page gehen und **System** auswählen.
  - **User management** öffnen und **Add** klicken.
  - Username und Password für NXGEN eintragen.
  - Empfehlung: Username „NXG“ mit den unten aufgeführten Rechten setzen.

- Benötigte Berechtigungen für den User „NXG“:
  - Local: Parameters Settings
  - Local: Log Search
  - Local: Playback
  - Local: Manual Operation
  - Local: PTZ Control
  - Local: Video Export
  - Remote: Parameters Settings
  - Remote: Log Search / Interrogate Working
  - Remote: Two-way Audio
  - Remote: Notify Surveillance Center / Trigger
  - Remote: Video Output Control
  - Remote: Live View
  - Remote: PTZ Control
  - Remote: Playback/Download

- Gewünschte Kameras auswählen, auf die diese Rechte angewendet werden sollen.
- Mit **OK** speichern.

- Erwartetes Ergebnis: NXG-User mit passenden Berechtigungen angelegt.
![Hikvision User Creation](./images/Hik%203.png)
![Hikvision Permissions](./images/Hik%204.png)

## Step 3 – Security Configuration

- UI-Pfad: **Configuration -> System -> Security**

- Vorgehen
  - RTSP- und WEB-Authentication auf Digest setzen.
  - So werden Credentials stärker geschützt und unbefugter Zugriff erschwert.

- Erwartetes Ergebnis: Authentication auf Digest gesetzt.

## Step 4 – Network Configuration (Integration Protocol)

- UI-Pfad: **Configuration -> Network -> Advanced Settings -> Integration Protocol**

- Vorgehen
  - Unter „Network“ zu „Advanced Settings“ wechseln und „Integration Protocol“ wählen.
  - ISAPI per Checkbox aktivieren.

- Erwartetes Ergebnis: ISAPI Protocol aktiviert.
![Hikvision Integration Protocol](./images/Hik%205.png)

## Step 5 – Basic Events konfigurieren

- UI-Pfad: **Configuration -> Event -> Basic Event**

- Vorgehen
  - In der „Configuration“-Page unter „Event“ auf „Basic Event“ gehen.
  - Kamera auswählen.
  - Area of Interest zeichnen.
  - Arming Schedule im Tab „Arming Schedule“ setzen.
  - Im Tab „Linkage Method“ das Häkchen unter der Kamera setzen und „Notify Surveillance Center“ aktivieren.
  - Um Alarme anderer Kameras auszulösen, „Trigger Alarm Output“ im Bereich „Normal Linkage“ nutzen.

- Wichtiger Hinweis: Motion Events vermeiden, da sie zu vielen Alarmen führen können.

- Erwartetes Ergebnis: Basic Events für ausgewählte Kameras konfiguriert.
![Hikvision Basic Event](./images/Hik%206.png)

## Step 6 – Smart Events konfigurieren

- UI-Pfad: **Configuration -> Event -> Smart Event**

- Verfügbare Smart Events:
  - **Line Crossing Detection**: Erkennt, wenn ein Objekt eine definierte virtuelle Linie überschreitet (z. B. Ein-/Ausgänge).
  - **Intrusion Detection**: Erkennt, wenn ein Objekt in einen definierten Bereich eintritt oder sich darin bewegt (z. B. gesicherte Zonen).

- Vorgehen
  - In der „Configuration“-Page unter „Event“ auf „Smart Event“ gehen.
  - Kamera auswählen.
  - Linien im Bereich of Interest zeichnen.
  - Arming Schedule im Tab „Arming Schedule“ setzen.
  - Im Tab „Linkage Method“ Häkchen unter der Kamera setzen und „Notify Surveillance Center“ aktivieren.
  - Zum Auslösen anderer Kameras „Trigger Alarm Output“ im Bereich „Normal Linkage“ verwenden.

- Erwartetes Ergebnis: Smart Events konfiguriert und Sicherheitswirkung erhöht.
![Hikvision Smart Event](./images/Hik%207.png)

## Step 7 – Device in GC-X-ONE hinzufügen
- UI-Pfad: **GC-X-ONE -> Customer -> Site -> Devices -> Add Device**
- Vorgehen
  - **Hikvision** auswählen.
  - Felder ausfüllen: **Host/Serial, Username, Password, Ports, Time Zone**.
  - **Discover** klicken. Gefundene Sensoren und I/O prüfen.
  - **Save** klicken.
- Erwartetes Ergebnis: GC-X-ONE listet Sensoren unter dem Hikvision-Device.
![Hikvision Device Configuration](./images/Hik%208.png)

## Step 8 – Integration verifizieren

- Checks
  - Time Sync funktioniert.
  - NXG-User Login und Berechtigungen testen.
  - ISAPI Protocol aktiv?
  - Basic und Smart Events lösen korrekt aus?
  - „Notify Surveillance Center“ sendet Benachrichtigungen?

- Erwartetes Ergebnis: Vollständige Hikvision-Integration mit der GC-X-ONE-Plattform.

# Troubleshooting

- Time Sync-Probleme
  - Erreichbarkeit des NTP-Servers prüfen.
  - Zeitzone mit GC-X-ONE abgleichen.
  - DST-Einstellungen kontrollieren.

- User-Permissions
  - Alle benötigten Rechte dem NXG-User zugewiesen?
  - Kamera-spezifische Rechte gesetzt?
  - User-Account aktiv?

- Event-Konfiguration
  - Motion Events vermeiden, um Alarmflut zu verhindern.
  - „Notify Surveillance Center“ aktiviert?
  - Arming Schedule korrekt konfiguriert?

- Authentication-Fehler
  - RTSP- und WEB-Authentication auf Digest gesetzt?
  - Credentials korrekt?
  - ISAPI Protocol aktiviert?

# Notes

- RTSP und WEB Authentication sollten auf Digest stehen, um die Sicherheit zu erhöhen.
- Motion Events vermeiden, da sie zu vielen Alarmen führen können.
- Saubere Konfiguration erhöht Funktionsumfang, Datensicherheit und Performance des Überwachungssystems.
- Bei Problemen bitte ein Ticket im NXGEN Help-Desk-Portal eröffnen.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from GCXONE)

<!-- Video: Hikvision Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
