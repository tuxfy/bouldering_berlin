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

*3a vom Nutzer bestätigt; in 3b an den Entwurf angepasst; Entwurf in 3c freigegeben (2026-10-24).*

-   **Ziel:** Während der Session in der Halle einen Boulder schnell mit **einer Hand** eintragen — Grad, Versuche, send, Style, weitere Angaben — und alle Einträge als **Klartext-Log** sehen, kopieren und bei Bedarf direkt darin korrigieren.

-   **Ist-Stand:** Kein Tool vorhanden. Die Shell zeigt einen leeren Tool-Grid; es gibt noch keinen Weg in ein Tool und keinen lokalen Speicher. Boulder-Log ist das erste Tool.

-   **Spielraum:** (aus Klärung) Darstellung · Verhalten · Struktur · Schnittstellen/Daten — alle vier. Feste Grenzen: build-frei (native ES-Module/Web Components, keine Laufzeit-Abhängigkeiten), nur Dark Mode, UI nur mit Tokens/Komponenten des Design-Systems, iPhone/eine Hand.

-   **Feste Grenzen** (Aufbau, Felder, Wertebereiche, Zustände, Texte):
    -   **Aufbau** — ein Screen, von oben nach unten:
        1.  **Header:** nur „⊞ Tools" (Rückweg zur Shell), **mittig**; der Titel „Boulder Log" ist nur für Screenreader vorhanden.
        2.  **Eingabezeile — alles in einer Zeile:** Grad · tries · send · Hinzufügen.
        3.  **Style-Toggles.**
        4.  **Freitext** „Weitere Angaben …".
        5.  **Log** (Textfeld, füllt den restlichen Platz).
        6.  **Aktionszeile:** „Kopieren" · „Reset" (Hinzufügen sitzt nur in der Eingabezeile).
    -   **Felder der Eingabe:**
        -   **Grad** — Texteingabe, Pflicht für Hinzufügen. Optionale **Vorschlagsliste Font-Skala (Fb):** `3, 4, 5a, 5b, 5c, 6a, 6a+, 6b, 6b+, 6c, 6c+, 7a, 7a+, 7b, 7b+, 7c, 7c+, 8a`; freie Eingabe bleibt möglich. Platzhalter „Grad".
        -   **tries** — Stepper **ohne Label**, Ganzzahl ≥ 1, Standard 1.
        -   **send** — ToggleChip „send", Standard aus.
        -   **Hinzufügen** — Plus-Button („+", Bedienhilfe-Name „Hinzufügen"); deaktiviert, solange kein Grad eingetragen ist.
        -   **Style** — vordefinierte Tags, mehrere wählbar, **optional**: `slab, vertical, overhang, roof, dyno, crimp, sloper, pinch, jug, technical, powerful`. *(Liste ist Content, steht in `_context/design.md`)*
        -   **Weitere Angaben** — einzeilige Texteingabe, optional, frei: **weitere Style-Angaben**, die im Log an die gewählten Styles angehängt werden (mit `, `). Platzhalter „Weitere Angaben …".
    -   **Nach Hinzufügen:** Grad bleibt stehen; tries → 1, send aus, Styles und weitere Angaben leer.
    -   **Log:** Textfeld in Monospace, **eine Zeile je Boulder**, neue Einträge werden **unten angehängt**. Das Log ist frei **bearbeitbar und kopierbar** und die **einzige Möglichkeit zum Korrigieren** oder Löschen einzelner Einträge — es gibt keine Listenansicht und keinen Bearbeiten-/Lösch-Dialog pro Eintrag. Platzhalter bei leerem Log: „Noch keine Einträge."
    -   **Zeilenformat** (englisch, maschinenlesbar): `- <grad>: <n> tries[ (send)][ - <style>, <style>, <weitere Angaben>]` — bei genau einem Versuch `1 try`, sonst `<n> tries`; weitere Angaben stehen hinter den Styles in derselben Liste, ohne Styles direkt nach ` - `. Z. B.

        ```text
        - 6a: 2 tries (send)
        - 6b: 2 tries
        - 6c: 3 tries (send) - crimp, sloper
        - 6b: 1 try - overhang, sloper, pinch, test, test
        ```

    -   **Kopieren:** kopiert das ganze Log; Bestätigung am Button „Kopiert ✓" für 2 s.
    -   **Reset:** leert das Log vollständig (destruktiv → **ConfirmSheet**: „Alle Einträge löschen?" · „Das lässt sich nicht rückgängig machen." · „Löschen" / „Abbrechen").
    -   Kopieren und Reset sind bei leerem Log deaktiviert.
    -   **Keine Halle** (keine Hallen-Auswahl, keine SubBar), **keine Session-Historie, kein Datum** — genau ein aktuelles Log.
    -   **Zustände:** leer; mit Einträgen; Kopiert-Bestätigung; Reset-Bestätigung (ConfirmSheet).
    -   **Texte:** Deutsch, Fachbegriffe englisch („send", „tries", „Boulder Log", „Reset", Style-Tags). Werkzeug-Ton, knapp.

-   **Design-System:** „Bouldering Berlin Toolkit" (Kopie unter `app/vendor/designsystem/`, Stand `443d530`). Gebrauchte Komponenten/Tokens:
    -   **navigation:** `ToolHeader` (Aktion „⊞ Tools"), `Tile` (Eintrag im Tool-Grid der Shell, Icon `assets/Icons/icon-boulderlog.svg`).
    -   **actions:** `IconButton` interactive (+ Hinzufügen), `ToggleChip` (send, Style), `Button` (Kopieren = secondary, breit; Reset = destructive, inhaltsbreit; Kopiert-Bestätigung = success).
    -   **forms:** `TextInput` (Grad, Weitere Angaben), `Stepper` (tries), `TextArea mono` (Log).
    -   **feedback:** `ConfirmSheet` (Reset).
    -   Nicht mehr gebraucht: `ListItem`, `StatusMessage`, `ConfigRow`/`ConfigGroup`, `Hint`.
    -   **Tokens:** nur Rollen-Tokens. send und aktive Style-Tags = success (Grün, Standard des ToggleChip); Plus-Button = `--color-interactive-solid`; Reset/Löschen = danger. Touch-Ziele ≥ 44px, Spalte ≤ 480px.

-   **Rahmen:** iPhone (Safari/Standalone-PWA), Hochformat, zentrierte Spalte max. 480px, nur Dark Mode (`[data-theme="dark"]`), Bedienung mit einer Hand. Barrierefreiheit: semantisches HTML, Bedienhilfe-Namen für Controls ohne sichtbares Label (Grad, tries, Hinzufügen, Log), 2px-Fokusring aus Tokens, Kontrast AA.

-   **Lücken** (bei Freigabe in `_context/design.md` vermerken, nie still erfinden):
    -   **Header ohne sichtbaren Titel, Aktion mittig** — `ToolHeader` sieht Titel links und Aktion rechts vor. Lokal: ToolHeader mit zentrierter Aktion und nur für Screenreader sichtbarem Titel.
    -   **Nur für Screenreader sichtbarer Text** (Titel) — im Design-System gibt es dafür keine Klasse; lokal umsetzen.
    -   **Vorschlagsliste am TextInput** — das Design-System kennt keine; Umsetzung über die native Vorschlagsliste des Browsers (`<datalist>`), deren Aussehen das System (iOS) bestimmt. Kein eigenes Aussehen nötig; zu prüfen, ob das reicht.
    -   *(entfällt: Auswahl-Chip für Einzelauswahl — durch die Texteingabe für den Grad nicht mehr nötig.)*

-   **Offen:** keine.

**Entwurf:** Design-Artifact „boulder-log"

**Ablage (3d):** `_requirements/mockups/boulder-log/` — Einstieg `Main.dc.html` (Boulder Log, interaktiv), dazu `Shell.dc.html` (Start mit Kachel), `Leer.dc.html` und `Reset.dc.html` (Zustände); Laufzeit des Entwurfswerkzeugs `support.js`, Kopie der benutzten Design-System-Dateien unter `ds/`, Anordnung in `canvas.json`. Werte, Texte und Logik für die Umsetzung aus dem Quelltext von `Main.dc.html` übernehmen.

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
