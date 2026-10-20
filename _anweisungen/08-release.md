# Stufe 8: Release

Bringt einen Release-Kandidaten mit einer oder mehreren abgenommenen Anforderungen live. Ein Release hat ein eigenes Dokument `releases/<version>.md`; **wann** released wird, entscheidet der Nutzer. Release-Modell und Auslieferung: `_kontext/projekt.md`.

| Schritt | Wer | Ergebnis |
|---|---|---|
| 8a Umfang | Nutzer | Inhalt des Releases festgelegt |
| 8b Gesamtprüfung | Agent | alle Prüfungen grün auf `rc/<version>` |
| 8c Freigabe | Nutzer | Release freigegeben |
| 8d Ausliefern | Nutzer (+ Automatik) | `rc/<version>` in `main`, Tag `v<version>`, ausgeliefert |
| 8e Nachprüfen | Agent + Nutzer | kurzer Test des ausgelieferten Stands |
| 8f Abschluss | Agent | Anforderungen `done`, Release-Dokument abgeschlossen |

## 8a: Umfang

-   Im Release-Dokument stehen die enthaltenen Anforderungen (alle `accepted` und im Release-Kandidaten).
-   Soll eine abgenommene Anforderung doch nicht mit: der Nutzer entscheidet, wie sie wieder herauskommt (z. B. Revert im Release-Kandidaten).

## 8b: Gesamtprüfung

Die Anforderungen sind einzeln geprüft — hier wird geprüft, ob sie **zusammen** funktionieren:

-   Alle Tests, der Prüflauf und die automatischen Prüfungen aus Stufe 6 auf `rc/<version>`.
-   Kurzer Klicktest über alle enthaltenen Anforderungen (Rolle Klicktester, nur die Hauptwege).
-   Ergebnis im Release-Dokument. Befunde → betroffene Anforderung zurück in Stufe 5; neue Abnahme nur für deren Änderung.

## 8c: Freigabe

-   Der Nutzer gibt das Release ausdrücklich frei.

## 8d: Ausliefern

-   Der Nutzer führt `rc/<version>` in `main` zusammen und setzt den Tag `v<version>`; der Agent schlägt die Befehle vor.
-   Ausgeliefert wird nach `_kontext/projekt.md` bzw. dem How-to in `_kontext/` (z. B. automatisch beim Push auf `main`).

## 8e: Nachprüfen

-   Kurzer Test des ausgelieferten Stands: startet die App, funktionieren die Hauptwege.
-   Geht etwas schief: zurückrollen wie im Release-Dokument beschrieben; Befund als Anforderung (Bug) ins Backlog.

## 8f: Abschluss

-   Alle enthaltenen Anforderungen: Status `done`, Dokument nach `anforderungen/done/`.
-   Release-Dokument: Status `released`, Datum.
-   Optional: kurzer Rückblick zum Release (wie 7d).

## Abkürzung

Ist im Projekt festgelegt, dass Zusammenführen bereits ausliefert (z. B. „jeder Stand auf `main` geht live"), gibt es keinen Release-Kandidaten: Nach der Abnahme führt der Nutzer den Feature-Branch direkt in `main` zusammen; Stufe 8 besteht dann nur aus 8b (auf dem Feature-Branch), 8e und 8f, ein Release-Dokument entfällt.
