---
title: "Senstar"
sidebar_label: "Senstar"
sidebar_position: 12
description: "Configure Senstar to stream and send events to GC-X-ONE."
tags:
  - Senstar
  - Perimeter Security
  - Symphony Server
  - RTSP
  - GC-X-ONE
---

# Senstar

**Device Information:**
- **Device**: Senstar Device Model
- **Vendor**: Senstar
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Senstar für Streaming und Event-Weiterleitung an GC-X-ONE konfigurieren.
- Ergebnis: Live View und Events erscheinen in GC-X-ONE (Video Activity).
- Zielgruppe: Field Engineer / Support / Admin Users für Troubleshooting und Konfiguration.

# Voraussetzungen

- Administratorrechte auf dem System
- System erfüllt Hardware- und OS-Anforderungen für den Senstar Installer
- Netzwerkzugriff auf das Ziel-Senstar-Device ist vorhanden

# Device-Profil

- Typ: Perimeter Security Device
- Discovery: HTTP/HTTPS
- Events: Motion-/Intrusion-Events (gemäß Senstar-Regeln)
- Ports: HTTP/HTTPS (Default 5000), RTSP
- Bekannte Besonderheiten: Für RTSP Streaming wird ein **encodetes Passwort** benötigt. **Event Polling** muss aktiviert sein. Regeln müssen im Symphony Server für Alarme konfiguriert werden.

**Core Functions**

- Live: Supported
- Events: Supported (Rules-Konfiguration erforderlich)
- Streaming: RTSP mit encoded Password

# Schritte

## Step 1 – Senstar Software installieren

- Installer herunterladen
  - Senstar Installer (Server) von der offiziellen Website laden.

- Installer ausführen
  - Heruntergeladene .exe doppelklicken.
  - Mit Default-Optionen fortfahren, sofern IT nichts anderes vorgibt.
  - Installation abschließen und Anwendung starten.

- Installationshinweis
  - Während der Installation erscheint ein Pop-up. Checkbox deaktivieren und mit „Next“ fortfahren.
  - ![Senstar Installation](./images/senstar%201.png)

- Nach der Installation
  - Nach erfolgreicher Installation ist der Client auf dem Desktop (oder Pfad) sichtbar.
  - ![Senstar Client Icon](./images/senstar%202.png)
  - Beim Öffnen werden IP-Adresse, Username, Password abgefragt; danach ist der Livestream sichtbar.
  - ![Senstar Client Login](./images/senstar%203.png)

- Erwartetes Ergebnis: Senstar Client installiert und erreichbar.

## Step 2 – Streaming und Events im Senstar Client prüfen

- UI-Pfad: **Senstar Client**

- Anwendung starten
  - Installierten **Senstar Client** vom Desktop oder Startmenü öffnen.

- Device verbinden
  - **IP Address**, **Username** und **Password** der Senstar-Einheit eingeben.
  - **Connect** klicken.

- Livestream prüfen
  - Zum Tab **Live View** wechseln.
  - Bestätigen, dass der Live-Feed funktioniert.

- Events prüfen
  - Bereich **Events** oder **Logs** öffnen.
  - Prüfen, ob Motion- oder Intrusion-Events protokolliert werden.

- ![Senstar Live View](./images/senstar%204.png)

- Erwartetes Ergebnis: Device online und funktionsfähig.

## Step 3 – Senstar-Parameter in GC-X-ONE hinterlegen

- Überblick:
- ![Senstar Overview](./images/senstar%205.png)

- UI-Pfad: **GC-X-ONE -> Configuration App -> Service Provider -> Overview -> Edit -> Additional Settings -> Custom Property**

- Vorgehen
  - In GC-X-ONE einloggen.
  - Zur Configuration App navigieren.
  - Auf Service-Provider-Ebene im Tab Overview **Edit** klicken.
  - ![Service Provider Edit](./images/senstar%206.png)
  - Zum Tab **Additional Settings -> Custom property** wechseln.
  - Nach unten scrollen und **Add +** klicken.
  - ![Custom Property Add](./images/senstar%207.png)
  - Parameter eintragen:
    - **Parameter Type**: string
    - **Parameter Name**: SenStar_Device_Custom_baseUrl
    - **Parameter Value**: https://universalproxy.nxgen.cloud/
  - ![Custom Property Value](./images/senstar%208.png)

- Erwartetes Ergebnis: Custom Property erfolgreich hinzugefügt.

## Step 4 – Senstar Device unter der gewünschten Site hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration -> Site -> Devices -> Add New Device**

- Vorgehen
  - Im Bereich **Configuration** die Ziel-Site auswählen, unter der das Senstar-Device registriert werden soll.
  - ![Select Site](./images/senstar%209.png)
  - Zu **Devices -> Add New Device** navigieren.
  - ![Add New Device](./images/senstar%2010.png)
  - Folgende Angaben ausfüllen:
    - **Device Name**: z. B. „Senstar Camera - Gate A“
    - **Device Type**: SenStar
    - **IP Address/Host**: xxx.xxx.xxx.xxx
    - **Http/s Port**: Standard oder angepasst (z. B. 5000)
    - **Enable HTTPS**: Aktivieren, wenn das Device HTTPS unterstützt, sonst deaktiviert lassen
    - **Username**: xxx
    - **Password**: xxx
    - **RTSP Port**: Für Streaming
    - **Enable event polling**: Checkbox aktivieren, damit Events im 10-Sekunden-Intervall abgeholt werden

- Hinweis: Standardports siehe unten.
- ![Default Ports](./images/senstar%2011.png)

- **Streaming Key**: Hier das geschützte RTSP-Passwort eintragen.

## Step 5 – Streaming-Passwort erzeugen

- Für den RTSP-Livestream wird ein encodetes Passwort benötigt.

- Vorgehen zum Encoden:
  - Passwort mit **PasswordEncoder.exe** encoden.
  - Hinweis: Der Encoder kann nicht separat geladen werden. Der Senstar Server (exe) muss laut Voraussetzungen installiert sein. Danach ist der Encoder unter folgendem Pfad verfügbar:
  - **PATH:** `C:\Program Files\Senstar\Symphony server V7\_Tools\PasswordEncoder`
  - ![Password Encoder](./images/senstar%2012.png)
  - **PasswordEncoder.exe** starten.
  - Device-Passwort eingeben.
  - Encoded Password kopieren und in der Device Configuration einfügen.
  - ![Encoded Password](./images/senstar%2013.png)

- Info: Der folgende Hinweis wird für VLC benötigt (nicht für GC-X-ONE).
  - ![VLC Note](./images/senstar%2014.png)

- Events aktivieren: Event Polling aktivieren.
  - ![Event Polling](./images/senstar%2015.png)

- **Save & Verify** klicken, um Erreichbarkeit und Datenempfang (Stream/Events) zu bestätigen.

- Hinweis: RTSP-URL sollte im VLC Media Player funktionieren.

- **Live Stream:**
  - ![Live Stream](./images/senstar%2016.png)

- **Events in Video Activity Search und Device Dashboard:**
  - ![Events](./images/senstar%2017.png)

- Erwartetes Ergebnis: Device erfolgreich hinzugefügt mit Live Stream und Events.

## Step 6 – Senstar für Alarme konfigurieren

- Hintergrund
  - Der Senstar Symphony Server generiert Alarme über Rules (Events, Action Sets, Schedules).
  - Rules werden in der Symphony Server Config erstellt; Events lösen eine Rule aus, Actions definieren die Reaktion, Schedule steuert die aktive Zeit.
  - Details siehe Senstar Webhelp: [Create Rule](https://xnet.senstar.com/webhelp/Symphony/8.0/en/topic_task/air_server_rules_rule_create_8.html?hl=add%2Crule)

- Steps zum Hinzufügen einer Rule im Senstar Client:
  - **Hinweis**: Konfiguration sollte durch Admin erfolgen.
  - **Step 1**: Symphony Client auf dem Rechner öffnen.
  - ![Symphony Client](./images/senstar%2018.png)
  - **Step 2**: Login zum Device im Symphony Client.
  - **Step 3**: **Server configuration** auswählen.
  - ![Server Configuration](./images/senstar%2019.png)
  - **Step 4**: Weiterleitung zum Senstar Portal.
  - **Step 5**: Mit Username und Password einloggen.
  - ![Portal Login](./images/senstar%2020.png)
  - **Step 6**: Konfigurationsübersicht wird angezeigt.
  - ![Configuration Overview](./images/senstar%2021.png)

- Hinweis: Rules müssen aktiviert sein, damit Alarme erzeugt werden.

  - **Step 7**: Tab **Rules** öffnen.
  - **Step 8**: Auf **Add** klicken.
  - ![Add Rule](./images/senstar%2022.png)
  - **Step 9**: Pflichtfelder für die Rule ausfüllen.
  - ![Rule Details](./images/senstar%2023.png)
  - **Step 10**: **Save** klicken.
  - **Step 11**: Neue Rule erscheint im Rules-Tab.
  - ![Rule List](./images/senstar%2024.png)
  - **Step 12**: Events fließen nun gemäß der Rule im Client.
  - ![Event Flow](./images/senstar%2025.png)
  - **Step 13**: Events aus dem Client werden in GC-X-ONE empfangen.
  - ![Events in GC-X-ONE](./images/senstar%2026.png)

- Erwartetes Ergebnis: Rules konfiguriert und Events fließen nach GC-X-ONE.

## Step 7 – Verifizieren

- Checks
  - Livestream erscheint in GC-X-ONE.
  - Events erscheinen in Video Activity Search und Device Dashboard.
  - RTSP-URL funktioniert im VLC Media Player.

- Erwartetes Ergebnis: Vollständige Integration mit Live Stream und Events.

# Troubleshooting Tools

- **Senstar SDK Mobile**: Mobile Bridge App zum Abruf der Sensorlisten.

# Notes

- Der Encoder ist nicht separat downloadbar; Installation des Senstar Servers ist erforderlich.
- Rules müssen aktiviert sein, sonst werden keine Alarme erzeugt.
- RTSP-URL sollte im VLC Media Player funktionieren.
- VLC-Hinweis dient nur zur Live-Wiedergabe in VLC, nicht in GC-X-ONE.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from GCXONE)
