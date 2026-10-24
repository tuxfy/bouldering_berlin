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

-   **Weg:** Design nötig? **ja** (→ Stufe 3; neue, nicht-triviale Oberfläche) · Ursache bestätigen? entfällt (Feature)

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

*3a — vom Nutzer zu bestätigen. Hält fest, wovon der Entwurf ausgeht.*

-   **Ziel:** Während der Session in der Halle einen geschafften (oder probierten) Boulder schnell mit **einer Hand** eintragen — Halle, Schwierigkeit, Versuche, Send, Style — und später Session und Einträge als **Liste** sehen. Grundlage, um Überblick zu behalten.

-   **Ist-Stand:** Kein Tool vorhanden. Die Shell zeigt einen leeren Tool-Grid; es gibt noch keinen Weg in ein Tool und keinen lokalen Speicher. Boulder-Log ist das erste Tool.

-   **Spielraum:** (aus Klärung) Darstellung · Verhalten · Struktur · Schnittstellen/Daten — alle vier. Feste Grenzen: build-frei (native ES-Module/Web Components, keine Laufzeit-Abhängigkeiten), nur Dark Mode, UI nur mit Tokens/Komponenten des Design-Systems, iPhone/eine Hand.

-   **Feste Grenzen** (Felder, Wertebereiche, Zustände, Texte):
    -   **Felder je Eintrag:**
        -   **Schwierigkeit** — **Font-Skala**, feste geordnete Liste zum Antippen: `3, 4, 5a, 5b, 5c, 6a, 6a+, 6b, 6b+, 6c, 6c+, 7a, 7a+, 7b, 7b+, 7c, 7c+, 8a` (Pflicht).
        -   **Versuche (tries)** — Ganzzahl ≥ 1, über **Stepper** (128×44). Standard 1.
        -   **Send** — Zustand geschafft ja/nein (Toggle, vgl. `.btn-send`). Geschaffte Boulder werden mit `(send)` versehen; auch **nicht** geschaffte (nur probierte) Boulder lassen sich eintragen. Flash ablesbar, wenn Send **und** tries = 1.
        -   **Style** — **vordefinierte Tags**, mehrere wählbar, **optional**: `slab, vertical, overhang, roof, dyno, crimp, sloper, pinch, jug, technical, powerful` (ToggleChip). *(Liste ist Content, steht in `_context/design.md`)*
    -   **Keine Halle** in dieser Version (keine Hallen-Auswahl, keine SubBar).
    -   **Datenformat** (maschinenlesbar, englisch, aus DS Content Fundamentals): Log-Zeile `- 6b+: 4 tries (send) - sloper, dyn`; ohne Send entfällt `(send)`, ohne Style der Teil nach `-`.
    -   **Session:** genau **eine aktuelle** Session/Liste — **kein Datum, keine Historie**. **Reset** leert die Liste vollständig (destruktiv → **ConfirmSheet** „Alle Einträge löschen?" / Button „Löschen"). Reset als Sekundär-Aktion im ToolHeader (Glyphe `↺`).
    -   **Zustände:** leer (noch keine Einträge, Hinweistext); Eingabe (Schnell-Eintrag); Liste der Einträge; einzelner Eintrag löschbar; Reset (alle löschen) → ConfirmSheet.
    -   **Texte:** Deutsch, Fachbegriffe englisch („send", „Boulder Log", „tries", Style-Tags). Werkzeug-Ton, knapp.

-   **Design-System:** „Bouldering Berlin Toolkit" (Kopie unter `app/vendor/designsystem/`, Stand `443d530`). Voraussichtlich gebrauchte Komponenten/Tokens:
    -   **navigation:** `ToolHeader` (Titel „Boulder Log" links, Sekundär-Aktion rechts = Reset `↺`; Rückweg zur Shell), `Tile` (Eintrag im Tool-Grid der Shell).
    -   **actions:** `Button` (Primär-CTA „Hinzufügen"), `ToggleChip` (Style, Send), `IconButton`, `TextLink`.
    -   **forms:** `Stepper` (tries), ggf. `TextInput`.
    -   **data:** `ListItem` (Eintrags-Zeile mit Haarlinie), ggf. `ConfigRow`/`ConfigGroup` für die Eingabe.
    -   **feedback:** `StatusMessage` (leer/Fehler), `ConfirmSheet` (löschen).
    -   **patterns:** `Hint` (Hinweise).
    -   **Tokens:** nur Rollen-/Ton-Tokens; Grün = Erfolg/Send (`--color-success-*`), Blau = Interaktion/Auswahl, Rot = destruktiv (löschen). Touch-Ziele ≥ 44px, Spalte ≤ 480px. Icon `assets/Icons/icon-boulderlog.svg` für die Kachel.

-   **Rahmen:** iPhone (Safari/Standalone-PWA), Hochformat, zentrierte Spalte max. 480px, nur Dark Mode (`[data-theme="dark"]`), Bedienung mit einer Hand (wichtige Aktionen in Daumenreichweite, unten). Barrierefreiheit: semantisches HTML, 2px-Fokusring aus Tokens, Kontrast AA.

-   **Lücken:** (falls im Entwurf etwas fehlt, hier nachtragen und in `_context/design.md` vermerken — nie still erfinden.) Zu prüfen: ob es für die **Schwierigkeits-Auswahl** (geordnete Font-Skala zum Antippen) ein passendes Muster im DS gibt oder ob dafür lokal eine Lösung mit Tokens/`ToggleChip` nötig ist.

**Entwurf:** *(Ablageort wird nach Freigabe in 3d ergänzt — Entwurf entsteht als HTML im Mockup-Ordner, da kein Claude-Design-Zugriff in der CLI.)*

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
