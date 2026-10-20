# Stufe 4: Refinement

Aus der geklärten (und ggf. entworfenen) Idee wird eine **umsetzbare Anforderung**. Am Ende setzt der **Nutzer** den Status auf `refined`.

## Was der Agent macht

1.  **Entscheidungen bündeln** — alles, was in Klärung, Entwurf und hier festgelegt wird, in den Abschnitt „Entscheidungen" (je Punkt kurz: was, ggf. warum). Beantwortete Fragen wandern aus „Offene Fragen" dorthin. Dabei prüfen, ob Hintergrund und Design-Brief noch zum aktuellen Stand passen — besonders nach einer Auffrischung des Design-Systems (z. B. Verweise auf Teile, die es nicht mehr gibt).
2.  **Technik klären** — vor `refined`, damit in der Umsetzung keine Architekturentscheidung ohne den Nutzer fällt. Grundlage sind die Festlegungen aus Stufe 0 in `_kontext/projekt.md`; hier nur, was **diese Anforderung** zusätzlich braucht oder wo sie abweicht, soweit relevant:
    -   Neue Bausteine, Bibliotheken oder Werkzeuge?
    -   Wie werden Daten gespeichert?
    -   Welche externen Abhängigkeiten gibt es (Schnittstellen, Dienste, Bibliotheken, auch Hosting und Auslieferung)? Für jede: ist das How-to bekannt oder muss es vor der Umsetzung geklärt werden?
    -   Was lässt sich nur am echten Gerät prüfen?

    Fehlt in `_kontext/projekt.md` etwas Grundlegendes (Stack, Prüfungen, Auslieferung, Abnahme): nicht in der Anforderung entscheiden, sondern Stufe 0 für diesen Teil nachholen.

    Der Agent schlägt vor, **der Nutzer entscheidet**. Ergebnis in „Entscheidungen".
3.  **Verhalten beschreiben** — was der Nutzer sieht und tut, aus seiner Sicht. Bei Design aus dem Entwurf.
4.  **Akzeptanzkriterien** — jedes prüfbar und abgrenzbar. Standardmäßig enthalten:
    -   Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot
    -   Nach der Umsetzung laufen alle Tests grün
    -   UI-Richtlinie eingehalten (nur Tokens und Komponenten des Design-Systems, keine festen Werte, keine Inline-Styles) — Prüflauf grün
    -   Bei Design: Entwurf umgesetzt, Werte und Logik aus der abgelegten Quelle übernommen
    -   `README.md` ergänzt — nur wenn sich Setup, Konfiguration oder Bedienung ändern
5.  **Teststrategie** — je Kriterium, wie es geprüft wird: Unit-Test, E2E-Test oder manuell (z. B. am Gerät).
6.  **Abgrenzung** — was ausdrücklich **nicht** dazugehört (ggf. mit Verweis auf eigene Ideen im Backlog).
7.  **Technische Notizen** — erlaubt, aber nicht bindend (z. B. betroffene Dateien, Hinweise für die Umsetzung).
8.  **Größe prüfen** — passt die Anforderung in einen Umsetzungsdurchgang? Wenn nicht: aufteilen, Teile als eigene Anforderungen im Backlog.

## Definition of Ready

`refined` erst, wenn alles erfüllt ist:

-   [ ] Keine offenen Fragen
-   [ ] Entscheidungen festgehalten, inkl. Technik; Grundlegendes steht in `_kontext/projekt.md` (Stufe 0)
-   [ ] Verhalten beschrieben
-   [ ] Jedes Akzeptanzkriterium prüfbar und mit Teststrategie
-   [ ] Abgrenzung formuliert
-   [ ] Bei Design: Entwurf freigegeben und abgelegt
-   [ ] Größe passt
-   [ ] **Nutzer setzt den Status auf `refined`**

## Übergang

-   Bei `refined` wandert das Dokument von `anforderungen/backlog/` nach `anforderungen/` — **ohne Nummer**, Dateiname bleibt `<kurzer-name>.md`.
-   Die Nummer wird erst beim **„Go"** vergeben (Stufe 5).
