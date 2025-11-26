---
sidebar_position: 3
sidebar_label: 'BulkImport (DE)'
image: ./logo.svg
title: BulkImport
unlisted: true
---

# BulkImport

Importieren Sie viele Geräte mit wenigen Klicks.  
BulkImport ermöglicht es Ihnen, eine Excel-Vorlagendatei hochzuladen, die Datensätze in der Vorschau anzuzeigen und Geräte in einem geführten Ablauf zu erstellen.

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

BulkImport ist die empfohlene Methode, um große Mengen von Geräten in GCXONE zu integrieren.  
Verwenden Sie diese Seite als Referenz dafür, wie es funktioniert, wie Sie Ihre Datei vorbereiten und was Sie von jedem Schritt erwarten können.

## Wo sich BulkImport befindet

Öffnen Sie GCXONE, gehen Sie zu **Geräte** und wählen Sie dann **Importieren**.

![Geräteseite mit Import-Schaltfläche](./Screenshot%202025-11-25%20124920.png)

Das System öffnet einen dreistufigen Assistenten:

1. Hochladen  
2. Vorschau  
3. Abschluss  

Sie bleiben die ganze Zeit auf der Geräteseite.

## Wann BulkImport verwendet werden sollte

Verwenden Sie BulkImport, wenn Sie:

- Viele Geräte für einen Kunden oder Standort hinzufügen möchten.  
- Geräte von einer älteren Plattform migrieren.  
- Neue Hardware gleichzeitig an mehreren Standorten ausrollen.  
- Die Gerätekonfiguration konsistent halten möchten, indem Sie mit einer Vorlagendatei beginnen.  

Für ein einzelnes Gerät verwenden Sie das normale Geräteerstellungsformular.  
Für größere Mengen spart BulkImport viel Zeit.

## Schritt 1 - Vorlagendatei hochladen

![Upload-Schritt - Excel-Datei auswählen](./Screenshot%202025-11-25%20124938.png)

Der Upload-Schritt bietet zwei Schaltflächen:

- **Vorlagendatei herunterladen**  
  Lädt eine leere Excel-Datei mit allen erforderlichen Spalten herunter.

- **Dateien durchsuchen**  
  Öffnet eine Dateiauswahl, in der Sie Ihre ausgefüllte `.xlsx`- oder `.xls`-Datei auswählen.

Der Assistent akzeptiert eine Excel-Datei pro Durchlauf.  
Wenn Sie mehrere Kunden oder Regionen verwalten, erstellen Sie eine Datei pro Gruppe.  
Das macht die Vorschau und Fehlerbehandlung übersichtlicher.

Nachdem Sie die Datei ausgewählt haben, wechselt der Assistent zur Vorschau.

## Schritt 2 - Importdaten in der Vorschau anzeigen

![Vorschau-Schritt - Zeilen überprüfen](./Screenshot%202025-11-25%20125048.png)

Der Vorschau-Schritt zeigt:

- Den Kunden oder Standort oben.  
- Eine Tabelle aller Zeilen, die BulkImport in der Datei erkannt hat.  
- Die Gesamtzahl der Zeilen auf der rechten Seite.  

Überprüfen Sie mindestens:

- Standortname.  
- Gerätetyp und Modell.  
- Seriennummern und IP-Adressen.  
- Dass die Zeilenanzahl Ihren Erwartungen entspricht.  

Wenn etwas falsch aussieht, klicken Sie auf **Zurück**, korrigieren Sie die Excel-Datei und laden Sie sie erneut hoch.  
Fahren Sie nicht fort, wenn die Vorschau nicht mit dem übereinstimmt, was Sie importieren wollten.

Wenn die Daten korrekt aussehen, klicken Sie auf **Daten importieren**.

## Schritt 3 - Abschluss

![Abschluss-Schritt - Erfolg](./Screenshot%202025-11-25%20125103.png)

Nachdem der Import abgeschlossen ist, sehen Sie einen Abschlussbildschirm.

Sie erhalten:

- Eine klare Erfolgsmeldung.  
- Die Anzahl der Datensätze, die BulkImport importiert hat.  

Wenn das System Probleme mit einigen Zeilen gefunden hat, zeigt es auch:

- Die Anzahl der fehlgeschlagenen Datensätze.  
- Einen Link zum Herunterladen einer Fehlerberichtsdatei.  

Verwenden Sie diesen Bericht, um nur die fehlgeschlagenen Zeilen zu korrigieren, und importieren Sie dann nur diese Zeilen in einer kleinen Folgedatei.

Vorhandene Geräte bleiben unverändert.  
BulkImport fügt nur neue hinzu.

## Excel-Vorlagendatei

Sie erhalten immer die neueste Vorlage, indem Sie im Upload-Schritt auf **Vorlagendatei herunterladen** klicken.

![Beispiel für Excel-Vorlage](./Screenshot%202025-11-25%20125021.png)

Die Vorlage enthält diese Spalten:

| Spaltenname                  | Beschreibung                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `siteName`                   | Standort, der das Gerät besitzt. Eine Datei zielt normalerweise auf einen Standort oder Kunden ab. |
| `deviceName`                 | Anzeigename des Geräts, wie er in der Benutzeroberfläche erscheint.                                |
| `deviceType`                 | Gerätehersteller oder -typ, zum Beispiel Dahua, Hikvision oder Tower1.                             |
| `ipAddressOrH`               | IP-Adresse oder Hostname des Geräts.                                                               |
| `isHttps`                    | `TRUE` für HTTPS-Verwendung, `FALSE` für HTTP.                                                     |
| `httpsPort`                  | HTTPS-Portnummer, wenn `isHttps` auf `TRUE` gesetzt ist.                                           |
| `controlPort`                | Port für Steuerungs- oder API-Aufrufe.                                                             |
| `serverPort`                 | Haupt-Server- oder Service-Port.                                                                   |
| `RTSPPort`                   | Port für RTSP-Streaming.                                                                           |
| `userName`                   | Benutzername, den BulkImport für die Anmeldung verwenden soll.                                     |
| `password`                   | Passwort für den oben genannten Benutzernamen.                                                     |
| `momentsTimeZoneCountryName` | Zeitzone, in der das Gerät installiert ist, zum Beispiel `Asia/Kolkata` oder `CET`.                |
| `isEventPollingEnabled`      | `TRUE` um Event-Polling zu aktivieren, `FALSE` um es zu deaktivieren.                              |
| `pollingInterval`            | Polling-Intervall in Sekunden, wenn Event-Polling aktiviert ist.                                   |
| `peirodi`                    | Reserviertes Feld. Lassen Sie es leer, es sei denn, der Support weist Sie an, es zu verwenden.     |

Tipps zum Ausfüllen der Datei:

- Füllen Sie alle Pflichtfelder in jeder Zeile aus.  
- Verwenden Sie eine Zeile pro Gerät.  
- Lassen Sie optional Felder leer, anstatt Werte zu erraten.  
- Verwenden Sie dasselbe Standort- und Zeitzonenformat in der gesamten Datei.  

Behandeln Sie die Datei als vertraulich, da sie Zugangsdaten enthält.  
Speichern und teilen Sie sie auf sichere Weise innerhalb Ihres Teams.

## Validierung und Fehler

BulkImport validiert Daten während der Vorschau und während des eigentlichen Imports.

### Vorschau-Prüfungen

Während der Vorschau prüft BulkImport auf:

- Fehlende Pflichtangaben.  
- Ungültige Portnummern.  
- Grundlegende Formatprobleme bei IP-Adressen oder Hostnamen.  
- Offensichtliche Duplikate in derselben Datei.  

Wenn BulkImport kritische Probleme findet, zeigt es eine Meldung an und blockiert den Import.  
Korrigieren Sie die Datei und laden Sie sie erneut hoch.

### Import-Prüfungen

Wenn Sie auf **Daten importieren** klicken, versucht BulkImport, jedes Gerät zu erstellen:

- Gültige Zeilen erstellen Geräte und ordnen sie dem ausgewählten Kunden oder Standort zu.  
- Ungültige Zeilen schlagen fehl und landen in der Fehlerliste.  

Wenn einige Zeilen fehlschlagen:

1. Laden Sie den Fehlerbericht herunter.  
2. Korrigieren Sie die Zeilen in einer neuen Kopie der Vorlage.  
3. Führen Sie BulkImport erneut nur mit diesen Zeilen aus.  

Auf diese Weise müssen Sie keinen vollständigen Import wiederholen.

## Best Practices

- Beginnen Sie mit einer kleinen Testdatei, zum Beispiel mit fünf Geräten, um das Format zu bestätigen.  
- Verwenden Sie eine Datei pro Kunde oder Region, damit die Vorschau lesbar bleibt.  
- Bewahren Sie eine Kopie jeder importierten Datei auf, falls Sie später Änderungen nachvollziehen müssen.  
- Öffnen Sie nach einem großen Import einige Geräte in der Benutzeroberfläche und bestätigen Sie, dass sie sich wie erwartet verbinden.  

## FAQ

**Kann ich BulkImport mit derselben Datei erneut ausführen?**  
Ja. Dies kann Duplikate erstellen, wenn Ihre Umgebung diese nicht blockiert. Überprüfen Sie daher die Vorschau sorgfältig.  
Im Zweifelsfall bewahren Sie eine Kopie der Originaldatei auf und verwenden Sie kleinere Dateien für Wiederholungsversuche.

**Was passiert mit Zeilen, die fehlschlagen?**  
Fehlgeschlagene Zeilen erstellen keine Geräte.  
Sie korrigieren diese Zeilen und führen dann einen kleineren Import nur mit diesen Daten durch.

**Kann ich CSV anstelle von Excel verwenden?**  
BulkImport erwartet die Excel-Vorlage, die Sie vom Assistenten herunterladen.  
Verwenden Sie diese Vorlage, um Probleme mit Spaltennamen und Formaten zu vermeiden.

**Benötige ich spezielle Berechtigungen, um BulkImport zu verwenden?**  
Sie benötigen die Berechtigung, Geräte für den Zielkunden oder -standort zu verwalten.  
Wenn Sie die Schaltfläche „Importieren" nicht sehen, wenden Sie sich an Ihren GCXONE-Administrator.

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** 25. November 2025  
**Status:** Aktuell