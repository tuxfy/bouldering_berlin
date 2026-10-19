-   **Title** Kurzer Titel
-   **Status** idea | new | refined | in progress | review | done

# Idee

*(unverändert aus der Idee übernommen)*

# Hintergrund

Ist-Stand: Wie funktioniert der betroffene Teil heute? Bei Bugs: beobachtetes Fehlverhalten.

# Einordnung

-   **Art:** Feature | Bug | Design | technisch
-   **Spielraum** (nur Angekreuztes darf sich ändern):
    -   [ ] Darstellung
    -   [ ] Verhalten
    -   [ ] Struktur
    -   [ ] Schnittstellen/Daten
-   **Weg:** Design nötig? ja/nein · Ursache bestätigen? ja/nein/entfällt

# Offene Fragen

-   ...

# Design-Brief

*Nur wenn Design nötig (siehe `_anweisungen/03-design.md`).*

-   **Ziel:**
-   **Ist-Stand:**
-   **Spielraum:** (aus Einordnung)
-   **Feste Grenzen:**
-   **Design-System:** System · benötigte Komponenten/Tokens · Zuordnungen aus `_kontext/design.md`
-   **Rahmen:**
-   **Lücken:**

# Entscheidungen

-   ...

# Verhalten

Was der Nutzer sieht und tut.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| ... | Unit / E2E / manuell |
| Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot | Testlauf |
| Nach der Umsetzung laufen alle Tests grün | Testlauf |
| UI-Richtlinie eingehalten (nur Tokens und Komponenten des Design-Systems) | Review / Test |
| *(bei Design)* Entwurf umgesetzt, Werte und Logik aus der Quelle übernommen | manuell |

# Abgrenzung

-   ...

# Technische Notizen

*Optional, nicht bindend.*

# Umsetzungsplan

*Vom Agenten in Stufe 5 (5b) geschrieben, vom Nutzer freigegeben.*

1.  **Schritte:**
2.  **Betroffene Dateien:**
3.  **Testfälle:**
4.  **Entwurf → Code** *(bei Design)*:
5.  **Externe Abhängigkeiten** (How-to wo?):
6.  **Annahmen und Risiken:**
7.  **Nicht angefasst:**

# Testnachweis

*Vom Agenten in Stufe 5 ergänzt.*

-   **Rot** (vor der Änderung): `<Befehl>` — <n> bestanden / <m> fehlgeschlagen; rot: `<Testname>`, …
-   **Grün** (nach der Änderung): `<Befehl>` — <n> bestanden / 0 fehlgeschlagen
-   **UI-Richtlinie:** `<Befehl>` — 0 Befunde; Ausnahmen: <keine | Liste> *(lief der Prüflauf nicht: Grund und manuelle Prüfung)*
