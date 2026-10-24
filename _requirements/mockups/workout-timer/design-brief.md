# Design-Brief: workout-timer

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
