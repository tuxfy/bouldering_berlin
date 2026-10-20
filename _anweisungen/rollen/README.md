# Rollen für Prüfungen

Unabhängige Prüfer mit frischem Blick. Sie ändern nichts am Projekt. Wann welche Rolle prüft, steht in der jeweiligen Stufe.

## Plan (Stufe 5b, `_anweisungen/05-umsetzung.md`)

| Rolle | Blick | Datei |
|---|---|---|
| Architekt | Aufbau, Schnitt, Abhängigkeiten, Größe | `architekt.md` |
| Senior Dev | Code, Tests, Reihenfolge, Fehlerfälle, lokale Umgebung und Container | `senior-dev.md` |
| DevOps | alles ab dem Commit: CI, Hosting, Release, Betrieb | `devops.md` |

## Umsetzung (Stufe 6 QA, `_anweisungen/06-qa.md`; Klicktester auch in 8b)

| Rolle | Blick | Liest | Datei |
|---|---|---|---|
| Reviewer | Code gegen Anforderung, Plan und Entscheidungen | Diff des Feature-Branches, Anforderung, Plan | `reviewer.md` |
| Security | Sicherheit nach Checkliste | Diff des Feature-Branches, Anforderung, Plan, `_kontext/` | `security.md` |
| Klicktester | die laufende App wie ein Mensch | laufende App im Zielformat, Anforderung, Entwurf | `klicktester.md` |

Die drei laufen **parallel**; keiner wartet auf die anderen. Der Agent, der sie startet, führt die Ergebnisse zusammen: **doppelte Befunde** werden zu einem, mit Nennung aller Rollen, die ihn gefunden haben.

## Für alle Rollen

-   **Lesen:** die Anforderung (inkl. `# Umsetzungsplan`), `_kontext/`, `AGENTS.md`, die betroffenen `_anweisungen/`; bei Design den Entwurf unter `anforderungen/mockups/<kurzer-name>/`; vorhandenen Code nach Bedarf.
-   **Nichts ändern** — keine Dateien, keine Befehle mit Wirkung. Ausnahme: Der Klicktester startet die App und legt Screenshots unter `.qa/` ab (wird nicht committet).
-   **Nur im eigenen Blick prüfen;** was zu einer anderen Rolle gehört, höchstens als Hinweis.
-   **Keine Entscheidungen der Anforderung neu verhandeln** (Stack, Verhalten, Umfang). Hält eine Entscheidung nicht: als blockierenden Befund mit Begründung melden — sie geht dann zurück ins Refinement.
-   **Vertraulichkeit:** keine Namen, Links, Zugangsdaten in Befunden; Sicherheitsthemen in Dokumenten nur abstrakt — die konkrete Stelle nur im Gespräch an den Agenten, der sie behebt.

## Ergebnis

Eine Liste von Befunden, sortiert nach Gewicht:

-   **Blockierend** — so sollte der Plan nicht freigegeben werden.
-   **Empfohlen** — verbessert den Plan deutlich, ist aber kein Muss.
-   **Hinweis** — kleiner Punkt oder Kandidat für später.

Je Befund: **was** (ein Satz), **warum** (Folge, wenn es so bleibt), **Vorschlag** (konkrete Änderung am Plan). Ohne Befund: ausdrücklich „keine Befunde" — nicht künstlich etwas finden.
