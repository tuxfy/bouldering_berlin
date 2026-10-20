# Bouldering Berlin Toolkit

Sammlung kleiner, mobiler Tools rund ums Bouldern — eine installierbare PWA, **ohne Build**, nur mit nativen ES-Modulen. Zielgerät: iPhone/Safari (Standalone-PWA, Dark Mode, Bedienung mit einer Hand). Einzelne Tools folgen als eigene Anforderungen; dieses Repo enthält das gemeinsame Grundgerüst.

Der Prozess (Idee → Release) ist in `AGENTS.md` beschrieben; Projekt-Festlegungen stehen in `_kontext/projekt.md` und `_kontext/design.md`.

## Voraussetzungen

- Node 20
- Das Design-System ist als Git-Submodul unter `_kontext/designsystem/` eingebunden.

## Einrichten

```bash
git submodule update --init   # Design-System holen
npm ci                        # Dev-Werkzeuge (die App selbst hat keine Laufzeit-Abhängigkeiten)
npm run ds:copy               # Design-System nach app/vendor/designsystem/ kopieren
```

## Befehle

| Befehl | Zweck |
|---|---|
| `npm start` | erzeugt den Service Worker und startet die App lokal auf `http://localhost:5000` (Ordner `app/`) |
| `npm test` | **alle** Prüfungen nacheinander — identisch zur CI |
| `npm run ds:copy` | Design-System aus dem Submodul nach `app/vendor/designsystem/` kopieren |
| `npm run lint` · `format:check` · `check:ui` | Linter · Formatierer · UI-Richtlinie (Stylelint) |
| `npm run test:unit` · `test:e2e` | Unit- (Vitest) · E2E-Tests (Playwright, iPhone-Viewport) |
| `npm run audit` · `check:secrets` | Schwachstellen · Geheimnis-Suche (gitleaks) |

## Aufbau

- `app/` — **alles Ausgelieferte** liegt hier (Web-Root und Deploy-Artefakt):
  - `index.html`, `app.css`, `main.js`, `manifest.webmanifest`, `sw.js`
  - `vendor/designsystem/` — kopierter CSS-Vertrag des Design-Systems (eingecheckt)
  - `sw-precache.js` — generiert (nicht eingecheckt), erzeugt von `scripts/gen-sw.mjs`
- `scripts/` — `ds-copy.mjs`, `gen-sw.mjs`, `serve.mjs`, `audit.mjs`
- `tests/` — `unit/` (Vitest) und `e2e/` (Playwright); `fixtures/` für die Negativproben
- `.github/workflows/` — `ci.yml` (Prüfungen) und `deploy.yml` (Pages)

Prozess-/Dev-Ordner (`_anweisungen/`, `_kontext/`, `anforderungen/`, Tests, `node_modules/`) liegen außerhalb von `app/` und werden nicht ausgeliefert.

## Design-System

Nur Dark Mode. Die App nutzt ausschließlich Tokens und Komponenten-Klassen des Design-Systems (`tokens.css`, `components/bundle.css`) — keine festen Werte, keine Inline-Styles. Das Design-System wird im Projekt nie bearbeitet; Aktualisierung über das Submodul und `npm run ds:copy`. Details: `_kontext/design.md`.

## Auslieferung

GitHub Pages, automatisch beim Release-Tag `v<version>`. Einrichtung, Ausliefern und Zurückrollen: `_kontext/hoster.md`.
