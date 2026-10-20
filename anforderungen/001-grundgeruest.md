-   **Title** Grundgerüst
-   **Status** qa

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
-   **Ein Auslieferungsordner `app/`:** alles Ausgelieferte liegt darunter — `app/index.html`, `app/main.js`, `app/app.css`, `app/manifest.webmanifest`, `app/sw.js`, später `app/tools/<tool>/…`, kopiertes Design-System unter `app/vendor/designsystem/`. **Ausgeliefert wird genau dieser Ordner**; Prozess-/Dev-/Test-Dateien liegen außerhalb und können nicht hineinrutschen — **keine Allowlist zu pflegen**. *Warum:* der Ordner ist zugleich Web-Root, Deploy-Artefakt und Quelle, aus der Precache-Liste und Cache-Version **automatisch erzeugt** werden — es gibt keine handgepflegte Liste.
-   **`app/vendor/designsystem/` wird eingecheckt** und nur bewusst per `npm run ds:copy` (+ Commit) aktualisiert; Stand in `_kontext/design.md`. *Warum:* Deploy/CI brauchen weder Submodul-Checkout noch Node-Schritt.
-   **UI-Prüflauf-Geltungsbereich:** Stylelint nur auf App-CSS (`app/**/*.css`), **ohne** `app/vendor/**`.
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

-   UI-Prüflauf nur auf App-CSS (`app/**/*.css`), **ohne** `app/vendor/**` (Design-System-Kopie).
-   Service Worker build-frei und schlank halten (kein Workbox); Precache-Liste und Cache-Version erzeugt `gen-sw.mjs` aus dem Ordner `app/`.
-   Für die DOM-nahen Unit-Tests Vitest mit jsdom-Umgebung; reine Logik ohne DOM direkt.
-   Auslieferung = der Ordner `app/` als Ganzes; Prozess-/Dev-/Test-Dateien liegen außerhalb und bleiben so automatisch draußen (keine Allowlist).

# Größe

Passt als **ein** Einrichtungsdurchgang: zusammenhängende Grundlage (Gerüst, PWA-Hülle, DS-Einbindung, Prüfungen/ein Befehl, CI, Deploy). Innere Reihenfolge für 5b: (1) Gerüst + DS-Kopie + Hülle, (2) Prüfungen + ein Befehl, (3) CI, (4) Deploy. Sollte der Deploy-Teil in der Umsetzung ausufern, kann er als eigene Anforderung abgespalten werden — Rest bleibt abnehmbar.

# Umsetzungsplan

## 1. Schritte

Jeder Schritt klein genug für einen Testlauf. **Test-first:** wo ein Test den Code absichert, wird er zuerst geschrieben und rot gesehen (Senior-Dev-Befund 1).

1.  **Gerüst + Dev-Werkzeuge + Konfig (ohne App-Code):** `package.json` (`"type":"module"`, Scripts), `.gitignore`; devDeps installieren (eslint 9, prettier 3, stylelint 16 + `stylelint-declaration-strict-value` 1, vitest + jsdom, @playwright/test, serve). `eslint.config.js`, `.prettierrc`/`.prettierignore`, `.stylelintignore`, `playwright.config.js` (iPhone-Viewport, `colorScheme:'dark'`). npm-Scripts inkl. Ketten-Befehl `test` (schnelle Prüfungen zuerst).
2.  **DS-Kopie (test-first):** `tests/unit/ds-copy.test` → rot (erwartet `app/vendor/designsystem/tokens.css`+`components/bundle.css` sowie `assets/Logos/app-icon-192.png`/`-512.png`, **kein** `bundle.js`/`.jsx`; **Fehlerfall:** fehlendes Submodul → Abbruch, Exit ≠ 0). Dann `scripts/ds-copy.mjs` (reines Node): Quelldateien inkl. der beiden App-Icons prüfen, bei Fehlen klare Meldung + Hinweis `git submodule update --init` + Exit ≠ 0; sonst nach `app/vendor/designsystem/` kopieren. `npm run ds:copy`, `app/vendor/` einchecken.
3.  **Startseite (test-first):** `tests/e2e/start.spec` → rot (dark, iPhone: `ToolHeader`-Text „Bouldering Berlin" + leere Übersicht sichtbar). Dann `app/index.html` (`<html data-theme="dark">`), `app/app.css` (zentrierte Spalte max. 480px, nur Tokens). **Markup-Quelle:** Klassen (`.tool-header` …) aus `components/bundle.css`/`preview.html`, nicht nur README (Senior-Dev-Befund 6). Alle URLs **relativ** (Pages-Unterpfad).
4.  **Manifest (test-first):** `tests/e2e/manifest.spec` → rot (`manifest.webmanifest` lädt, `display==='standalone'`, Icons referenziert). Dann `app/manifest.webmanifest` — referenziert **genau** `app-icon-192.png`/`app-icon-512.png` aus `app/vendor/designsystem/assets/Logos/`.
5.  **Service Worker/Offline (test-first):** `tests/e2e/offline.spec` → rot: **erst auf aktiven SW-Controller warten** (`navigator.serviceWorker.ready`), dann offline + Reload → `ToolHeader` weiter sichtbar. Dann `app/main.js` (SW-Registrierung) + `app/sw.js`. **Precache-Liste und Cache-Version werden erzeugt, nicht gepflegt:** `scripts/gen-sw.mjs` liest den Ordner `app/` (ohne `sw.js` selbst), schreibt die Dateiliste und eine Cache-Kennung in den Service Worker (`npm run sw:build`). Lokal läuft das vor `npm start`/den E2E-Tests (Dev-Kennung), im Deploy mit der Tag-Version.
6.  **Prüfungen + ein Befehl + Negativproben:** Scripts `lint`, `format:check`, `check:ui` (`app/**/*.css` ohne `app/vendor/**`), `test:unit`, `test:e2e`, `audit` (`scripts/audit.mjs`), `check:secrets` (`gitleaks detect`); `test` kettet alle. Je Prüfung eine **reproduzierbare Negativprobe** (Fixture mit Verstoß → Exit ≠ 0), dokumentiert/nachspielbar: Stylelint (Hex-Farbe), ESLint (Fehler), gitleaks (Dummy-Secret-Fixture), Audit (gegen den **vollen** Warn-Pfad — der blockierende `--omit=dev` bleibt ohne Laufzeit-Deps erwartungsgemäß leer).
7.  **CI:** `.github/workflows/ci.yml` — `permissions: contents: read`; `npm ci`, `npx playwright install --with-deps chromium`, gitleaks-Action (**gepinnt, gleiche Version** wie `check:secrets`), `npm test`. Trigger: Push/PR auf `feature/*`, `rc/*`, `main`.
8.  **Deploy:** `.github/workflows/deploy.yml` — Trigger `on: push: tags: ['v*']` (bindet Auslieferung an das Tag, passend zum rc/Tag-Release-Modell). `permissions: pages: write, id-token: write, contents: read`; `environment: github-pages`; `concurrency`. **Gate:** Deploy-Job `needs:` einen Test-Job, der `npm test` fährt — kein Publish ohne grün. Vor dem Upload `npm run sw:build` mit der Tag-Version (stempelt Cache-Kennung + Precache aus dem Ordner), `.nojekyll` in `app/` legen; dann **den Ordner `app/`** direkt als Pages-Artefakt hochladen (`upload-pages-artifact` mit `path: app/`) + `deploy-pages`. **Keine Allowlist** — der Ordner ist die Grenze.
9.  **`_kontext/hoster.md` + README:** `hoster.md` = Repo anlegen, Pages aktivieren (Quelle: GitHub Actions), **Zurückrollen** (vorherigen Tag erneut deployen per Re-run/`workflow_dispatch`). `README.md` = Setup, Befehle, DS-Submodul (`git submodule update --init`, `npm run ds:copy`), Deploy/Pages.

## 2. Betroffene Dateien

Neu: `package.json`, `package-lock.json`, `eslint.config.js`, `.prettierrc`/`.prettierignore`, `.stylelintignore`, `scripts/ds-copy.mjs`, `scripts/gen-sw.mjs`, `scripts/audit.mjs`, `app/index.html`, `app/app.css`, `app/main.js`, `app/manifest.webmanifest`, `app/sw.js`, `app/vendor/designsystem/**` (kopiert; `.nojekyll` erzeugt der Deploy), `tests/unit/**`, `tests/e2e/**`, `tests/fixtures/**` (Negativproben), `playwright.config.js`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `_kontext/hoster.md`, `README.md`. Geändert: `.gitignore`.

## 3. Testfälle (je Akzeptanzkriterium)

-   `e2e/start.spec` — Startseite rendert `ToolHeader`-Text „Bouldering Berlin" + leere Übersicht (dark, iPhone). Erwartung: sichtbar.
-   `e2e/manifest.spec` — Manifest lädt, `display==='standalone'`, Icons 192/512 referenziert.
-   `e2e/offline.spec` — nach `npm run sw:build` + `serviceWorker.ready` offline + Reload → `ToolHeader` weiter sichtbar (kein Flaky durch Timing); Precache stammt aus dem generierten SW.
-   `unit/ds-copy.test` — Erfolg: richtige Dateien, keine React-Quellen; **Fehlerfall:** fehlendes Submodul → Exit ≠ 0 + klare Meldung.
-   „Prüfungen greifen" — je Negativprobe (Stylelint/ESLint/gitleaks/Audit-Warnpfad) liefert Exit ≠ 0 bzw. Meldung; nachspielbares Rezept.
-   „alle Prüfungen ein Befehl" — `npm test` grün; CI ruft denselben Befehl.
-   UI-Richtlinie: `npm run check:ui` = 0 Befunde.

## 4. Entwurf → Code

Entfällt (kein Design). Markup-Quelle für Komponenten-Klassen: `components/bundle.css` und `preview.html` des Design-Systems, nicht nur die README.

## 5. Externe Abhängigkeiten (How-to wo?)

-   **GitHub Pages** (Hosting/Deploy): How-to in `_kontext/hoster.md` (Schritt 9), inkl. Zurückrollen. Zugang: GitHub-Repo des Nutzers, keine Zugangsdaten im Dokument; Deploy via OIDC (`id-token`), keine gespeicherten Secrets. Test: Workflow-Lauf; echtes Pages erst nach Repo-Anlage.
-   **Playwright-Browser:** Chromium im Container/CI (`npx playwright install --with-deps chromium`). Prüfung: E2E-Lauf.
-   **gitleaks:** Binär im Container + offizielle Action in CI, **dieselbe gepinnte Version**; läuft bewusst doppelt (lokal↔CI identisch via `npm test`, zusätzlich Sichtbarkeit im CI-Log). Schließt die offene gitleaks-Frage aus `projekt.md`.
-   **npm-Registry:** nur Dev-Abhängigkeiten; App bleibt ohne Laufzeit-Deps.

## 6. Annahmen und Risiken

-   **Pages-Unterpfad:** Projekt-Pages liegen unter `…/<repo>/` → **relative** URLs und relativer SW-Scope; in Schritt 3/5 berücksichtigt (Haupt-Risiko).
-   **Audit blockierend faktisch leer:** ohne Laufzeit-Deps meldet `--omit=dev` nichts; das ist erwartet. Die Negativprobe prüft den vollen Warn-Pfad, damit „Audit greift" belegt bleibt.
-   **SW-Precache + Cache-Version:** werden aus dem Ordner `app/` **erzeugt** (`gen-sw.mjs`), nicht von Hand gepflegt — lokal mit Dev-Kennung, im Deploy mit der Tag-Version. Damit entfällt die frühere handgepflegte Liste und jeder Abgleich Precache↔Auslieferung (ein neuer Baustein unter `app/` wird automatisch mitgecacht).
-   **Service Worker/Offline** zuverlässig nur über http(s)/localhost; echte Installation nur am Gerät (Abnahme/Release-Nachprüfung).
-   **Kein Projekt-Remote:** Repo-Anlage + Pages-Aktivierung sind Nutzer-Handlung vor dem ersten Deploy (`hoster.md`).
-   **gitleaks/Chromium** müssen in der Agent-Umgebung vorhanden sein — Agent installiert nach Rückfrage.
-   **Typprüfung** (JSDoc + `tsc --noEmit`) ist bewusst **nicht** Teil des Grundgerüsts (in `projekt.md` nur „bei Bedarf") — kein Loch, sondern Entscheidung.

## 7. Nicht angefasst

Design-System (`_kontext/designsystem/`), Prozess-Ordner (`_anweisungen/`, `anforderungen/` außer diesem Dokument), spätere Tools, Prüf-Konfiguration des Templates.

## 8. Prüfung durch Rollen

Selbstprüfung + Architekt, Senior Dev, DevOps (Plan berührt CI/Hosting/Release). Alle blockierenden Befunde eingearbeitet (Test-first-Reihenfolge; Negativproben aller vier Prüfungen; Deploy-Trigger an Tag `v*`; getrennte Pages-Rechte; Gate vor Deploy). Empfohlene Befunde ebenfalls übernommen (ds-copy-Fehlerfall, Offline-Wartebedingung, Audit-Warnpfad, Markup-Quelle, Manifest-Icons, Precache-Liste, gitleaks-Version/Doppellauf, Zurückrollen, SW-Cache-Automatik, `.nojekyll`, Typprüfung außen vor). Keine offenen Rollen-Widersprüche; kein Befund berührt eine Anforderungs-Entscheidung.

## 9. Abweichungen in der Umsetzung

Gegenüber dem freigegebenen Plan, mit Grund (keine berührt eine Anforderungs-Entscheidung):

-   **E2E-Browser Chromium statt WebKit:** In der Agent-Umgebung laufen WebKit-System-Libs nicht (kein root). Playwright nutzt Chromium mit iPhone-Emulation (Viewport, Touch, iOS-UA). Echtes Safari bleibt der Geräte-Nachprüfung (Abnahme/Release) vorbehalten — war ohnehin so vorgesehen. *(Empfehlung: WebKit-Libs ins Container-Image aufnehmen.)*
-   **Lokaler Server:** statt des Pakets `serve` ein winziger eigener Node-Static-Server (`scripts/serve.mjs`) — entfernt 7 Audit-Warnungen und eine Abhängigkeit, build-frei.
-   **ESLint 10** statt der vorgeschlagenen 9 (aktuelle Hauptversion; flat config). Stylelint wie vom Template vorgegeben auf **16** fixiert.
-   **`.npmrc` mit `legacy-peer-deps=true`:** umgeht einen npm-10-Bug beim Peer-Set-Aufbau (vitest→jsdom→canvas); hält lokale Installation und CI (`npm ci`) identisch.
-   **gitleaks nur über `npm test`** (nicht zusätzlich als CI-Action), CI installiert die gepinnte Binär (8.21.2) — ein Lauf, lokal wie CI identisch (DevOps-Empfehlung E1).

# Testnachweis

-   **Rot** (vor der jeweiligen Änderung, test-first): `npx vitest run tests/unit/ds-copy.test.mjs` — 2 rot (Skript fehlt); `npx playwright test manifest.spec` — 1 rot („Manifest nicht erreichbar"); `offline.spec` — 1 rot (kein aktiver SW); `start.spec` — rot, da ohne `index.html` keine Seite ausgeliefert wird (Server-Readiness-Timeout). Negativproben belegen zusätzlich, dass Stylelint/ESLint/gitleaks bei einem Verstoß rot werden (`tests/unit/checks-fire.test.mjs`, 3 grün = die Prüfungen greifen).
-   **Grün** (nach der Umsetzung): `npm test` — ein Befehl, alle Prüfungen grün: ESLint 0 Fehler · Prettier 0 · Stylelint 0 · Vitest **8/8** · E2E (Playwright, iPhone) **3/3** · gitleaks keine Funde.
-   **Audit:** Prod (`--omit=dev`) **0** (blockierend sauber). Voller Audit: **5 High**, alle dev-only und unfixbar (`braces` ≤ 3.0.3 ohne Patch, transitiv über `stylelint`); wird nie ausgeliefert → als Warnung **hingenommen** (auf neueste `braces` aktualisiert, mehr nicht möglich).
-   **UI-Richtlinie:** `npm run check:ui` — **0 Befunde**; keine Ausnahmen. App-CSS nutzt nur Tokens; `app/vendor/**` ist ausgenommen.

# QA

*Vom Agenten in Stufe 6 ergänzt.*

# Abnahme

*In Stufe 7 ergänzt.*
