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
| 1. Idee oder Bug | `idea` / `bug` | `_anweisungen/01-idee.md` |
| 2. Klärung | `new` | `_anweisungen/02-klaerung.md` |
| 3. Design *(nur bei Bedarf)* | `new` | `_anweisungen/03-design.md` |
| 4. Refinement | `new` → `refined` | `_anweisungen/04-refinement.md` |
| 5. Umsetzung | `in progress` | `_anweisungen/05-umsetzung.md` |
| 6. QA | `qa` | `_anweisungen/06-qa.md` |
| 7. Abnahme | `review` → `accepted` | `_anweisungen/07-abnahme.md` |
| 8. Release *(mehrere Anforderungen)* | `accepted` → `done` | `_anweisungen/08-release.md` |

Branches — `main` ist beim Hoster geschützt; dorthin gelangt alles nur per Pull Request:

| Branch | Zweck | Weg nach `main` |
|---|---|---|
| `backlog` | neue Ideen und Bugs (Stufe 1) | Pull Request, Nutzer führt zusammen |
| `feature/<kurzer-name>` bzw. `fix/<kurzer-name>` | eine Anforderung ab ihrer Aufnahme (Stufe 2) bis zur Abnahme: Dokument, Plan, Code, QA | Pull Request in `rc/<version>` (Stufe 6/7) |
| `rc/<version>` | Release-Kandidat: abgenommene Anforderungen, Release-Dokument | Pull Request nach `main` (Stufe 8), danach Tag `v<version>` |
| `release/<version>-abschluss` | Abschluss nach dem Ausliefern: Status `done`, Release `released` | Pull Request |

Ist im Projekt „Zusammenführen = Ausliefern" festgelegt, entfällt der Release-Kandidat (siehe `08-release.md`, Abkürzung).

## Regeln

-   **Vor der Arbeit an einer Stufe** die zugehörige Anweisungsdatei lesen.
-   **Vor jeder Arbeit am Projekt** `_kontext/projekt.md` lesen, bei Design-Arbeit zusätzlich `_kontext/design.md`. Ist `_kontext/projekt.md` noch nicht ausgefüllt: zuerst Stufe 0.
-   Eine Stufe wird erst begonnen, wenn die vorherige abgeschlossen ist.
-   **Meldet der Nutzer einen Fehler oder Wunsch: zuerst als Bug bzw. Idee festhalten** (`_anweisungen/01-idee.md`) — nicht sofort beheben. Code entsteht nur für eine Anforderung nach ihrem „Go" (Stufe 5).
-   **Abgenommene und abgeschlossene Anforderungsdokumente** (`accepted`, `done`) werden nicht mehr geändert; Nachträge gehören in eine neue Anforderung.
-   **Tests werden nie abgeschwächt,** um grün zu werden (Prüfung entfernt, nur bedingt ausgeführt, Erwartung gelockert). Passt ein Test nicht mehr zur Umgebung: die Umgebung des Tests anpassen, nicht die Prüfung.
-   **Am Ende jeder Stufe** sagt der Agent dem Nutzer kurz: was erledigt ist, was als Nächstes kommt (Stufe bzw. Schritt und Anweisungsdatei) und was der Nutzer dafür tun oder entscheiden muss (z. B. Status setzen, freigeben, committen).
-   **Abhängigkeiten und Werkzeuge** (Pakete, Browser für Tests u. ä.) installiert der Agent **selbst in seiner Umgebung** (z. B. im Container), nach Rückfrage — nie auf dem Rechner des Nutzers und nie als Aufgabe an den Nutzer.
    -   Neue Pakete nur, wenn sie im freigegebenen Umsetzungsplan stehen.
    -   Die Lock-Datei (z. B. `package-lock.json`) ändert sich nur durch genau diese Installation; sonst wird aus ihr installiert (z. B. `npm ci`).
-   **Git:** Der Agent committet und pusht Arbeits-Branches selbst und eröffnet Pull Requests; **zusammenführen und taggen nur der Nutzer** — siehe Abschnitt „Commits".
-   **Kennung** einer Anforderung ist ihr kurzer Name (Dateiname im Backlog). Die **Nummer** wird erst beim „Go" vergeben (nur im Dateinamen, der Branch behält den kurzen Namen): höchste vergebene Nummer in `anforderungen/` und `anforderungen/done/` + 1, dreistellig mit führenden Nullen (`007-boulder-log.md`); Nummern werden nie wiederverwendet.

## Commits

Format: Conventional Commits mit dem kurzen Namen als Scope — `<typ>(<kurzer-name>): <details>`, `typ` ∈ `feat`, `fix`, `test`, `refactor`, `chore`, `design`; bricht eine Änderung Bestehendes: `!` nach dem Scope. Für Prozess-Dokumente ohne Code: `chore(<kurzer-name>): …`.

**Der Agent committet selbst** (ohne Rückfrage), nur an diesen Stellen:

| Stelle | Branch | Inhalt |
|---|---|---|
| Neue Idee bzw. neuer Bug (Stufe 1) | `backlog` | Eintrag im Backlog |
| Nach Klärung, Design-Übergabe, Refinement (Stufen 2–4) | Feature-Branch | Anforderungsdokument, Entwurf, ggf. `_kontext/` |
| Nach freigegebenem Plan (5b) | Feature-Branch | Plan im Anforderungsdokument |
| Nach jedem grünen Schritt des Plans (5c–5e) | Feature-Branch | Code, Tests, Testnachweis |
| Je Korrektur in der QA (6c) | Feature-Branch | Korrektur mit ihrem Test |
| Nach der Abnahme (7c, 7d) | Feature-Branch | Status `accepted`, Rückblick |
| Im Release (8a, 8b) | `rc/<version>` | Release-Dokument |
| Nach dem Ausliefern (8f) | `release/<version>-abschluss` | Status `done`, Release `released` |

-   **Leitplanken** (in Stufe 0 festgelegt, im Grundgerüst eingerichtet): Vor jedem Commit laufen alle Prüfungen (ein Befehl) und die Prüfung des Commit-Formats. Der Agent umgeht sie nie (z. B. kein `--no-verify`).
-   Ein Commit mit rotem Test gibt es nicht: In 5c wird der rote Test nachgewiesen, committet wird erst der grüne Schritt.
-   **Pushen:** Der Agent pusht nur die Branches aus der Tabelle oben (nie `main`, nie Tags) und eröffnet die Pull Requests — mit kurzer Beschreibung, was drin ist, und Verweis auf das Anforderungs- bzw. Release-Dokument.
-   **Zusammenführen und Tags: nur der Nutzer** — Zusammenführen im Pull Request beim Hoster (erst bei grüner CI möglich), den Tag `v<version>` setzt und pusht er nach dem Release-Pull-Request. Erst damit wird ausgeliefert.
-   **Grün heißt grün in der CI.** Ein lokales Grün reicht nicht für Abnahme oder Tag; maßgeblich ist der CI-Lauf auf dem gepushten Branch.
-   Verlauf nicht umschreiben (kein Rebase, kein Reset, kein Amend).
-   **Git-Befehle:** Branch wechseln oder anlegen **nur mit `git switch`** (`git switch <branch>`, `git switch -c <branch>`); Datei auf den letzten Commit zurücksetzen mit `git restore <datei>` (fragt nach). **Nicht verwenden** — in der Umgebung des Agenten gesperrt, Versuche kosten nur Zeit: `git checkout`, `git merge`, `git tag`, Push von `main` oder Tags, `--force`, `git rebase`, `git reset`, `git stash`, `git cherry-pick`, `git commit --amend`, `git commit --no-verify`, `git -c …`.

## UI-Richtlinie

Damit die App einheitlich aussieht, gilt bei **jeder** UI-Arbeit — mit oder ohne Stufe 3:

-   **Das Design-System ist die Richtlinie.** UI nur mit seinen Tokens und Komponenten; seine README-Regeln gelten.
-   **Keine festen Werte** für Farben, Maße, Abstände, Radien oder Schriftgrößen im App-Code — nur Tokens.
-   **Keine Inline-Styles** — Gestaltung steht nur in Stylesheets, damit sie prüfbar bleibt.
-   **Prüflauf:** Die Prüf-Konfiguration liegt in `_anweisungen/pruefung/` und läuft mit den Tests (im Container und in der CI). **Ausnahme** nur mit Markierung an der Stelle (mit Grund) und Eintrag in `_kontext/design.md`.
-   **Fehlt etwas im Design-System:** in `_kontext/design.md` benennen, im Projekt vorerst lokal umsetzen (mit Tokens), als Idee für das Design-System vermerken.
-   **Das Design-System wird im Projekt nie bearbeitet.**
