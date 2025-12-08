---
title: Admin-Leitfaden
description: Vollständiger Leitfaden für Systemadministratoren zur Verwaltung von Benutzern, Standorten und globalen Einstellungen.
tags: [admin, configuration, user-management]
---

# Admin-Leitfaden

Als **System Administrator** haben Sie die vollständige Kontrolle über die GCXONE-Organisation. Dieser Leitfaden deckt die wichtigsten Aufgaben zur Verwaltung Ihrer Umgebung ab.

## Benutzerverwaltung

### Benutzer einladen
1. Zu **Settings > Users** navigieren.
2. **Invite User** anklicken.
3. E-Mail-Adresse eingeben und eine Role auswählen (Admin, Operator, Installer).
4. **Send Invitation** anklicken.

### Rollen und Berechtigungen verwalten
GCXONE verwendet ein Role-Based-Access-Control-(RBAC)-Modell:

| Rolle         | Beschreibung                                                               |
| :------------ | :------------------------------------------------------------------------ |
| **Admin**     | Voller Zugriff auf alle Einstellungen, Benutzer und Abrechnung.           |
| **Manager**   | Kann Standorte verwalten und Reports einsehen, aber keine globalen Settings ändern. |
| **Operator**  | Kann Alarme einsehen und bearbeiten. Schreibgeschützter Zugriff auf Standortkonfiguration. |
| **Installer** | Kann Geräte bereitstellen und Diagnosen ansehen. Auf zugewiesene Sites beschränkt. |

## Standortkonfiguration

### Einen Standort anlegen
Ein „Site“ steht für einen physischen Standort (z. B. „Main Office“, „Warehouse A“).
1. Zu **Sites > Create New** gehen.
2. Site Name und Address eintragen.
3. Eine Time Zone zuweisen.

### Globale Einstellungen
* **Security Policies**: Unter **Settings > Security** 2FA für alle Benutzer erzwingen.
* **Audit Logs**: Chronologische Aufzeichnung aller Systemaktionen im Bereich **Audit Log** einsehen.

## Abrechnung und Subscriptions
Im **Billing**-Portal das Abonnement verwalten und Rechnungen einsehen. Sie können Ihren Plan jederzeit upgraden, um mehr Geräte oder Speicher für Retention hinzuzufügen.
