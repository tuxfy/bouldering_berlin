# Design

*In Stufe 0 (`_agent-process/anweisungen/00-einrichtung.md`) ergänzen.*

## Design-System

Welches zentrale Design-System das Projekt nutzt und wie es eingebunden ist (z. B. Kopie unter `_design-system/`).

- **System:** „Bouldering Berlin Toolkit" — Design-System der Marke, maßgebliche Fassung im Repo `tuxfy/design_system_bb`.
- **Quelle:** als **Git-Submodul** unter `_design-system/`. Wird im Projekt **nie bearbeitet** (Änderungen nur im Design-System-Repo selbst).
- **Einbindung:** **CSS-Vertrag + Vanilla.** In die App kommen nur die ausgelieferten CSS-Dateien und Assets — per `npm run ds:copy` kopiert nach `app/vendor/designsystem/`:
  - `tokens.css` (alle Tokens als CSS-Variablen),
  - `components/bundle.css` (Komponenten-Klassen `.btn`, `.stepper`, `.tile`, `.stage` … + Schrift-/Motion-Atome),
  - `assets/Icons/`, `assets/Logos/`.
  Markup und Klassen folgen den Komponenten-READMEs des Systems; das **Verhalten** wird in Vanilla-JS neu umgesetzt. Die React-Quellen (`components/bundle.js`, `components/src/*.jsx`, `*.d.ts`) dienen **nur als Referenz**, laufen nicht in der App (kein React, kein Build).
- **Theme:** nur Dark Mode (`[data-theme="dark"]`) — das System sieht bewusst kein helles Theme vor. Keine Abweichung.
- **Stand:** `443d530` (Submodul-HEAD, `git -C _design-system rev-parse --short HEAD`). Bei jeder Aktualisierung neu eintragen.

## Zuordnungen

App-spezifische Bedeutungen, z. B. welcher Ton welchen Zustand kennzeichnet. Nur Zuordnungen zu vorhandenen Werten des Design-Systems — keine neuen Werte.

Marken-weite Rollen (fest im System): **Blau** = Interaktion/Auswahl/Link, **Grün** = Erfolg (`success`), **Rot** = destruktiv/Fehler (`danger`).

Töne pro Tool werden festgelegt, wenn das jeweilige Tool gebaut wird. Referenz aus der System-README (Intervall-Timer): `prep`/`done` → neutral, `work` → orange, `rest`/`set-pause` → green.

**Boulder Log** (Entwurf: `_requirements/mockups/boulder-log/`):

| Element | Rolle/Ton |
|---|---|
| send (an), aktive Style-Tags | success (Grün) — Standard des ToggleChip |
| Hinzufügen („+") | interactive-solid (Blau) |
| Kopiert-Bestätigung | success (Button `success`, 2 s) |
| Reset, Löschen im ConfirmSheet | danger (Rot) |

Content (app-spezifisch, nicht im Design-System):

- **Grad-Vorschläge (Font-Skala, Fb):** `3, 4, 5a, 5b, 5c, 6a, 6a+, 6b, 6b+, 6c, 6c+, 7a, 7a+, 7b, 7b+, 7c, 7c+, 8a` — nur Vorschläge, freie Eingabe erlaubt.
- **Style-Tags:** `slab, vertical, overhang, roof, dyno, crimp, sloper, pinch, jug, technical, powerful`.
- **Log-Zeile:** `- <grad>: <n> tries[ (send)][ - <style>, <style>, <weitere Angaben>]`, bei genau einem Versuch `1 try`.

## Lokal umgesetzt — gehört ins Design-System

| Was | Wo im Projekt | Idee im Design-System vermerkt |
|---|---|---|
| ToolHeader ohne sichtbaren Titel, Aktion mittig (nur „⊞ Tools") | Boulder Log (geplant; Entwurf `_requirements/mockups/boulder-log/`) | vorgemerkt — noch nicht im Design-System eingetragen |
| Text nur für Screenreader (z. B. versteckter Titel), keine Klasse im Design-System | Boulder Log (geplant) | vorgemerkt — noch nicht im Design-System eingetragen |
| Vorschlagsliste am TextInput (native `<datalist>`, Aussehen durch iOS) — prüfen, ob ein Muster im Design-System nötig ist | Boulder Log (geplant), Grad-Eingabe | vorgemerkt — noch nicht im Design-System eingetragen |
| Stepper-Buttons (−/+) unter 44px Touch-Ziel (`.stepper button` = `--space-10`/40px, effektiv ~40×42) — Zielformat fordert ≥ 44px | Boulder Log (DS-Komponente `.stepper`, im Projekt **nicht** lokal überschrieben); in QA (Klicktester) festgestellt | vorgemerkt — Stepper-Buttons ≥ 44px im Design-System |

## Ausnahmen (feste Werte außerhalb von CSS)

Der Stylelint-Prüflauf greift nur in CSS. An folgenden Stellen ist ein fester Farbwert technisch nötig, weil Meta-Tags und JSON keine CSS-Tokens (`var(--…)`) referenzieren können:

| Stelle | Wert | Grund / Abgleich |
|---|---|---|
| `app/index.html` `<meta name="theme-color">` | `#111111` | Plattform-Vorgabe; entspricht `--color-bg` (= `--n-100` = `#111`). Bei Änderung des DS-Hintergrunds mitziehen. |
| `app/manifest.webmanifest` `background_color`/`theme_color` | `#111111` | wie oben (Manifest ist JSON). |
