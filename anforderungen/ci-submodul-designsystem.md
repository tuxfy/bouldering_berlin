-   **Title** CI bricht am Klonen des Design-System-Submoduls ab
-   **Status** refined

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
