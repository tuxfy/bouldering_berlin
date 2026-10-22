# Stufe 0: Projekt einrichten

Legt **einmal** fest, wie im Projekt gebaut, geprüft, abgenommen und ausgeliefert wird. Alle späteren Stufen lesen diese Festlegungen aus `_kontext/` statt sie je Anforderung neu zu klären.

**Es wird nichts eingerichtet** — keine Pakete, keine Konfiguration, kein Code. Das Einrichten ist die **erste Anforderung** und läuft wie jede andere durch den Prozess (mit Plan, Prüfern, QA und Abnahme).

## Wann

-   **Neues Projekt:** vor der ersten Idee, die umgesetzt werden soll.
-   **Bestehendes Projekt:** Vorhandenes erkennen und als Ist-Stand vorschlagen (z. B. vorhandene Test-Werkzeuge, CI, Auslieferung) — nicht neu erfinden. Lücken zu den Standardprüfungen benennen.
-   **Erneut,** wenn sich Grundlegendes ändert (z. B. neuer Stack, anderes Release-Modell). Dann nur den betroffenen Teil; daraus entsteht eine Anforderung für die Umstellung.

## Was festgelegt wird

Der Agent schlägt vor, mit kurzer Begründung; **der Nutzer entscheidet** (so fragen wie in `_anweisungen/02-klaerung.md`). Ergebnis in `_kontext/projekt.md`, Design-System in `_kontext/design.md`.

1.  **Zweck** — wofür das Projekt da ist, in zwei, drei Sätzen.
2.  **Stack** — Sprache, Framework, Build (oder keiner), Laufzeit-Abhängigkeiten.
3.  **Zielformat** — Geräte, Bildschirmgrößen, Ausrichtung, hell/dunkel, Sprache, Barrierefreiheit. Gilt für Entwurf, Tests und Klicktest.
4.  **Design-System** — welches, und wie es zur Laufzeit in die App kommt (z. B. welche Dateien, ob kopiert wird; dann Kopierbefehl).
5.  **Prüfungen** — je Kategorie das passende Werkzeug für den Stack (siehe „Standardprüfungen").
6.  **Ein Befehl für alles** — alle Prüfungen laufen mit einem Befehl, lokal in der Umgebung des Agenten und in der CI gleich.
7.  **Umgebung des Agenten** — wo der Agent arbeitet und testet (z. B. Container), was dort verfügbar sein muss.
8.  **Auslieferung und Release** — wohin ausgeliefert wird (Rolle „Hoster", How-to in `_kontext/`), Release-Modell (Release-Kandidat oder „Zusammenführen nach `main` = Ausliefern", siehe `_anweisungen/08-release.md`), Zurückrollen.
9.  **Abnahme** — wo und wie der Nutzer abnimmt (lokal, Befehl) und was nur am echten Gerät geprüft werden kann (dann beim Nachprüfen nach dem Release).

## Standardprüfungen

Kategorien, unabhängig vom Stack. Welches Werkzeug, entscheidet der Stack; Konfigurationen nur, wo das Template eine eigene Regel hat.

| Kategorie | Standard | Hinweis |
|---|---|---|
| Code-Linter | immer | Fehler und Stil im Code (z. B. ESLint bei JavaScript) |
| Formatierer | immer | mit Standardeinstellungen, keine eigene Konfiguration (z. B. Prettier) |
| Prüflauf UI-Richtlinie | bei UI | Konfiguration aus `_anweisungen/pruefung/` |
| Unit-Tests | immer | Logik ohne Oberfläche |
| E2E-Tests | bei UI | im Zielformat |
| Schwachstellen in Abhängigkeiten | immer | **ausgelieferte** Abhängigkeiten blockieren (z. B. `npm audit --omit=dev`); **Entwicklungswerkzeuge** nur als Warnung (voller Audit, blockiert nicht) |
| Geheimnisse im Code | immer | Suche nach Zugangsdaten, Schlüsseln, Tokens |
| Barrierefreiheit | optional bei UI | z. B. axe in den E2E-Tests |
| Git-Hook vor dem Commit | immer | führt alle Prüfungen (ein Befehl) aus; Commit nur bei grün |
| Commit-Format | immer | prüft Conventional Commits mit Scope (z. B. commitlint) |

Abweichungen (eine Kategorie bewusst weglassen) mit Grund in `_kontext/projekt.md`.

Im Grundgerüst werden Werkzeuge in aktuellen Versionen eingerichtet; Warnungen des vollen Audits werden dabei zuerst durch Aktualisieren behoben, erst danach hingenommen.

## Ergebnis

-   `_kontext/projekt.md` (und `_kontext/design.md`) ausgefüllt; offene Punkte ausdrücklich als offen markiert.
-   **Erste Anforderung** `anforderungen/backlog/grundgeruest.md` (Vorlage `_anweisungen/vorlagen/anforderung.md`, Status `new`): Einrichten von allem, was Stufe 0 festgelegt hat. Die Entscheidungen verweisen auf `_kontext/projekt.md`; weiter mit Stufe 4 (Refinement) — Klärung und Design entfallen in der Regel.
-   Bei einem bestehenden Projekt: nur für die Lücken eine Anforderung (z. B. `pruefungen-ergaenzen`).
