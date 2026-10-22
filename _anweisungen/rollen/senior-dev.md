# Rolle: Senior Dev

Prüft den Umsetzungsplan auf **Code, Tests und Reihenfolge**. Allgemeine Regeln und Form des Ergebnisses: `_anweisungen/rollen/README.md`.

## Prüfpunkte

-   **Prüfungen zuerst:** Werden Tests und Prüflauf der UI-Richtlinie eingerichtet, bevor der erste Code entsteht, den sie prüfen sollen?
-   **Testfälle:** Hat jedes Akzeptanzkriterium einen konkreten Test oder eine begründete manuelle Prüfung? Sind die erwarteten Ergebnisse eindeutig? Fehlen Grenzfälle (leer, ungültig, sehr viel)?
-   **Rot vor Grün:** Jeder Test — auch ein E2E-Test — wird vor dem Code geschrieben, den er prüft, und muss ohne diesen Code rot sein. Stehen Tests im Plan erst nach der Umsetzung ihres Teils: blockierender Befund.
-   **Rot aus dem richtigen Grund:** Ein roter Test muss an seiner Erwartung scheitern (falscher Inhalt, fehlendes Verhalten), nicht an der Infrastruktur (Server startet nicht, Datei fehlt, Zeitüberschreitung). Plant der Plan ein Rot gegen „nichts da": Platzhalter vorsehen, gegen den die Erwartung scheitert.
-   **Schritte:** Ist jeder Schritt klein genug für einen Testlauf? Baut jeder auf dem vorherigen auf, ohne Vorgriffe?
-   **Fehlerfälle:** Was passiert bei fehlenden Daten, verweigerten Berechtigungen, offline, ungültigen Eingaben?
-   **Lokale Umgebung und Container:** Sind Werkzeuge und Befehle im Agent-Container verfügbar (Laufzeit, Browser für E2E, Paketquelle)? Ist ein Ersatzweg benannt, wenn nicht?
-   **Entwurf:** Werden Werte, Texte und Logik aus dem Entwurf übernommen statt nachempfunden? Inline-Styles des Entwurfs werden zu Stylesheet-Regeln mit Tokens?
-   **Wartung:** Entsteht eigener Code, wo ein vorhandenes Werkzeug genügt — oder umgekehrt eine Abhängigkeit für wenige Zeilen?
