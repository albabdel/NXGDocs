---
title: "Teltonika Router"
sidebar_label: "Teltonika Router"
sidebar_position: 13
description: "Configure Teltonika Router to integrate with GC-X-ONE platform for GPS tracking and device monitoring."
tags:
  - Teltonika
  - Router
  - GPS Tracking
  - HTTPS
  - GC-X-ONE
---

# Teltonika Router

**Device Information:**
- **Device**: Teltonika Router Device Model
- **Vendor**: Teltonika
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0

# Zusammenfassung

- Zweck: Teltonika Router für GPS-Tracking und Device Monitoring in GC-X-ONE integrieren.
- Ergebnis: Erweiterte Funktionen mit GPS-Datenübertragung und Standort-Tracking über die GC-X-ONE-Integration.
- Zielgruppe: Field Engineer / Support.

# Voraussetzungen

- Administrative Rechte auf die Teltonika Router-Konfiguration
- Netzwerkzugriff auf den Router
- Aktives GPS-Signal für Location Tracking
- HTTPS-Konnektivität für die Datenübertragung

# Device-Profil

- Typ: GPS Tracking Router
- Discovery: Serial Number basiert
- Events: GPS-Positionsupdates, Device Status
- Ports: HTTPS
- Bekannte Besonderheiten: **Serial Number** erforderlich für die Registrierung. **GPS Service** muss aktiviert und konfiguriert sein. **HTTPS URL** muss korrekt für die Datenübertragung gesetzt werden.

**Core Functions**

- GPS Tracking: Supported
- Location Updates: Supported
- Device Status: Supported
- HTTPS Communication: Supported

# Schritte

## Step 1 – Device Serial Number ermitteln

- UI-Pfad: **Teltonika Router -> Status -> Device**

- Serial Number abrufen
  - In die Teltonika Device Weboberfläche einloggen.
  - Zum Status-Menü navigieren.
  - **Device** auswählen.
  - Serial Number kopieren (für die Registrierung in GC-X-ONE).
  - ![Teltonika Status](./images/Teltonika%20Router%201.png)
  - ![Device Details](./images/Teltonika%20Router%202.png)

- Erwartetes Ergebnis: Serial Number für die Registrierung erhalten.

## Step 2 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Configuration App -> Site -> Devices -> Add**

- Teltonika Device registrieren
  - In GC-X-ONE einloggen.
  - Zur Configuration App wechseln.
  - Zum Bereich Device Addition gehen.
  - Device Type „Teltonika“ auswählen.
  - Serial Number aus Step 1 eintragen.
  - Registrierung abschließen.
  - ![GC-X-ONE Device Add](./images/Teltonika%20Router%2010.png)

- Erwartetes Ergebnis: Teltonika Device erfolgreich in GC-X-ONE registriert.

## Step 3 – Device-Informationen anzeigen

- UI-Pfad: **GC-X-ONE -> Device List -> View**

- Registrierung verifizieren
  - Nach der Registrierung **View** klicken.
  - Prüfen, ob Device-Informationen korrekt angezeigt werden.
  - Device-Status und Konfigurationsdetails bestätigen.
  - ![Device View](./images/Teltonika%20Router%2011.png)

- Erwartetes Ergebnis: Device-Informationen zugänglich und korrekt.

## Step 4 – Custom Receiver URL abrufen

- UI-Pfad: **GC-X-ONE -> Device Configuration -> Edit**

- Teltonika Custom URL holen
  - In der Device-Konfiguration **Edit** klicken.
  - Feld **Teltonika Custom Receiver URL** suchen.
  - Komplette URL kopieren (für Router-Konfiguration).
  - ![Receiver URL](./images/Teltonika%20Router%2011.png)
  - ![Receiver URL Copy](./images/Teltonika%20Router%2012.png)

- Erwartetes Ergebnis: Custom Receiver URL für die Router-Konfiguration erhalten.

## Step 5 – GPS Service am Router konfigurieren

- UI-Pfad: **Teltonika Router -> Service -> GPS**

- GPS Settings setzen
  - Zur Teltonika Router Weboberfläche zurückkehren.
  - Menü **Service** öffnen.
  - **GPS** auswählen.
  - GPS-Konfigurationsoptionen aufrufen.
  - ![GPS Service](./images/Teltonika%20Router%208.png)

- Erwartetes Ergebnis: Seite zur GPS-Konfiguration geöffnet.

## Step 6 – HTTPS URL konfigurieren

- UI-Pfad: **Teltonika Router -> Service -> GPS -> HTTPS Tab**

- Custom Receiver URL setzen
  - Im GPS-Bereich den Tab **HTTPS** öffnen.
  - Die in Step 4 kopierte URL in das Feld **HTTPS URL** eintragen.
  - Sicherstellen, dass die URL vollständig und korrekt formatiert ist.
  - Einstellungen speichern.
  - ![HTTPS URL](./images/Teltonika%20Router%209.png)

- Erwartetes Ergebnis: HTTPS URL für die Datenübertragung zu GC-X-ONE konfiguriert.

## Step 7 – Integration verifizieren

- Checks
  - GPS Service aktiviert und aktiv?
  - HTTPS URL korrekt eingetragen?
  - Device-Status in GC-X-ONE auf online?
  - GPS-Positionsdaten werden empfangen?
  - Datenübertragung getestet?

- Erwartetes Ergebnis: Vollständige Teltonika Router-Integration mit GC-X-ONE.

# Troubleshooting

- Probleme mit Serial Number
  - Serial Number exakt von der Status-Seite übernehmen.
  - Keine Leerzeichen oder Sonderzeichen im Eintrag.
  - Device Type in GC-X-ONE korrekt auf Teltonika setzen.

- GPS Service-Probleme
  - GPS-Antenne korrekt angeschlossen?
  - GPS-Signalstärke und Satellitenempfang prüfen.
  - GPS Service in der Router-Konfiguration aktiviert?
  - Standortdienste aktiv?

- HTTPS-Konfigurationsprobleme
  - Custom Receiver URL korrekt kopiert?
  - HTTPS-Konnektivität vom Router zu GC-X-ONE prüfen.
  - Firewall-Einstellungen erlauben HTTPS Traffic?
  - Netzwerk-Konnektivität und DNS-Auflösung bestätigen.

- Datenübertragung
  - HTTPS URL gespeichert?
  - Router-Systemlogs auf Übertragungsfehler prüfen.
  - Empfängt GC-X-ONE Daten-Updates?
  - Netzwerkverbindung zwischen den Geräten testen.

# Notes

- Die Serial Number ist für die Registrierung in GC-X-ONE erforderlich.
- GPS Service muss für Location Tracking aktiv sein.
- HTTPS URL ist entscheidend für die Datenübertragung.
- Stabile Netzwerkkonnektivität ist essenziell für die Integration.
- Alle Konfigurationen nach der Umsetzung verifizieren.

# Change log

- 2025-09-04 v1.0.0 Initial GC-X-ONE aligned doc (converted from original format)
