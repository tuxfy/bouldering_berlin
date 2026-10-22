# Projekt

*In Stufe 0 (`_anweisungen/00-einrichtung.md`) festgelegt; bei Änderungen dort erneut. Offenes ausdrücklich als offen markiert.*

## Zweck

Eine Sammlung kleiner, mobiler Tools rund ums Bouldern („Bouldering Berlin Toolkit"), ausgeliefert als **eine** installierbare PWA. Werkzeug-Charakter, keine Marketing-App: Bedienung mit einer Hand in der (dunklen) Halle. Einzelne Tools (z. B. Boulder-Log, Intervall-Timer, QR-Scan) sind je eine eigene spätere Anforderung — dieses Projekt richtet nur die gemeinsame Grundlage ein.

## Stack

*Sprache, Framework, Build, Laufzeit-Abhängigkeiten.*

- **Sprache:** JavaScript, native ES-Module im Browser, **keine Transpilierung**. Optional Typprüfung über JSDoc + `tsc --noEmit` als reine Dev-Prüfung (kein Build, keine Laufzeitwirkung) — bei Bedarf.
- **Framework:** keins. Native Web Components + ES-Module; jedes Tool eine eigene Seite/Komponente.
- **Build:** **keiner.** Die App wird als statische Dateien ausgeliefert.
- **PWA:** handgeschriebenes `manifest.json` + Service Worker (ohne Workbox/Build), offline-fähig.
- **Laufzeit-Abhängigkeiten:** keine. Das Design-System kommt als kopierte CSS (siehe „Befehle" und `_kontext/design.md`). npm/`package.json` existiert nur für **Dev-Werkzeuge** (Prüfungen) — die App selbst bleibt build-frei.

## Zielformat

*Geräte, Bildschirmgrößen, Ausrichtung, hell/dunkel, Sprache, Barrierefreiheit.*

- **Gerät:** primär iPhone (Safari), als **Standalone-PWA**; responsiv bis Desktop nutzbar.
- **Ausrichtung/Layout:** Hochformat; Inhalt in zentrierter Spalte **max. 480px**. Touch-Ziele **≥ 44px** (eine Hand).
- **Farbschema:** **nur Dark Mode** — so gibt es das Design-System bewusst vor (kein helles Theme). `[data-theme="dark"]`.
- **Sprache:** Deutsch; Kletter-/Training-Fachbegriffe bleiben englisch („send", „Work", „Rest", „Sets" …) — siehe „Content Fundamentals" der Design-System-README.
- **Barrierefreiheit:** semantisches HTML, Tastatur/Fokus (einheitlicher 2px-Fokusring aus Tokens), Kontrast AA (durch die Tokens erfüllt). axe in den E2E-Tests (optional).

## Prüfungen

| Kategorie | Werkzeug | Befehl |
|---|---|---|
| Code-Linter | ESLint (flat config) | `npm run lint` |
| Formatierer | Prettier (Standardeinstellungen) | `npm run format:check` |
| Prüflauf UI-Richtlinie | Stylelint 16 + stylelint-declaration-strict-value 1, Config `_anweisungen/pruefung/stylelint.json` | `npm run check:ui` |
| Unit-Tests | Vitest | `npm run test:unit` |
| E2E-Tests | Playwright (iPhone-Viewport, dark; axe optional) | `npm run test:e2e` |
| Schwachstellen in Abhängigkeiten | npm audit | `npm run audit` (`npm audit --omit=dev` blockiert; voller `npm audit` nur Warnung) |
| Geheimnisse im Code | gitleaks | `npm run check:secrets` |
| Barrierefreiheit *(optional)* | axe-core in Playwright | Teil von `npm run test:e2e` |

**Alle Prüfungen:** `npm test` — ruft alle oben genannten nacheinander auf, **lokal (im Container) und in der CI identisch**. Bewusst weggelassen: *(keine)*

Hinweis UI-Prüflauf: nur **App-Stylesheets** prüfen (`app/**/*.css`), **nicht** die Kopie des Design-Systems unter `app/vendor/designsystem/`.

## Befehle

*Lokal starten (Abnahme), Design-System kopieren (falls nötig), weitere.*

- **Lokal starten (Abnahme):** `npm start` → erzeugt den Service Worker (`npm run sw:build`) und startet einen statischen Server (z. B. `npx serve`) auf dem Ordner `app/` unter `http://localhost:<port>`. `localhost` gilt als sicherer Kontext, daher funktioniert der Service Worker lokal.
- **Design-System kopieren:** `npm run ds:copy` → kopiert die ausgelieferten Dateien aus dem Submodul `_kontext/designsystem/` (`tokens.css`, `components/bundle.css`, `assets/Icons/`, `assets/Logos/`) nach `app/vendor/designsystem/`. Stand (Submodul-Commit) in `_kontext/design.md` eintragen.
- **Design-System aktualisieren:** `git submodule update --remote _kontext/designsystem`, danach `npm run ds:copy` und neuen Commit-Stand in `design.md`.
- **Dev-Werkzeuge installieren:** `npm ci` (aus der Lock-Datei).

## Umgebung des Agenten

*Wo der Agent arbeitet und testet (z. B. Container), was dort verfügbar sein muss.*

- Docker-Container über `run-ai-agent.sh` (Image `ai-agents`), mit gemountetem `/workspace` und `node_modules` als container-eigenem Volume (bei jedem Start `npm ci`).
- Verfügbar sein muss: **Node + npm**, **Chromium** für Playwright (`npx playwright install --with-deps chromium`), **gitleaks**. Der Agent installiert Abhängigkeiten/Werkzeuge **selbst in seiner Umgebung**, nach Rückfrage — nie auf dem Rechner des Nutzers.
- **gitleaks:** fest im Container-Image und in der CI als gepinnte Binär (gleiche Version wie `check:secrets`); `npm test` ruft die Binär.
- **Empfehlung (offen):** Für originalgetreue Safari-E2E fehlen im aktuellen Image die **WebKit-System-Bibliotheken** (`npx playwright install --with-deps webkit` braucht root). Solange sie fehlen, laufen die E2E in **Chromium mit iPhone-Emulation**; Safari-Eigenheiten bleiben der Geräte-Nachprüfung vorbehalten. WebKit-Libs ins Image aufnehmen, dann auf WebKit umstellen.

## Auslieferung und Release

*Wohin (Rolle „Hoster", How-to in `_kontext/`), Release-Modell, Zurückrollen.*

- **Hoster:** GitHub Pages (statisches Hosting). Deploy per GitHub Actions. How-to beim Grundgerüst als `_kontext/hoster.md` anlegen. *(offen: GitHub-Repo/Pages-URL und ggf. CI-Rechte.)*
- **Release-Modell:** Standard mit Release-Kandidat `rc/<version>` (siehe `_anweisungen/08-release.md`). Branches: je Anforderung `feature/<Nr>-<name>` von `main`; nach Abnahme in `rc/<version>`; Release = Zusammenführen nach `main` mit Tag `v<version>`.
- **Zurückrollen:** vorherigen Tag/Commit erneut auf Pages veröffentlichen (Deployment auf den letzten funktionierenden Stand zurücksetzen).

## Abnahme

*Wo und wie der Nutzer abnimmt (lokal, Befehl); was nur am echten Gerät prüfbar ist.*

- **Lokal:** `npm start`, im Browser im mobilen Viewport (iPhone), Dark Mode.
- **Nur am echten Gerät prüfbar** (dann als Nachprüfung nach dem Release, im `releases/`-Dokument): PWA-Installation („Zum Home-Bildschirm"), echtes Offline-Verhalten, Standalone-Darstellung und Safari-Eigenheiten.
