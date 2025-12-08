---
title: "Avigilon"
sidebar_label: "Avigilon"
sidebar_position: 3
description: "Configure Avigilon Video Management System (VMS) to integrate seamlessly with GC-X-ONE platform for enhanced video surveillance and analytics."
tags:
  - Avigilon
  - VMS
  - Video Management
  - Analytics
  - GC-X-ONE
---

# Avigilon

**Device Information:**
- **Device**: Avigilon Device Model
- **Vendor**: Avigilon
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Zusammenfassung

- Zweck: Avigilon Video Management System (VMS) so konfigurieren, dass es sich nahtlos mit der GC-X-ONE-Plattform für erweiterte Videoüberwachung und Analytics integriert.
- Ergebnis: Erweiterte Funktionen mit Analytics, User Management und Alarmkonfiguration für robustes Management und Monitoring über die GC-X-ONE-Integration.
- Zielgruppe: Systemadministratoren / IT-Fachkräfte / Field Engineers.

# Voraussetzungen

- Avigilon ACC Client-Software
- ACC 7 Web Endpoint Service
- IT-Team, das Port Forwarding auf Firewall oder Router einrichtet
- Administrative Rechte auf dem Avigilon-System

# Device-Profil

- Typ: Video Management System (VMS)
- Discovery: WebAPI Endpoint
- Events: Motion Detection, Analytics Events, Alarm Triggers
- Ports: Custom (per Port Forwarding konfiguriert)
- Bekannte Besonderheiten: **WebAPI Endpoint Installation** für externe Kommunikation erforderlich. **User Group Setup** für GC-X-ONE-Zugriff obligatorisch. **Analytics-Konfiguration** auf Kameraebene nötig für Event Detection.

**Core Functions**

- Live: Supported
- Analytics: Supported (Motion Detection, Object Detection)
- Events: Supported
- Alarm Management: Supported
- User Management: Supported
- PTZ Controls: Supported

# Schritte

## Step 1 – Essenzielle Softwarekomponenten installieren

- WebAPI Endpoint installieren
  - Bei Nutzung von Avigilon VMS den WebAPI Endpoint installieren.
  - Den Avigilon WebAPI Endpoint gemäß Quick Start Guide installieren.
  - Dieser Endpoint ermöglicht die Kommunikation zwischen VMS und externen Anwendungen.

- ACC Server Accessibility sicherstellen
  - Prüfen, dass der ACC (Avigilon Control Center) Server korrekt installiert und funktionsfähig ist.
  - Der ACC Server kommuniziert extern über den konfigurierten Server Port, sodass das VMS Daten senden und empfangen kann.

- Erwartetes Ergebnis: WebAPI Endpoint installiert und ACC Server erreichbar.

## Step 2 – In den Avigilon ACC Client einloggen

- UI-Pfad: **ACC Client -> Login**

- ACC Client aufrufen
  - Im ACC Client Login-Screen im Suchfeld die IP-Adresse des Devices eintragen.
  - Username und Password für den ACC Client eingeben.
  
  ![ACC Client Login](./images/Avigilon%201.png)

- Erwartetes Ergebnis: Erfolgreich im ACC Client eingeloggt.

## Step 3 – Zur Kamera-Konfiguration navigieren

- UI-Pfad: **ACC Client -> Camera Selection**

- Kamera-Interface aufrufen
  - Nach dem Login im Client-Interface die gewünschte Kamera bzw. das Device auswählen.
  - ![Camera Selection](./images/Avigilon%202.png)

- Erwartetes Ergebnis: Kamera-Interface zur Konfiguration erreichbar.

## Step 4 – Kamera-Setup öffnen

- UI-Pfad: **Camera -> Right-Click -> Setup**

- Kamera-Konfiguration öffnen
  - Rechtsklick auf die Kamera, die konfiguriert werden soll.
  - Im Kontextmenü „Setup“ wählen.
  - Dadurch öffnet sich die Konfigurationsseite der Kamera.
  - ![Camera Right-Click](./images/Avigilon%203.png)
  - ![Camera Setup](./images/Avigilon%204.png)

- Erwartetes Ergebnis: Seite zur Kamerakonfiguration geöffnet.

## Step 5 – Motion Detection Analytics konfigurieren

- UI-Pfad: **Camera Setup -> Analytics -> Motion Detection**

- Motion Detection einrichten
  - Gewünschten Analytics-Typ auswählen und konfigurieren.
  - Anschließend die spezifischen Einstellungen anpassen:
    - **Object Types**: Objektarten wählen (Person, Vehicle).
    - **Sensitivity**: Empfindlichkeit festlegen (Empfehlung 8–10).
    - **Threshold Time**: Mindestdauer setzen (Empfehlung 2 Sekunden).
    - **Pre-Motion Record Time**: Aufzeichnungszeit vor Event (Empfehlung 10 Sekunden).
    - **Post-Motion Record Time**: Aufzeichnungszeit nach Event (Empfehlung 10 Sekunden).
  - ![Motion Detection](./images/Avigilon%205.png)

- Erwartetes Ergebnis: Motion Detection Analytics konfiguriert.

## Step 6 – Analytic Events konfigurieren

- UI-Pfad: **Camera Setup -> Analytics -> Analytic Events**

- Analytic Events einrichten
  - Analytics verarbeiten den Videostream in Echtzeit, um auf bestimmte Aktivitäten oder Bedingungen zu reagieren.
  - Auf „Add“ klicken.
  - Area of Interest über das Icon oben links definieren.
  - ![Add Analytic Event](./images/Avigilon%206.png)
  - ![Define Area](./images/Avigilon%207.png)

- Event-Parameter festlegen
  - Nach dem Hinzufügen der Area of Interest folgende Parameter setzen:
    - **Enabled Checkbox**: Aktivieren, um das Analytic Event zu nutzen.
    - **Activity**: Aktivitätstyp auswählen, der in der Zone überwacht wird.
    - **Object Types**: Objektarten festlegen, die erkannt werden sollen.
    - **Sensitivity**: Empfindlichkeit festlegen (Empfehlung 8–10).
    - **Threshold Time**: Mindestdauer (Empfehlung 2 Sekunden).
    - **Number of Objects**: Anzahl der Objekte definieren, die das Event auslösen.
    - **Timeout**: Wartezeit vor dem Zurücksetzen (Empfehlung 10 Sekunden).
    - **Distance (feet)**: Mindestdistanz, die ein Objekt zurücklegen muss.
  - ![Analytic Event Parameters](./images/Avigilon%208.png)

- Erwartetes Ergebnis: Analytic Events mit definierter Area of Interest konfiguriert.

## Step 7 – User Group für GC-X-ONE anlegen

- UI-Pfad: **Site -> Right-Click -> Setup -> User and Groups**

- Site-Konfiguration aufrufen
  - Rechtsklick auf die gewünschte Site.
  - Im Kontextmenü „Setup“ wählen.
  - Dadurch öffnet sich die Site-Konfigurationsseite.
  - ![Site Setup](./images/Avigilon%209.png)
  - Zu „User and groups“ navigieren.
  - ![User and Groups](./images/Avigilon%2010.png)

- Erwartetes Ergebnis: Zugriff auf die Konfiguration für User und Groups.

## Step 8 – User Group erstellen

- UI-Pfad: **Groups -> Add**

- Neue Gruppe hinzufügen
  - Zu „Groups“ wechseln und **Add** anklicken.
  - ![Add Group](./images/Avigilon%2011.png)
  - Eine Kopie der Berechtigungen „Restricted Users“ für NXGEN anlegen.
  - ![Copy Permissions](./images/Avigilon%2012.png)

- Erwartetes Ergebnis: Neue User Group erstellt.

## Step 9 – Gruppeneinstellungen konfigurieren

- Gruppendetails festlegen
  - Den **Name** der User Group eintragen, empfohlen „NXGEN“ oder „NXG“.
  - Folgende Privileges unter „Group Privileges“ vergeben:
    - **View Live Images**:
      - PTZ Controls nutzen
      - PTZ Controls sperren
      - Trigger Digital Outputs
      - Broadcast to speakers
    - **Receive live events with identifying features**
    - **View high resolution images**
    - **View Recorded Images**:
      - Export images
      - View images recorded before login
      - Licensed search for identifying features
    - **View Maps**:
      - Manage Maps
    - **Manage user sessions**
    - **Listen to microphones**

- Erwartetes Ergebnis: Gruppen-Privileges eingerichtet.

## Step 10 – Kameras der Gruppe zuordnen

- Kamerazugriff hinzufügen
  - Die Kameras hinzufügen, die in der GC-X-ONE-Plattform erscheinen sollen.
  - ![Select Cameras](./images/Avigilon%2013.png)
  - ![Assign Cameras](./images/Avigilon%2014.png)
  - ![Camera Assignment](./images/Avigilon%2015.png)
  - Mit **Ok** die Änderungen speichern.

- Erwartetes Ergebnis: Kameras der User Group zugewiesen.

## Step 11 – Alarme konfigurieren

- UI-Pfad: **Setup -> Alarms**

- Alarm-Konfiguration öffnen
  - Zur Setup-Seite zurückkehren und „Alarms“ auswählen.
  - ![Alarms Section](./images/Avigilon%2016.png)
  - Auf **Add** klicken.
  - ![Add Alarm](./images/Avigilon%2017.png)

- Erwartetes Ergebnis: Alarm-Konfigurationsseite geöffnet.

## Step 12 – Alarm Trigger Source definieren

- Alarm-Trigger konfigurieren
  - Alarm-Trigger-Quelle festlegen und die relevanten Kameras auswählen.
  - Anschließend **Next** klicken.
  - ![Alarm Trigger Source](./images/Avigilon%2018.png)

- Erwartetes Ergebnis: Alarm-Trigger-Quelle konfiguriert.

## Step 13 – Alarm-Aufzeichnungseinstellungen konfigurieren

- Recording-Parameter festlegen
  - Geräte auswählen, die mit diesem Alarm verknüpft werden sollen.
  - **Pre-alarm recording time** einstellen (Empfehlung 10 Sekunden).
  - Recording-Dauer definieren.
  - Dann auf **Next** klicken.
  - ![Alarm Recording](./images/Avigilon%2019.png)

- Erwartetes Ergebnis: Aufzeichnungseinstellungen für Alarme konfiguriert.

## Step 14 – Alarmempfänger konfigurieren

- UI-Pfad: **Alarm Recipients -> Add Recipients**

- Empfänger einrichten
  - Alarmempfänger auswählen.
  - Auf **Add Recipients** klicken und die zuvor konfigurierte Gruppe wählen.
  - ![Alarm Recipients](./images/Avigilon%2020.png)
  - **Next** klicken.

- Erwartetes Ergebnis: Alarmempfänger festgelegt.

## Step 15 – Alarmkonfiguration abschließen

- Alarm-Setup abschließen
  - Den entsprechenden User auswählen.
  - Auf **Add** klicken.
  - Dauer definieren, wie lange der Empfänger bei Alarm benachrichtigt wird.
  - ![Finalize Alarm](./images/Avigilon%2021.png)
  - Änderungen speichern.

- Erwartetes Ergebnis: Alarmkonfiguration abgeschlossen und gespeichert.

## Step 16 – Device in GC-X-ONE konfigurieren

- UI-Pfad: **GC-X-ONE -> Site -> Configuration App -> Devices**

- Vorgehen
  - In der GC-X-ONE Configuration App zur gewünschten Site wechseln.
  - Avigilon als Device wählen und **Serial Number**, **UserName** und **Password** eintragen.
![GC-X-ONE Configuration](./images/Avigilon%2022.png)

- Vorgehen
  - Nach dem Ausfüllen auf **Discover** klicken; die Sensoren sollten erkannt werden.

- Erwartetes Ergebnis: Sensoren erfolgreich in GC-X-ONE entdeckt.

## Step 17 – Integration verifizieren

- Checks
  - WebAPI Endpoint funktionsfähig?
  - User Group Access und Berechtigungen testen.
  - Erzeugen Analytics passende Events?
  - Alarm-Benachrichtigungen testen.
  - Kamera-Zugriff über die konfigurierte User Group prüfen.

- Erwartetes Ergebnis: Vollständige Avigilon-Integration mit der GC-X-ONE-Plattform.

# Troubleshooting

- WebAPI Endpoint-Probleme
  - Prüfen, ob der WebAPI Endpoint korrekt installiert ist.
  - Port-Forwarding-Konfiguration kontrollieren.
  - Sicherstellen, dass der ACC Server extern erreichbar ist.

- Probleme beim User Access
  - Gruppenberechtigungen korrekt gesetzt?
  - Kamerazuweisungen zur User Group prüfen.
  - Stimmt der Umfang der vergebenen Privileges?

- Analytics funktionieren nicht
  - Sensitivity-Einstellungen prüfen (Empfehlung 8–10).
  - Ist die Area of Interest korrekt definiert?
  - Threshold Time und Timeout-Einstellungen verifizieren.

- Alarmkonfiguration fehlerhaft
  - Alarm-Trigger-Quellen richtig gewählt?
  - Empfänger-Konfiguration entspricht der User Group?
  - Recording-Einstellungen korrekt gesetzt?

# Notes

- Installation des WebAPI Endpoints ist Pflicht für externe Kommunikation.
- User Group Setup ist notwendig für GC-X-ONE-Zugriff.
- Analytics-Konfiguration auf Kameraebene ist für Event Detection erforderlich.
- Empfohlene Einstellungen: Sensitivity 8–10, Threshold Time 2 Sekunden, Timeout 10 Sekunden.
- Pre-Alarm und Post-Motion Recording empfohlen mit 10 Sekunden.
- IT-Team muss korrektes Port Forwarding einrichten.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
