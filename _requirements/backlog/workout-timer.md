-   **Title** Workout-Timer (Intervall-Timer mit Sets)
-   **Status** new

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

-   Töne: wie erzeugt (Web Audio API)? Ein Signal pro Phasenwechsel oder je Phase unterschiedlich? Countdown-Pieptöne in den letzten Sekunden einer Phase?
-   iOS-Realität: Läuft der Timer (und der Ton) zuverlässig weiter, wenn der Bildschirm sperrt oder die PWA im Hintergrund ist? Braucht es einen Wake Lock, oder ist die Erwartung „Bildschirm anlassen"?
-   Steuerung während des Laufs: Pause/Fortsetzen, Abbrechen, Phase überspringen — oder nur Start/Stopp?
-   Werte-Grenzen, Schrittweiten und sinnvolle Vorgaben für Sets, Work, Rest und Pause.
-   Entfällt die „Pause" nach dem letzten Set? Verhalten am Ende (Schlusssignal, Rückkehr zur Einstell-Ansicht)?
-   Zusätzlich Vibration/Haptik zum Ton? (auf iOS eingeschränkt.)

# Design-Brief

*Nur wenn Design nötig. Entsteht mit dem Entwurf extern und wird in 3c unverändert übernommen (siehe `_agent-process/anweisungen/03-design.md`).*

-   **Ziel:**
-   **Aufbau und Zustände:** Screens, Bereiche, Zustände und Übergänge
-   **Abläufe:** was der Nutzer wo tut
-   **Texte:**
-   **Design-System:** genutzte Komponenten und Tokens · Zuordnungen aus `_context/design.md`
-   **Rahmen:**
-   **Lücken:** was das Design-System nicht hat
-   **Entwurf:** `_requirements/mockups/workout-timer/`

# Entscheidungen

-   ...

# Verhalten

Was der Nutzer sieht und tut.

# Akzeptanzkriterien

| Kriterium | Prüfung |
|---|---|
| ... | Unit / E2E / manuell |
| Test für das abzusichernde Verhalten geschrieben — ohne die Änderung rot | Testlauf |
| Nach der Umsetzung laufen alle Tests grün | Testlauf |
| UI-Richtlinie eingehalten (nur Tokens und Komponenten des Design-Systems) | Review / Test |
| *(bei Design)* Entwurf umgesetzt, Werte und Logik aus der Quelle übernommen | manuell |

# Abgrenzung

-   ...

# Technische Notizen

*Optional, nicht bindend.*

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
