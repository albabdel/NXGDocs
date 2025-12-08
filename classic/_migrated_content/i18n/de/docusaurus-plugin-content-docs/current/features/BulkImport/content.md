---
sidebar_position: 2
image: ./logo.svg
title: BulkImport
tags:
  - bulk-import
  - devices
  - excel
---

# BulkImport

Importieren Sie viele Geräte mit wenigen Klicks.  
BulkImport lässt Sie eine Excel-Vorlagendatei hochladen, die Datensätze in der Vorschau prüfen und Geräte in einem geführten Ablauf erstellen.

<video
  controls
  style={{
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    marginTop: '1rem',
    marginBottom: '1.5rem'
  }}
>
  <source src={require('./Bulk import (2).mp4').default} type="video/mp4" />
  Your browser does not support the video tag.
</video>

BulkImport ist die empfohlene Methode, um große Gerätemengen in GCXONE einzubinden.  
Nutzen Sie diese Seite als Referenz dafür, wie der Ablauf funktioniert, wie Sie Ihre Datei vorbereiten und was Sie in jedem Schritt erwartet.

## Wo BulkImport zu finden ist

GCXONE öffnen, zu **Devices** gehen und **Import** auswählen.

![Devices page with Import button](./Screenshot%202025-11-25%20124920.png)

Das System startet einen dreistufigen Wizard:

1. Upload  
2. Preview  
3. Complete  

Sie bleiben die gesamte Zeit auf der Devices-Seite.

## Wann BulkImport sinnvoll ist

BulkImport einsetzen, wenn Sie:

- Viele Geräte für einen Customer oder eine Site hinzufügen möchten.  
- Geräte von einer älteren Plattform migrieren.  
- Neue Hardware gleichzeitig an mehreren Standorten ausrollen.  
- Eine konsistente Gerätekonfiguration sicherstellen wollen, indem Sie mit einer Template-Datei starten.  

Für ein einzelnes Gerät nutzen Sie das normale Formular zur Gerätekonfiguration.  
Für größere Mengen spart BulkImport erheblich Zeit.

## Step 1 – Template-Datei hochladen

![Upload step - select Excel file](./Screenshot%202025-11-25%20124938.png)

Im Upload-Schritt gibt es zwei Buttons:

- **Download Template File**  
  Lädt eine leere Excel-Datei mit allen erforderlichen Spalten herunter.

- **Browse Files**  
  Öffnet die Dateiauswahl, um Ihre ausgefüllte `.xlsx`- oder `.xls`-Datei auszuwählen.

Der Wizard akzeptiert pro Durchlauf eine Excel-Datei.  
Wenn Sie mehrere Kunden oder Regionen bedienen, erstellen Sie eine Datei pro Gruppe.  
So bleiben Vorschau und Fehlerbehandlung übersichtlich.

Nach der Dateiauswahl wechselt der Wizard zur Preview.

## Step 2 – Importdaten prüfen

![Preview step - review rows](./Screenshot%202025-11-25%20125048.png)

Die Preview zeigt:

- Customer oder Site oben.  
- Eine Tabelle aller Zeilen, die BulkImport in der Datei gefunden hat.  
- Die Gesamtzahl der Zeilen rechts.  

Prüfen Sie mindestens:

- Site-Name.  
- Device-Type und Modell.  
- Seriennummern und IP-Adressen.  
- Ob die Zeilenzahl Ihren Erwartungen entspricht.  

Wenn etwas nicht passt, auf **Back** klicken, die Excel-Datei korrigieren und erneut hochladen.  
Nicht fortfahren, wenn die Vorschau nicht zu Ihrem geplanten Import passt.

Wenn die Daten korrekt aussehen, **Import Data** anklicken.

## Step 3 – Completion

![Complete step - success](./Screenshot%202025-11-25%20125103.png)

Nach Abschluss des Imports erscheint ein Abschlussbildschirm.

Sie sehen:

- Eine klare Erfolgsnachricht.  
- Die Anzahl der importierten Datensätze.  

Wenn das System Probleme mit einzelnen Zeilen erkennt, erhalten Sie zusätzlich:

- Die Anzahl der fehlgeschlagenen Datensätze.  
- Einen Link zum Download des Error Reports.  

Nutzen Sie diesen Report, um nur die fehlerhaften Zeilen zu korrigieren, und importieren Sie anschließend eine kleine Folgedatei mit genau diesen Zeilen.

Bestehende Geräte bleiben unverändert.  
BulkImport fügt nur neue Einträge hinzu.

## Template-Excel-Datei

Die jeweils aktuelle Vorlage erhalten Sie im Upload-Schritt über **Download Template File**.

![Template Excel example](./Screenshot%202025-11-25%20125021.png)

Die Vorlage enthält folgende Spalten:

| Column name                  | Description                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `siteName`                   | Site, die das Device besitzt. Eine Datei adressiert normalerweise eine Site oder einen Customer. |
| `deviceName`                 | Anzeigename des Geräts in der UI.                                             |
| `deviceType`                 | Device-Vendor oder -Typ, zum Beispiel Dahua, Hikvision oder Tower1.           |
| `ipAddressOrH`               | IP-Adresse oder Hostname des Geräts.                                          |
| `isHttps`                    | `TRUE` für HTTPS, `FALSE` für HTTP.                                           |
| `httpsPort`                  | HTTPS-Port, wenn `isHttps` `TRUE` ist.                                        |
| `controlPort`                | Port für Steuerungs- oder API-Aufrufe.                                        |
| `serverPort`                 | Haupt-Server- oder Service-Port.                                              |
| `RTSPPort`                   | Port für RTSP-Streaming.                                                      |
| `userName`                   | Benutzername, den BulkImport für die Anmeldung nutzen soll.                   |
| `password`                   | Passwort für den oben genannten Benutzer.                                     |
| `momentsTimeZoneCountryName` | Zeitzone des Installationsorts, z. B. `Asia/Kolkata` oder `CET`.              |
| `isEventPollingEnabled`      | `TRUE` um Event-Polling zu aktivieren, `FALSE` um es zu deaktivieren.         |
| `pollingInterval`            | Polling-Intervall in Sekunden bei aktiviertem Event-Polling.                  |
| `peirodi`                    | Reserviertes Feld. Nur auf Anweisung des Supports befüllen.                   |

Tipps zum Ausfüllen:

- Alle Pflichtfelder in jeder Zeile ausfüllen.  
- Ein Device pro Zeile.  
- Optionale Felder lieber leer lassen als raten.  
- Einheitliches Site- und Zeitzonenformat in der ganzen Datei verwenden.  

Behandeln Sie die Datei als vertraulich, weil sie Credentials enthält.  
Speichern und teilen Sie sie nur über sichere Kanäle im Team.

## Validation und Fehler

BulkImport validiert Daten sowohl in der Preview als auch beim eigentlichen Import.

### Preview-Checks

Während der Preview prüft BulkImport auf:

- Fehlende Pflichtwerte.  
- Ungültige Portnummern.  
- Basisprobleme bei IP- oder Hostname-Formaten.  
- Offensichtliche Duplikate in derselben Datei.  

Bei kritischen Problemen erscheint eine Meldung und der Import wird blockiert.  
Datei korrigieren und erneut hochladen.

### Import-Checks

Nach Klick auf **Import Data** versucht BulkImport, jedes Device anzulegen:

- Gültige Zeilen erstellen Devices und ordnen sie dem gewählten Customer oder der Site zu.  
- Ungültige Zeilen schlagen fehl und landen im Error Report.  

Wenn einige Zeilen fehlschlagen:

1. Error Report herunterladen.  
2. Zeilen in einer neuen Template-Kopie korrigieren.  
3. BulkImport erneut nur mit diesen Zeilen ausführen.  

So vermeiden Sie einen kompletten Neuimport.

## Best Practices

- Mit einer kleinen Testdatei (z. B. fünf Devices) beginnen, um das Format zu prüfen.  
- Pro Customer oder Region eine eigene Datei nutzen, damit die Preview übersichtlich bleibt.  
- Jede importierte Datei archivieren, falls Sie Änderungen später nachvollziehen müssen.  
- Nach einem großen Import einige Devices in der UI öffnen und die Verbindung prüfen.  

## FAQ

**Kann ich BulkImport mit derselben Datei erneut ausführen?**  
Ja. Falls Ihre Umgebung keine Duplikate verhindert, können doppelte Geräte entstehen – daher die Preview genau prüfen. Bei Unsicherheit die Originaldatei aufbewahren und für Wiederholungen kleinere Dateien nutzen.

**Was passiert mit fehlerhaften Zeilen?**  
Fehlerhafte Zeilen erzeugen keine Devices. Sie korrigieren diese Zeilen und führen einen kleinen Import nur mit diesen Daten aus.

**Kann ich CSV statt Excel verwenden?**  
BulkImport erwartet die Excel-Vorlage aus dem Wizard. Nutzen Sie diese Vorlage, um Probleme mit Spaltennamen und Formaten zu vermeiden.

**Brauche ich spezielle Berechtigungen für BulkImport?**  
Sie benötigen Rechte zum Verwalten von Devices für den Ziel-Customer oder die Site. Wenn die Import-Schaltfläche nicht sichtbar ist, wenden Sie sich an Ihren GCXONE-Administrator.

---

**Version:** 1.0.0  
**Last Updated:** November 25, 2025  
**Status:** Current
