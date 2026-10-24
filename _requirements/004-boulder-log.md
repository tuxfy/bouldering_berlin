-   **Title** Boulder-Log
-   **Status** in progress

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

-   keine — in „Entscheidungen" überführt.

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

Aus Klärung und Design übernommen, hier ergänzt (beantwortete offene Fragen eingeschlossen).

**Fachlich / Verhalten:**

-   **Skala:** Grad als Font-Skala (Fb) `3 … 8a` über eine Vorschlagsliste; **freie Eingabe bleibt möglich**. (war offen — Hallen-Farben verworfen, weil pro Halle verschieden.)
-   **Style:** vordefinierte Tags, mehrere wählbar, **optional**; dazu Freitext „Weitere Angaben", der im Log **an die Styles angehängt** wird. (war offen)
-   **Send & Versuche:** `send` ist ein Toggle (geschafft ja/nein), `tries` ≥ 1; auch **nur probierte** Boulder (ohne `send`) werden erfasst. (war offen)
-   **Session:** genau **ein** aktuelles Log — **kein Datum, keine Historie**. (war offen)
-   **Halle:** **keine** Hallen-Auswahl in dieser Version. (war offen)
-   **Korrigieren/Löschen einzelner Einträge:** ausschließlich **direkt im editierbaren Log-Textfeld** — kein Bearbeiten-/Lösch-Dialog pro Eintrag. (war offen)
-   **Nach Hinzufügen:** Grad bleibt stehen; `tries` → 1, `send` aus, Styles und „Weitere Angaben" leer.
-   **Kopieren:** ganzes Log in die Zwischenablage; Bestätigung am Button „Kopiert ✓" für 2 s.
-   **Reset:** leert das Log vollständig; Bestätigung über **ConfirmSheet**.
-   **Leeres Log:** Platzhalter „Noch keine Einträge."; **Kopieren und Reset deaktiviert**.
-   **Zeilenformat:** `- <grad>: <n> tries[ (send)][ - <style>, …, <weitere Angaben>]`, bei genau einem Versuch `1 try`.

**Technik** (Agent schlägt vor, Nutzer entscheidet):

-   **Navigation:** je Tool eine **eigene Seite** (gemäß `_context/projekt.md`: „jedes Tool eine eigene Seite/Komponente"). Die Shell verlinkt per **Kachel (Tile)** auf die Boulder-Log-Seite; „⊞ Tools" im Header führt zurück. Kein Router, kein Build.
-   **Speicher:** `localStorage`, ein Schlüssel. **Der Inhalt des Log-Textfelds ist die Datenquelle** (ein String) — kein IndexedDB nötig. Bleibt auf dem Gerät, offline-fähig.
-   **Zwischenablage:** native `navigator.clipboard.writeText` (sicherer Kontext: `localhost`/`https` gegeben).
-   **Grad-Vorschläge:** native `<datalist>`; Aussehen bestimmt iOS (DS-Lücke, in `_context/design.md` vermerkt).
-   **Offline:** neue Tool-Seite und ihre Dateien in die **Precache-Liste des Service Workers** aufnehmen.
-   **Neue Pakete/Abhängigkeiten:** **keine.**
-   **Nur am echten Gerät prüfbar:** Zwischenablage in Safari, echtes Offline-Verhalten, PWA-Installation/Standalone, Darstellung der `<datalist>` auf iOS.

# Verhalten

Was der Nutzer sieht und tut (aus dem freigegebenen Entwurf, `_requirements/mockups/boulder-log/`):

-   **Einstieg:** In der Shell steht im Tool-Grid eine Kachel **„Boulder Log"** (Icon). Tippen öffnet den Boulder-Log-Screen. Im Header führt **„⊞ Tools"** zurück zur Shell.
-   **Eintragen (eine Zeile):** Grad eintippen (Vorschläge aus der Font-Skala, freie Eingabe möglich) · `tries` über den Stepper (Standard 1) · `send` optional an · **„+"** fügt hinzu. „+" ist **deaktiviert, solange kein Grad** eingetragen ist.
-   **Style:** darunter Tags zum Antippen (mehrere), optional; „Weitere Angaben" als Freitext für zusätzliche Stichworte.
-   **Nach dem Hinzufügen** erscheint unten im **Log** eine neue Zeile im festgelegten Format; Grad bleibt stehen, der Rest wird zurückgesetzt — so lässt sich mehreres am selben Grad schnell eintragen.
-   **Log ansehen/korrigieren:** Das Log ist ein **editierbares Monospace-Textfeld**; einzelne Zeilen lassen sich direkt ändern oder löschen. Leeres Log zeigt „Noch keine Einträge.".
-   **Kopieren:** „Kopieren" legt das ganze Log in die Zwischenablage; der Button zeigt kurz „Kopiert ✓".
-   **Reset:** „Reset" fragt über ein Sheet nach („Alle Einträge löschen?") und leert das Log erst nach „Löschen".
-   **Dauerhaft & offline:** Das Log bleibt nach Schließen/Neuladen der App erhalten (Gerät) und funktioniert ohne Netz.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| Shell zeigt eine „Boulder Log"-Kachel; Tippen öffnet den Screen; „⊞ Tools" führt zurück | E2E |
| Grad-Feld bietet die Font-Skala als Vorschläge und erlaubt freie Eingabe; „+" ist ohne Grad deaktiviert | E2E |
| Hinzufügen hängt genau eine Zeile im Format `- <grad>: <n> tries[ (send)][ - …]` unten an; `1 try` bei genau einem Versuch | Unit (Formatfunktion) + E2E |
| Nach Hinzufügen: Grad bleibt, `tries`→1, `send` aus, Styles und „Weitere Angaben" leer | E2E |
| Log ist frei editierbar; manuelle Änderungen bleiben erhalten | E2E |
| Kopieren legt das ganze Log in die Zwischenablage; Button zeigt „Kopiert ✓" für 2 s | E2E (Clipboard) + manuell (Safari am Gerät) |
| Reset öffnet das ConfirmSheet; „Löschen" leert das Log, „Abbrechen" lässt es unverändert | E2E |
| Bei leerem Log: Platzhalter „Noch keine Einträge."; Kopieren und Reset deaktiviert | E2E |
| Log bleibt nach Neuladen erhalten (localStorage); ohne Netz nutzbar | E2E (Reload) + manuell (echtes Offline/Gerät) |
| Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot | Testlauf |
| Nach der Umsetzung laufen alle Tests grün | Testlauf |
| UI-Richtlinie eingehalten (nur Tokens und Komponenten des Design-Systems, keine festen Werte, keine Inline-Styles) | `npm run check:ui` / Review |
| Entwurf umgesetzt, Werte/Texte/Logik aus der abgelegten Quelle (`Main.dc.html`) übernommen | manuell / Review |
| `README.md` ergänzt — nur wenn sich Setup, Konfiguration oder Bedienung ändern | Review |

# Abgrenzung

Ausdrücklich **nicht** Teil dieser Anforderung (jeweils Kandidat für eine eigene Idee, Stufe 1):

-   **Fortschritt / Statistik** („werde ich besser?") — keine Auswertung, keine Graphen, keine Trends.
-   **Export / Backup / Datei-Ausgabe** — der einzige Weg, Daten rauszubringen, ist **„Kopieren"** (Zwischenablage). Kein Teilen, kein Download, keine Cloud/Sync, kein Konto.
-   **Halle / Hallen-Auswahl**, **Session-Historie**, **Datum/Zeit** je Eintrag.
-   **Mehrere/benannte Logs.**
-   **Datensicherheit:** Die Daten liegen nur im Browser-Speicher des Geräts; Leeren des Speichers oder Deinstallation löscht sie. Bewusst in Kauf genommen; Sicherung erfolgt bei Bedarf über „Kopieren".

# Technische Notizen

*Optional, nicht bindend.*

-   Voraussichtlich betroffen: `app/index.html` (Kachel + „Noch keine Tools" ausblenden), neue Tool-Seite `app/tools/boulder-log/` (HTML/JS/CSS), Service-Worker-Precache (`app/sw-precache.js` bzw. `scripts/gen-sw.mjs`), ggf. `app/app.css`.
-   Die **Formatierung einer Log-Zeile** als reine Funktion ausgliedern (gut per Unit-Test absicherbar).
-   Clipboard/`<datalist>`/Offline sind teils nur am Gerät final prüfbar (siehe Entscheidungen).

# Umsetzungsplan

Architektur: Tool als **statische Seite + ES-Modul-Controller** (Light DOM mit DS-Klassen, wie die Shell aus 001 — kein Shadow DOM, sonst greift die globale DS-CSS nicht; von allen drei Rollen bestätigt). Reine Logik (`formatLine` + `appendLine`) in einem eigenen Modul, per Unit-Test abgesichert; **tries-Clamping (1–999) und Grad-Trim/„+"-Sperre liegen im Controller und werden per E2E geprüft**. Werte/Texte/Logik aus `_requirements/mockups/boulder-log/Main.dc.html` übernehmen.

**Test-zuerst mit „rot aus dem richtigen Grund"** (senior-dev B1): Vor dem ersten roten E2E eines Schritts existiert eine **erreichbare** Minimal-Fassung (Route + Kachel), sodass der Test an der fehlenden **Erwartung** scheitert, nicht an 404. Jeder Schritt lässt die Suite am Ende grün (Commit je grünem Schritt).

1.  **Schritte:**
    1.  **Format-Modul:** `format.js` mit reinen Funktionen `formatLine({grade,tries,send,styles,note})` **und `appendLine(log, line)`** (Anhängen inkl. Sonderfall leeres Log und Trailing-Whitespace); Unit-Tests zuerst (rot → grün). Keine DOM-/Browser-APIs.
    2.  **a) Shell-Anbindung + Tool-Grundgerüst + Eingabe:** Kachel in `app/index.html` (verlinkt `./tools/boulder-log/`, Icon `icon-boulderlog.svg`), „Noch keine Tools"-Hinweis entfernen, `start.spec.js` **im selben Schritt** auf die Kachel anpassen (bleibt positiv: Kachel vorhanden + verlinkt, Hinweis weg). Tool-Seite `index.html` (Markup, DS-Klassen, **keine** Inline-Styles) + `boulder-log.css` (Layout aus Entwurf, nur Tokens) + `boulder-log.js` (Zustand Grad/tries/send/Style/Weitere, Hinzufügen). E2E: Navigation hin/zurück; „+" ohne Grad deaktiviert / mit Grad aktiv; Hinzufügen hängt Zeile an; danach tries=1, send aus, Styles+Weitere leer, Grad bleibt; Datalist-Options + freie Eingabe; Leerzustand-Platzhalter.
        **b) Reset + ConfirmSheet** (eigener Unterschritt, eigener roter→grüner E2E): Reset → Sheet; Abbrechen behält; Löschen leert; Scrim-Klick schließt; Kopieren+Reset bei leerem Log disabled.
    3.  **Dauerhaftigkeit + Kopieren:** `localStorage` laden/speichern (neu ggü. Entwurf); `navigator.clipboard.writeText` + „Kopiert ✓" (2 s, dann zurück). E2E: nach Reload erhalten; Kopieren-Label + disabled-Logik (deterministisch).
    4.  **Offline + Feinschliff:** expliziter Offline-E2E der **Tool-Seite** (DevOps 1). *Abweichung:* `app/sw-precache.js` ist **gitignored** (wird durch `sw:build` lokal/CI erzeugt, nicht committet) — es nimmt die Tool-Dateien automatisch auf. Die Kachel verlinkt auf `index.html` (nicht `./tools/boulder-log/`), damit die Navigations-URL die **gecachte** Datei trifft; außerdem registriert die Tool-Seite den Service Worker selbst (direkter Einstieg offline).
    5.  **Grün:** `npm test`, `npm run check:ui`, `npm run check:clean`; Kriterien abhaken, nur-am-Gerät-Prüfbares für die Abnahme markieren.

2.  **Betroffene Dateien:**
    -   neu: `app/tools/boulder-log/{index.html,boulder-log.js,boulder-log.css,format.js}`
    -   neu (Tests): `tests/unit/boulder-log-format.test.mjs`, `tests/e2e/boulder-log.spec.js`
    -   geändert: `app/index.html` (Kachel + Hinweis), `tests/e2e/start.spec.js` (Kachel statt leer)
    -   erzeugt (gitignored, **nicht** committet): `app/sw-precache.js` (durch `npm run sw:build` lokal/CI; nimmt die Tool-Dateien automatisch auf)

3.  **Testfälle je Akzeptanzkriterium:**
    -   *Unit* (`boulder-log-format.test.mjs`, reine Logik): `1 try` vs. `n tries`; mit/ohne `(send)`; mit Styles; Styles + Weitere; nur Weitere; Join „, "; **Grenzfälle:** Grad mit umgebenden Leerzeichen → getrimmt; `note` nur Leerzeichen → nicht angehängt; `styles` **und** `note` leer → keine ` - `-Liste; `appendLine`: leeres Log → **keine** führende Leerzeile; Log mit Trailing-Newline → genau ein `\n`.
    -   *E2E* (`boulder-log.spec.js`): „+" ohne Grad deaktiviert / mit Grad aktiv (**Grad nur aus Leerzeichen → deaktiviert**); Hinzufügen hängt genau eine Zeile an; danach tries=1, send aus, Styles+Weitere leer, **Grad bleibt**; **Stepper-Grenzen 1 und 999**; Datalist hat 18 Options im DOM + **freie Eingabe** (Wert außerhalb der Liste) landet korrekt im Log; Log editierbar und **nach Reload erhalten** (localStorage); Kopieren → Button „Kopiert ✓" + disabled bei leerem Log (**deterministisch**); Zwischenablage-Inhalt best-effort via `grantPermissions(['clipboard-read','clipboard-write'])` + `readText()`, klar als Chromium-Nachweis markiert — Safari-Verhalten = Geräteprüfung; Reset → Sheet, Abbrechen behält, Löschen leert; leeres Log → Platzhalter „Noch keine Einträge.", Kopieren+Reset disabled.
    -   *E2E Offline* (eigener Fall, Muster aus `offline.spec.js`): Tool-Seite online besuchen → auf aktiven SW warten → `setOffline(true)` → **Tool-Seite** neu laden → auf ein **Tool-spezifisches** Element prüfen (nicht den Shell-Titel, sonst greift unbemerkt der Navigate-Fallback).
    -   *E2E* (`start.spec.js`): Shell zeigt genau **eine** Kachel „Boulder Log", verlinkt aufs Tool; Hinweis „Noch keine Tools." nicht mehr sichtbar.

4.  **Entwurf → Code** (aus `Main.dc.html` übernehmen):
    -   Header: sichtbar nur „⊞ Tools" (`btn btn--secondary btn--compact`) → Shell; Titel „Boulder Log" nur für Screenreader (lokale `.sr-only`-Klasse — DS-Lücke, in `design.md` vermerkt).
    -   Eingabezeile: `.field` + `list="fb-grades"` + `<datalist>` (18 Grade; ID dokumentseitig eindeutig) · `.stepper` (−/`output`/+, tries 1–999) · Send-ToggleChip (`toggle`/`is-on`) · „+" (`btn btn--icon btn--interactive btn--compact`, disabled ohne Grad).
    -   Style-Tags (`toggle`/`is-on`, Mehrfach); „Weitere Angaben" (`.field`); Log (`.textarea`, mono, `resize:none`, Platzhalter „Noch keine Einträge.").
    -   Aktionen: Kopieren (`btn btn--secondary btn--compact` → `btn--success` „Kopiert ✓") · Reset (`btn btn--destructive btn--compact`).
    -   Sheet: `.sheet-scrim`/`.sheet` „Alle Einträge löschen?" · „Das lässt sich nicht rückgängig machen." · „Löschen"/„Abbrechen".
    -   Format exakt: `- <grad>: <n> tries[ (send)][ - <tags>]`, tags = Styles + (Weitere, falls gesetzt), Join „, "; Anhängen mit `\n`.
    -   Alle **Inline-Styles** des Entwurfs werden in `boulder-log.css` mit Tokens übersetzt.

5.  **Externe Abhängigkeiten:** keine neuen Pakete. Browser-APIs (Standard, keine Zugangsdaten): `localStorage` (Speicher), `navigator.clipboard.writeText` (sicherer Kontext localhost/https), natives `<datalist>`, Service Worker (Offline, vorhanden). Im Test: E2E (Clipboard via `grantPermissions`), Offline über vorhandenes Muster (`offline.spec.js`).

6.  **Annahmen und Risiken:**
    -   Benötigte Tokens (`--content-pad-x/y`, `--color-scrim`, `--size-stepper` …) in der Projekt-DS (`443d530`) **vorhanden** (geprüft) → Entwurf 1:1 umsetzbar.
    -   `start.spec.js` (gehört zu 001) wird angepasst: Erwartung „leere Übersicht" → „eine Kachel". **Keine Abschwächung**, sondern geändertes Verhalten (erstes Tool); die neue Prüfung bleibt **positiv**.
    -   **Offline-E2E setzt den automatischen `sw:build` voraus** (via `npm start` in `playwright.config.js`): `app/sw-precache.js` wird vor dem Lauf frisch erzeugt, der Test hängt daher nicht an der committeten Datei und testet die Tool-Seite aus dem Precache (nicht den Shell-Fallback).
    -   Clipboard-Lesen ist in headless Chromium je nach Fokus/Umgebung **flaky** → E2E sichert deterministisch Label + disabled; echter Zwischenablage-Inhalt in Safari = **Geräteprüfung**. Ebenso iOS-`<datalist>`-Aussehen = Geräteprüfung.
    -   `localStorage` im privaten Modus evtl. flüchtig → Datensicherheit bewusst abgegrenzt.

7.  **Nicht angefasst:** Aussehen/Verhalten der Shell außer Kachel + Hinweis; andere Tools; Design-System; Build/CI/Hosting/Release-Modell; Manifest; `scripts/gen-sw.mjs` (nur Ausführung). Abgegrenzt (nicht umgesetzt): Fortschritt/Statistik, Export/Backup, Halle, Historie/Datum, Cloud/Sync.

# Testnachweis

**Schritt 1 — Format-Modul (`format.js`):**

-   **Rot** (vor der Änderung): `npx vitest run tests/unit/boulder-log-format.test.mjs` — Suite fehlgeschlagen: `Cannot find module '../../app/tools/boulder-log/format.js'`.
-   **Grün** (nach der Änderung): `npx vitest run tests/unit/boulder-log-format.test.mjs` — 13 bestanden / 0 fehlgeschlagen. Voller Lauf `npm test` grün (lint, format, check:ui, Unit 37, audit, secrets, E2E 3).

**Schritt 2a — Shell-Kachel + Tool-Seite + Eingabe/Hinzufügen:**

-   **Rot** (vor dem Controller `boulder-log.js`): `npx playwright test tests/e2e/boulder-log.spec.js` — 5 fehlgeschlagen (Add-Aktivierung, Datalist-Optionen, Anhängen, freie Eingabe, mehrere Einträge), 3 bestanden (Navigation, Stepper-Minimum, Platzhalter). Rot am fehlenden Verhalten, nicht an 404 (Seite erreichbar).
-   **Grün** (nach `boulder-log.js`): `npx playwright test tests/e2e/boulder-log.spec.js tests/e2e/start.spec.js` — 9/9. Voller Lauf `npm test` grün (E2E 11, Unit 37).

**Schritt 2b — Reset + ConfirmSheet (+ Aktivierung Kopieren/Reset):**

-   **Rot** (vor der Verdrahtung): `npx playwright test tests/e2e/boulder-log.spec.js --grep Reset` — 4 fehlgeschlagen (Aktivierung, Sheet öffnen, Löschen, Scrim).
-   **Grün** (nach der Verdrahtung): `npx playwright test tests/e2e/boulder-log.spec.js` — 12/12. Voller Lauf `npm test` grün (E2E 15, Unit 37).

**Schritt 3 — Dauerhaftigkeit (localStorage) + Kopieren:**

-   **Rot** (vor der Umsetzung): `npx playwright test tests/e2e/boulder-log.spec.js --grep "Speichern & Kopieren"` — 3 fehlgeschlagen (Neuladen behält Einträge, manuelle Änderung bleibt, Kopieren), 1 bestanden (Reset-leer trivial).
-   **Grün** (nach der Umsetzung): dieselbe Auswahl 4/4. Voller Lauf `npm test` grün (E2E 19, Unit 37). Zwischenablage-Inhalt in Chromium bestätigt; Safari-Clipboard = Geräteprüfung (Stufe 7).

**Schritt 4 — Offline der Tool-Seite:**

-   **Rot** (vor SW-Registrierung/Precache): `npx playwright test tests/e2e/boulder-log.spec.js --grep Offline` — fehlgeschlagen (kein kontrollierender Service Worker beim direkten Einstieg).
-   **Grün** (nach SW-Registrierung in der Tool-Seite + Kachel-Link auf `index.html`): dieselbe Auswahl 1/1. Voller Lauf `npm test` grün (E2E 20, Unit 37).

# QA

*Vom Agenten in Stufe 6 ergänzt.*

# Abnahme

*In Stufe 7 ergänzt.*
