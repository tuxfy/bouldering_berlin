-   **Title** Boulder-Log
-   **Status** new

# Idee

Es fehlt der Überblick, welche Boulder geschafft wurden. Nach der Session ist oft unklar, was probiert und was geschafft wurde, und ob man besser wird.

Danach soll man während der Session in der Halle schnell mit einer Hand einen geschafften Boulder eintragen können: Halle, Schwierigkeit, Anzahl Versuche, Send, Style. Später sieht man Session und geschaffte Boulder als Liste. Die Daten bleiben auf dem Handy und funktionieren auch ohne Netz.

# Hintergrund

Ist-Stand: Das Projekt ist die gemeinsame PWA-Grundlage, noch ohne Tool. Die Shell (`app/index.html`) zeigt einen leeren Tool-Grid („Noch keine Tools"); Tools sollen als eigene Anforderungen folgen. Vorhanden sind: Service Worker für Offline-Betrieb (`app/sw.js`), Design-System als kopierte CSS (`app/vendor/designsystem/`, nur Dark Mode), zentrierte Spalte max. 480px, Touch-Ziele ≥ 44px.

Es gibt bisher **keinen** Weg von der Shell in ein Tool (keine Navigation/kein Routing) und **keinen** Datenspeicher auf dem Gerät. Boulder-Log wäre das **erste** Tool auf dieser Grundlage — beides müsste hier erstmals entstehen.

# Einordnung

-   **Art:** Feature
-   **Spielraum** (nur Angekreuztes darf sich ändern) — *Vorschlag, Nutzer bestätigt:*
    -   [x] **Darstellung** — eine neue Oberfläche (Schnell-Eingabe + Session-/Listenansicht) muss gestaltet werden.
    -   [x] **Verhalten** — die Funktion ist komplett neu (Eintragen, Anzeigen).
    -   [x] **Struktur** — ein neues Tool entsteht; dazu muss in der Shell erstmals ein Weg in ein Tool und zurück angelegt werden (Navigation/Routing-Muster).
    -   [x] **Schnittstellen/Daten** — es wird erstmals lokal auf dem Gerät gespeichert (neues Datenformat, offline).

    **Feste Grenzen** (ändern sich nicht): build-freier Ansatz (native ES-Module + Web Components, keine Laufzeit-Abhängigkeiten), nur Dark Mode, UI nur mit Tokens/Komponenten des Design-Systems, Zielformat iPhone/eine Hand. Das bestehende Aussehen und Verhalten der Shell bleibt bis auf den neuen Tool-Zugang unverändert.

-   **Weg:** Design nötig? **nein** (Nutzer-Entscheidung; Gestaltung ergibt sich aus Design-System und Refinement) · Ursache bestätigen? entfällt (Feature)

# Offene Fragen

*Werden in Stufe 3/4 beantwortet — hier nur gesammelt.*

-   **Schwierigkeit:** Welche Skala? Berliner Hallen nutzen oft Farbkreise/Hallen-Farben statt Graden (Font-Skala). Feste Auswahl, pro Halle unterschiedlich, oder frei?
-   **Halle:** Feste Liste zum Antippen, frei eintippbar, oder zuletzt genutzte vorausgewählt?
-   **Send & Versuche:** Was bedeutet „Send" genau (geschafft ja/nein, Flash = 1. Versuch)? Wie verhält sich das zu „Anzahl Versuche"? Werden nur geschaffte oder auch nur probierte Boulder erfasst?
-   **Style:** Welche Werte (z. B. Slab, Overhang, Dyno, Crimp …) und wie viele? Ein Wert oder mehrere pro Boulder? Pflicht oder optional?
-   **Session:** Wie wird eine Session abgegrenzt — automatisch über Datum/Zeit oder manuell gestartet/beendet?
-   **Fortschritt:** Gehört eine Fortschritts-/Statistikansicht („werde ich besser?") schon dazu oder vorerst nur die Liste? (→ ggf. Abgrenzung)
-   **Korrigieren:** Lassen sich Einträge bei Fehleingabe bearbeiten oder löschen?
-   **Datensicherheit:** „Bleiben auf dem Handy" — Risiko Datenverlust beim Leeren des Browser-Speichers; ist ein Export/Backup gewünscht oder bewusst außen vor?

# Design-Brief

*Entfällt — kein Design-Schritt (Stufe 3) für diese Anforderung.*

# Entscheidungen

-   *(folgen aus Stufe 3/4)*

# Verhalten

*(Stufe 4)*

# Akzeptanzkriterien

*(Stufe 4)*

# Abgrenzung

-   *(folgt; abhängig von „Fortschritt" und „Datensicherheit" oben)*

# Technische Notizen

*Optional, nicht bindend.*

# Umsetzungsplan

*Vom Agenten in Stufe 5 (5b) geschrieben, vom Nutzer freigegeben.*

# Testnachweis

*Vom Agenten in Stufe 5 ergänzt.*

# QA

*Vom Agenten in Stufe 6 ergänzt.*

# Abnahme

*In Stufe 7 ergänzt.*
