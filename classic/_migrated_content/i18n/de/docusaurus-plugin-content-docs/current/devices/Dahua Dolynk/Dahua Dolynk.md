---
title: "Dahua Dolynk"
sidebar_label: "Dahua Dolynk"
sidebar_position: 7
description: "Configure Dahua Dolynk devices to integrate with GC-X-ONE platform through Dolynk Care cloud service."
tags:
  - Dahua
  - Dolynk
  - Cloud Service
  - ARC
  - GC-X-ONE
---

# Dahua Dolynk

**Device Information:**
- **Device**: Dahua Dolynk Device Model
- **Vendor**: Dahua
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Zusammenfassung

- Zweck: Dahua Dolynk-Devices über den Dolynk Care Cloud Service in GC-X-ONE integrieren.
- Ergebnis: Cloud-basierte Device-Integration mit ARC-Funktionalität (Alarm Receiving Center) über GC-X-ONE.
- Zielgruppe: Field Engineer / Support / Installers.

# Voraussetzungen

Vor der Konfiguration in GC-X-ONE müssen folgende Daten vom Installer gesammelt und an das NXGEN-Team übergeben werden, um einen reibungslosen Ablauf sicherzustellen:

1. Serial Number des Devices
2. Device Password, User Name
3. Ports

# Device-Profil

- Typ: Cloud-based Security Device
- Discovery: Dolynk Cloud Service
- Events: Sensorbasierte Alarme und Benachrichtigungen
- Ports: Durch Cloud Service verwaltet
- Bekannte Besonderheiten: Dolynk Care Account muss vor der GC-X-ONE-Integration eingerichtet sein. Device muss online sein, damit Discovery funktioniert.

**Core Functions**

- Cloud Integration: Supported
- Events: Supported
- ARC Functionality: Supported

# Schritte

## Step 1 – In Dolynk Care Account einloggen

- Vorgehen
  - Über die URL https://care.dolynkcloud.com/ in den Dolynk Care Account einloggen.

- Erwartetes Ergebnis: Erfolgreich im Dolynk Care Portal angemeldet.

## Step 2 – Site hinzufügen

- UI-Pfad: **Site -> Add**

- Vorgehen
  - Zu **Site** gehen und **Add** klicken.
  
  ![Dolynk Site Addition](./images/Dolynk%201.png)

- Erwartetes Ergebnis: Seite zur Site-Erstellung geöffnet.

## Step 3 – Site-Details ausfüllen

- Vorgehen
  - Site-Details wie Timezone und Name eintragen.

- Erwartetes Ergebnis: Site in Dolynk Care angelegt.

## Step 4 – Device zur Site hinzufügen

- UI-Pfad: **Site -> Add Device -> Serial Number (SN)**

- Vorgehen
  - Die angelegte **Site** auswählen und **Add Device** über **Serial Number (SN)** klicken.
  - Device-Details ausfüllen.
  
  ![Dolynk Device Addition](./images/Dolynk%202.png)

- Wichtiger Hinweis
  - Bitte sicherstellen, dass das Device online ist.

- Erwartetes Ergebnis: Device der Site hinzugefügt.

## Step 5 – ARC (Alarm Receiving Center) einrichten und Device mit NXGEN teilen

- UI-Pfad: **Security Service**

- Vorgehen
  - Nachdem das Device zum Dolynk Care Account hinzugefügt wurde, GC-X-ONE als ARC einrichten, indem die Option **Security Service** gewählt wird.
  
  ![Dolynk Security Service](./images/Dolynk%203.png)

- Vorgehen
  - Im folgenden Menü die Devices/Sensoren auswählen, die mit GC-X-ONE geteilt werden sollen, dann **Next** klicken.
  - Im Feld **Company Name/email** unsere E-Mail zur Suche nutzen: dev@nxgen.info
  - Anschließend erscheint NXGEN Technology AG; auf das Schild-Icon daneben klicken.
  
  ![Dolynk ARC Selection](./images/Dolynk%204.png)

- Erwartetes Ergebnis: NXGEN Technology AG als ARC ausgewählt.

## Step 7 – Anwenden und Konfiguration speichern

- Vorgehen
  - **Apply** klicken, um zu speichern und das ARC zu benachrichtigen.

- Erwartetes Ergebnis: ARC-Konfiguration gespeichert und NXGEN benachrichtigt.

## Step 8 – Device in GC-X-ONE konfigurieren

- UI-Pfad: **GC-X-ONE -> Site -> Configuration App -> Devices**

- Vorgehen
  - In der GC-X-ONE Configuration App die Site öffnen, zu der das Device hinzugefügt werden soll.
  - **Dahua Cloud** als Device wählen und **Serial Number**, **UserName** und **Password** des Devices eintragen.
![Dolynk GC-X-ONE Configuration](./images/Dolynk%205.png)

- Vorgehen
  - Nach dem Ausfüllen auf **Discover** klicken; die Sensoren sollten erkannt werden.

- Erwartetes Ergebnis: Sensoren erfolgreich in GC-X-ONE entdeckt.

# Troubleshooting

- Discovery-Probleme
  - Prüfen, ob das Device in Dolynk Care online ist.
  - Serial Number, Username und Password auf Richtigkeit kontrollieren.
  - Sicherstellen, dass das Device korrekt mit NXGEN geteilt wurde.

# Notes

- Device muss online sein, damit die Konfiguration gelingt.
- Device darf nicht an einen anderen Account gebunden sein.
- Für die Firmensuche in Dolynk Care dev@nxgen.info verwenden.
- Diese Schritte erleichtern die Integration des Dahua Dolynk-Devices in GC-X-ONE.
- Bei Problemen bitte ein Ticket im NXGEN Help-Desk-Portal eröffnen, damit das NXGEN Support-Team schnell helfen kann.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
