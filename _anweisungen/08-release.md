# Stufe 8: Release

Bringt einen Release-Kandidaten mit einer oder mehreren abgenommenen Anforderungen live. Ein Release hat ein eigenes Dokument `releases/<version>.md`; **wann** released wird, entscheidet der Nutzer. Release-Modell und Auslieferung: `_kontext/projekt.md`.

| Schritt | Wer | Ergebnis |
|---|---|---|
| 8a Umfang | Nutzer | Inhalt des Releases festgelegt |
| 8b Gesamtprüfung | Agent | alle Prüfungen grün auf `rc/<version>`, **CI grün** |
| 8c Freigabe | Nutzer | Release freigegeben |
| 8d Ausliefern | Agent eröffnet Pull Request, Nutzer führt zusammen und taggt | `rc/<version>` in `main`, Tag `v<version>`, ausgeliefert |
| 8e Nachprüfen | Agent + Nutzer | kurzer Test des ausgelieferten Stands |
| 8f Abschluss | Agent | Anforderungen `done`, Release-Dokument abgeschlossen |

## 8a: Umfang

-   Im Release-Dokument stehen die enthaltenen Anforderungen (alle `accepted` und im Release-Kandidaten).
-   Soll eine abgenommene Anforderung doch nicht mit: der Nutzer entscheidet, wie sie wieder herauskommt (z. B. Revert im Release-Kandidaten).

## 8b: Gesamtprüfung

Die Anforderungen sind einzeln geprüft — hier wird geprüft, ob sie **zusammen** funktionieren:

-   Alle Tests, der Prüflauf, die automatischen Prüfungen aus Stufe 6 und der saubere Lauf auf `rc/<version>`.
-   Der Agent eröffnet den **Pull Request von `rc/<version>` nach `main`**; die CI läuft dort. **Ohne grüne CI kein Zusammenführen und kein Tag.**
-   Kurzer Klicktest über alle enthaltenen Anforderungen (Rolle Klicktester, nur die Hauptwege).
-   Ergebnis im Release-Dokument. Befunde → betroffene Anforderung zurück in Stufe 5; neue Abnahme nur für deren Änderung.

## 8c: Freigabe

-   Der Nutzer gibt das Release ausdrücklich frei.

## 8d: Ausliefern

-   **Der Nutzer führt den Pull Request** nach `main` zusammen, setzt auf dem neuen Stand von `main` den Tag `v<version>` und pusht ihn; erst damit wird ausgeliefert.
-   Ausgeliefert wird nach `_kontext/projekt.md` bzw. dem How-to in `_kontext/` (z. B. automatisch beim Push auf `main`).

## 8e: Nachprüfen

-   Kurzer Test des ausgelieferten Stands: startet die App, funktionieren die Hauptwege.
-   Geht etwas schief (auch: Auslieferung bricht ab): zurückrollen wie im Release-Dokument beschrieben; Release-Status **`failed`**, der Tag wird nicht wiederverwendet; Befund als Bug ins Backlog, Korrektur im nächsten Patch-Release. Die enthaltenen Anforderungen bleiben `accepted`.

## 8f: Abschluss

-   Auf dem Branch `release/<version>-abschluss` (von `main`): alle enthaltenen Anforderungen Status `done`, Dokument nach `anforderungen/done/`.
-   Release-Dokument: Status `released`, Datum — **erst**, wenn die Nachprüfung (8e) den ausgelieferten Stand bestätigt hat.
-   Optional: kurzer Rückblick zum Release (wie 7d).
-   Pushen, Pull Request eröffnen; der Nutzer führt zusammen.

## Abkürzung

Ist im Projekt festgelegt, dass Zusammenführen bereits ausliefert (z. B. „jeder Stand auf `main` geht live"), gibt es keinen Release-Kandidaten: Der Pull Request der Anforderung geht direkt nach `main`; der Nutzer führt ihn nach der Abnahme zusammen; Stufe 8 besteht dann nur aus 8b (auf dem Feature-Branch), 8e und 8f, ein Release-Dokument entfällt.
