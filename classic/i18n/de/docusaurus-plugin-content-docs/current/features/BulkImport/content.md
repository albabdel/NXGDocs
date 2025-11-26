---
sidebar_position: 2
image: ./logo.svg
title: Massenimport
---

# Massenimport

Importieren Sie viele Geräte mit wenigen Klicks.  
Mit dem Massenimport können Sie eine Excel-Vorlagendatei hochladen, die Datensätze in der Vorschau ansehen und Geräte in einem geführten Ablauf erstellen.

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
  Ihr Browser unterstützt das Video-Tag nicht.
</video>

Der Massenimport ist die empfohlene Methode, um eine große Anzahl von Geräten in GCXONE zu integrieren.  
Verwenden Sie diese Seite als Referenz dafür, wie es funktioniert, wie Sie Ihre Datei vorbereiten und was Sie von jedem Schritt erwarten können.

## Wo sich der Massenimport befindet

Öffnen Sie GCXONE, gehen Sie zu **Geräte** und wählen Sie dann **Importieren**.

![Geräteseite mit Import-Schaltfläche](./Screenshot%202025-11-25%20124920.png)

Das System öffnet einen dreistufigen Assistenten:

1. Hochladen  
2. Vorschau  
3. Abschluss  

Sie bleiben die ganze Zeit auf der Geräteseite.

## Wann sollte der Massenimport verwendet werden

Verwenden Sie den Massenimport, wenn Sie:

- Viele Geräte für einen Kunden oder Standort hinzufügen möchten.  
- Geräte von einer älteren Plattform migrieren.  
- Neue Hardware gleichzeitig an mehreren Standorten einführen.  
- Die Gerätekonfiguration konsistent halten möchten, indem Sie von einer Vorlagendatei ausgehen.  

Für ein einzelnes Gerät verwenden Sie das normale Geräteerstellungsformular.  
Für alles Größere spart der Massenimport viel Zeit.

## Schritt 1 - Vorlagendatei hochladen

![Upload-Schritt - Excel-Datei auswählen](./Screenshot%202025-11-25%20124938.png)

Der Upload-Schritt bietet zwei Schaltflächen:

- **Vorlagendatei herunterladen**  
  Lädt eine leere Excel-Datei mit allen erforderlichen Spalten herunter.

- **Dateien durchsuchen**  
  Öffnet eine Dateiauswahl, in der Sie Ihre ausgefüllte `.xlsx`- oder `.xls`-Datei auswählen.

Der Assistent akzeptiert eine Excel-Datei pro Durchlauf.  
Wenn Sie mehrere Kunden oder Regionen verwalten, erstellen Sie eine Datei pro Gruppe.  
Das macht die Vorschau und Fehlerbehandlung einfacher zu verfolgen.

Nachdem Sie die Datei ausgewählt haben, wechselt der Assistent zur Vorschau.

## Schritt 2 - Importdaten in der Vorschau ansehen

![Vorschau-Schritt - Zeilen überprüfen](./Screenshot%202025-11-25%20125048.png)

Der Vorschau-Schritt zeigt:

- Den Kunden oder Standort oben.  
- Eine Tabelle aller Zeilen, die der Massenimport in der Datei erkannt hat.  
- Die Gesamtanzahl der Zeilen auf der rechten Seite.  

Überprüfen Sie mindestens:

- Standortname.  
- Gerätetyp und Modell.  
- Seriennummern und IP-Adressen.  
- Dass die Anzahl der Zeilen Ihren Erwartungen entspricht.  

Wenn etwas nicht stimmt, klicken Sie auf **Zurück**, korrigieren Sie die Excel-Datei und laden Sie sie erneut hoch.  
Fahren Sie nicht fort, wenn die Vorschau nicht mit dem übereinstimmt, was Sie importieren wollten.

Wenn die Daten korrekt aussehen, klicken Sie auf **Daten importieren**.

## Schritt 3 - Abschluss

![Abschluss-Schritt - Erfolg](./Screenshot%202025-11-25%20125103.png)

Nach Abschluss des Imports sehen Sie einen Abschlussbildschirm.

Sie erhalten:

- Eine klare Erfolgsmeldung.  
- Die Anzahl der Datensätze, die der Massenimport importiert hat.  

Wenn das System Probleme mit einigen Zeilen gefunden hat, zeigt es auch:

- Die Anzahl der fehlgeschlagenen Datensätze.  
- Einen Link zum Herunterladen einer Fehlerberichtsdatei.  

Verwenden Sie diesen Bericht, um nur die fehlgeschlagenen Zeilen zu korrigieren, und importieren Sie dann nur diese Zeilen in einer kleinen Folgedatei.

Vorhandene Geräte bleiben wie sie sind.  
Der Massenimport fügt nur neue hinzu.

## Excel-Vorlagendatei

Sie erhalten die neueste Vorlage immer, indem Sie im Upload-Schritt auf **Vorlagendatei herunterladen** klicken.

![Beispiel für Excel-Vorlage](./Screenshot%202025-11-25%20125021.png)

Die Vorlage enthält diese Spalten:

| Spaltenname                  | Beschreibung                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `siteName`                   | Standort, der das Gerät besitzt. Eine Datei richtet sich normalerweise an einen Standort oder Kunden. |
| `deviceName`                 | Freundlicher Gerätename, wie er in der Benutzeroberfläche angezeigt wird.                             |
| `deviceType`                 | Gerätehersteller oder -typ, z.B. Dahua, Hikvision oder Tower1.                                        |
| `ipAddressOrH`               | IP-Adresse oder Hostname des Geräts.                                                                  |
| `isHttps`                    | `TRUE` für HTTPS, `FALSE` für HTTP.                                                                   |
| `httpsPort`                  | HTTPS-Portnummer, wenn `isHttps` `TRUE` ist.                                                          |
| `controlPort`                | Port für Steuerungs- oder API-Aufrufe.                                                                |
| `serverPort`                 | Haupt-Server- oder Dienst-Port.                                                                       |
| `RTSPPort`                   | Port für RTSP-Streaming.                                                                              |
| `userName`                   | Benutzername, den der Massenimport für die Anmeldung verwenden soll.                                  |
| `password`                   | Passwort für den oben genannten Benutzernamen.                                                        |
| `momentsTimeZoneCountryName` | Zeitzone, in der das Gerät installiert ist, z.B. `Europe/Berlin` oder `CET`.                          |
| `isEventPollingEnabled`      | `TRUE` zum Aktivieren des Ereignis-Pollings, `FALSE` zum Deaktivieren.                                |
| `pollingInterval`            | Polling-Intervall in Sekunden, wenn Ereignis-Polling aktiviert ist.                                   |
| `peirodi`                    | Reserviertes Feld. Lassen Sie es leer, es sei denn, der Support weist Sie an, es zu verwenden.        |

Tipps zum Ausfüllen der Datei:

- Füllen Sie alle erforderlichen Felder in jeder Zeile aus.  
- Verwenden Sie eine Zeile pro Gerät.  
- Lassen Sie optionale Felder leer, anstatt Werte zu erraten.  
- Verwenden Sie in der gesamten Datei dasselbe Standort- und Zeitzonenformat.  

Behandeln Sie die Datei als vertraulich, da sie Anmeldeinformationen enthält.  
Speichern und teilen Sie sie in Ihrem Team auf sichere Weise.

## Validierung und Fehler

Der Massenimport validiert Daten während der Vorschau und während des eigentlichen Imports.

### Vorschau-Prüfungen

Während der Vorschau prüft der Massenimport auf:

- Fehlende erforderliche Werte.  
- Ungültige Portnummern.  
- Grundlegende Probleme mit dem IP- oder Hostname-Format.  
- Offensichtliche Duplikate in derselben Datei.  

Wenn der Massenimport kritische Probleme findet, wird eine Meldung angezeigt und der Import blockiert.  
Korrigieren Sie die Datei und laden Sie sie erneut hoch.

### Import-Prüfungen

Wenn Sie auf **Daten importieren** klicken, versucht der Massenimport, jedes Gerät zu erstellen:

- Gültige Zeilen erstellen Geräte und ordnen sie dem ausgewählten Kunden oder Standort zu.  
- Ungültige Zeilen schlagen fehl und landen in der Fehlerliste.  

Wenn einige Zeilen fehlschlagen:

1. Laden Sie den Fehlerbericht herunter.  
2. Korrigieren Sie die Zeilen in einer neuen Kopie der Vorlage.  
3. Führen Sie den Massenimport nur mit diesen Zeilen erneut aus.  

Auf diese Weise müssen Sie keinen vollständigen Import wiederholen.

## Best Practices

- Beginnen Sie mit einer kleinen Testdatei, z.B. fünf Geräten, um das Format zu bestätigen.  
- Verwenden Sie eine Datei pro Kunde oder Region, damit die Vorschauen lesbar bleiben.  
- Bewahren Sie eine Kopie jeder importierten Datei auf, falls Sie später Änderungen prüfen müssen.  
- Öffnen Sie nach einem großen Import einige Geräte in der Benutzeroberfläche und bestätigen Sie, dass sie wie erwartet verbunden sind.  

## Häufig gestellte Fragen (FAQ)

**Kann ich den Massenimport mit derselben Datei erneut ausführen?**  
Ja. Dies kann Duplikate erstellen, wenn Ihre Umgebung diese nicht blockiert. Überprüfen Sie daher die Vorschau sorgfältig.  
Im Zweifelsfall behalten Sie eine Kopie der Originaldatei und verwenden Sie kleinere Dateien für Wiederholungen.

**Was passiert mit fehlgeschlagenen Zeilen?**  
Fehlgeschlagene Zeilen erstellen keine Geräte.  
Sie korrigieren diese Zeilen und führen dann einen kleineren Import nur mit diesen Daten aus.

**Kann ich CSV anstelle von Excel verwenden?**  
Der Massenimport erwartet die Excel-Vorlage, die Sie vom Assistenten herunterladen.  
Verwenden Sie diese Vorlage, um Probleme mit Spaltennamen und Formaten zu vermeiden.

**Benötige ich spezielle Berechtigungen für den Massenimport?**  
Sie benötigen die Berechtigung zum Verwalten von Geräten für den Zielkunden oder Standort.  
Wenn Sie die Import-Schaltfläche nicht sehen, wenden Sie sich an Ihren GCXONE-Administrator.

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** 25. November 2025  
**Status:** Aktuell
