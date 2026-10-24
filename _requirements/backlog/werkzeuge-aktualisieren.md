-   **Title** Entwicklungswerkzeuge aktualisieren
-   **Status** idea

# Idee

Der volle `npm audit` meldet 5 High-Warnungen, alle dev-only und aktuell unfixbar: `braces` (≤ 3.0.3, kein Patch) kommt transitiv über `stylelint`. Nicht ausgeliefert, daher nur Warnung — aber im Blick behalten. Sobald ein gepatchtes `braces` bzw. eine Stylelint-Version ohne diese Kette verfügbar ist: aktualisieren, sodass der volle Audit wieder 0 meldet.
