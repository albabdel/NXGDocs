---
title: API-Referenz
description: Dokumentation für die GCXONE REST-API.
tags: [api, developer, integration]
---

# API-Referenz

Die GCXONE-API ermöglicht Entwicklern die Integration von Drittanbieteranwendungen in die Plattform. Es handelt sich um eine RESTful-API, die JSON für Anfrage- und Antworttexte verwendet.

## Basis-URL

Alle API-Anfragen sollten an folgende Adresse gesendet werden:

```
https://api.gcxone.com/v1
```

## Authentifizierung

Die API verwendet die **Bearer Token**-Authentifizierung. Sie müssen Ihren API-Schlüssel in den `Authorization`-Header jeder Anfrage aufnehmen.

```http
Authorization: Bearer YOUR_API_KEY
```

### Generieren eines API-Schlüssels
1.  Melden Sie sich als Admin in der Konsole an.
2.  Gehen Sie zu **Einstellungen > API-Schlüssel**.
3.  Klicken Sie auf **Neuen Schlüssel generieren**.

## Endpunkte

### Geräte

#### `GET /devices`
Gibt eine Liste aller Geräte zurück, die Ihrer Organisation zugewiesen sind.

**Antwort:**
```json
[
  {
    "id": "dev_12345",
    "name": "Main Gateway",
    "status": "online",
    "last_seen": "2023-10-27T10:00:00Z"
  }
]
```

#### `GET /devices/{id}`
Gibt Details für ein bestimmtes Gerät zurück.

### Alarme

#### `GET /alarms`
Gibt eine Liste aktiver Alarme zurück.

#### `POST /alarms/{id}/acknowledge`
Bestätigt einen Alarm.

**Anfragetext:**
```json
{
  "user_id": "usr_98765",
  "note": "Investigating..."
}
```

## Ratenbegrenzung
Die API ist auf **100 Anfragen pro Minute** pro IP-Adresse begrenzt. Das Überschreiten dieses Limits führt zu einer `429 Too Many Requests`-Antwort.
