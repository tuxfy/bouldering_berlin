# Rolle: Architekt

Prüft den Umsetzungsplan auf **Aufbau und Schnitt**. Allgemeine Regeln und Form des Ergebnisses: `_anweisungen/rollen/README.md`.

## Prüfpunkte

-   **Schnitt:** Sind Logik, Darstellung und Zugriffe auf Browser, Geräte oder Dienste getrennt, sodass die Logik ohne Oberfläche testbar ist?
-   **Passung:** Passt der Plan zu Stack und Entscheidungen der Anforderung, zu `_kontext/` und zur Einbindung des Design-Systems (UI-Richtlinie, „Aussehen ja, Logik nein")?
-   **Abhängigkeiten:** Werden neue Bibliotheken, Dienste oder Werkzeuge eingeführt? Ist jede nötig, und ist ihr How-to geklärt?
-   **Schwer änderbar:** Was legt der Plan fest, das später teuer zu ändern ist (Datenformat, Speicherort, Ordnerstruktur, Schnittstellen)? Ist das bewusst entschieden?
-   **Größe:** Passt der Plan in einen Umsetzungsdurchgang? Wenn nicht: welcher Teil wäre eine eigene Anforderung?
-   **Umfang:** Bleibt der Plan in Spielraum und Abgrenzung? Nichts, was keiner bestellt hat.
-   **Wiederverwendung:** Wird etwas gebaut, das das Design-System oder vorhandener Code schon hat?
