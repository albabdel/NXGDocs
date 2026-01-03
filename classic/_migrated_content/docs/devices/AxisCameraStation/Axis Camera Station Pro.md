---
title: "Axis Camera Station Pro"
sidebar_label: "Axis Camera Station Pro"
sidebar_position: 4
description: "Configure Axis Camera Station Pro to integrate seamlessly with GC-X-ONE platform for comprehensive video management and security monitoring."
tags:
  - Axis
  - Camera Station Pro
  - VMS
  - Video Management
  - GC-X-ONE
---

# Axis Camera Station Pro

**Device Information:**
- **Device**: Axis Camera Station Pro Device Model
- **Vendor**: Axis
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Axis Camera Station Pro so konfigurieren, dass sie sich nahtlos mit der GC-X-ONE-Plattform für umfassendes Video Management und Security Monitoring verbindet.
- Ergebnis: Erweiterte Funktionen für Livestreaming, Aufzeichnung, Playback und Event-Management durch die GC-X-ONE-Integration.
- Zielgruppe: Field Engineer / Support / Admin Users für Troubleshooting und Konfiguration.

# Voraussetzungen

- Administratorrechte auf dem System
- System erfüllt Mindest-Hardware- und OS-Anforderungen für den Axis Camera Station Pro Installer
- Netzwerkzugriff auf das Ziel-Device Axis Camera Station Pro ist verfügbar

# Device-Profil

- Typ: Video Management System (VMS)
- Discovery: HTTP/HTTPS
- Events: Motion Detection, Device Events, Rule-based Alarms
- Ports: HTTP Port 29204 (bei Pro-Version nicht änderbar)
- Bekannte Besonderheiten: **Axis Camera Station Pro nutzt immer Port 29204** (nicht änderbar). **Event Callback** für Events implementiert – der notwendige Webhook muss auf Device-Ebene erstellt werden. **Anderes Client-Executable** als bei der Standard Axis Camera Station.

**Core Functions**

- Live: Supported
- Playback: Supported (Recording muss auf Device-Ebene aktiviert sein)
- Events: Supported (Webhook-Konfiguration erforderlich)
- Recording: Supported
- Device Management: Supported
- Rule-based Alarms: Supported

# Schritte

## Step 1 – Axis Camera Station Pro Software installieren

- Installer herunterladen
  - Axis Camera Station Pro Installer von der offiziellen Website laden: [AXIS Camera Station Pro - Update for server and client](https://www.axis.com/ftp/pub_soft/cam_srv/cam_station_pro/latest/AXISCameraStationProSetup.msi)

- Installer ausführen
  - Heruntergeladene .msi-Datei doppelklicken.
  - Mit Default-Optionen fortfahren, sofern IT-Richtlinien nichts anderes verlangen.
  - Installation abschließen und Anwendung starten.

- Hinweis zur Installation
  - Nach der Installation erscheint das Pop-up „Welcome to Axis Camera Station Pro“.
  - ![Welcome Screen](./images/AXIS%201.png)
  - ![Setup Wizard](./images/AXIS%202.png)
  - ![Installation Steps](./images/AXIS%203.png)

- Nach der Installation
  - Nach erfolgreicher Installation ist der Client auf dem Desktop (oder angegebenem Pfad) sichtbar.
  - ![Client Icon](./images/AXIS%204.png)
  - Beim Öffnen fordert der Client IP-Adresse, Username, Password an und zeigt anschließend den Livestream.
  - ![Client Login](./images/AXIS%205.png)

- Erwartetes Ergebnis: Axis Camera Station Pro Client installiert und erreichbar.

## Step 2 – Device Discovery und Verbindung

- UI-Pfad: **Axis Camera Station Pro Client -> Manual Search**

- Manuelle Gerätesuche
  - Auf „Manual Search“ klicken, um das Popup zu öffnen.
  - IP-Adresse des Ziel-Devices eintragen.
  - ![Manual Search](./images/AXIS%206.png)
  - ![Search Result](./images/AXIS%207.png)
  - ![Search Confirmation](./images/AXIS%208.png)

- Device-Authentifizierung
  - Username und Password für das Device eintragen.
  - Auf **Connect** klicken, um die Verbindung herzustellen.
  - Prüfen, ob die Credentials akzeptiert werden.

- Erwartetes Ergebnis: Device erfolgreich gefunden und verbunden.

## Step 3 – Kamerageräte hinzufügen

- UI-Pfad: **Axis Camera Station Pro Client -> Devices -> Add**

- Kameras hinzufügen
  - Im Bereich „Devices“ **Add** auswählen.
  - ![Add Device](./images/AXIS%209.png)
  - Mit **Next** den Hinzufügeprozess starten.
  - ![Device Addition](./images/AXIS%2010.png)
  - **Install the devices** anklicken, um den Vorgang abzuschließen.
  - ![Install Devices](./images/AXIS%2011.png)

- Kamerainstallation prüfen
  - Nach der Installation erscheinen Kamera-Snapshots.
  - ![Camera Snapshot](./images/AXIS%2012.png)
  - Kamera wurde erfolgreich hinzugefügt.

- Erwartetes Ergebnis: Kamerageräte hinzugefügt und im System sichtbar.

## Step 4 – Live View konfigurieren

- UI-Pfad: **Axis Camera Station Pro Client -> Live View**

- Live View einrichten
  - Auf den „+“-Button klicken und **Live View** wählen.
  - ![Live View Selection](./images/AXIS%2013.png)
  - Live View Interface öffnen.
  - ![Live View Interface](./images/AXIS%2014.png)

- Erwartetes Ergebnis: Live-Video-Feed zugänglich und funktionsfähig.

## Step 5 – Recording aktivieren

- UI-Pfad: **Axis Camera Station Pro Client -> Recording and Events -> Recording Methods**

- Recording konfigurieren
  - Damit Playback funktioniert, Recording auf Device-Ebene aktivieren.
  - Auf **Recording and Events** gehen und **Recording Methods** öffnen.
  - ![Recording Methods](./images/AXIS%2015.png)
  - „+“-Button klicken und **Recording View** wählen.
  - ![Recording View](./images/AXIS%2016.png)

- Erwartetes Ergebnis: Recording aktiviert, Playback möglich.

## Step 6 – Streaming und Events verifizieren

- Anwendung starten
  - Installierten Axis Camera Station Pro Client vom Desktop oder Startmenü öffnen.

- Device verbinden
  - IP-Adresse, Username und Password der Axis Camera Station Pro Einheit eintragen.
  - **Connect** klicken.

- Livestream prüfen
  - Zum Tab **Live View** navigieren.
  - Sicherstellen, dass der Live-Feed wie erwartet funktioniert.

- Events prüfen
  - Bereich **Events** oder **Logs** öffnen.
  - Kontrollieren, ob Motion- oder Intrusion-Events in Echtzeit geloggt werden.

- Erwartetes Ergebnis: Device ist online und liefert Live Stream sowie Events.

## Step 7 – Axis Camera Station Pro Parameter in GC-X-ONE hinterlegen

- UI-Pfad: **GC-X-ONE -> Configuration App -> Service Provider -> Overview -> Edit -> Additional Settings -> Custom Property**

- Custom Property konfigurieren
  - In GC-X-ONE einloggen.
  - Zur Configuration App navigieren.
  - Auf Service Provider-Ebene im Tab Overview den **Edit**-Button klicken.
  - Zum Tab **Additional Settings** wechseln und **Custom property** öffnen.
  - Nach unten scrollen und auf **Add +** klicken.
  - ![Custom Property](./images/AXIS%2019.png)

- Parameterdetails eintragen
  - Parameter Type: string
  - Parameter Name: AxisCameraStation_Device_Custom_baseUrl
  - Parameter Value: https://acsproxy.nxgen.cloud/

- Erwartetes Ergebnis: Custom Property erfolgreich hinzugefügt.

## Step 8 – Axis Camera Station Pro Device unter gewünschter Site hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration -> Site -> Devices -> Add New Device**

- Device hinzufügen
  - In GC-X-ONE zum Configuration-Bereich gehen.
  - Ziel-Site auswählen, unter der das Axis Camera Station Pro-Device registriert werden soll.
![AXIS Device Configuration](./images/AXIS%2031.png)
  - Zu **Devices -> Add New Device** navigieren.
  - ![Add New Device](./images/AXIS%2031.png)

- Device-Details ausfüllen
  - Device Name: z. B. „Axis Camera Station Pro - Gate A“
  - Device Type: Axis Camera Station
  - IP Address/Host: xxx.xxx.xxx.xxx
  - Http/s Port: Standard oder angepasst (z. B. 5000)
  - Username: xxx
  - Password: xxx
  - HTTP Port: für Streaming

- Wichtiger Hinweis
  - Event Callback ist implementiert; ein Webhook muss auf Device-Ebene erstellt werden.

- Save und Verify
  - **Save & Verify** klicken, um Erreichbarkeit und Datenempfang (Stream/Events) zu prüfen.

- Erwartetes Ergebnis: Device erfolgreich in GC-X-ONE hinzugefügt.

## Step 9 – Device Events konfigurieren

- UI-Pfad: **Axis Camera Station Pro Client -> Device Events**

- Device Events einrichten
  - Auf **Device Events** klicken und **OK** bestätigen.
  - ![Device Events](./images/AXIS%2024.png)
  - Popup „Configure device events trigger“ öffnen und **OK** klicken.
  - ![Configure Triggers](./images/AXIS%2025.png)

- Event-Parameter festlegen
  - Events: MotionAlarm
  - State: Yes

- Erwartetes Ergebnis: Device Events für Alarm-Erkennung konfiguriert.

## Step 10 – Webhook für Event-Integration erstellen

- UI-Pfad: **Axis Camera Station Pro Client -> HTTP Notification**

- HTTP Notification einrichten
  - In der Device-Event-Rule eine Action „Send HTTP Notification (Webhook)“ konfigurieren.
  - ![HTTP Notification Action](./images/AXIS%2026.png)
  - Popup öffnen, „Send HTTP Notification“ auswählen und **OK** klicken.
  - ![HTTP Notification Popup](./images/AXIS%2027.png)

- Webhook-Parameter konfigurieren
  - URL: https://acsproxy.nxgen.cloud/
  - Method: POST
  - Content type: application/json

- Request Body konfigurieren
  ```json
  {
    "initialRequest": {
      "payload": {
        "type": "NOTIFICATION",
        "authenticationToken": "5654974ab97f48a1b16a74472864e195",
        "notifications": [
          {
            "event": {
              "type": "ALARM_TRIGGERED",
              "cameraId": "$(TriggerData.SourceId)",
              "timestamp": "$(TriggerData.TimeUtc)"
            }
          }
        ]
      }
    }
  }
  ```

- Webhook-Einrichtung abschließen
  - URL, Method, Content Type und Body eintragen und **OK** klicken.
  - ![Webhook Configuration](./images/AXIS%2028.png)

- Erwartetes Ergebnis: Webhook für Event-Übertragung an GC-X-ONE konfiguriert.

## Step 11 – Event Rules finalisieren

- UI-Pfad: **Axis Camera Station Pro Client -> Edit Rules**

- Rule-Konfiguration abschließen
  - Popup „Edit rules“ öffnen und **Next** klicken.
  - ![Edit Rules](./images/AXIS%2029.png)
  - Erneut „Edit rules“ bestätigen und **Finish** klicken.
  - ![Finish Rules](./images/AXIS%2030.png)

- Erwartetes Ergebnis: Event Rules finalisiert und aktiv.

## Step 12 – Integration verifizieren

- Livestream prüfen
  - Sicherstellen, dass der Live-Feed in GC-X-ONE angezeigt wird.

- Events prüfen
  - Verifizieren, dass Events in Video Activity Search und Device Dashboard erscheinen.

- Erwartetes Ergebnis: Vollständige Axis Camera Station Pro-Integration mit der GC-X-ONE-Plattform.

# Troubleshooting

- Installationsprobleme
  - Administratorrechte vorhanden?
  - Erfüllt das System die Mindestanforderungen (Hardware/OS)?
  - Netzwerk-Konnektivität zum Ziel-Device prüfen.

- Verbindungsprobleme
  - IP-Adresse, Username, Password korrekt?
  - Ist Port 29204 erreichbar (nicht änderbar bei Pro)?
  - Netzwerkverbindung zwischen Client und Device sicherstellen.

- Event-Konfigurationsprobleme
  - Stimmt die Webhook-URL und ist sie erreichbar?
  - Authentication Token im Webhook Payload korrekt?
  - Sind Device Events mit den richtigen Triggern konfiguriert?

- Recording/Playback-Probleme
  - Recording auf Device-Ebene aktiviert?
  - Speicherverfügbarkeit und -konfiguration prüfen.
  - Berechtigungen für Playback-Zugriff sicherstellen.

# Notes

- Axis Camera Station Pro nutzt stets Port 29204 (nicht änderbar).
- Client-Executable unterscheidet sich von der Standard Axis Camera Station.
- Event Callback erfordert Webhook-Konfiguration auf Device-Ebene.
- Recording muss auf Device-Ebene aktiviert sein, damit Playback funktioniert.
- Custom Property muss auf Service-Provider-Ebene in GC-X-ONE hinzugefügt werden.
- Authentication Token im Webhook Payload muss den Systemvorgaben entsprechen.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
