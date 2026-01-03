---
title: "EagleEye"
sidebar_label: "EagleEye"
sidebar_position: 8
description: "Configure EagleEye Bridge to integrate with GC-X-ONE platform for video surveillance and camera management."
tags:
  - EagleEye
  - Bridge
  - Camera Management
  - ESN
  - GC-X-ONE
---

# EagleEye

**Device Information:**
- **Device**: EagleEye Device Model
- **Vendor**: EagleEye
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: EagleEye Bridge so konfigurieren, dass sie sich mit der GC-X-ONE-Plattform für Videoüberwachung und Kamera-Management verbindet.
- Ergebnis: Erweiterte Funktionen dank Bridge-Konnektivität und Kameranetzwerk-Management über GC-X-ONE.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Administrative Rechte für die EagleEye Bridge-Konfiguration
- Netzwerkzugriff auf das Bridge-Device
- Aktive Internetverbindung für Cloud-Integration
- ESN (Equipment Serial Number) der Bridge

# Device-Profil

- Typ: Camera Bridge/Network Video Recorder
- Discovery: ESN (Equipment Serial Number) basiert
- Events: Kamerakonnektivität, Netzwerkstatus
- Ports: WAN (1000 Mb/s), CamLAN (1000 Mb/s)
- Bekannte Besonderheiten: **ESN** für Device-Registration erforderlich. **Bridge Settings** müssen korrekt konfiguriert werden. **User Settings** sind entscheidend für den Betrieb.

**Core Functions**

- Bridge Management: Supported
- Camera Network: Supported (Gigabit)
- Cloud Integration: Supported via GUID
- User Management: Supported
- High-throughput Support: Bis zu 1000 Mb/s für mehrere Kameras

# Schritte

## Step 1 – Bridge-Informationen erfassen

- UI-Pfad: **EagleEye Bridge -> Bridge Settings**

- Bridge-Details sammeln
  - EagleEye Bridge-Konfigurationsoberfläche öffnen.
  - Zum Bereich Bridge Settings navigieren.
  - Folgende Hardware- und Netzwerk-Infos notieren:
    - **SSN**: Seriennummer der Bridge
    - **IP Address**: Lokale IP-Adresse der Bridge im internen Netzwerk
    - **ESN**: Equipment Serial Number (für GC-X-ONE-Registrierung)
    - **GUID**: Eindeutiger Global Identifier für das Device im Cloud-System
    - **WAN**: 1000 Mb/s – Uplink unterstützt Gigabit
    - **CamLan**: 1000 Mb/s – Kamera-Netzwerkinterface mit Gigabit
    - **CamLan+**: Bestätigt bis zu 1000 Mb/s für hohe Durchsätze
  
  ![EagleEye Bridge Settings](./images/EagleEye%201.png)

- Erwartetes Ergebnis: Bridge-Informationen für Registrierung und Konfiguration gesammelt.

## Step 2 – User Settings konfigurieren

- UI-Pfad: **EagleEye Bridge -> User Settings**

- User-Konfiguration setzen
  - Zum Bereich User Settings wechseln.
  - Benutzerkonten und Berechtigungen konfigurieren.
  - Authentifizierungsparameter definieren.
  - Zugriffslevel und Sicherheitseinstellungen festlegen.
  - Sicherstellen, dass User Management für den Systemzugriff passt.
  
  ![EagleEye User Settings 1](./images/EagleEye%202.png)
  
  ![EagleEye User Settings 2](./images/EagleEye%203.png)
  
  ![EagleEye User Settings 3](./images/EagleEye%204.png)

- Erwartetes Ergebnis: User Settings für Bridge-Zugriff und Management korrekt eingerichtet.

## Step 3 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration App -> Site -> Devices -> Add -> EagleEye**

- EagleEye Device registrieren
  - In GC-X-ONE anmelden.
  - Zur Configuration App navigieren.
  - Site -> Devices -> Add -> EagleEye auswählen.
  - Pflichtfelder ausfüllen:
    - **Device Name**: Beschreibender Name für die Bridge
    - **ESN**: Aus Step 1 ermittelte Equipment Serial Number
    - **IP Address**: Bridge-IP-Adresse
    - **Authentication credentials**: Laut User Settings
  - Auf **Discover** klicken, um das Device zu erkennen.
  - Erfolgreiche Discovery prüfen.
  - **Save** klicken, um die Registrierung abzuschließen.
  
  ![EagleEye GC-X-ONE Configuration](./images/EagleEye%205.png)

- Erwartetes Ergebnis: EagleEye Bridge erfolgreich in GC-X-ONE hinzugefügt und erkannt.

## Step 4 – Integration verifizieren

- Checks
  - Bridge erscheint in der GC-X-ONE Device-Liste.
  - Netzwerkverbindung bestätigt.
  - Kamera-Netzwerkfunktion (CamLan) testen.
  - WAN-Verbindung prüfen.
  - GUID-Registrierung im Cloud-System kontrollieren.
  - User-Authentifizierung testen.
  - High-Throughput-Unterstützung für Kameras prüfen.

- Erwartetes Ergebnis: Vollständige EagleEye-Integration mit der GC-X-ONE-Plattform.

# Troubleshooting

- Bridge-Konnektivität
  - IP-Adresskonfiguration prüfen.
  - Sicherstellen, dass WAN Gigabit-Geschwindigkeit bietet.
  - Routing und Firewall-Einstellungen kontrollieren.
  - Internetverbindung für Cloud-Integration bestätigen.

- ESN-Registrierung
  - ESN korrekt und ohne Leerzeichen aus Bridge Settings übernehmen.
  - Device-Typ in GC-X-ONE als EagleEye wählen.
  - Gültigkeit der ESN sicherstellen.

- User-Authentifizierung
  - User Settings korrekt konfiguriert?
  - Stimmt das Credential-Paar?
  - Haben die Accounts passende Berechtigungen?
  - Access Levels korrekt gesetzt?

- Kamera-Netzwerk
  - Unterstützt das CamLan-Interface 1000 Mb/s?
  - Kameraverbindungen zur Bridge prüfen.
  - Bandbreite für mehrere Kameras sicherstellen.
  - Support für hochauflösende Kameras testen.

- Cloud-Integration
  - GUID korrekt registriert?
  - Internetverbindung für Cloud Services vorhanden?
  - Firewall erlaubt Cloud-Kommunikation?
  - Ist die Bridge im Cloud-System authentifiziert?

# Notes

- ESN (Equipment Serial Number) ist für die Device-Registrierung erforderlich.
- Bridge unterstützt Gigabit auf WAN und CamLan.
- CamLan+ bestätigt hohen Durchsatz für mehrere hochauflösende Kameras.
- User Settings sind essenziell für den Betrieb.
- GUID dient als eindeutige ID für die Cloud-Integration.
- Alle Netzwerkinterfaces sollten für optimale Performance konfiguriert sein.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)

# Additional Resources

- NXGEN Help-desk: https://helpdesk.nxgen.io/portal/en/signin
