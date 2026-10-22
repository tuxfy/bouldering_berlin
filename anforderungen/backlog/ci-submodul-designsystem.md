-   **Title** CI bricht am Klonen des Design-System-Submoduls ab
-   **Status** bug

# Bug

-   **Was passiert:** Die CI (`.github/workflows/ci.yml` und der Test-Gate in `deploy.yml`) checkt mit `submodules: true` aus und versucht, das Submodul `_kontext/designsystem` (`git@github.com:tuxfy/design_system_bb.git`) zu klonen. Das schlägt fehl („remote: Repository not found" / „fatal: clone of … failed"), der Lauf bricht ab, noch bevor `npm test` startet.
-   **Was erwartet war:** Die CI läuft durch; alle Prüfungen (`npm test`) werden ausgeführt.
-   **So tritt es auf:** Bei jedem Push/PR (Schritt „Fetching submodules" von `actions/checkout`). Das private Submodul-Repo ist für den Standard-Token der Action nicht erreichbar. Das Submodul wird für `npm test` nicht gebraucht: Das Design-System liegt als eingecheckte Kopie unter `app/vendor/designsystem/`, der UI-Prüflauf läuft nur auf `app/**/*.css` (Vendor-Kopie ausgeschlossen); der Deploy-Job checkt bereits ohne Submodule aus.
-   **Stand:** Commit `009f846` (main), GitHub Actions (ubuntu-latest), `actions/checkout@v4`.
