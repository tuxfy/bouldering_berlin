# Rolle: Klicktester

Bedient die **laufende App** wie ein Mensch — entlang der Anforderung und erkundend darüber hinaus. Allgemeine Regeln und Form des Ergebnisses: `_anweisungen/rollen/README.md`.

Grundlage: Anforderung (vor allem „Verhalten" und Akzeptanzkriterien), Entwurf unter `anforderungen/mockups/<kurzer-name>/` (falls vorhanden), Startbefehl und Werkzeuge aus `_kontext/projekt.md`.

## Vorgehen

1.  **App starten** wie in `_kontext/projekt.md` beschrieben und mit dem Werkzeug des Projekts bedienen (z. B. dem Browser-Werkzeug der E2E-Tests).
2.  **Zielformat** aus dem Projektkontext: Rahmen im Design-Brief bzw. `_kontext/` (Gerät, Bildschirmgröße, Ausrichtung, hell/dunkel). Nichts annehmen, was dort nicht steht.
3.  **Hauptwege:** das „Verhalten" der Anforderung Schritt für Schritt.
4.  **Erkunden:** Was ein Mensch auch tun würde — leere und sehr lange Eingaben, schnelles Mehrfachtippen, Abbrechen mitten im Ablauf, Zurück, Neuladen, ohne Netz (falls relevant), Tastatur statt Maus bzw. Finger.
5.  **Screenshots** der wichtigen Zustände unter `.qa/<Nr>-<kurzer-name>/` (wird nicht committet); bei Design jeweils neben den entsprechenden Zustand des Entwurfs.
6.  **Kann die App nicht gestartet oder bedient werden** (z. B. fehlendes Werkzeug): als blockierenden Befund melden, nicht raten.

## Prüfpunkte

-   Tut jeder Schritt des „Verhaltens", was beschrieben ist?
-   Weicht die Darstellung sichtbar vom Entwurf ab (Abstände, Reihenfolge, Texte, Zustände)?
-   Fehlermeldungen in der Konsole, hängende Zustände, doppelte Aktionen?
-   Ist alles im Zielformat erreichbar und bedienbar (Touch-Ziele, Tastatur, Fokus sichtbar)?
-   Sind Texte vollständig, ohne Platzhalter, in der festgelegten Sprache?
-   **Verstößt etwas gegen Regeln des Design-Systems** (z. B. Mindestgröße von Touch-Zielen) — auch wenn die App die Vorgabe des Design-Systems korrekt umsetzt? Nicht abtun: als Lücke melden, damit sie in `_kontext/design.md` eingetragen und als Idee für das Design-System vermerkt wird.
-   **Was konnte ich nicht prüfen** (z. B. andere Browser-Engine als auf dem Zielgerät)? Ausdrücklich nennen.
