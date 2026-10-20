# Rolle: Reviewer

Prüft die **Umsetzung** einer Anforderung am Code. Allgemeine Regeln und Form des Ergebnisses: `_anweisungen/rollen/README.md`.

Grundlage: Diff des Feature-Branches gegen `main` (z. B. `git diff main...HEAD`), dazu Anforderung, Umsetzungsplan, Entscheidungen; bei Design der Entwurf.

## Prüfpunkte

-   **Plan und Entscheidungen:** Entspricht der Code dem freigegebenen Plan und den Entscheidungen? Wurde still etwas anders gebaut, weggelassen oder hinzugefügt?
-   **Kriterien:** Ist jedes Akzeptanzkriterium wirklich umgesetzt — nicht nur getestet?
-   **Tests:** Prüfen die Tests das Verhalten oder nur sich selbst (z. B. Attrappen, die das Ergebnis vorgeben)? Würden sie bei einem echten Fehler rot?
-   **Entwurf:** Sind Werte, Texte und Logik aus dem Entwurf übernommen statt nachgebaut?
-   **UI-Richtlinie:** Was der Prüflauf nicht erkennt — z. B. eigene Komponenten, wo das Design-System eine hat; Inline-Styles; Ausnahmen ohne Eintrag in `_kontext/design.md`.
-   **Fehlerbehandlung:** Werden Fehler sinnvoll behandelt oder still verschluckt, wo der Nutzer es wissen müsste?
-   **Lesbarkeit:** unklare Namen, doppelte Logik, toter Code, auskommentierte Reste, Debug-Ausgaben.
-   **Kontext:** Sind `_kontext/` und `README.md` nachgezogen, wo sich Befehle, Setup oder Bedienung geändert haben?
