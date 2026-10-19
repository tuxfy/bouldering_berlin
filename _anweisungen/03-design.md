# Stufe 3: Design

Nur bei Bedarf — für neue oder deutlich veränderte Screens (z. B. ein neues Menü), wenn in der Klärung **„Design nötig: ja"** festgelegt wurde. Kleine Änderungen folgen direkt der UI-Richtlinie in `AGENTS.md`. Ablauf in Teilschritten:

| Teilschritt | Wer | Ergebnis |
|---|---|---|
| 3a Brief | Agent schreibt, Nutzer prüft | Abschnitt `# Design-Brief` im Anforderungsdokument |
| 3b Entwurf | Nutzer + Claude | Design-Artifact (Titel = kurzer Name) — oder ohne Ansicht im Gespräch: Datei im Mockup-Ordner |
| 3c Freigabe | Nutzer | Entwurf freigegeben, Lücken eingetragen |
| 3d Übergabe | Claude | freigegebene Entwurfsquelle unter `anforderungen/mockups/<kurzer-name>/` |

## Grundsätze

-   **Faustregel — was gehört wohin:** Würde ein zweites Projekt es auch brauchen? Ja → Design-System (Tokens, Komponenten, allgemeine Muster, Vorlagen-Seiten). Nein → Projekt (konkrete Screens, Texte, Zuordnungen).
-   **In sich geschlossene Module** (z. B. ein Intervall-Timer) kommen **als Ganzes** ins Design-System — als Vorlage mit allen Zuständen, nicht nur in Einzelteilen; die Bausteine bleiben darunter erhalten.
-   **Aussehen ja, Logik nein:** Das Design-System zeigt, wie etwas aussieht, welche Zustände es gibt und wie sie wechseln (als Beschreibung). Logik (Berechnung, Abläufe, Speichern, Geräte-Funktionen) gehört in die App — oder, wenn mehrere Apps sie teilen, in ein eigenes Modul-Repo.
-   **Das Design-System wird benutzt, nie bearbeitet.** Es ist zentral und liegt außerhalb des Projekts.
-   **App-Spezifisches bleibt im Projekt:** Entwürfe, Texte und Zuordnungen (z. B. welcher Ton was bedeutet) stehen in `_kontext/design.md`, nicht im Design-System.
-   **Fehlt etwas im Design-System** (Komponente, Wert, Muster):
    1.  in `_kontext/design.md` unter „Lokal umgesetzt — gehört ins Design-System" benennen,
    2.  im Projekt vorerst lokal umsetzen — mit den Tokens des Design-Systems, so nah wie möglich an dessen Regeln,
    3.  als Idee für das Design-System vermerken, damit es später von dort verwendet und die lokale Lösung ersetzt wird.

## 3a: Design-Brief

Der Agent schreibt den Brief in das Anforderungsdokument (Vorlage: `_anweisungen/vorlagen/anforderung.md`, Abschnitt „Design-Brief"). Der Brief ist der Auftrag für den Entwurf und hält fest, wovon der Entwurf ausging.

Inhalt:

1.  **Ziel** — was das Design erreichen soll (aus der Idee).
2.  **Ist-Stand** — wie der betroffene Bereich heute aussieht und funktioniert.
3.  **Spielraum** — aus der Klärung übernommen; nicht Angekreuztes bleibt unverändert.
4.  **Feste Grenzen** — was der Entwurf einhalten muss: Felder, Wertebereiche, Zustände, Texte.
5.  **Design-System** — welches System; welche vorhandenen Komponenten und Tokens voraussichtlich gebraucht werden (aus dessen README); die Zuordnungen des Projekts aus `_kontext/design.md`.
6.  **Rahmen** — Geräte, Bildschirmgröße, hell/dunkel, Barrierefreiheit.
7.  **Lücken** — was das Design-System dafür nicht hat. Ausdrücklich benennen, nie still erfinden (weiter siehe Grundsätze).

Abschluss: Der **Nutzer bestätigt** den Brief. Erst dann folgt 3b.

## 3b: Entwurf

-   Claude legt ein **Design-Artifact** an, das auf dem Design-System aufbaut, und folgt dem Brief.
-   **Titel** = kurzer Name der Anforderung, wie ihr Dateiname im Backlog (z. B. „menue-neu"). Eine Nummer gibt es in dieser Stufe noch nicht — sie wird erst beim „Go" vergeben. Im Anforderungsdokument steht nur: `Entwurf: Design-Artifact „menue-neu"` — kein Link.
-   Der Nutzer kommentiert direkt am Entwurf; Claude überarbeitet, bis der Nutzer zufrieden ist.
-   Braucht der Entwurf etwas, das das Design-System nicht hat: als **Lücke** im Brief nachtragen (siehe Grundsätze), nicht still erfinden.

**Wo der Entwurf entsteht:**

-   **Standard: im Chat bzw. in Claude Design** — dort sieht und kommentiert der Nutzer den Entwurf direkt. Ab der Übergabe (3d) arbeiten Refinement und Umsetzung nur mit der abgelegten Datei, auch in der CLI.
-   **Ohne Ansicht im Gespräch (z. B. CLI, Entwicklungs-Container)** — sinnvoll vor allem für kleine Entwürfe:
    -   Der Agent schreibt den Entwurf direkt als HTML-Seite nach `anforderungen/mockups/<kurzer-name>/`; Styles und Komponenten relativ aus der Kopie des Design-Systems im Projekt.
    -   Der Nutzer öffnet die Datei im Browser und lädt nach jeder Änderung neu; besprochen wird im Terminal.
    -   Kann der Agent Screenshots machen (z. B. mit Playwright), prüft er den Entwurf damit selbst, bevor er ihn zeigt — das ersetzt nicht die Sicht des Nutzers.
    -   Im Anforderungsdokument steht: `Entwurf: anforderungen/mockups/<kurzer-name>/`.

## 3c: Freigabe

-   Der **Nutzer gibt den Entwurf frei.** Erst dann wird er abgelegt (3d).
-   Offene Lücken stehen in `_kontext/design.md` unter „Lokal umgesetzt — gehört ins Design-System" und sind als Idee für das Design-System vermerkt.

## 3d: Übergabe

-   **Entstand der Entwurf schon als Datei im Mockup-Ordner** (ohne Ansicht im Gespräch, siehe 3b): Er bleibt dort; es gelten nur die Prüfungen unten (Verweise, Vertraulichkeit).
-   Sonst legt Claude die **freigegebene Quelle des Entwurfs** im Projekt ab: `anforderungen/mockups/<kurzer-name>/`. So steht sie auch dem Agenten in der Umsetzung zur Verfügung, der keinen Zugriff auf Claude Design hat.
-   **Die Ablage muss für sich allein laufen:** jede lokal verwiesene Datei (`src`, `href`, Laufzeit-Skripte wie `support.js`, Bilder) wird mit abgelegt — oder verweist relativ auf die Kopie des Design-Systems im Projekt. Vor dem Abschluss alle Verweise prüfen (z. B. `grep -oE '(src|href)="[^"]+"'`) und sicherstellen, dass jede Datei existiert.
-   **Abgelegt wird das Original** des Entwurfs mit seiner Laufzeit (z. B. `Main.dc.html` + `support.js`) — keine Übersetzung in ein anderes Format und keine zweite, abgeleitete Fassung. Das Original ist maßgeblich und Grundlage der Umsetzung; Werte, Texte und Logik werden aus seinem Quelltext gelesen.
-   Vor dem Ablegen: Vertraulichkeit prüfen; eingebettete Metadaten in Bildern entfernen. Technische Adressen von Bibliotheken in der Laufzeit des Entwurfswerkzeugs (z. B. React aus einem CDN mit fester Version) sind in Ordnung; Links zu Projekt, System oder Dritten nicht.
-   Im Anforderungsdokument unter dem Brief den Ablageort nennen.

## Hinweis für die Umsetzung

Der Entwurf ist eine **ausführbare Vorlage**, kein Bild: Werte und Formeln werden aus der Quelle **übernommen, nicht nachempfunden** — umgesetzt mit den Tokens und Komponenten des Design-Systems.
