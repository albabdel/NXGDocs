---
title: "Ajax"
sidebar_label: "Ajax"
sidebar_position: 2
description: "Integrate Ajax security devices with GC-X-ONE platform for alarm monitoring and effective false alarm filtration."
tags:
  - Ajax
  - Security Hub
  - NVR
  - GC-X-ONE
  - Integration
---

# Ajax

**Device Information:**
- **Device**: Ajax Hub/NVR Model
- **Vendor**: Ajax
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0


# Zusammenfassung

- Zweck: Ajax-Sicherheitsgeräte mit der GC-X-ONE-Plattform integrieren, um Alarme zu überwachen und False Alarms zu filtern.
- Ergebnis: Live-Ajax-Events in GC-X-ONE mit integriertem Reporting und False-Alarm-Filter.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Ajax PRO Desktop-Applikation installiert
- Gültiger Ajax Hub oder NVR mit Devices/Kameras
- Zugriff auf die GC-X-ONE-Plattform
- E-Mail-Einladungsfunktion für das Ajax-System

# Device-Profil

- Typ: Security Hub/NVR
- Discovery: SIA-DC09 Protocol
- Events: Security Events, Device Alarms, Monitoring Alerts
- Ports: Custom Receiver IP/Port (von GC-X-ONE bereitgestellt)
- Bekannte Besonderheiten: Benötigt **Invitation Process** über Ajax PRO Desktop. **Account-Number-Mapping** für jedes überwachte Device erforderlich.

**Core Functions**

- Hub Discovery: Supported
- NVR Discovery: Supported
- Events: Supported (SIA-DC09 Protocol)
- Device Monitoring: Supported
- Encrypted Communication: Supported
- Account Mapping: Required

# Schritte

## Step 1 – NXGEN Technologies zu Ihrem Hub einladen

- UI-Pfad: **AJAX PRO Desktop -> Space Setting -> Security Companies -> Invite via Email**

- Vorgehen
  - **AJAX PRO Desktop** öffnen.
  - Zu Space Setting -> Security Companies -> Invite via Email navigieren.
  - Folgende E-Mail-Adresse für die Einladung eintragen: ajax@nxgen.io
  - Einladung senden und sicherstellen, dass sie von NXGEN Technologies akzeptiert wird.

![Ajax PRO Desktop Space Settings](./images/Ajax%201.png)

![Ajax Email Invitation](./images/Ajax%202.png)

- Erwartetes Ergebnis: NXGEN Technologies erfolgreich eingeladen und im Ajax Hub akzeptiert.

## Step 2 – Ajax Device in der GC-X-ONE-Plattform hinzufügen

- UI-Pfad: **GC-X-ONE -> Devices -> Add Device**

- Vorgehen
  - Mit den eigenen Credentials bei GC-X-ONE anmelden.
  - Zu **Devices** gehen und **Add Device** wählen.
  - Im Konfigurationsformular:
    - **Type**: Ajax Hub oder Ajax NVR auswählen.
    - **Hub ID / Device ID**:
      - Bei Ajax Hub die Hub ID eintragen.
      - Bei Ajax NVR die Device ID eintragen.
    - **Timezone**: Zeitzone des Standorts auswählen.

- Discovery-Prozess
  - **Discover** klicken.
  - Die Plattform verbindet sich und verifiziert Hub/NVR.
  - Bei Erfolg:
    - Hub: Alle dem Hub zugeordneten Devices werden automatisch geladen und in einer Liste angezeigt.
    - NVR: Alle dem NVR zugeordneten Kameras werden automatisch geladen und in einer Liste angezeigt.

- Validierung & Speichern
  - Gefundene Devices oder Kameras prüfen.
  - Details bestätigen.
  - Auf **Save** klicken, um sie dem Account hinzuzufügen.

![Ajax Device Configuration](./images/Ajax%203.png)

![Ajax Hub Selection](./images/Ajax%204.png)

![Ajax Device Discovery](./images/Ajax%205.png)

![Ajax Device List](./images/Ajax%206.png)

- Erwartetes Ergebnis: Ajax-Device erfolgreich in GC-X-ONE hinzugefügt, alle zugehörigen Devices/Kameras entdeckt.

## Step 3 – SIA-DC09 Receiver Details in GC-X-ONE finden

- UI-Pfad: **GC-X-ONE -> Devices -> View Device**

- Vorgehen
  - Nach dem Hinzufügen des Devices:
    - Das neu registrierte AJAX-Device in der Device-Liste suchen.
    - Auf **View** neben dem Device klicken.
    - In der Geräteübersicht stehen die SIA-DC09 Receiver-Informationen:
      - **Account number**
      - **Encryption key**
      - **Receiver IP/Port**

![Ajax SIA-DC09 Receiver Details](./images/Ajax%207.png)

- Erwartetes Ergebnis: SIA-DC09 Receiver-Details aus der GC-X-ONE-Geräteübersicht erhalten.

## Step 4 – Receiver in AJAX PRO Desktop konfigurieren

- UI-Pfad: **AJAX PRO Desktop -> Company -> CMS connection -> Add Receiver**

- Vorgehen
  - **AJAX PRO Desktop** öffnen.
  - Zu Company -> CMS connection -> Add Receiver navigieren.
  - Receiver-Details aus der GC-X-ONE-Geräteübersicht eintragen:
    - **Receiver IP/Hostname**, **Port** und **Encryption Key** verwenden.
  - Falls verschlüsselte Kommunikation genutzt wird, **Encryption aktivieren** und den **exakten Encryption Key** aus GC-X-ONE übernehmen.
  - Checkbox „Transfer device or group name to CMS events“ aktivieren.
  - Receiver-Konfiguration **speichern**.

![Ajax Receiver Configuration](./images/Ajax%208.png)

![Ajax Encryption Settings](./images/Ajax%209.png)

- Erwartetes Ergebnis: Receiver in Ajax PRO Desktop mit GC-X-ONE-Verbindungsdaten eingerichtet.

## Step 5 – Receiver aktivieren & Account Numbers zuordnen

- UI-Pfad: **AJAX PRO Desktop -> Objects -> Object -> Maintenance -> Monitoring via [Receiver Name]**

- Vorgehen
  - Im Bereich **Objects** in AJAX PRO Desktop das gewünschte **Object** wählen.
  - Tab **Maintenance** öffnen.
  - Option **Monitoring via [Receiver Name]** finden (Name wie in Step 4 vergeben).
  - Im rechten Panel werden alle Hub- und NVR-Geräte des Objects gelistet.
  - Das zu überwachende Device auswählen, die Account Number laut GC-X-ONE-Geräteübersicht eintragen und speichern.

![Ajax Account Mapping](./images/Ajax%2010.png)

- Erwartetes Ergebnis: Account Numbers für überwachte Devices gemappt und Receiver aktiviert.

## Step 6 – Integration verifizieren

- Checks
  - Sicherstellen, dass der Receiver-Status in AJAX PRO Desktop aktiv ist.
  - Ein Test-Event auf dem AJAX-Device auslösen und prüfen, ob Alerts in GC-X-ONE erscheinen.

![Ajax Integration Verification](./images/Ajax%2011.png)

- Erwartetes Ergebnis: Live-AJAX-Events in GC-X-ONE mit integriertem Reporting und False-Alarm-Filter.

# Troubleshooting

- Einladung nicht akzeptiert
  - E-Mail-Adresse ajax@nxgen.io prüfen.
  - Kontrolle, ob die Einladung erfolgreich versendet wurde.
  - NXGEN Support kontaktieren, falls die Einladung offen bleibt.

- Device Discovery schlägt fehl
  - Hub ID oder Device ID korrekt eingegeben?
  - Netzwerk-Konnektivität zwischen Ajax-System und GC-X-ONE prüfen.
  - Zeitzonenauswahl verifizieren.

- Keine Events in GC-X-ONE
  - Receiver-Status in Ajax PRO Desktop aktiv?
  - Stimmt das Account Number Mapping mit der GC-X-ONE-Geräteübersicht überein?
  - Encryption Key exakt übernommen, falls Verschlüsselung aktiv ist?
  - Checkbox „Transfer device or group name to CMS events“ aktiviert?

- Receiver-Verbindungsprobleme
  - Receiver IP/Hostname und Port aus GC-X-ONE nochmals prüfen.
  - Passen die Encryption Settings zwischen Ajax PRO Desktop und GC-X-ONE?
  - Netzwerk-Konnektivität zum Receiver-Endpunkt testen.

# Notes

- E-Mail-Einladung an ajax@nxgen.io ist für das Initial-Setup erforderlich.
- Account Number Mapping ist entscheidend für korrektes Event-Routing.
- Encryption Key muss exakt übernommen werden, wenn verschlüsselt wird.
- Checkbox „Transfer device or group name to CMS events“ muss aktiv sein.
- Testevents auslösen, um die vollständige Integration zu verifizieren.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (migrated from GCXONE)
