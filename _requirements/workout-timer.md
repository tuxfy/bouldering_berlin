-   **Title** Workout-Timer (Intervall-Timer mit Sets)
-   **Status** refined

# Idee

Fürs Training in der Halle fehlt ein Intervall-Timer: eine feste Abfolge aus Arbeits- und Pausenphasen über mehrere Sets soll von selbst ablaufen, per Ton geführt (eine Hand, dunkle Halle), ohne auf die Uhr zu schauen.

Danach gibt es ein Timer-Tool, bei dem man **Anzahl Sets**, **Work**, **Rest** und **Pause** (zwischen Sets) einstellt; der Timer läuft von selbst durch, zeigt die aktuelle Phase, den aktuellen Set und die verbleibende Zeit an und kündigt Phasenwechsel akustisch an.

# Hintergrund

Ist-Stand: Das Projekt ist die gemeinsame PWA-Grundlage „Bouldering Berlin Toolkit". Die Shell (`app/index.html`) zeigt einen Kachel-Grid der Tools; aktuell gibt es ein Tool (Boulder Log). Einen Timer gibt es nicht, und bisher nutzt **kein** Teil der App Ton/Audio.

Neue Tools folgen einem festen Muster (Erkenntnis aus 004): eigener Ordner `app/tools/<name>/` mit **explizitem `index.html`**, **eigener Service-Worker-Registrierung** in der Tool-Seite (für den direkten Einstieg offline), verlinkt über eine Kachel in der Shell. Rahmen: nur Dark Mode, Bedienung mit einer Hand, zentrierte Spalte max. 480px, Touch-Ziele ≥ 44px, UI nur mit Tokens/Komponenten des Design-Systems, build-frei (native ES-Module + Web Components, keine Laufzeit-Abhängigkeiten). Einen lokalen Datenspeicher für Einstellungen gibt es in diesem Tool noch nicht.

# Einordnung

-   **Art:** Feature
-   **Spielraum** (nur Angekreuztes darf sich ändern) — *Vorschlag, vom Nutzer bestätigt:*
    -   [x] **Darstellung** — zwei neue Ansichten (Einstellen + Laufen) müssen gestaltet werden.
    -   [x] **Verhalten** — die Funktion ist komplett neu (Timer-Ablauf über Phasen und Sets, akustische Signale).
    -   [x] **Struktur** — ein neues Tool entsteht unter `app/tools/workout-timer/`; einzige Änderung an Bestehendem ist eine neue Kachel in der Shell (`app/index.html`).
    -   [x] **Schnittstellen/Daten** — die zuletzt genutzten Einstellungen (Sets/Work/Rest/Pause) werden lokal auf dem Gerät gespeichert (neues, kleines Datenformat, offline).

    **Feste Grenzen** (ändern sich nicht): build-freier Ansatz, nur Dark Mode, UI nur mit Tokens/Komponenten des Design-Systems, Zielformat iPhone/eine Hand. Aussehen und Verhalten der Shell und des bestehenden Boulder-Log bleiben unverändert — bis auf die neue Kachel.

-   **Weg:** Design nötig? **ja** (→ Stufe 3; neue, nicht-triviale Oberfläche mit mehreren Zuständen) · Ursache bestätigen? entfällt (Feature)

# Offene Fragen

-   Keine. (Töne, Steuerung, Werte-Grenzen, Pause nach dem letzten Set, Ende-Verhalten → durch den Entwurf/Brief geklärt; Bildschirm wach, gesperrter Bildschirm, Vibration → unter „Entscheidungen".)

# Design-Brief

*Übernommen aus dem externen Entwurf (3c), unverändert.*

-   **Ziel:** Ein Intervall-Timer fürs Training in der Halle. Man stellt einmal Sets, Reps, Work, Rest und Pause ein und drückt Start. Danach läuft der Timer von selbst durch und führt per Ton, sodass man nicht auf den Bildschirm schauen muss. Bedienung mit einer Hand.

-   **Aufbau und Zustände:**
    -   **Kachel in der Shell:** zweite Kachel „Workout-Timer“ neben „Boulder Log“, Icon = `assets/Icons/icon-timer.svg` aus dem Design-System.
    -   **Kopfzeile (alle Ansichten):** `ToolHeader` wie im Boulder Log: kein sichtbarer Titel (nur für Screenreader „Workout-Timer“), Aktion „⊞ Tools“ mittig.
    -   **Ansicht Einstellen:**
        -   ConfigGroup 1: `Sets` (ohne Ton, ohne Einheit) · `Pause` (green, „s“).
        -   ConfigGroup 2: `Work` (orange, „s“) · `Reps` (orange, ohne Einheit) · `Rest` (green, „s“).
        -   Freiraum, darunter zentriert die Meta-Zeile „Gesamt · m:ss“ (berechnete Gesamtdauer inkl. Vorlauf), ganz unten `Start` (Primär, Block).
    -   **Ansicht Lauf (Stage, füllt den Platz unter der Kopfzeile):** von oben nach unten
        1.  Zähler: „Rep r / R“ · „Set s / S“
        2.  ProgressRing: Label (Phase), Wert (verbleibende Zeit m:ss), Caption
        3.  SegmentBar: eine Leiste je Rep des aktuellen Sets
        4.  Hint: „Als Nächstes: <Phase> · m:ss“
        5.  ControlBar: `↺ Reset` (destruktiv, large) · Primär `Pause`/`Weiter` (large) · `⇥ Skip` (sekundär, large)
    -   **Zustände des Laufs:**

        | Zustand | Stage-Ton | Ring-Label | Caption | SegmentBar |
        |---|---|---|---|---|
        | Vorlauf (10 s fest) | neutral | GET READY | Mach dich bereit | orange, alle leer |
        | Work | orange | WORK | Gib alles | orange; erledigte Reps voll, laufender füllt sich |
        | Rest | green | REST | Durchatmen | orange; Reps bis einschließlich aktuellem voll |
        | Pause (zwischen Sets) | green | PAUSE | Set geschafft — kurz erholen | green, alle voll |
        | Angehalten | Ton der laufenden Phase | wie Phase | Angehalten | unverändert |
        | Fertig | neutral | DONE | Workout geschafft | neutral, alle voll |

    -   **Fertig:** Ring voll, Wert = Gesamtdauer, Zähler auf Endstand (R / R, S / S), Hint ohne Ton-Punkt mit Zusammenfassung „S Sets · R Reps · W s / R s“. ControlBar: `← Zurück` (sekundär, large) · Primär `Nochmal` · rechter Platz leer.
    -   **Beenden?** (ConfirmSheet über dem Lauf): Titel „Workout beenden?“, Text „Der Lauf wird abgebrochen, die Einstellungen bleiben.“, Buttons `Beenden` (destruktiv) und `Weitermachen` (sekundär).
    -   **Übergänge:** Der Stage-Ton wechselt mit `--duration-slow`. Der Ring-Wert pulsiert bei 3-2-1 (`.ring__value.pulse`), nicht während Angehalten.

-   **Abläufe:**
    -   Shell → Kachel „Workout-Timer“ → Einstellen.
    -   Einstellen: Werte per Stepper (−/+) oder Eingabe in der Mitte. `Start` → Vorlauf.
    -   Reihenfolge: Vorlauf → je Set: Work und Rest im Wechsel, R × Work, nach dem letzten Work eines Sets **kein** Rest → Pause → nächstes Set. Nach dem letzten Set **keine** Pause → Fertig. Pause = 0 s überspringt die Pause.
    -   Primär-Button: `Pause` hält an, `Weiter` setzt fort.
    -   `⇥ Skip`: beendet die laufende Phase sofort, weiter mit der nächsten (aus der letzten Phase → Fertig).
    -   `↺ Reset`: hält an und öffnet „Workout beenden?“. `Beenden` → Einstellen (Werte bleiben). `Weitermachen` oder Tipp auf den Scrim → zurück in den vorherigen Zustand (lief er, läuft er weiter; war er angehalten, bleibt er angehalten).
    -   Fertig: `Nochmal` → startet denselben Ablauf neu (mit Vorlauf). `← Zurück` → Einstellen.
    -   „⊞ Tools“ → Shell (jederzeit).
    -   **Töne** (aus dem Entwurf übernehmen, `Main.dc.html`, Methoden `beep`/`signal`; Rechteckton, voller Pegel über Kompressor):

        | Ereignis | Ton |
        |---|---|
        | Start (Beginn Vorlauf) | kurzer Piepton wie Countdown |
        | Countdown: letzte 3, 2, 1 s jeder Phase | kurzer Piepton, 1760 Hz, 180 ms |
        | Beginn Work | ein langer Ton, 2093 Hz, 800 ms |
        | Beginn Rest und Pause | ein langer Ton, 1046 Hz, 800 ms |
        | Fertig | drei aufsteigende Töne: 1318 Hz 250 ms, 1760 Hz 250 ms, 2637 Hz 900 ms (Abstand 0,3 s) |

-   **Texte:** „Workout-Timer“ (Kachel, Screenreader-Titel) · Zeilen „Sets“, „Pause“, „Work“, „Reps“, „Rest“, Einheit „s“ · „Gesamt · m:ss“ · „Start“ · Zähler „Rep“, „Set“ · Labels „GET READY“, „WORK“, „REST“, „PAUSE“, „DONE“ · Captions „Mach dich bereit“, „Gib alles“, „Durchatmen“, „Set geschafft — kurz erholen“, „Angehalten“, „Workout geschafft“ · Hint „Als Nächstes: Work · m:ss“ / „Als Nächstes: Rest · m:ss“ / „Als Nächstes: Pause · m:ss“, letztes Work: „Letzter Rep — gleich geschafft“, Fertig: „S Sets · R Reps · W s / R s“ · Buttons „Pause“, „Weiter“, „Nochmal“, Icon-Labels „Reset“, „Skip“, „Zurück“ · Sheet: „Workout beenden?“, „Der Lauf wird abgebrochen, die Einstellungen bleiben.“, „Beenden“, „Weitermachen“ · Screenreader-Labels der Stepper: „<Feld> weniger“ / „<Feld> mehr“; Skip „Überspringen“, Zurück „Zurück zum Einstellen“. Zeitformat überall `m:ss`.

-   **Werte (Vorgaben und Grenzen):**

    | Feld | Vorgabe | min | max | Schritt |
    |---|---|---|---|---|
    | Sets | 5 | 1 | 20 | 1 |
    | Pause | 180 s | 0 | 900 | 15 |
    | Work | 7 s | 1 | 600 | 1 |
    | Reps | 6 | 1 | 30 | 1 |
    | Rest | 3 s | 1 | 600 | 1 |
    | Vorlauf | 10 s | fest | | |

    Eingaben außerhalb der Grenzen werden geklemmt (Stepper-Verhalten des Design-Systems).

-   **Design-System:** Bouldering Berlin Design System, Stand wie im Projekt. Genutzt: `ToolHeader`, `Tile`, `ConfigGroup`, `ConfigRow` (tone orange/green), `Stepper`, `Button` (primary block/large, secondary compact), `IconButton` (large: destructive, secondary), `Stage`, Counters, `ProgressRing`, `SegmentBar`, `Hint`, `ControlBar`, `ConfirmSheet`; Tokens `--type-meta`, `--color-text-muted`, `--color-text-strong`, `--space-*`, `--content-pad-x`. Aufbau folgt der Modul-Vorlage **IntervallTimer**.
    Zuordnungen (für `_context/design.md`): Vorlauf/Fertig → neutral, Work → orange, Rest/Pause → green (wie in der Referenz der System-README); Reset/Beenden → danger; Kanten der Konfig-Zeilen: Work und Reps orange, Rest und Pause green, Sets ohne Ton.

-   **Rahmen:** iPhone (Safari, Standalone-PWA), Hochformat, Spalte max. 480 px, nur Dark Mode, eine Hand, Touch-Ziele ≥ 44 px; Entwurf auf 390 × 844.

-   **Lücken:**
    -   `ControlBar` verlangt genau drei Kinder. In der Fertig-Ansicht gibt es nur zwei Aktionen, der rechte Platz bleibt leer (Platzhalter ohne Inhalt). Prüfen, ob das System einen leeren Nebenplatz vorsehen soll.
    -   Bereits vorgemerkt und hier wieder genutzt: ToolHeader ohne sichtbaren Titel mit mittiger Aktion, Text nur für Screenreader, Stepper-Tasten unter 44 px.
    -   Kein Muster für akustische Signale im System. Nach der Faustregel bleiben Töne Logik der App. Würde ein zweites Tool sie brauchen, gehören sie in ein Modul-Repo.

-   **Offen für die Umsetzung (nicht gestaltbar):**
    -   iOS: Steht das Gerät auf lautlos, sind Web-Audio-Töne in Safari normalerweise stumm. Auf dem Gerät prüfen und bei Bedarf umgehen.
    -   Laufen Timer und Ton bei gesperrtem Bildschirm weiter? Bildschirm wachhalten (Wake Lock)?
    -   Die zuletzt genutzten Werte werden lokal gespeichert (laut Klärung).
    -   Die Zeitmessung im Entwurf ist vereinfacht (Schritte von 100 ms). Die App rechnet gegen die Uhrzeit, damit nichts driftet.

-   **Entwurf:** `_requirements/mockups/workout-timer/` — `Main.dc.html` ist der interaktive Prototyp mit allen Zuständen (Prop `zustand`, Tweaks `tempo` und `ton`). Die übrigen `.dc.html` zeigen je einen Zustand. `Shell.dc.html` zeigt die Shell mit der neuen Kachel.

# Entscheidungen

-   **Umfang:** Neben Sets, Work, Rest und Pause gehören **Reps** (Wiederholungen von Work/Rest je Set) und ein fester **Vorlauf (10 s)** zur Anforderung (im Entwurf bestätigt).
-   **Signale nur akustisch:** keine Vibration/Haptik.
-   **Bildschirm wach während des Laufs:** feste Anforderung — Screen Wake Lock, solange der Timer läuft (auf iOS Safari ab 16.4; bei verdeckter Seite erneut anfordern).
-   **Gesperrter Bildschirm:** Weil der Wake Lock das Gerät am Selbst-Sperren hindert, läuft der Timer während des Laufs durch. Für eine *manuelle* Sperre gilt „best effort" ohne harte Garantie — Web-Audio/Timer werden auf iOS beim Sperren meist angehalten; am echten Gerät nachprüfen.

**Technik** (Vorschlag des Agenten, vom Nutzer mit der Plan-Freigabe bestätigt):

-   **Aufbau:** eigenes Tool unter `app/tools/workout-timer/` mit **explizitem `index.html`**, eigener **Service-Worker-Registrierung** und Precache über das generierte `app/sw-precache.js`; Kachel in `app/index.html` — Muster wie Boulder Log (Erkenntnis aus 004). Build-frei (native ES-Module + Web Components).
-   **Keine neuen Pakete.** Nur Browser-APIs: **Web Audio** (Töne), **Screen Wake Lock** (Bildschirm wach), **Page Visibility** (Wake Lock bei Wiederkehr erneut anfordern, Timer gegen die Uhr abgleichen).
-   **Zeitbasis:** gegen die Uhr rechnen (`performance.now()`), Anzeige-Takt davon abgeleitet — kein Driften (der Entwurf zählt vereinfacht in 100-ms-Schritten; die App rechnet genau).
-   **Speicherung:** zuletzt genutzte Werte (Sets, Pause, Work, Reps, Rest) als ein JSON unter einem `localStorage`-Schlüssel (z. B. `bb:workout-timer`), nur auf dem Gerät, offline; beim Öffnen vorbelegt, sonst Vorgaben aus dem Brief.
-   **Audio-Freischaltung:** der Web-Audio-Context wird durch die erste Nutzer-Geste (Tipp auf `Start`) entsperrt (iOS-Autoplay-Regel); Töne sonst stumm.
-   **Prüfbare Logik:** die Phasen-Abfolge entsteht als **reine Funktion** (Einstellungen → Phasenliste) — unit-testbar; Werte und Formeln aus dem Entwurf `Main.dc.html` übernommen, nicht nachempfunden.
-   **Nur am echten Gerät prüfbar** (Nachprüfung nach dem Release, im `_releases/`-Dokument): Ton bei gesetztem Lautlos-Schalter, Verhalten bei *manueller* Sperre, Wake Lock auf iOS Safari, PWA-Installation/Offline/Standalone.

# Verhalten

Aus Nutzersicht (Detail im Design-Brief und im Entwurf):

-   **Einstieg:** In der Shell steht eine zweite Kachel „Workout-Timer". Ein Tipp öffnet die Ansicht **Einstellen**.
-   **Einstellen:** Der Nutzer stellt **Sets, Pause, Work, Reps, Rest** per Stepper (−/+) oder Eingabe ein; Werte außerhalb der Grenzen werden geklemmt. Darunter zeigt „Gesamt · m:ss" die errechnete Gesamtdauer inkl. Vorlauf. `Start` beginnt den Lauf. Die zuletzt genutzten Werte sind beim nächsten Öffnen vorbelegt.
-   **Lauf:** Es läuft automatisch ab: **Vorlauf (10 s)** → je Set `Reps`× **Work** im Wechsel mit **Rest** (nach dem letzten Work eines Sets **kein** Rest) → **Pause** zwischen den Sets (entfällt nach dem letzten Set; `Pause = 0` wird übersprungen) → **Fertig**. Die Ansicht zeigt jederzeit die aktuelle **Phase**, **Rep r / R** und **Set s / S**, die **verbleibende Zeit** (m:ss) im Ring, eine **SegmentBar** je Rep des Sets und einen Hinweis „Als Nächstes: …". Der Bildschirm bleibt während des Laufs an.
-   **Töne:** Phasenwechsel und der Countdown 3-2-1 jeder Phase werden akustisch angekündigt; zum Schluss ein Erfolgssignal — so, dass man nicht hinschauen muss (Werte siehe Brief).
-   **Steuerung:** `Pause`/`Weiter` hält an bzw. setzt fort; `Skip` beendet die laufende Phase sofort (aus der letzten Phase → Fertig); `Reset` hält an und fragt „Workout beenden?" (`Beenden` → Einstellen, Werte bleiben; `Weitermachen`/Scrim → zurück in den vorherigen Zustand).
-   **Fertig:** Zusammenfassung; `Nochmal` startet denselben Ablauf neu, `Zurück` führt zu Einstellen.
-   **„⊞ Tools"** führt jederzeit zurück zur Shell.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| Kachel „Workout-Timer" in der Shell öffnet die Ansicht Einstellen | E2E |
| Felder Sets/Pause/Work/Reps/Rest mit den Vorgaben vorbelegt; Stepper ändern in den festgelegten Schritten; Werte außerhalb min/max werden geklemmt | Unit (Logik) + E2E |
| „Gesamt · m:ss" zeigt die korrekte Gesamtdauer inkl. Vorlauf für gegebene Einstellungen | Unit |
| Phasen-Abfolge korrekt: Vorlauf → je Set Reps×Work mit Rest dazwischen, kein Rest nach letztem Work, Pause zwischen Sets, keine Pause nach letztem Set, `Pause = 0` übersprungen → Fertig | Unit (reine Timeline-Funktion) |
| Restzeit läuft gegen die Uhr ohne Driften (lange Läufe, Anhalten/Fortsetzen) | Unit (gesteuerte Uhr) |
| Lauf-Anzeige stimmt mit dem Zustand überein: Phase/Label/Caption, Rep r/R, Set s/S, Ring-Restzeit m:ss, SegmentBar, „Als Nächstes" | E2E |
| Steuerung: Start, Pause/Weiter, Skip (inkl. aus letzter Phase → Fertig), Reset → ConfirmSheet → Beenden/Weitermachen/Scrim wie beschrieben | E2E |
| Fertig-Ansicht mit Zusammenfassung; `Nochmal` startet neu (mit Vorlauf), `Zurück` → Einstellen | E2E |
| Akustische Signale an den richtigen Stellen (Phasenbeginn, Countdown 3-2-1, Fertig); Context erst nach Start-Geste aktiv | Unit (Auslösepunkte) + manuell (Klang am Gerät) |
| Bildschirm bleibt während des Laufs wach (Wake Lock angefordert; bei Rückkehr erneut); nach Ende/Verlassen freigegeben | Unit/Integration (API-Aufrufe) + manuell am Gerät |
| Zuletzt genutzte Werte werden lokal gespeichert und beim nächsten Öffnen vorbelegt | Unit + E2E |
| Tool ist eigene Seite (`app/tools/workout-timer/index.html`) mit eigener SW-Registrierung und Precache; direkter Einstieg funktioniert offline | E2E + manuell |
| Nur Dark Mode, Spalte ≤ 480 px, Touch-Ziele ≥ 44 px (Stepper-Lücke in `_context/design.md` vermerkt) | E2E (iPhone-Viewport) / Review |
| Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot | Testlauf |
| Nach der Umsetzung laufen alle Tests grün | Testlauf |
| UI-Richtlinie eingehalten (nur Tokens und Komponenten des Design-Systems, keine festen Werte, keine Inline-Styles) | `npm run check:ui` / Review |
| Entwurf umgesetzt, Werte und Logik aus der abgelegten Quelle (`Main.dc.html`) übernommen, nicht nachempfunden | manuell |

# Abgrenzung

Nicht Teil dieser Anforderung (ggf. später als eigene Idee im Backlog):

-   Mehrere speicherbare Programme/Profile (nur die zuletzt genutzten Werte werden gespeichert).
-   Auswahl verschiedener Klänge, Lautstärkeregler, eigene Tonlängen.
-   Garantiertes Weiterlaufen von Ton/Timer bei *manuell* gesperrtem Bildschirm (OS-Grenze; nur best effort).
-   Vibration/Haptik.
-   Verlauf/Statistik absolvierter Workouts.
-   Querformat, helles Theme, andere Sprachen.

# Technische Notizen

*Optional, nicht bindend.*

-   Voraussichtlich betroffen: neu `app/tools/workout-timer/index.html`, `app/tools/workout-timer/*.js`, `app/tools/workout-timer/*.css`; geändert `app/index.html` (Kachel). `app/sw-precache.js` ist generiert und nimmt neue Dateien automatisch auf.
-   Phasen-Abfolge und Zeitformat als reine, unit-testbare Module halten (Logik aus `Main.dc.html`).
-   Wake Lock an `visibilitychange` koppeln (bei `visible` erneut anfordern, bei Ende/Verlassen freigeben).
-   `README.md`: keine Änderung nötig (kein neues Setup, keine neue Bedienung des Projekts).

# Umsetzungsplan

*Vom Agenten in Stufe 5 (5a) geschrieben, vom Nutzer freigegeben.*

1.  **Schritte:**
2.  **Betroffene Dateien:**
3.  **Testfälle:**
4.  **Entwurf → Code** *(bei Design)*:
5.  **Externe Abhängigkeiten** (How-to wo?):
6.  **Annahmen und Risiken:**
7.  **Nicht angefasst:**

# Testnachweis

*Vom Agenten in Stufe 5 ergänzt.*

-   **Rot** (vor der Änderung): `<Befehl>` — <n> bestanden / <m> fehlgeschlagen; rot: `<Testname>`, …
-   **Grün** (nach der Änderung): `<Befehl>` — <n> bestanden / 0 fehlgeschlagen
-   **UI-Richtlinie:** `<Befehl>` — 0 Befunde; Ausnahmen: <keine | Liste> *(lief der Prüflauf nicht: Grund und manuelle Prüfung)*

# QA

*Vom Agenten in Stufe 6 ergänzt.*

-   **Automatisch:** je Prüfung Befehl und Ergebnis; nicht Eingerichtetes nennen
-   **Geprüft durch:** <Rollen>
-   **Befunde:** je Befund kurz, was damit passiert ist

# Abnahme

*In Stufe 7 ergänzt.*

-   **Abgenommen am:** <Datum> — <was geprüft wurde>
