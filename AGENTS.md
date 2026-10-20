# Agent Guidelines

Prozess von der Idee bis zum Release — unabhängig von Sprache, Framework und Werkzeugen.

## Ordner

| Ordner | Inhalt | Gehört |
|---|---|---|
| `_anweisungen/` | **Wie** gearbeitet wird: eine Datei je Stufe, dazu `vorlagen/`, `pruefung/` (Prüflauf der UI-Richtlinie) und `rollen/` (Prüfer des Umsetzungsplans) | Template — im Projekt nicht ändern |
| `.claude/agents/` | Prüfer-Rollen als Unteragenten für Claude Code; verweisen auf `_anweisungen/rollen/` | Template — im Projekt nicht ändern |
| `_kontext/` | **Was** man über das Projekt wissen muss (Stack, Befehle, …) | Projekt |
| `anforderungen/backlog/` | Ideen und Anforderungen in Klärung/Refinement, ohne Nummer | Projekt |
| `anforderungen/` | `refined` (ohne Nummer) und ab Umsetzung bis zum Release (mit Nummer) | Projekt |
| `anforderungen/done/` | abgeschlossene (releaste) Anforderungen | Projekt |
| `releases/` | ein Dokument je Release: Inhalt, Gesamtprüfung, Zurückrollen | Projekt |

## Ablauf

| Stufe | Status | Anweisung |
|---|---|---|
| 0. Projekt einrichten *(einmal, bei Bedarf erneut)* | — | `_anweisungen/00-einrichtung.md` |
| 1. Idee | `idea` | `_anweisungen/01-idee.md` |
| 2. Klärung | `new` | `_anweisungen/02-klaerung.md` |
| 3. Design *(nur bei Bedarf)* | `new` | `_anweisungen/03-design.md` |
| 4. Refinement | `new` → `refined` | `_anweisungen/04-refinement.md` |
| 5. Umsetzung | `in progress` | `_anweisungen/05-umsetzung.md` |
| 6. QA | `qa` | `_anweisungen/06-qa.md` |
| 7. Abnahme | `review` → `accepted` | `_anweisungen/07-abnahme.md` |
| 8. Release *(mehrere Anforderungen)* | `accepted` → `done` | `_anweisungen/08-release.md` |

Branches: je Anforderung `feature/<Nr>-<kurzer-name>` von `main`; nach der Abnahme in den Release-Kandidaten `rc/<version>`; beim Release nach `main` mit Tag `v<version>`. Ist im Projekt „Zusammenführen = Ausliefern" festgelegt, entfällt der Release-Kandidat (siehe `08-release.md`, Abkürzung).

## Regeln

-   **Vor der Arbeit an einer Stufe** die zugehörige Anweisungsdatei lesen.
-   **Vor jeder Arbeit am Projekt** `_kontext/projekt.md` lesen, bei Design-Arbeit zusätzlich `_kontext/design.md`. Ist `_kontext/projekt.md` noch nicht ausgefüllt: zuerst Stufe 0.
-   Eine Stufe wird erst begonnen, wenn die vorherige abgeschlossen ist.
-   **Am Ende jeder Stufe** sagt der Agent dem Nutzer kurz: was erledigt ist, was als Nächstes kommt (Stufe bzw. Schritt und Anweisungsdatei) und was der Nutzer dafür tun oder entscheiden muss (z. B. Status setzen, freigeben, committen).
-   **Abhängigkeiten und Werkzeuge** (Pakete, Browser für Tests u. ä.) installiert der Agent **selbst in seiner Umgebung** (z. B. im Container), nach Rückfrage — nie auf dem Rechner des Nutzers und nie als Aufgabe an den Nutzer.
    -   Neue Pakete nur, wenn sie im freigegebenen Umsetzungsplan stehen.
    -   Die Lock-Datei (z. B. `package-lock.json`) ändert sich nur durch genau diese Installation; sonst wird aus ihr installiert (z. B. `npm ci`).
-   **Der Agent committet nie** — Commits, Zusammenführen und Tags macht der Nutzer; Branches anlegen und wechseln darf der Agent. Format der Commit-Nachricht: siehe `_anweisungen/05-umsetzung.md`.
-   **Kennung** einer Anforderung ist ihr kurzer Name (Dateiname im Backlog). Die **Nummer** wird erst beim „Go" vergeben: höchste vergebene Nummer in `anforderungen/` und `anforderungen/done/` + 1, dreistellig mit führenden Nullen (`007-boulder-log.md`); Nummern werden nie wiederverwendet.

## UI-Richtlinie

Damit die App einheitlich aussieht, gilt bei **jeder** UI-Arbeit — mit oder ohne Stufe 3:

-   **Das Design-System ist die Richtlinie.** UI nur mit seinen Tokens und Komponenten; seine README-Regeln gelten.
-   **Keine festen Werte** für Farben, Maße, Abstände, Radien oder Schriftgrößen im App-Code — nur Tokens.
-   **Keine Inline-Styles** — Gestaltung steht nur in Stylesheets, damit sie prüfbar bleibt.
-   **Prüflauf:** Die Prüf-Konfiguration liegt in `_anweisungen/pruefung/` und läuft mit den Tests (im Container und in der CI). **Ausnahme** nur mit Markierung an der Stelle (mit Grund) und Eintrag in `_kontext/design.md`.
-   **Fehlt etwas im Design-System:** in `_kontext/design.md` benennen, im Projekt vorerst lokal umsetzen (mit Tokens), als Idee für das Design-System vermerken.
-   **Das Design-System wird im Projekt nie bearbeitet.**
