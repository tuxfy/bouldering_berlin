-   **Title** Prozess-Repo-Umstellung: Verweise auf neue Pfade nachziehen
-   **Status** review

# Idee

Der Prozess liegt jetzt als Submodul unter `_agent-process/`; Ordner wurden umbenannt (`_kontext/`→`_context/`, `anforderungen/`→`_requirements/`, `releases/`→`_releases/`, Design-System-Submodul `_kontext/designsystem/`→`_design-system/`), die UI-Prüf-Config liegt als `.stylelintrc.json` im Projekt. Der eigentliche Umzug ist auf diesem Branch committet (`4cffe9d`). In Code und Doku zeigen aber noch Verweise auf die **alten** Pfade — deshalb ist die CI rot. Diese Verweise sind nachzuziehen; zusätzlich die Kurzinfo in der Projekt-`AGENTS.md` aus `_context/projekt.md` ausfüllen.

# Hintergrund

Ist-Stand (bestätigt durch lokale Läufe am 2026-10-24):

-   **lint rot** (80 Fehler): `eslint.config.js` ignoriert noch `_kontext/designsystem/**`; der Pfad existiert nicht mehr, also lintet ESLint das Submodul `_design-system/` (React-Quellen) → `no-undef` u. a.
-   **format:check rot** (81 Dateien): `.prettierignore` listet `_anweisungen`/`_kontext`/`anforderungen`/`releases`; Prettier prüft daher `_design-system/`, `_context/` usw. und die neue `.stylelintrc.json`.
-   **check:ui rot**: `package.json` → `check:ui` zeigt per `--config` auf `_anweisungen/pruefung/stylelint.json` (ENOENT); die Config liegt jetzt als `.stylelintrc.json`.
-   **test:unit / check:secrets grün** — aber: `tests/unit/checks-fire.test.mjs` ist beim Stylelint-Fall nur „grün", weil die alte Config fehlt (Lauf bricht mit Config-Fehler ab, nicht wegen der Hex-Farbe) → hohler Test.
-   Weitere, nicht CI-brechende Alt-Verweise: `scripts/ds-copy.mjs` (Default-Quelle), `scripts/check-clean.mjs` (Selbsttest-Pfad), `gitleaks.toml` (Allowlist), `.github/workflows/ci.yml` (`rc/*`), `_context/*`, `README.md`, Kommentare.
-   Die Projekt-`AGENTS.md` hat die Kurzinfo noch als Platzhalter.

# Einordnung

-   **Art:** technisch (Repo-Umstellung / CI-Regression)
-   **Spielraum** (nur Angekreuztes darf sich ändern):
    -   [ ] Darstellung
    -   [x] Verhalten *(Prüf-/Build-Konfiguration, damit die CI wieder grün läuft)*
    -   [x] Struktur *(Verweise/Pfade in Code und Doku)*
    -   [ ] Schnittstellen/Daten
-   **Weg:** Design nötig? nein · Ursache bestätigen? ja — bestätigt (siehe Hintergrund)

# Offene Fragen

-   *(keine — in „Entscheidungen" geklärt)*

# Entscheidungen

-   **Nur Verweise nachziehen, keine Umbenennung.** Der Ordner-Umzug ist erledigt (`4cffe9d`); diese Anforderung ändert ausschließlich Verweise auf alte Pfade plus die `AGENTS.md`-Kurzinfo.
-   **Eingefroren (Historie, nicht geändert):** `_requirements/done/001|002` (`done`) und `_releases/0.1.0|0.1.1|0.1.2` (`failed`/`released`). Ihre Alt-Pfade sind historische Einträge.
-   **`app/vendor/designsystem/` bleibt** — das ist die eingecheckte Vendor-Kopie *in* der App, nicht das umbenannte Submodul.
-   **`.gitmodules`-Sektionsname `[submodule "_kontext/designsystem"]` bleibt** — der `path = _design-system` ist bereits korrekt; den internen Namen umzubenennen berührt `.git/modules` (riskant) und ist nicht CI-relevant.
-   **`_agent-process/` und `_design-system/` werden nicht bearbeitet.**
-   **Test-first:** neuer Guard `tests/unit/repo-paths.test.mjs`, der in den lebenden Code-/Konfig-/Workflow-/Test-Dateien keine Alt-Tokens (`_kontext`, `_anweisungen`, `anforderungen/`) duldet — vor der Korrektur rot, danach grün. Zusätzlich `checks-fire.test.mjs` auf `.stylelintrc.json` umstellen, damit der Stylelint-Fall wieder echt greift.

# Verhalten

Aus Sicht von Entwickler/CI:

-   `npm test` läuft wieder vollständig grün (lint, format:check, check:ui, unit, audit, secrets, e2e), lokal und in der CI.
-   `npm run ds:copy` kopiert aus `_design-system/`; `npm run check:clean` prüft submodul-frei gegen `_design-system`.
-   Doku (`_context/`, `README.md`) und Projekt-`AGENTS.md` beschreiben die neue Struktur.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| Guard-Test `repo-paths` geschrieben, vor der Korrektur **rot** (Alt-Tokens in lebenden Dateien) | Unit |
| Keine lebende Code-/Konfig-/Workflow-/Test-Datei verweist mehr auf alte Pfade | Unit (`repo-paths`) |
| `checks-fire.test.mjs` prüft Stylelint über `.stylelintrc.json` (nicht über Config-Fehler) | Unit |
| Nach der Korrektur `npm test` grün | Testlauf |
| Sauberer Lauf `npm run check:clean` grün (Selbsttest prüft `_design-system`) | check:clean |
| CI auf dem gepushten Branch grün | CI |
| Projekt-`AGENTS.md`-Kurzinfo aus `_context/projekt.md` ausgefüllt | Review |
| `_context/`-Doku + `README.md` zeigen auf neue Pfade | Review |
| `_requirements/done/*`, `_releases/*`, `_agent-process/`, `_design-system/`, `app/vendor/` unverändert | Review / `git diff` |

# Abgrenzung

-   **Keine** inhaltliche Änderung an `_agent-process/`, `_design-system/`, `app/vendor/designsystem/`.
-   **Keine** Änderung an eingefrorenen `done`-/Release-Dokumenten.
-   **Keine** Umbenennung des `.gitmodules`-Sektionsnamens.
-   Kein neues Tooling, keine neuen Pakete.

# Technische Notizen

*Optional, nicht bindend.* Guard liest eine feste Liste lebender Dateien (schließt sich selbst aus, da er die Alt-Tokens als Suchmuster enthält). `_design-system` und `_context` sind **erlaubte** Tokens — nur `_kontext`, `_anweisungen`, `anforderungen/` sind verboten.

# Umsetzungsplan

*Vom Nutzer vorab freigegeben (Auftrag dieser Sitzung: „Klärung kurz, Refinement, Umsetzungsplan, Umsetzung, QA").*

1.  **Schritte:**
    1.  **(5c, rot)** Guard `tests/unit/repo-paths.test.mjs` schreiben; `npx vitest run tests/unit/repo-paths.test.mjs` → **rot**. Nicht committen.
    2.  **(5d) CI-brechende Fixes:** `eslint.config.js` ignore `_kontext/designsystem/**`→`_design-system/**`; `.prettierignore` (`_anweisungen`→`_agent-process`, `_kontext`→`_context`, `anforderungen`→`_requirements`, `releases`→`_releases`, `_design-system` ergänzen); `package.json` `check:ui` `--config .stylelintrc.json`; `checks-fire.test.mjs` Stylelint-Config → `.stylelintrc.json`; `.stylelintrc.json` mit Prettier formatieren.
    3.  **(5d) Funktional:** `scripts/ds-copy.mjs` (`DS_SRC` default `_design-system`), `scripts/check-clean.mjs` (Selbsttest-Pfad `_design-system`), `gitleaks.toml` (Allowlist `_design-system/`, `_agent-process/`), Kommentare in `scripts/audit.mjs`/`ci-workflows.test.mjs`.
    4.  **(5d) Workflows:** `ci.yml` `on.push.branches` `rc/*`→`next`, `fix/*` ergänzen; Kommentare in `ci.yml`/`deploy.yml`.
    5.  **(5d) Doku:** `_context/projekt.md|design.md|hoster.md`, `README.md`, Kommentare `app/index.html`/`playwright.config.js`; Projekt-`AGENTS.md`-Kurzinfo aus `_context/projekt.md`.
    6.  **(5e, grün)** `npm test` grün; `npm run check:clean` grün; Guard grün. Testnachweis, Commit, Push, PR nach `next`.
2.  **Betroffene Dateien:**
    -   neu: `tests/unit/repo-paths.test.mjs`
    -   geändert (Konfig/Code/Test): `eslint.config.js`, `.prettierignore`, `.stylelintrc.json`, `package.json`, `gitleaks.toml`, `scripts/ds-copy.mjs`, `scripts/check-clean.mjs`, `scripts/audit.mjs`, `tests/unit/checks-fire.test.mjs`, `tests/unit/ci-workflows.test.mjs`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
    -   geändert (Doku): `AGENTS.md`, `README.md`, `_context/projekt.md`, `_context/design.md`, `_context/hoster.md`, `app/index.html` (Kommentar), `playwright.config.js` (Kommentar)
3.  **Testfälle:** Guard `repo-paths` rot→grün; `checks-fire` Stylelint echt (Config-Pfad gültig, meldet Hex-Farbe); voller `npm test` grün; `check:clean` grün.
4.  **Entwurf → Code:** entfällt (kein Design, keine UI/CSS berührt).
5.  **Externe Abhängigkeiten:** keine neuen.
6.  **Annahmen und Risiken:**
    -   `check:clean` klont HEAD → Guard + Fixes müssen committet sein, bevor es grün ist (deshalb am Ende).
    -   Im `check:clean`-Klon ist `_design-system` ein leerer Gitlink → Selbsttest „leer" greift wie zuvor.
    -   Risiko gering/mechanisch; CI-Lauf auf dem Branch ist die Gegenprobe.
7.  **Nicht angefasst:** `_agent-process/`, `_design-system/`, `app/vendor/designsystem/`, `_requirements/done/*`, `_releases/*`, `.gitmodules`-Sektionsname.

# Testnachweis

-   **Rot** (vor der Korrektur):
    -   `npx vitest run tests/unit/repo-paths.test.mjs` → **11 fehlgeschlagen / 3 bestanden** (14): Alt-Tokens in `eslint.config.js`, `.prettierignore`, `package.json`, `gitleaks.toml`, `scripts/*`, Workflows, Tests.
    -   `npm test` rot: **lint** 80 Fehler (ESLint lintet `_design-system/`), **format:check** 81 Dateien, **check:ui** Config `_anweisungen/pruefung/stylelint.json` nicht gefunden.
-   **Grün** (nach der Korrektur): `npm test` — **grün**: ESLint 0 · Prettier 0 · Stylelint (UI, `.stylelintrc.json`) 0 Befunde · Vitest **24/24** (5 Dateien, inkl. 14 `repo-paths`-Guards; `checks-fire` prüft Stylelint jetzt echt über `.stylelintrc.json`) · Audit 0 prod / 0 dev · gitleaks keine · Playwright (iPhone/dark) 3/3.
-   **Sauberer Lauf:** `npm run check:clean` — **grün** (submodul-freier Klon des 5e-Stands; Selbsttest „`_design-system` leer: ja"). Belegt, dass `npm test` ohne Submodul durchläuft.
-   **UI-Richtlinie:** `npm run check:ui` — 0 Befunde; keine UI/CSS berührt. Ausnahmen: keine.

# QA

## Automatisch

Lauf im Container (`npm ci` aus der Lock-Datei, alle Prüfungen aus `_context/projekt.md`):

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Lint | `npm run lint` | grün (vorher 80 Fehler) |
| Format | `npm run format:check` | grün (vorher 81 Dateien) |
| UI-Prüflauf | `npm run check:ui` (`.stylelintrc.json`) | 0 Befunde (vorher Config-ENOENT) |
| Unit (Vitest) | `npm run test:unit` | 24/24 (inkl. 14 `repo-paths`-Guards) |
| Audit | `npm run audit` | 0 Prod / 0 Dev |
| Secrets (gitleaks) | `npm run check:secrets` | keine |
| E2E (Playwright, iPhone/dark) | `npm run test:e2e` | 3/3 |
| Sauberer Lauf | `npm run check:clean` | grün (submodul-frei; Selbsttest „`_design-system` leer: ja") |

## Geprüft durch

Reviewer (durch den Agenten, da keine Prüfer-Unteragenten mehr verfügbar; nur lesende Diff-Prüfung gegen Anforderung/Plan/Abgrenzung). Klicktester entfällt (keine UI/App-Änderung). Security entfällt (keine neuen Dienste/Daten; gitleaks grün).

## Befunde

Reviewer: **keine blockierenden, keine empfohlenen** Befunde. Bestätigt: alle CI-brechenden Referenzen behoben (`npm test` grün); Guard `repo-paths` greift echt (vorher 11/14 rot); `checks-fire` prüft Stylelint wieder über `.stylelintrc.json` (erkennt die Hex-Farbe → Regeln aktiv, nicht abgeschwächt); `.stylelintrc.json`-Änderung ist reine Prettier-Formatierung (JSON-Semantik gleich); gitleaks-Allowlist nicht zu weit (Dummy-Leak wird weiter gefunden); `check:clean`-Selbsttest auf `_design-system` umgestellt und weiterhin aussagekräftig. Abgrenzung eingehalten: `git diff` ohne Änderung an `_requirements/done/*`, `_releases/*`, `_agent-process/`, `_design-system/`, `app/vendor/`.

Ein **Hinweis** (nichts muss): Der `.gitmodules`-Sektionsname `[submodule "_kontext/designsystem"]` bleibt bewusst stehen (der `path = _design-system` ist korrekt; den internen Namen umzubenennen berührt `.git/modules`, ist riskant und nicht CI-relevant).

## CI

Pull Request [#4](https://github.com/tuxfy/bouldering_berlin/pull/4) `feature/prozess-repo-umstellen` → `next`, Lauf [40071325294](https://github.com/tuxfy/bouldering_berlin/actions/runs/40071325294): **`test` grün**, Socket Security grün. `MERGEABLE`/`CLEAN`.

# Abnahme

*In Stufe 7 ergänzt.*
