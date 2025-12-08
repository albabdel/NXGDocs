---
title: Installer-Leitfaden
description: Technischer Leitfaden für das Bereitstellen von Geräten, das Einrichten von Sites und Diagnosen.
tags: [installer, provisioning, hardware]
---

# Installer-Leitfaden

Dieser Leitfaden richtet sich an **Installers** und **Technicians**, die für die Einrichtung der physischen Hardware und die Anbindung an die GCXONE-Plattform verantwortlich sind.

## Gerätebereitstellung

### Schritt 1: Auspacken und Einschalten
GCXONE Gateway mit Strom und Ethernet verbinden. Sicherstellen, dass die **Power**- und **Network**-LEDs dauerhaft grün leuchten.

### Schritt 2: Gerät registrieren
1. In der **Installer App** auf dem Mobilgerät anmelden.
2. QR-Code auf der Unterseite des Gateways scannen.
3. Das Gerät einer **Site** zuweisen.

### Schritt 3: Firmware aktualisieren
Das Gateway prüft nach dem Verbinden automatisch auf Updates. Das Gerät nicht trennen, solange die **Update**-LED gelb blinkt.

## Site-Setup

### Sensoren hinzufügen
1. Das Gateway über die App in den **Pairing Mode** versetzen.
2. Den Sensor auslösen (z. B. Türkontakt öffnen).
3. Den Sensor benennen (z. B. „Front Door“) und einen Zone Type zuweisen.

### Tests
Einen **Walk Test** durchführen, um sicherzustellen, dass alle Sensoren korrekt kommunizieren.
* Zu **Diagnostics > Walk Test** gehen.
* Jeden Sensor auslösen.
* Prüfen, ob die Signalstärke (RSSI) im tolerierten Bereich liegt (>-70 dBm).

## Troubleshooting

| Problem               | Mögliche Ursache        | Lösung                                                   |
| :-------------------- | :---------------------- | :------------------------------------------------------- |
| **Gateway offline**   | Keine Internetverbindung | Ethernet-Kabel und Firewall-Einstellungen (Port 443) prüfen. |
| **Sensor koppelt nicht** | Schwache Batterie      | Sensorbatterie tauschen und erneut versuchen.            |
| **Schwaches Signal**  | Störungen               | Gateway näher an den Sensor stellen oder einen Repeater einsetzen. |
