-   **Title** CI bricht am Klonen des Design-System-Submoduls ab
-   **Status** new

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

-   **Richtung der Korrektur** (Entscheidung für Refinement): (A) `submodules: true` aus den beiden Test-Checkouts entfernen — das Submodul wird dort nicht gebraucht; oder (B) das Submodul in der CI erreichbar machen (Deploy-Key/PAT als Secret). A ist einfacher und ohne Geheimnisse; B nur nötig, falls die CI künftig selbst `ds:copy` laufen lassen soll.
-   Soll `.gitmodules` unverändert bleiben (SSH-URL für Entwickler mit Zugriff) oder gehört die (Un-)Erreichbarkeit des Submodul-Repos mit in den Blick?
