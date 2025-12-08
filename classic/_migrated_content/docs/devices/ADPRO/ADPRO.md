---
title: "ADPRO"
sidebar_label: "ADPRO"
sidebar_position: 1
description: "Configure ADPRO devices to successfully transmit alarms into the GC-X-ONE platform"
tags:
  - ADPRO
  - Honeywell
  - GC-X-ONE
  - Integration
  - security-panel
  - alarm-transmission
  - ift-gateway
---

# ADPRO

**Device Information:**
- **Device**: ADPRO (Device Model)
- **Vendor**: ADPRO (Honeywell)
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Zusammenfassung

- Zweck: ADPRO-Devices so konfigurieren, dass Alarme zuverlässig an die GC-X-ONE-Plattform gesendet werden.
- Ergebnis: Nahtlose Alarmübertragung und stabile Verbindung mit GC-X-ONE für das Security Monitoring.
- Zielgruppe: Installers / Field Engineers / Support.

# Voraussetzungen

- ADPRO XO Client-Software installiert
- Netzwerk-Konnektivität zum ADPRO Virtual Receiver von NXGEN
- Eigene Virtual-Receiver-IP (vom NXGEN CMS Team bereitgestellt)
- Netzwerkkonfiguration (Public Network, VPN oder Whitelisting-Setup)

# Device-Profil

- Typ: Security Control Panel
- Discovery: Custom ADPRO Protocol
- Events: Intrusion, Motion, Analytics (Intrusion Trace, Loiter Trace, Motion Sabotage)
- Ports: Custom Alarm Transmission Ports
- Bekannte Besonderheiten: Jedes Device benötigt eine **eindeutige Server ID**. Primäre und Backup Receiver werden unterstützt. **iFT Gateway**-Subtype benötigt zusätzliche Custom Properties in GC-X-ONE.

**Core Functions**

- Alarm Transmission: Supported (Primary und Secondary)
- Events: Supported (Analytics, Motion, Intrusion)
- ARM / DISARM: Supported (Schedule-basiert)
- Live View: Supported
- User Management: Supported
- Time Sync: NTP Supported

# Schritte

## Step 1 – Network Configuration

- Netzwerkoptionen
  - **Public Network**: Public IP des Receivers und zugehörige Ports nutzen
  - **VPN**: Über Netzwerk-Tunnel mit Private IP adressieren
  - **Whitelisting**: Vom NXG Tech Support dedizierte Receiver-IP anfordern

- Wichtige Hinweise
  - Für ADPRO-Devices gibt es einen dedizierten Virtual Receiver pro Kunde.
  - Das NXGEN CMS Team liefert die IP-Adresse für Ihren ADPRO Virtual Receiver, wenn Ihr GC-X-ONE Tenant eingerichtet wird.
  - GC-X-ONE unterstützt sowohl Primary Receiver als auch Backup Receiver.
  - Wenn Sie vorhandenes RTSP nicht nach außen öffnen wollen, benötigen Sie eine externe RTSP-Adresse sowie den Control Port.

- Erwartetes Ergebnis: Netzwerk-Konnektivität zum NXGEN ADPRO Virtual Receiver hergestellt.

## Step 2 – CMS Alarm Transmission

- UI-Pfad: **ADPRO XO Client -> CMS Alarm Transmission**

![ADPRO CMS Alarm Transmission](./images/ADPRO%201.png)

- Allgemeine Einstellungen konfigurieren
  - Unter „General“ die Server Unit ID eintragen.
  - Jede Einheit benötigt eine **eindeutige Server ID**; derselbe Wert darf nicht doppelt verwendet werden.
  
  ![ADPRO General Settings](./images/ADPRO%202.png)

- Primary Alarm Transmission konfigurieren
  - Im Bereich „Primary Alarm Transmission“ die vom NXG Support bereitgestellte IP-Adresse eintragen.
  - Diese IP entspricht dem Customer Device auf GC-X-ONE.
  
  ![ADPRO Primary Alarm Transmission](./images/ADPRO%203.png)

- Secondary Alarm Transmission konfigurieren (optional)
  - Unter „Secondary Alarm Transmission“ eine zusätzliche Backup-IP hinzufügen.
  - Die vom NXG Support bereitgestellte Secondary IP nutzen.
  - Vorher die IP mit NXG Support validieren, um Konfigurationsfehler zu vermeiden.
  - Diese Secondary IP dient als Backup-Pfad und erhöht die Redundanz.
  
  ![ADPRO Secondary Alarm Transmission](./images/ADPRO%204.png)

- Lifecheck - Site Pulse konfigurieren (empfohlen)
  - Sowohl unter Primary als auch Secondary gibt es einen Bereich für Site Pulse Activity Monitoring.
  - Regelmäßig die Site Activity prüfen.
  - Das Intervall definieren, in dem Pulse an GC-X-ONE gesendet werden.
  - So behalten Sie die Häufigkeit der Status-Updates im Griff und stellen sicher, dass das Device aktiv ist.
  
  ![ADPRO Site Pulse Configuration](./images/ADPRO%205.png)

- Erwartetes Ergebnis: Primary und Secondary Alarm Transmission mit Site-Pulse-Monitoring konfiguriert.

## Step 3 – Parallel Alarm Transmission (optional)

- UI-Pfad: **ADPRO XO Client -> Parallel Alarm Transmission**

- Vorgehen
  - Im Abschnitt „Parallel Alarm“ lässt sich eine zusätzliche IP für die Alarmübertragung hinterlegen.
  - Nützlich für andere Alarmsysteme oder Reporting-Zwecke.
  - Diese Funktion ist optional und für Kunden gedacht.
  - Die gleichen Schritte wie in Step 2 sind hier anwendbar.

![ADPRO Parallel Alarm Transmission](./images/ADPRO%206.png)

- Erwartetes Ergebnis: Zusätzliche Parallel Alarm Transmission konfiguriert (falls benötigt).

## Step 4 – Analytics Configuration

- UI-Pfad: **ADPRO XO Client -> Analytics**

- Verfügbare Analytics-Funktionen
  - **Intrusion Trace**: Bestimmte Bereiche im Sichtfeld zur Überwachung unerlaubten Zutritts definieren.
  - **Loiter Trace**: Erkennung längerer Aufenthalte in gesperrten Bereichen konfigurieren.
  - **Motion Sabotage**: Erkennung bei Kameramanipulation oder -blockade einrichten.

![ADPRO Analytics Configuration](./images/ADPRO%207.png)

- Detection-Parameter konfigurieren
  - Parameter für Motion Alarms festlegen und anpassen.
  - Zonen, Empfindlichkeit und Regeln für unterschiedliche Aktivitäten oder Bedrohungen definieren.
  - Detektionszonen für Eingänge oder Perimeter konfigurieren.
  - Empfindlichkeit so einstellen, dass zwischen kleinen Bewegungen und echten Intrusionen unterschieden wird.
  - Bedingungen wie Größe und Geschwindigkeit bewegter Objekte festlegen, die Alerts auslösen.
  
  ![ADPRO Detection Parameters](./images/ADPRO%208.png)

- Erwartetes Ergebnis: Analytics so eingestellt, dass False Alarms reduziert und die Security-Genauigkeit erhöht werden.

## Step 5 – Arm and Disarm Schedule

- UI-Pfad: **ADPRO XO Client -> Arm/Disarm Schedule**

- Vorgehen
  - System auf Armed oder Disarmed setzen, indem die gewünschten Zeiten gewählt werden.
  - Im rechten Bildschirmbereich das Scheduling konfigurieren.
  - Festlegen, wann das System automatisch bewaffnet oder entwaffnet werden soll.

![ADPRO Arm/Disarm Schedule](./images/ADPRO%209.png)

- Erwartetes Ergebnis: Automatischer Arm-/Disarm-Zeitplan konfiguriert.

## Step 6 – Alarms Profile

- UI-Pfad: **ADPRO XO Client -> Alarms Profile**

- Alarm Profiles konfigurieren
  - Alarm Profiles bestimmen, wie das System auf unterschiedliche Alarm-Events reagiert.
  - Parameter wie Alarmtyp, Auslösekonditionen und Folgeaktionen definieren.
  
  ![ADPRO Alarms Profile](./images/ADPRO%2010.png)

- Profileinstellungen bearbeiten
  - Über „Edit“ folgende Punkte konfigurieren:
  
  ![ADPRO Profile Settings](./images/ADPRO%2011.png)
  - **Profile Type**: Profiltyp wählen (Alarm oder anderer Event-Typ).
  - **Operational State**: Festlegen, ob das Profil im disarmed-, armed- oder beiden Zuständen aktiv ist.
  - **Alarm Behaviour - Armed**: Verhalten im bewaffneten Zustand definieren.
  - **Alarm Behaviour - Disarmed**: Verhalten im unbewaffneten Zustand definieren (Alarme unterdrücken, Transmission, E-Mail-Benachrichtigungen).

- Hinweis: Admins können eigene Profile hinzufügen.

- Erwartetes Ergebnis: Maßgeschneiderte Alarm Profile für unterschiedliche Betriebszustände erstellt.

## Step 7 – Input/Output Behaviour

- UI-Pfad: **ADPRO XO Client -> Input/Output Behaviour**

- Event-Responses konfigurieren
  - Der Config-Screen ermöglicht die Verwaltung der Systemreaktionen auf Events.
  - Linkes Panel: Navigation Tree.
  - Mittleres Panel: Events wie „SYSTEM STARTUP“ und „SYSTEM ARMED“.
  - Rechtes Panel: Detaillierte Einstellungen pro Event.
  
  ![ADPRO Input/Output Behaviour](./images/ADPRO%2012.png)

- Camera Assignment konfigurieren
  - Event der entsprechenden Kamera für E-Mail- oder Alarmreports zuordnen.
  
  ![ADPRO Camera Assignment](./images/ADPRO%2013.png)

- Camera View Style konfigurieren
  - Nach der Kamerakonfiguration den View Style wählen.
  - **Live View**: Live-Feed im ADPRO XO Client und in GC-X-ONE.
  - **Quad View** oder **Duress**: Standbilder auf beiden Plattformen erhalten.
  
  ![ADPRO Camera View Style](./images/ADPRO%2014.png)

- Erwartetes Ergebnis: Automatisierte Security-Aktionen mit korrekten Kamera-Zuordnungen und View Styles konfiguriert.

## Step 8 – Time Zone Configuration

- UI-Pfad: **ADPRO XO Client -> General -> Date/Time**

- Vorgehen
  - Zeitzone auf die Kundenzone setzen.
  - Empfehlung: NTP-Server synchronisieren, dann ist keine manuelle Konfiguration nötig.
  - Das Device liest die Server-Zeit.

![ADPRO Time Zone Configuration](./images/ADPRO%2015.png)

- Erwartetes Ergebnis: Zeitzone mit NTP-Sync konfiguriert.

## Step 9 – NXG Users konfigurieren

- UI-Pfad: **ADPRO XO Client -> Users**

- Vorgehen
  - Im Bereich „Users“ NXG User anlegen und deren Rechte definieren.
  - Empfehlung: Administrative Rechte vergeben; falls nicht möglich, reichen User-Rechte aus.

![ADPRO Users Configuration](./images/ADPRO%2016.png)

- Erwartetes Ergebnis: NXG User mit passenden Rechten konfiguriert.

## Step 10 – iFT Gateway konfigurieren (falls zutreffend)

- UI-Pfad: **GC-X-ONE -> Device -> Edit -> Additional Settings -> Custom Property**

- Vorgehen (für ADPRO Device Sub-Type [iFT] Gateway)
  - In GC-X-ONE mit den eigenen Credentials einloggen.
  
  ![GC-X-ONE Login](./images/ADPRO%2017.png)
  - Zum Device navigieren und „Edit“ wählen.
  - Zu „Additional Settings“ gehen, dann „Custom property“ und folgende Parameter ergänzen:
    - **Parameter type**: String
    - **Parameter name**: eventClipRecord
    - **Parameter value**: True
    - **Parameter type**: String
    - **Parameter name**: eventClipRecordAlarmCode
    - **Parameter Value**: motion.perimeter
  
  ![GC-X-ONE Custom Properties](./images/ADPRO%2018.png)

- Erwartetes Ergebnis: iFT Gateway mit Custom Properties für Event Clip Recording konfiguriert.

## Step 11 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Customer -> Site -> Devices -> Add Device**
- Vorgehen
  - **ADPRO** auswählen.
  - Felder ausfüllen: **Host/Serial, Username, Password, Ports, Time Zone**.
  - **Discover** klicken. Gefundene Sensoren und I/O prüfen.
  - **Save** klicken.
- Erwartetes Ergebnis: GC-X-ONE listet Sensoren unter dem ADPRO-Device auf.
  
  ![Adding Device Step 1](./images/ADPRO%2017.png)
  
  ![Adding Device Step 2](./images/ADPRO%2018.png)
  
  ![ADPRO Device Added](./images/ADPRO%2019.png)


## Step 12 – Integration verifizieren

- Checks
  - Alarmübertragung (Primary und Secondary) prüfen.
  - Site Pulse/Lifecheck testen.
  - Sicherstellen, dass Analytics passende Events erzeugen.
  - Arm/Disarm-Schedules testen.
  - Userzugriff und Berechtigungen verifizieren.
  - Zeitsynchronisation prüfen.

- Erwartetes Ergebnis: Vollständig funktionierende ADPRO-Integration mit der GC-X-ONE-Plattform.

# Troubleshooting

- Probleme bei Alarm Transmission
  - Eindeutige Server ID konfiguriert?
  - IP-Adressen vom NXG Support-Team prüfen.
  - Netzwerkverbindung zum Virtual Receiver bestätigen.
  - Sowohl Primary als auch Secondary Transmission testen.

- Analytics-False-Alarms
  - Empfindlichkeitswerte anpassen.
  - Größen- und Geschwindigkeitsgrenzen für bewegte Objekte verfeinern.
  - Grenzen der Detection Zones überarbeiten.

- Scheduling-Probleme
  - Passt die Zeitzone zum Kundenstandort?
  - NTP-Synchronisation überprüfen.
  - Arm-/Disarm-Schedule-Einstellungen prüfen.

- User-Access-Probleme
  - Hat der NXG User passende Rechte (Administrativ bevorzugt)?
  - Credentials und Berechtigungen prüfen.

# Notes

- Jede Einheit benötigt eine eindeutige Server ID – kein Wert darf doppelt genutzt werden.
- Das NXGEN CMS Team stellt pro Kunde eine dedizierte Virtual-Receiver-IP bereit.
- Secondary Alarm Transmission ist optional, wird aber für Redundanz empfohlen.
- Site Pulse Monitoring wird für die Statusprüfung der Devices empfohlen.
- iFT Gateway-Subtype benötigt zusätzliche Custom Properties in GC-X-ONE.
- Administrative Rechte sind für NXG User empfohlen.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from GCXONE)

<!-- Video: ADPRO Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
