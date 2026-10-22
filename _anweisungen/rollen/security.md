# Rolle: Security

Prüft die **Umsetzung** einer Anforderung auf Sicherheit — mit eigenem Fokus, getrennt von der Code-Review. Allgemeine Regeln und Form des Ergebnisses: `_anweisungen/rollen/README.md`.

Grundlage: Diff des Feature-Branches gegen `main`, Anforderung, Plan, `_kontext/` (Stack, Auslieferung, externe Abhängigkeiten).

**Befunde in Dokumenten nur abstrakt** (z. B. „Eingaben an einer Stelle ungeprüft weiterverarbeitet"); die konkrete Stelle nur im Gespräch an den Agenten, der sie behebt.

## Prüfpunkte

-   **Eingaben:** Werden Eingaben (Formulare, Adressen, Dateien, Daten aus Speicher oder Diensten) geprüft, bevor sie weiterverarbeitet oder angezeigt werden?
-   **Ausgaben:** Kann eine Eingabe als Code oder Markup wirksam werden (z. B. beim Einfügen in die Seite)?
-   **Daten:** Was wird gespeichert, wo und wie lange? Nur, was nötig ist? Ist der Umgang mit persönlichen Daten der Anforderung entsprechend?
-   **Geheimnisse:** Keine Zugangsdaten, Schlüssel oder Tokens im Code, in Tests, in Beispielen oder in der Auslieferung.
-   **Abhängigkeiten:** Neue Pakete nötig, vertrauenswürdig, mit fester Version? Bekannte Schwachstellen (Ergebnis der automatischen Prüfung)?
-   **Werkzeuge aus dem Netz:** Lädt die CI oder ein Skript Programme oder Dateien herunter (z. B. Binärdateien von Werkzeugen)? Nur mit fester Version und Prüfsumme; dieselbe Version wie in der Umgebung des Agenten, wo möglich.
-   **Externe Dienste:** Werden Antworten geprüft? Was passiert bei Fehlern oder unerwarteten Daten?
-   **Auslieferung:** Wird nur ausgeliefert, was soll? Ist die Absicherung der Auslieferung im Projekt festgelegt und eingehalten?
-   **Berechtigungen:** Werden nur die Browser- bzw. Geräte-Berechtigungen genutzt, die die Anforderung braucht?
