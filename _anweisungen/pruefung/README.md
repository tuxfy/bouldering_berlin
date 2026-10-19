# Prüf-Konfiguration der UI-Richtlinie

Konfiguration für Stylelint. Sie meldet feste Werte in den Stylesheets eines Projekts, die aus den Tokens des Design-Systems kommen sollen. Sie kennt keine einzelnen Tokens und passt deshalb zu jedem Design-System, das seine Tokens als CSS-Variablen liefert. Teil des Templates — im Projekt nicht ändern.

## Was gemeldet wird

-   **Farben** als Hex-Wert, Name (`red`) oder Farbfunktion (`rgb()`, `oklch()` …) — stattdessen `var(--color-…)`.
-   **Längen und Dauern** in `px`, `rem`, `em`, `pt`, `ms`, `s` — für Maße, Abstände, Radien, Ränder, Schriftgrößen und Bewegung stattdessen `var(--…)`. Erlaubt bleiben `%`, `fr`, `vw`/`vh`/`dvh`, `0` und Breiten bzw. Höhen in Media Queries (dort gehen keine Variablen).
-   **Schrift, Ebenen, Deckkraft, Schatten** (`font`, `font-family`, `font-weight`, `line-height`, `z-index`, `opacity`, `box-shadow`) nur über `var(--…)`; erlaubt sind Schlüsselwörter wie `inherit`, `normal`, `auto`, `none` sowie `0` und `1`.

## Was nicht erkannt wird

-   **Inline-Styles** und CSS-in-JS — die UI-Richtlinie verbietet sie; Prüfung von Hand.
-   Eigene Komponenten, wo das Design-System schon eine hat — Prüfung in der Abnahme.
-   Feste Werte innerhalb von `calc()` ohne Einheit.

## Voraussetzung an das Design-System

Für jede gemeldete Art von Wert braucht das Design-System Tokens: Farben, Längen (Maße, Abstände, Radien, Ränder, Schriftgrößen), Dauern, Schrift (Familie, Gewicht, Zeilenhöhe), Ebenen, Deckkraft, Schatten. Fehlt eine Art, meldet der erste Prüflauf es — dann im Projekt als Lücke in `_kontext/design.md` eintragen und als Idee für das Design-System vermerken.

## Einbinden im Projekt

Voraussetzung: Node (z. B. im Agent-Container oder in der CI). Benötigte Pakete als Entwicklungs-Abhängigkeiten des Projekts, Versionen legt das Projekt fest:

-   `stylelint` (Hauptversion 16)
-   `stylelint-declaration-strict-value` (Hauptversion 1)

Befehl — nur die Stylesheets der App angeben, nicht die Kopie des Design-Systems:

```
stylelint "<Stylesheets der App, z. B. src/**/*.css>" --config _anweisungen/pruefung/stylelint.json
```

Den Befehl in `_kontext/projekt.md` eintragen (z. B. als `npm run check:ui`).

## Ausnahmen

Nur mit Grund, direkt an der Stelle:

```css
/* stylelint-disable-next-line color-no-hex -- ui-ausnahme: <Grund> */
```

Ohne Grund nach `--` meldet der Prüflauf die Ausnahme selbst als Fehler; überflüssige Ausnahmen ebenfalls. Jede Ausnahme zusätzlich im Projekt in `_kontext/design.md` unter „Lokal umgesetzt — gehört ins Design-System" eintragen.
