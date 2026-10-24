-   **Title** CI bricht am Klonen des Design-System-Submoduls ab
-   **Status** done

# Bug

-   **Was passiert:** Die CI (`.github/workflows/ci.yml` und der Test-Gate in `deploy.yml`) checkt mit `submodules: true` aus und versucht, das Submodul `_kontext/designsystem` (`git@github.com:tuxfy/design_system_bb.git`) zu klonen. Das schlägt fehl („remote: Repository not found" / „fatal: clone of … failed"), der Lauf bricht ab, noch bevor `npm test` startet.
-   **Was erwartet war:** Die CI läuft durch; alle Prüfungen (`npm test`) werden ausgeführt.
-   **So tritt es auf:** Bei jedem Push/PR (Schritt „Fetching submodules" von `actions/checkout`). Das private Submodul-Repo ist für den Standard-Token der Action nicht erreichbar. Das Submodul wird für `npm test` nicht gebraucht: Das Design-System liegt als eingecheckte Kopie unter `app/vendor/designsystem/`, der UI-Prüflauf läuft nur auf `app/**/*.css` (Vendor-Kopie ausgeschlossen); der Deploy-Job checkt bereits ohne Submodule aus.
-   **Stand:** Commit `009f846` (main), GitHub Actions (ubuntu-latest), `actions/checkout@v4`.

# Hintergrund

Ist-Stand (bestätigtes Fehlverhalten und Ursache):

-   Beide Workflows checken im Test-Schritt mit `submodules: true` aus. `actions/checkout` ruft dafür `git submodule update --init` und scheitert am privaten, für den Lauf nicht erreichbaren Repo `git@github.com:tuxfy/design_system_bb.git` → Abbruch vor `npm test`.
-   Das Submodul `_kontext/designsystem` dient ausschließlich dem **manuellen** Schritt `npm run ds:copy`, der die ausgelieferten Dateien nach `app/vendor/designsystem/` kopiert. Diese Kopie (`tokens.css`, `components/bundle.css`, Icons/Logos — 7 Dateien) ist **eingecheckt**.
-   `npm test` greift nirgends auf das Submodul zu: Die einzigen Code-Referenzen auf `_kontext/designsystem` sind in `eslint.config.js` (nur als Ignorier-Pfad) und in `scripts/ds-copy.mjs` (nicht Teil von `npm test`). Der UI-Prüflauf läuft nur auf `app/**/*.css`.
-   Der Deploy-Job in `deploy.yml` checkt bereits ohne Submodule aus und vermerkt das ausdrücklich. Nur die beiden **Test-Checkouts** (`ci.yml` und der `test`-Gate in `deploy.yml`) tun es unnötig.

# Einordnung

-   **Art:** Bug (technisch — CI, kein App-Verhalten betroffen)
-   **Spielraum** (nur Angekreuztes darf sich ändern):
    -   [ ] Darstellung
    -   [x] Verhalten *(der betroffenen Stelle: die beiden CI-Test-Checkouts sollen das Submodul nicht mehr klonen)*
    -   [ ] Struktur
    -   [ ] Schnittstellen/Daten
-   **Weg:** Design nötig? nein · Ursache bestätigen? ja — bestätigt (siehe Hintergrund)

# Offene Fragen

-   *(keine — in „Entscheidungen" geklärt)*

# Entscheidungen

-   **Richtung der Korrektur: Variante A.** `submodules: true` aus den beiden Test-Checkouts entfernen (`ci.yml` Job `test`; `deploy.yml` Job `test`). Das Submodul wird für `npm test` nicht gebraucht; die ausgelieferten Design-System-Dateien liegen eingecheckt unter `app/vendor/designsystem/`. Kein Deploy-Key/PAT nötig (Variante B verworfen: mehr Aufwand und ein Geheimnis, ohne Nutzen, solange die CI `ds:copy` nicht selbst ausführt).
-   **`.gitmodules` bleibt unverändert.** Die SSH-URL ist für Entwickler mit Zugriff weiterhin korrekt; nur die CI soll das Submodul nicht mehr anfassen. Die eingecheckte Vendor-Kopie bleibt ebenfalls unangetastet.
-   **Der Deploy-Job (`deploy`) bleibt wie er ist** — er checkt schon ohne Submodule aus.
-   **Technik:** keine neuen Pakete/Werkzeuge. Der Rot→Grün-Nachweis ist ein Vitest-Unit-Test, der die Workflow-Dateien als Text liest und prüft, dass kein `actions/checkout` Submodule zieht (`submodules:` mit truthy-Wert). Reines `node:fs` — kein YAML-Parser, keine neue Abhängigkeit.
-   **Keine externen Abhängigkeiten, nichts nur am Gerät prüfbar.** Der tatsächliche CI-Durchlauf ist nur auf GitHub beobachtbar und wird nach dem Merge als manuelle Gegenprobe bestätigt.

# Verhalten

Aus Sicht von Entwickler/CI:

-   Ein Push/PR löst die CI aus; der Checkout zieht **kein** Submodul mehr, der Lauf erreicht `npm test` und führt alle Prüfungen aus.
-   Beim Release (Tag `v*`) läuft der Test-Gate in `deploy.yml` genauso durch, bevor deployt wird.
-   Lokale Abläufe (`npm run ds:copy`, `git submodule update --remote …`) bleiben unverändert — das Submodul steht Entwicklern mit Zugriff weiter zur Verfügung.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| Guard-Test geschrieben, der vor der Korrektur **rot** ist (ein Workflow-Checkout zieht noch Submodule) | Testlauf (Unit) |
| Kein `actions/checkout` in `ci.yml`/`deploy.yml` zieht Submodule (`submodules: true` entfernt) | Unit |
| Nach der Korrektur laufen alle Tests grün (`npm test`) | Testlauf |
| UI-Richtlinie eingehalten — keine UI/CSS berührt, Prüflauf bleibt grün (0 Befunde) | Test (`check:ui`) |
| `.gitmodules` und `app/vendor/designsystem/` unverändert | Review / `git diff` |
| CI-Lauf erreicht `npm test` und bricht nicht mehr am Submodul ab | manuell (nächster CI-Lauf nach Merge) |

# Abgrenzung

-   **Keine** Einrichtung von Deploy-Key/PAT für Submodul-Zugriff in der CI (Variante B).
-   **Kein** Umbau der Submodul-Definition oder Entfernen des Submoduls.
-   **Keine** Änderung an der App, an `app/vendor/designsystem/` oder am `ds:copy`-Ablauf.
-   Die separate Backlog-Idee `werkzeuge-aktualisieren` bleibt unberührt.

# Technische Notizen

*Optional, nicht bindend.*

-   Betroffen: `.github/workflows/ci.yml` (Job `test`, Schritt `actions/checkout`), `.github/workflows/deploy.yml` (Job `test`, Schritt `actions/checkout`). Je das `with: submodules: true` entfernen (und das dann leere `with:` mit).
-   Neuer Test z. B. `tests/unit/ci-workflows.test.mjs` (passt zu `include: tests/unit/**/*.test.mjs`).
-   Größe: klein, ein Umsetzungsdurchgang.

# Umsetzungsplan

1.  **Schritte:**
    1.  Guard-Test `tests/unit/ci-workflows.test.mjs` schreiben: liest beide Workflow-Dateien und stellt sicher, dass **kein** `actions/checkout`-Schritt Submodule zieht. Ausführen → **rot** (beide enthalten noch `submodules: true`). Testnachweis „Rot".
    2.  Korrektur: in `ci.yml` (Job `test`) und `deploy.yml` (Job `test`) beim `actions/checkout@v4` das `with: submodules: true` entfernen (das dann leere `with:` mit). Der `deploy`-Job bleibt unverändert.
    3.  Alle Prüfungen ausführen (`npm test`) → **grün**. Testnachweis „Grün" und „UI-Richtlinie". Status `qa`.
2.  **Betroffene Dateien:**
    -   neu: `tests/unit/ci-workflows.test.mjs`
    -   geändert: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
3.  **Testfälle:**
    -   `ci-workflows.test.mjs`: Invariante „**für jeden** `actions/checkout`-Schritt in `ci.yml` und `deploy.yml` gilt: kein truthy `submodules` (`true`/`recursive`)". Prüft alle Jobs beider Dateien — schützt damit dauerhaft auch den `deploy`-Job, nicht nur die zwei Test-Jobs; nicht auf eine feste Anzahl Fundstellen fixiert. Ist-Zustand vor der Korrektur: 2 Fundstellen → rot; nach der Korrektur 0 → grün. Deckt die Kriterien „Guard-Test rot vorher", „kein `submodules: true` mehr", „nach Korrektur grün".
    -   Unverändert-Kriterien (`.gitmodules`, `app/vendor/designsystem/`) über `git diff` im Review; `check:ui` bleibt Teil von `npm test`.
4.  **Entwurf → Code:** entfällt (kein Design).
5.  **Externe Abhängigkeiten:** keine neuen. Der Test nutzt nur `node:fs`; Hosting/CI-How-to steht in `_kontext/hoster.md`. Kein Zugang, kein Geheimnis nötig.
6.  **Annahmen und Risiken:**
    -   Annahme: `npm test` greift nirgends auf das Submodul zu (in der Klärung belegt). Risiko gering; der nächste CI-Lauf nach Merge ist die Gegenprobe.
    -   Risiko: Der Text-Guard (ohne YAML-Parser) könnte theoretisch an ungewöhnlicher Formatierung vorbeigehen. Abgedeckt, indem der Test auf das Schlüsselwort `submodules:` im Checkout-Kontext prüft, nicht auf eine exakte Zeile.
    -   DevOps-Empfehlung (nicht übernommen in diesem Bug, bewusst): In `_kontext/hoster.md` einen Halbsatz ergänzen, dass das Submodul nur für lokales `ds:copy`/DS-Update gebraucht wird und für CI/Deploy ohne Belang ist. Gehört zur `_kontext/`-Doku, die dieser Bug ausgrenzt — später als Doku-Pflege.
    -   DevOps-Prüfung: keine blockierenden Befunde; Korrektur für CI, Deploy-Gate, Pages-Deploy und Release-Modell vollständig und korrekt.
7.  **Nicht angefasst:** `.gitmodules`, das Submodul selbst, `app/vendor/designsystem/`, der `ds:copy`-Ablauf, der `deploy`-Job, die App.

# Testnachweis

-   **Rot** (vor der Änderung): `npx vitest run tests/unit/ci-workflows.test.mjs` — 0 bestanden / 2 fehlgeschlagen; rot: `ci.yml: kein actions/checkout mit truthy submodules`, `deploy.yml: kein actions/checkout mit truthy submodules` (je `expected [ 'true' ] to deeply equal []`).
-   **Grün** (nach der Änderung): `npm test` — alle Prüfungen grün. Unit (Vitest): 10 bestanden / 0 fehlgeschlagen (inkl. der 2 Guard-Tests); E2E (Playwright, iPhone/dark): 3 bestanden / 0; Audit: 0 Prod-Schwachstellen (5 Dev-Warnungen hingenommen); Secrets (gitleaks): keine.
-   **UI-Richtlinie:** `npm run check:ui` — 0 Befunde (Teil von `npm test`); keine UI/CSS berührt. Ausnahmen: keine.

# QA

## Automatisch

Ein Lauf, `npm test` (alle Prüfungen aus `_kontext/projekt.md`, lokal im Container):

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Lint | `npm run lint` | grün |
| Format | `npm run format:check` | grün |
| UI-Prüflauf | `npm run check:ui` | 0 Befunde |
| Unit (Vitest) | `npm run test:unit` | 10 bestanden / 0 (inkl. 2 Guard-Tests) |
| Audit | `npm run audit` | 0 Prod-Schwachstellen; 5 Dev-Warnungen (Hinweis) |
| Secrets (gitleaks) | `npm run check:secrets` | keine |
| E2E (Playwright, iPhone/dark) | `npm run test:e2e` | 3 bestanden / 0 |

-   **Hinweis:** 5 Schwachstellen-Warnungen in Entwicklungswerkzeugen (nicht ausgeliefert). Bereits als Idee im Backlog erfasst (`werkzeuge-aktualisieren`), kein neuer Eintrag nötig.
-   E2E lief in **Chromium mit iPhone-Emulation** (WebKit-Libs fehlen im Image, siehe `_kontext/projekt.md`) — für diese CI-Änderung ohne Belang.

## Geprüft durch

Reviewer (nur lesend). Klicktester entfällt (keine UI); Security auf Wunsch ausgelassen (reine CI-Konfiguration).

## Befunde

Reviewer: **keine blockierenden, keine empfohlenen** Befunde. Bestätigt: Guard-Test deckt die Kriterien ab und erkennt die Regression echt (Regex gegen mehrere Formatierungen geprüft, `true`/`recursive` erkannt, `false` durchgelassen); Korrektur vollständig (kein `submodules`-Vorkommen mehr in `.github/`); Abgrenzung eingehalten (`git diff` ohne Änderung an `.gitmodules`, `app/vendor/designsystem/`, `deploy`-Job, App); keine übersehene Submodul-Nutzung in `npm test`; Plan/Testnachweis/Änderung stimmen überein.

Zwei **Hinweise** (nichts muss):

1.  Die Dateiliste `WORKFLOWS` im Guard-Test ist statisch — eine künftige dritte Workflow-Datei mit `submodules: true` würde nicht erfasst. Folge gering (aktuell nur zwei Dateien, beide vollständig geprüft). Optionale spätere Robustheit: Liste per Glob `.github/workflows/*.yml`. Für diesen Bug nicht umgesetzt — Scope eng gehalten.
2.  Erinnerung, den QA-Abschnitt zu füllen — hiermit erledigt.

# Abnahme

> **Aufgehoben am 2026-10-22.** Diese Abnahme beruhte auf einem **lokalen** Grün (`npm test` mit ausgechecktem Submodul). Maßgeblich ist aber das Grün in der CI (AGENTS.md: „Grün heißt grün in der CI"). Dort ist `npm test` **rot**: Der Unit-Test `tests/unit/ds-copy.test.mjs` (Happy-Path) ruft `scripts/ds-copy.mjs` gegen das Submodul `_kontext/designsystem`, das in der CI seit 002 bewusst **nicht** mehr ausgecheckt wird → Abbruch → Test rot → Deploy-Gate rot → kein Pages-Deploy. Die Anforderung ist damit **nicht fertig**; Status zurück auf `in progress`. Der ursprüngliche Eintrag bleibt zur Nachvollziehbarkeit stehen. Weiteres unter `# Wiederaufnahme`.

-   **Datum:** 2026-10-22
-   **Abgenommen von:** Nutzer (ausdrücklich), auf dem Feature-Branch `fix/002-ci-submodul-designsystem`, lokal.
-   **Geprüft (Checkliste des Abnahmepakets):**
    -   Guard-Test vorher rot (2 Fundstellen) → nach Korrektur grün — bestätigt.
    -   Kein `actions/checkout` zieht Submodule mehr: `grep -rn submodules .github/` ohne Treffer.
    -   Alle Tests grün (`npm test`): Unit 10/0 (inkl. 2 Guard-Tests), E2E 3/0, Lint/Format/Audit/Secrets grün.
    -   UI-Richtlinie: `check:ui` 0 Befunde; keine UI/CSS berührt.
    -   Unverändert: `git diff main...HEAD` leer für `.gitmodules` und `app/vendor/designsystem/`.
-   **Offen (bauartbedingt):** Das Kriterium „CI erreicht `npm test` und bricht nicht mehr am Submodul ab" ist erst nach dem Merge auf GitHub beobachtbar — Nachprüfung im Release.

# Wiederaufnahme (2026-10-22)

**Warum wieder geöffnet.** 002 hat die beiden CI-Test-Checkouts vom Submodul befreit (erledigt, gemerged), damit aber ein zweites, bis dahin verdecktes Problem aufgedeckt: `npm test` lief lokal nur deshalb grün, weil Entwickler das Submodul ausgecheckt haben. In der submodul-freien CI ist `npm test` **rot** — der Happy-Path-Fall von `tests/unit/ds-copy.test.mjs` ruft `scripts/ds-copy.mjs` ohne `DS_SRC`, also gegen `_kontext/designsystem` (Submodul), findet die Pflichtdateien nicht und bricht ab. Die Abnahme war verfrüht (nur lokales Grün). Release 0.1.1 wurde deshalb nie ausgeliefert und steht auf `failed`; 002 kommt mit **0.1.2**.

**Befund.** `npm test` in der CI rot, weil der `ds-copy`-Test das Submodul braucht, das es in der CI nicht gibt.

**Welche Prüfung hätte das finden müssen?** Der **Sauberer Lauf** (Standardprüfung „immer" aus `_anweisungen/00-einrichtung.md`): ein Befehl, der den aktuellen Commit in einen leeren Ordner klont — **ohne Submodule**, ohne vorhandene Abhängigkeiten, ohne ungetrackte Dateien — und dort wie die CI installiert und alle Prüfungen ausführt. Genau er findet, „was nur lokal vorhanden ist". Das normale lokale `npm test` und ein Commit-Hook hätten es **nicht** gefunden, weil beide mit dem ausgecheckten Submodul des Entwicklers laufen und grün bleiben — nur der submodul-freie Lauf reproduziert die CI. Dieser Sauberer Lauf fehlt im Projekt (nicht in `_kontext/projekt.md` — Lücke gegenüber Stufe 0). **Konsequenz:** Er wird in diesem Zuge ergänzt (`npm run check:clean` + Eintrag in `_kontext/projekt.md`) und dient zugleich als Rot-/Grün-Nachweis dieser Korrektur.

**Umfang der Wiederaufnahme** (zusätzlich zur bereits erledigten Submodul-Entfernung):

1.  `npm test` läuft ohne ausgechecktes Submodul vollständig grün — der `ds-copy`-Happy-Path läuft gegen eine eingecheckte, deterministische Quelle statt gegen das Submodul; **ohne Abschwächung** (die Ausschluss-Prüfung „keine React-Quellen" bleibt wirksam).
2.  Der **Sauberer Lauf** wird als Projektprüfung ergänzt und dokumentiert.

**Neue Akzeptanzkriterien** (zusätzlich zu den oben genannten, die für die Submodul-Entfernung weiter gelten):

| Kriterium | Prüfung |
|---|---|
| `ds-copy`-Happy-Path läuft gegen eine eingecheckte Quelle (nicht gegen das Submodul); ohne diese Quelle ist er rot (Nachweis vor der Korrektur) | Unit (Vitest) |
| Ausschluss bleibt wirksam: die eingecheckte Quelle enthält React-Quellen-Attrappen, die **nicht** nach `dest` kopiert werden | Unit |
| Fall 2 (Abbruch bei fehlender/leerer Quelle, klare Meldung, Exit ≠ 0) unverändert grün | Unit |
| `scripts/ds-copy.mjs`, `app/vendor/designsystem/`, `.gitmodules` und der Entwickler-Ablauf (`npm run ds:copy` gegen das Submodul) unverändert | Review / `git diff` |
| Sauberer Lauf vorhanden (`npm run check:clean`), in `_kontext/projekt.md` dokumentiert; er ist **ohne** die Korrektur rot und **mit** ihr grün | Sauberer Lauf |
| Keine Abschwächung bestehender Prüfungen (nichts entfernt, nichts bedingt übersprungen, keine gelockerte Erwartung) | Review |

# Umsetzungsplan (Wiederaufnahme)

*Stufe 5b — geprüft durch Senior Dev und DevOps, Befunde eingearbeitet. Vom Nutzer **freigegeben am 2026-10-22** und umgesetzt (Nachweis unter `# Testnachweis (Wiederaufnahme)`).*

1.  **Schritte (Reihenfolge):**
    1.  **Sauberer Lauf als Werkzeug anlegen** — `scripts/check-clean.mjs` + npm-Script `check:clean` (eigenständig, **nicht** Teil von `npm test` → keine Rekursion). Das Skript: `git clone` des **lokalen Repos** (aktueller Commit) **ohne** `--recurse-submodules` in einen frischen Temp-Ordner (kein `cp`/`rsync` des Arbeitsverzeichnisses — sonst käme das lokal ausgecheckte Submodul mit), dort `npm ci` und `npm test`, danach `try/finally`-Aufräumen (auch bei rotem Lauf). Als Selbsttest einmal belegen, dass `_kontext/designsystem` im Temp **leer** ist (die load-bearing Eigenschaft). *Noch kein Rot/Grün — nur das Werkzeug.*
    2.  **Rot-Nachweis dieser Korrektur (5c)** — Fall 1 in `tests/unit/ds-copy.test.mjs` auf `DS_SRC=tests/fixtures/designsystem` umstellen, Fixture **noch nicht** anlegen. `npx vitest run tests/unit/ds-copy.test.mjs` → **rot** (ds-copy.mjs bricht ab: Pflichtdateien in der Fixture fehlen). Testnachweis „Rot". **Nicht committen** (kein Commit mit rotem Test).
        -   *Zusätzlich, als Beleg der fehlenden Prüfung:* `node scripts/check-clean.mjs` gegen den **noch nicht korrigierten** committeten Stand → **rot** (reproduziert die CI: ds-copy-Happy-Path ohne Submodul). Nur Nachweis, nicht committet.
    3.  **Fixture anlegen (5d)** — `tests/fixtures/designsystem/` eingecheckt mit:
        -   Pflichtdateien: `tokens.css`, `components/bundle.css`, `assets/Logos/app-icon-192.png`, `assets/Logos/app-icon-512.png` (PNGs: gültige, **minimale** Platzhalter — der Test prüft nur Existenz), ein Icon unter `assets/Icons/`.
        -   React-Quellen-**Attrappen**: `components/bundle.js`, `components/src/<datei>` — müssen vorhanden sein, damit die Ausschluss-Prüfung echt greift (der Test behält `toBe(false)` für `bundle.js`/`src`).
    4.  **Grün (5e)** — `npx vitest run tests/unit/ds-copy.test.mjs` grün; voller `npm test` grün; `npm run check:clean` **grün** (submodul-freier Klon). Testnachweis „Grün" + „UI-Richtlinie" (`check:ui` 0 Befunde, keine UI berührt). Erst dieser grüne Stand wird committet (Fixture + Teständerung + `check:clean` + `package.json` + `_kontext/projekt.md`). Status `qa`.
2.  **Betroffene Dateien:**
    -   neu: `scripts/check-clean.mjs`, `tests/fixtures/designsystem/…`
    -   geändert: `package.json` (Script `check:clean`), `tests/unit/ds-copy.test.mjs` (Fall 1: `DS_SRC`→Fixture), `_kontext/projekt.md` (Sauberer Lauf in der Prüfungen-Tabelle **und** Voraussetzungen unter „Umgebung des Agenten")
    -   unverändert: `scripts/ds-copy.mjs`, `app/vendor/designsystem/`, `.gitmodules`, `.github/workflows/*`, Fall 2 des Tests
3.  **Testfälle (je Akzeptanzkriterium):** Fall 1 gegen Fixture grün; ohne Fixture rot (Rot-Nachweis); `bundle.js`/`src`-Attrappen **nicht** nach `dest` kopiert (Ausschluss bleibt wirksam); Fall 2 unverändert grün; `check:clean` rot (vor) → grün (nach).
4.  **Entwurf → Code:** entfällt (kein Design, keine UI).
5.  **Externe Abhängigkeiten / Umgebung:** keine neuen Pakete. `check:clean` braucht im Temp-Klon eine erreichbare npm-Registry (bzw. Cache) für `npm ci`, die Playwright-Browser (über geerbtes `PLAYWRIGHT_BROWSERS_PATH`, sonst Chromium im Klon nachinstallieren) und die `gitleaks`-Binär auf `PATH`. Im Agent-Container laut `_kontext/projekt.md` vorhanden; Voraussetzungen dort dokumentieren. **Risiko:** Ist die Registry im Container offline, scheitert `npm ci` im Klon — dann `npm ci --offline` gegen den Cache bzw. Einschränkung dokumentieren; im Zweifel in 5e Rücksprache.
6.  **Annahmen und Risiken:**
    -   Das echte Submodul ist für `npm test` nirgends sonst nötig (in der Klärung belegt; `check:clean` sichert das dauerhaft mit).
    -   `check:clean` läuft **gegen den committeten Stand** (klont HEAD) — Rot vor der Korrektur daher nur als Nachweis; committet wird erst der grüne Stand.
7.  **Nicht angefasst / Abgrenzung:** `scripts/ds-copy.mjs`, Vendor-Kopie, Submodul/`.gitmodules`, `ds:copy`-Ablauf, die App, die bereits erledigte Submodul-Entfernung in den Workflows. **Nur** der Sauberer Lauf wird aus den Stufe-0-Lücken mitgenommen (er erbringt den Rot-Nachweis); die ebenfalls fehlenden Leitplanken (Git-Hook vor dem Commit, Commit-Format-Prüfung) gehören in eine **eigene** Anforderung `leitplanken-ergaenzen` (Backlog), nicht hierher.

# Testnachweis (Wiederaufnahme)

-   **Rot** (vor der Korrektur):
    -   `npx vitest run tests/unit/ds-copy.test.mjs` — Fall 1 auf das Fixture umgestellt, Fixture noch **nicht** angelegt → **rot**: 1 fehlgeschlagen / 1 bestanden; `ds-copy.mjs` bricht ab („Design-System unter 'tests/fixtures/designsystem' unvollständig …"; fehlend: `tokens.css`, `components/bundle.css`, `app-icon-192/512.png`).
    -   **Beleg der fehlenden Prüfung:** `node scripts/check-clean.mjs` gegen den committeten Stand **vor** der Korrektur → **rot**: der submodul-freie Klon bricht in `test:unit` ab (ds-copy-Happy-Path ohne Submodul), `npm test` endet mit Exit 1 — genau das CI-Verhalten. (Nur Nachweis, nicht committet.)
-   **Grün** (nach der Korrektur):
    -   `npx vitest run tests/unit/ds-copy.test.mjs` → **2/2 grün** (Happy-Path gegen Fixture; Attrappen `components/bundle.js`/`components/src` **nicht** kopiert; Fall 2 unverändert).
    -   `npm test` (lokal, mit Submodul) → **grün**: ESLint 0 · Prettier 0 · Stylelint (UI) 0 · Vitest 10/10 · Audit 0 prod (5 dev-Warnungen hingenommen) · gitleaks keine · Playwright (iPhone/dark) 3/3.
    -   `npm run check:clean` (submodul-freier Klon, Selbsttest „_kontext/designsystem leer: ja") → **grün**: Vitest 10/10, Playwright 3/3, alle übrigen Prüfungen grün. Belegt, dass `npm test` **ohne** Submodul durchläuft — damit erreicht die CI `npm test`, der Deploy-Gate ist nicht mehr blockiert.
-   **UI-Richtlinie:** `npm run check:ui` — 0 Befunde (Teil von `npm test`); keine UI/CSS berührt. Ausnahmen: keine.
-   **Offen (bauartbedingt):** „CI-Lauf erreicht `npm test` / Pages-Deploy" ist erst im realen CI-Lauf nach dem Push/Merge beobachtbar — Gegenprobe in der Abnahme/im Release 0.1.2.

# QA (Wiederaufnahme)

Stufe 6, Lauf vom 2026-10-22 auf `fix/002-ci-submodul-designsystem`. Die erste QA (oben) bleibt zur Nachvollziehbarkeit stehen.

## Automatisch

Frischer Lauf im Container (`npm ci` aus der Lock-Datei, danach alle Prüfungen aus `_kontext/projekt.md`):

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Lint | `npm run lint` | grün |
| Format | `npm run format:check` | grün |
| UI-Prüflauf | `npm run check:ui` | 0 Befunde |
| Unit (Vitest) | `npm run test:unit` | 10 bestanden / 0 |
| Audit | `npm run audit` | 0 Prod-Schwachstellen; 5 Dev-Warnungen (Hinweis) |
| Secrets (gitleaks) | `npm run check:secrets` | keine |
| E2E (Playwright, iPhone/dark) | `npm run test:e2e` | 3 bestanden / 0 |
| **Sauberer Lauf** | `npm run check:clean` | **grün** — submodul-freier Klon, alle Prüfungen bestanden (Selbsttest „`_kontext/designsystem` leer: ja") |

-   **Hinweis:** 5 Schwachstellen-Warnungen in Entwicklungswerkzeugen (nicht ausgeliefert) — bekannt, als Idee `werkzeuge-aktualisieren` im Backlog.
-   **Umgebung:** Nach frischem `npm ci` war der Playwright-Chromium neu zu installieren (dokumentierte Test-Umgebung, kein neues Paket; Lock-Datei unverändert). E2E lief in Chromium mit iPhone-Emulation (WebKit-Libs fehlen im Image, siehe `_kontext/projekt.md`) — für diese CI-/Test-Änderung ohne Belang.

## Geprüft durch

Reviewer (nur lesend). Klicktester entfällt (keine UI). Security auf Nutzerwunsch ausgelassen (reine CI-/Test-Konfiguration, keine neuen externen Dienste/Daten).

## Befunde

Reviewer: **keine blockierenden** Befunde an der fachlichen Umsetzung. Bestätigt: neue Akzeptanzkriterien erfüllt (Happy-Path gegen eingecheckte Fixture statt Submodul; Ausschluss „keine React-Quellen" greift echt — `components/bundle.js`/`components/src` werden nicht kopiert; Fall 2 unverändert; `check:clean` klont ohne Submodule, räumt per `try/finally` auf, belegt leeres `_kontext/designsystem`); keine Prüfung abgeschwächt; Abgrenzung eingehalten (`ds-copy.mjs`, `app/vendor/designsystem/`, `.gitmodules` per `git diff` unverändert).

Ein **empfohlener** Befund, bearbeitet: Ein branchfremder Commit mit einer Änderung an `run-ai-agent.sh` (GitHub-Token aus dem Schlüsselbund) war zwischenzeitlich auf dem Branch gelandet. **Erledigt:** aus dem Branch entfernt, sodass `origin/fix/002` nur den geplanten 002-Umfang trägt. Kein Test — reines Umgebungs-Tooling, kein App-/Testverhalten. Die Token-Tooling-Idee wird separat im Backlog festgehalten.

Zwei **Hinweise** (nichts muss): `check:clean` installiert den Browser bei jedem Lauf neu (robust, aber netz-/cache-abhängig — in `_kontext/projekt.md` als Einschränkung vermerkt); die Workflow-Dateiliste im Guard-Test ist statisch (bereits in Runde 1 notiert, kein Handlungsbedarf).

## CI (vorab)

Pull Request [#1](https://github.com/tuxfy/bouldering_berlin/pull/1) `fix/002-ci-submodul-designsystem` → `rc/0.1.2`, Lauf [39820121763](https://github.com/tuxfy/bouldering_berlin/actions/runs/39820121763): **`test` grün** (erreicht `npm test` und läuft submodul-frei durch), Socket Security grün. Damit ist das Kriterium „CI-Lauf erreicht `npm test` und bricht nicht mehr am Submodul ab" **real auf GitHub** belegt — nicht erst nach dem Merge. Der Merge in `rc/0.1.2` selbst folgt nach der Abnahme (Stufe 7/8).

# Abnahme (Wiederaufnahme)

-   **Datum:** 2026-10-22
-   **Abgenommen von:** Nutzer (ausdrücklich), auf dem Feature-Branch `fix/002-ci-submodul-designsystem`.
-   **Geprüft (Checkliste des Abnahmepakets):**
    -   CI real grün: PR #1, Check `test` erreicht `npm test` und läuft submodul-frei durch (vorher Abbruch am Submodul) — belegt (Lauf 39820121763).
    -   Submodul-frei lokal: `npm run check:clean` endet „grün — alle Prüfungen ohne Submodul bestanden".
    -   Entwickler-Ablauf unberührt: `npm run ds:copy` gegen das Submodul funktioniert weiter.
-   **Offen (bauartbedingt):** Der Pages-Deploy selbst ist erst beim Release (Merge nach `main` + Tag `v0.1.2`) beobachtbar — Gegenprobe in Stufe 8e.

# Rückblick (Wiederaufnahme)

-   **Projekt:** Der **Sauberer Lauf** (`npm run check:clean`) fehlte und ist jetzt ergänzt und in `_kontext/projekt.md` dokumentiert. Er ist der einzige Lauf, der „nur lokal Vorhandenes" (hier: das ausgecheckte Submodul) aufdeckt; das normale `npm test` eines Entwicklers bleibt trügerisch grün. Vor Abnahme/Release künftig immer mitlaufen lassen.
-   **Prozess (Vorschlag fürs Template, hier nicht geändert):** Der Sauberer Lauf gehört zu den Stufe-0-Standardprüfungen — seine Abwesenheit hat die verfrühte Abnahme 0.1.1 und das fehlgeschlagene Release ermöglicht. Ebenso fehlen noch die Leitplanken „Prüfungen + Commit-Format vor jedem Commit" (eigene Backlog-Idee `leitplanken-ergaenzen`).
-   **Betrieb:** „Grün heißt grün in der CI" hat sich konkret bewährt — das lokale Grün (mit Submodul) war hier irreführend; maßgeblich war erst der CI-Lauf auf dem gepushten Branch.
