# Agent Guidelines

Prozess von der Idee bis zum Release — unabhängig von Sprache, Framework und Werkzeugen.

## Ordner

| Ordner | Inhalt | Gehört |
|---|---|---|
| `_anweisungen/` | **Wie** gearbeitet wird: eine Datei je Stufe, dazu `vorlagen/` und `pruefung/` (Prüflauf der UI-Richtlinie) | Template — im Projekt nicht ändern |
| `_kontext/` | **Was** man über das Projekt wissen muss (Stack, Befehle, …) | Projekt |
| `anforderungen/backlog/` | Ideen und Anforderungen in Klärung/Refinement, ohne Nummer | Projekt |
| `anforderungen/` | `refined` (ohne Nummer) und in Umsetzung (mit Nummer) | Projekt |
| `anforderungen/done/` | abgeschlossene Anforderungen | Projekt |

## Ablauf

| Stufe | Status | Anweisung |
|---|---|---|
| 1. Idee | `idea` | `_anweisungen/01-idee.md` |
| 2. Klärung | `new` | `_anweisungen/02-klaerung.md` |
| 3. Design *(nur bei Bedarf)* | `new` | `_anweisungen/03-design.md` |
| 4. Refinement | `new` → `refined` | `_anweisungen/04-refinement.md` |
| 5. Umsetzung bis Release | `in progress` → `review` → `done` | `_anweisungen/05-umsetzung.md` |

## Regeln

-   **Vor der Arbeit an einer Stufe** die zugehörige Anweisungsdatei lesen.
-   **Vor jeder Arbeit am Projekt** `_kontext/projekt.md` lesen, bei Design-Arbeit zusätzlich `_kontext/design.md`.
-   Eine Stufe wird erst begonnen, wenn die vorherige abgeschlossen ist.
-   **Der Agent committet nie** — Commits macht der Nutzer. Format der Commit-Nachricht: siehe `_anweisungen/05-umsetzung.md`.
-   **Kennung** einer Anforderung ist ihr kurzer Name (Dateiname im Backlog). Die **Nummer** wird erst beim „Go" vergeben: höchste vergebene Nummer in `anforderungen/` und `anforderungen/done/` + 1, dreistellig mit führenden Nullen (`007-boulder-log.md`); Nummern werden nie wiederverwendet.

## UI-Richtlinie

Damit die App einheitlich aussieht, gilt bei **jeder** UI-Arbeit — mit oder ohne Stufe 3:

-   **Das Design-System ist die Richtlinie.** UI nur mit seinen Tokens und Komponenten; seine README-Regeln gelten.
-   **Keine festen Werte** für Farben, Maße, Abstände, Radien oder Schriftgrößen im App-Code — nur Tokens.
-   **Keine Inline-Styles** — Gestaltung steht nur in Stylesheets, damit sie prüfbar bleibt.
-   **Prüflauf:** Die Prüf-Konfiguration liegt in `_anweisungen/pruefung/` und läuft mit den Tests (im Container und in der CI). **Ausnahme** nur mit Markierung an der Stelle (mit Grund) und Eintrag in `_kontext/design.md`.
-   **Fehlt etwas im Design-System:** in `_kontext/design.md` benennen, im Projekt vorerst lokal umsetzen (mit Tokens), als Idee für das Design-System vermerken.
-   **Das Design-System wird im Projekt nie bearbeitet.**
