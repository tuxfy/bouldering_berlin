-   **Title** Grundgerüst
-   **Status** new

# Idee

Die in Stufe 0 festgelegte Grundlage einrichten: eine build-freie, installierbare Vanilla-PWA als Hülle für die späteren Boulder-Tools, mit eingebundenem Design-System, allen Prüfungen unter einem Befehl und automatischer Auslieferung nach GitHub Pages. (Entstanden aus `_anweisungen/00-einrichtung.md`.)

# Hintergrund

Ist-Stand: leeres Projekt-Template mit Prozess-Rahmen (`_anweisungen/`, `.claude/agents/`) und Agent-Container (`run-ai-agent.sh`). Kein Anwendungscode, keine `package.json`, keine CI, keine Auslieferung. Das Design-System ist bereits als Submodul unter `_kontext/designsystem/` eingebunden (Stand `443d530`). Die Festlegungen stehen in `_kontext/projekt.md` und `_kontext/design.md`.

# Einordnung

-   **Art:** technisch
-   **Spielraum** (nur Angekreuztes darf sich ändern):
    -   [x] Darstellung
    -   [x] Verhalten
    -   [x] Struktur
    -   [x] Schnittstellen/Daten
    -   *(neues Projekt — es gibt noch keinen zu schützenden Bestand)*
-   **Weg:** Design nötig? **nein** (Design-System vorhanden, dark-only) · Ursache bestätigen? **entfällt**

# Offene Fragen

*Keine mehr — in Stufe 4 geklärt (siehe „Entscheidungen").*

Der Nutzer hat vor dem ersten Deploy noch **eine Handlung** zu erledigen (keine offene Entscheidung): GitHub-Repo anlegen, Remote setzen, Pages aktivieren (Quelle: GitHub Actions) — siehe `_kontext/hoster.md` (wird in der Umsetzung angelegt).

# Design-Brief

*Entfällt — kein Design nötig (Design-System vorhanden).*

# Entscheidungen

Grundlegendes steht in `_kontext/projekt.md` / `_kontext/design.md` (Stufe 0). Hier das für diese Anforderung Festgelegte:

**Aus Stufe 0 (unverändert gültig):**

-   **Stack:** Vanilla JS (native ES-Module, keine Transpilierung), native Web Components, **kein Build**; PWA mit `manifest.webmanifest` + handgeschriebenem Service Worker (offline-fähig); keine Laufzeit-Abhängigkeiten.
-   **Design-System:** CSS-Vertrag + Vanilla — `tokens.css` + `components/bundle.css` + Assets per `npm run ds:copy` nach `vendor/designsystem/`; React-Quellen nur Referenz; nur Dark Mode.
-   **Zielformat:** iPhone/Safari Standalone-PWA, Hochformat, zentrierte Spalte max. 480px, Touch-Ziele ≥44px, Deutsch (englische Fachbegriffe).
-   **Prüfungen / ein Befehl:** `npm test` ruft Linter, Formatierer, UI-Prüflauf, Unit-, E2E-Tests, Audit und Geheimnis-Suche nacheinander auf — lokal und in der CI identisch.
-   **Auslieferung:** GitHub Pages per GitHub Actions; Release-Modell mit `rc/<version>` und Tag `v<version>`.

**In Stufe 4 (Refinement) festgelegt:**

-   **Seitenmodell — MPA:** `index.html` ist die Tool-Übersicht; jedes spätere Tool bekommt eine **eigene Seite** (`tools/<tool>/index.html`) mit eigenem ES-Modul. Kein clientseitiger Router. *Warum:* kein Build, einfacher Offline-Cache, jede Seite isoliert ladbar — passt zum Werkzeug-Charakter.
-   **Verzeichnis-Layout (Richtung, Details in 5b):** App-Dateien im Repo-Root; gemeinsame Module/CSS unter `app/`, Tool-Seiten unter `tools/`, kopiertes Design-System unter `vendor/designsystem/`, Service Worker + Manifest + Icons im Root. Prozess-/Dev-Ordner (`_anweisungen/`, `_kontext/`, `anforderungen/`, `node_modules/`, Tests) werden **nicht** ausgeliefert.
-   **`vendor/designsystem/` wird eingecheckt** und nur bewusst per `npm run ds:copy` (+ Commit) aktualisiert; Stand in `_kontext/design.md`. *Warum:* Deploy/CI brauchen weder Submodul-Checkout noch Node-Schritt.
-   **UI-Prüflauf-Geltungsbereich:** Stylelint nur auf App-CSS (`app/**/*.css`, `tools/**/*.css`), **nicht** auf `vendor/designsystem/`.
-   **Werkzeug-Versionen (Vorschlag, aktuelle Hauptversionen):** ESLint 9 (flat config), Prettier 3, Stylelint 16 + `stylelint-declaration-strict-value` 1 (Template-Vorgabe), Vitest (aktuell) mit jsdom-Umgebung für DOM-nahe Logik, Playwright (aktuell). Genaues Pinning in der Lock-Datei bei der Installation.
-   **gitleaks:** als fester, gepinnter Bestandteil der **CI** (offizielle gitleaks-Action) **und** des Agent-Containers; `npm run check:secrets` ruft die `gitleaks`-Binärdatei auf (`gitleaks detect`). *Warum:* gleicher Lauf lokal wie in der CI, keine pro-Lauf-Downloads im Testpfad.
-   **Statischer Server für `npm start`:** `npx serve` (bzw. als Dev-Abhängigkeit) auf `http://localhost` — sicherer Kontext, Service Worker läuft lokal.
-   **Deploy:** GitHub-Actions-Workflow kuratiert ein Publish-Verzeichnis per Datei-Kopie (kein Build) und veröffentlicht es über die Pages-Action. Repo-Anlage und Pages-Aktivierung sind eine **Nutzer-Handlung** vor dem ersten Deploy (How-to in `_kontext/hoster.md`, in der Umsetzung angelegt).

# Verhalten

Was der Nutzer sieht und tut — bewusst **minimal** (reine Hülle, einzelne Tools folgen als eigene Anforderungen):

-   Die App lädt als dunkle, mobile Seite im Stil des Design-Systems: sticky `ToolHeader` mit dem Namen „Bouldering Berlin", darunter eine (zunächst leere) Tool-Übersicht als Platzhalter.
-   Die App ist **installierbar** (Manifest, App-Icons aus dem Design-System) und lädt nach dem ersten Besuch **offline** (Service Worker).
-   Alles ausschließlich mit Tokens und Komponenten-Klassen des Design-Systems; keine festen Werte, keine Inline-Styles.

# Akzeptanzkriterien

Jedes Kriterium ist einzeln prüfbar; Spalte „Prüfung" = Teststrategie.

| Kriterium | Prüfung |
|---|---|
| `index.html` lädt im iPhone-Viewport dark und zeigt den `ToolHeader` „Bouldering Berlin" und die (leere) Tool-Übersicht | E2E (Playwright, iPhone-Viewport) + manuell |
| App ist installierbar: gültiges `manifest.webmanifest` (Name, `display: standalone`, App-Icons 192/512 aus dem Design-System) | E2E (Manifest geladen, Felder geprüft); echte Installation nur am Gerät |
| Service Worker registriert sich; nach erstem Besuch lädt die Startseite **offline** | E2E (zweiter Aufruf offline) |
| `npm run ds:copy` erzeugt `vendor/designsystem/` aus dem Submodul; die App bindet **nur** diese Dateien ein (kein Pfad nach `_kontext/designsystem/`, kein React/`bundle.js` zur Laufzeit) | Unit (Kopie-Skript) + Review |
| `npm test` führt **alle** Prüfungen mit einem Befehl aus; der CI-Workflow ruft denselben Befehl auf | Testlauf lokal + CI |
| Bei einem gesetzten Fehler schlägt die passende Prüfung fehl (Linter/UI-Prüflauf/Audit/Geheimnis-Suche greifen nachweislich) | Testlauf (je Prüfung einmal rot provoziert) |
| GitHub-Actions-Workflow kuratiert das Publish-Verzeichnis (nur App-Dateien, keine Prozess-/Dev-Ordner) und veröffentlicht nach GitHub Pages | CI (Workflow-Lauf) |
| Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot | Testlauf |
| Nach der Umsetzung laufen alle Tests grün | Testlauf |
| UI-Richtlinie eingehalten (nur Tokens und Komponenten-Klassen des Design-Systems, keine festen Werte, keine Inline-Styles) — Prüflauf grün | `npm run check:ui` + Review |
| `README.md` ergänzt (Setup, Befehle, DS-Submodul, Deploy) | Review |

# Abgrenzung

-   **Keine** einzelnen Tools (Boulder-Log, Intervall-Timer, QR-Scan …) — je eigene spätere Anforderung im Backlog.
-   Keine fachliche Logik und keine Datenspeicherung (kommt mit den Tools).
-   Keine Änderungen am Design-System (wird nie im Projekt bearbeitet).
-   Kein helles Theme.
-   Repo-Anlage und Pages-Aktivierung sind Nutzer-Handlungen, nicht Teil der Umsetzung (nur das How-to wird geschrieben).

# Technische Notizen

*Optional, nicht bindend.*

-   UI-Prüflauf nur auf App-CSS (`app/**/*.css`, `tools/**/*.css`), nicht auf `vendor/designsystem/`.
-   Service Worker build-frei und schlank halten (kein Workbox); Cache-Version beim Ausliefern erhöhen.
-   Für die DOM-nahen Unit-Tests Vitest mit jsdom-Umgebung; reine Logik ohne DOM direkt.
-   Publish-Verzeichnis im Workflow per Allowlist zusammenstellen, damit `_anweisungen/`, `_kontext/`, `anforderungen/`, Tests und `node_modules/` sicher draußen bleiben.

# Größe

Passt als **ein** Einrichtungsdurchgang: zusammenhängende Grundlage (Gerüst, PWA-Hülle, DS-Einbindung, Prüfungen/ein Befehl, CI, Deploy). Innere Reihenfolge für 5b: (1) Gerüst + DS-Kopie + Hülle, (2) Prüfungen + ein Befehl, (3) CI, (4) Deploy. Sollte der Deploy-Teil in der Umsetzung ausufern, kann er als eigene Anforderung abgespalten werden — Rest bleibt abnehmbar.

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

# QA

*Vom Agenten in Stufe 6 ergänzt.*

# Abnahme

*In Stufe 7 ergänzt.*
