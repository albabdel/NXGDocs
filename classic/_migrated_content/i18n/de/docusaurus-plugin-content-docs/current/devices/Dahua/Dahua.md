---
title: "Dahua"
sidebar_label: "Dahua"
sidebar_position: 6
description: "Configure Dahua to stream and send events to GC-X-ONE."
tags:
  - Dahua
  - Camera
  - NVR
  - IVS Analytics
  - GC-X-ONE
---

# Dahua

**Device Information:**
- **Device**: Dahua Camera/NVR Model
- **Vendor**: Dahua
- **Model**: Various
- **Firmware**: Compatible versions
- **Platform**: GC-X-ONE
- **Doc Version**: 1.0.0  

# Zusammenfassung

- Zweck: Dahua für Streaming und Event-Weiterleitung an GC-X-ONE konfigurieren.  
- Ergebnis: Live View und Alarme erscheinen in GC-X-ONE (Video Activity).  
- Zielgruppe: Field Engineer / Support.  

# Voraussetzungen

- Netzwerk: Erreichbare IP, korrektes VLAN und Ports (80/443/554/HTTP API je nach Nutzung).  
- Time Sync: Dahua-Zeitzone an GC-X-ONE anpassen. NTP aktivieren.  
- Access: Admin-Zugriff auf Dahua UI und GC-X-ONE Config App.  
- IP-Allowlist: Anpassen, falls Whitelisting aktiv ist.  
- Test-Account: Dedizierten User für GC-X-ONE anlegen.  

# Device-Profil

- Typ: Camera | NVR  
- Discovery: ONVIF | Proprietary (Dahua)  
- Events: Motion | IVS (Tripwire/Intrusion) | Video Loss | Tamper | I/O  
- Ports: 80/443/554/rtsp  
- Bekannte Besonderheiten: **Log -> Report Alarm** aktivieren, damit GC-X-ONE Events empfängt.  

**Core Functions**

- Cloud Mode: Supported  
- Discovery: Supported  
- Live: Supported  
- Playback: Supported  
- Timeline: Supported  
- Events: Supported  
- ARM / DISARM: Supported  
- GCXONE Audio (SIP): Supported  
- PTZ/Presets: Supported  

# Schritte

## Step 1 – Dahua vorbereiten (User, Zeit, Streams)

- UI-Pfad: **Home -> Accounts**  
- Vorgehen  
    - **Add** klicken. User (z. B. `NXG`) mit Passwort anlegen.  
    - Berechtigungen vergeben: **Manual control, System, Camera, System info, Event**.  
    - Für **Search** und **Live** die Kameras auswählen, die in GC-X-ONE genutzt werden.  
- Time/NTP  
    - Zeitzone setzen. NTP aktivieren. Speichern.  
- Erwartetes Ergebnis: Dedizierter Least-Privilege-User existiert; Zeit ist korrekt.  
![Dahua User Setup](./images/Dahua%20pic%201.gif)

## Step 2 – Alerts (AI/IVS) konfigurieren und Reporting aktivieren

- UI-Pfad: **AI -> Parameters -> IVS** (oder **Alarm -> Video Detection** für Basic Motion)  
- Vorgehen (IVS empfohlen)  
    - Kamera auswählen. Mit **+** eine Regel hinzufügen.  
    - **Tripwire** oder **Intrusion** wählen.  
    - Regel/Region zeichnen.  
    - **Action** festlegen: Appear oder Cross.  
    - **Tracking duration** auf 30 s setzen.  
    - **Effective target**: Human, Motor Vehicle.  
    - **Schedule** setzen.  
- Events für GC-X-ONE bereitstellen  
    - **More -> Log -> Report Alarm** öffnen. Aktivieren und speichern.  
- Optional: Falls Motion nötig, **Sensitivity ~70** und **Threshold 5** setzen und störende Bereiche meiden.  
- Erwartetes Ergebnis: Dahua erzeugt IVS-Alarme und meldet sie an GC-X-ONE.  
![Dahua IVS Configuration](./images/Dahua%20pic%203.gif)

## Step 2b – Alarmkonfiguration (optional)

- Hinweis: **Motion Detection** möglichst vermeiden; auf Legacy-Systemen können zu viele Alerts entstehen. IVS bevorzugen.  
- UI-Pfad: **Alarm -> Video Detection**  
- Gilt für: Motion Detection, Video Tampering, Video Loss u. ä.  
- Vorgehen  
    - Kamera wählen.  
    - **Setting** rechts neben **Channel** anklicken.  
    - Region(en) markieren, die überwacht werden sollen.  
    - Mit **OK** speichern.  
- Alarme für GC-X-ONE verfügbar machen  
    - Zu **More -> Log -> Report Alarm** gehen. Aktivieren. **OK** klicken.  
![Dahua Alarm Configuration](./images/Dahua%20pic%202.gif)

## Step 3 – Device in GC-X-ONE hinzufügen

- UI-Pfad: **GC-X-ONE -> Customer -> Site -> Devices -> Add Device**  
- Vorgehen  
    - **Dahua** auswählen.  
    - Felder ausfüllen: **Serial Number, Username, Password, Ports, Time Zone**.  
    - Für NVR: **Channel** je Sensor wählen.  
    - **Discover** klicken. Gefundene Sensoren und I/O prüfen.  
    - **Save** klicken.  
- Erwartetes Ergebnis: GC-X-ONE listet Sensoren unter dem Dahua-Device.  

## Step 4 – Verifizieren

- Checks  
    - **Live** öffnet ohne Ruckeln.  
    - Neueste IVS Events erscheinen in **Video Activity** mit Clips.  
    - PTZ bewegt Presets, sofern unterstützt.  
![Adding Device Step 1](./images/Adding%20device%201.png)

![Adding Device Step 2](./images/Adding%20device%202.png)

![Adding Device Step 3](./images/Adding%20device%203.png)

# Troubleshooting

- Keine Events in Video Activity  
    - Prüfen, ob **More -> Log -> Report Alarm** aktiv ist.  
    - IVS-Regel ist armed und aktuell gescheduled?  
    - Time Sync/NTP kontrollieren.  
- Discovery schlägt fehl  
    - Credentials, Rollenberechtigungen, Ports und Erreichbarkeit prüfen.  
    - HTTP vs. HTTPS je nach Site-Policy testen.  
- Live View ruckelt  
    - Substream-Bitrate/FPS reduzieren; Dual-Stream-Profil sicherstellen.  
- Zu viele Alerts  
    - IVS-Zonen enger setzen. Generische Motion möglichst vermeiden.  

# Notes

- Least Privilege: Dahua-User aus Step 1 verwenden, nicht Admin wiederverwenden.  
- Bei Multi-Channel-NVRs Step 3 für jeden benötigten Channel in GC-X-ONE wiederholen.  

# Change log

- 2025-09-02 v1.0.0 Initial GC-X-ONE aligned doc.  

# Summary video

<!-- Video: Dahua Integration Demo -->
<!-- Note: Video files need to be hosted separately or embedded via iframe -->
    
- External: ([DahuaWiki](https://dahuawiki.com/NVR/Basic_Setup/Initial_Setup))
