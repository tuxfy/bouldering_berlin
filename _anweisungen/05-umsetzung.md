# Stufe 5: Umsetzung bis Release

Voraussetzung: Status `refined`, Dokument liegt in `anforderungen/`. Konkrete Befehle (Tests, Start, Deploy) stehen in `_kontext/projekt.md`.

| Schritt | Wer | Ergebnis |
|---|---|---|
| 5a Go | Nutzer | Nummer vergeben, Status `in progress` |
| 5b Plan | Agent schreibt, Nutzer gibt frei | Abschnitt `# Umsetzungsplan` |
| 5c Test zuerst | Agent | roter Test, Testnachweis „Rot" |
| 5d Umsetzen | Agent | Änderung nach Plan, Entscheidungen und UI-Richtlinie |
| 5e Grün und Prüfung | Agent | alle Tests grün, Testnachweis „Grün", Kriterien abgehakt |
| 5f Abnahme | Nutzer | Status `review` → Abnahme |
| 5g Abschluss | Agent + Nutzer | Commit durch den Nutzer, Status `done`, Dokument in `done/` |
| 5h Rückblick | Agent | Erkenntnisse für Projekt bzw. Template |

## 5a: Go

-   Erst nach ausdrücklichem **„Go"** des Nutzers — vorher kein Code.
-   **Nummer vergeben:** höchste vergebene Nummer in `anforderungen/` und `anforderungen/done/` + 1. Datei umbenennen in `<Nr>-<kurzer-name>.md`, Nummer **dreistellig mit führenden Nullen** (z. B. `007-boulder-log.md`), damit die Dateien richtig sortiert werden. Der Ordner eines Entwurfs (`mockups/<kurzer-name>/`) wird nicht umbenannt.
-   Status `in progress`.

## 5b: Plan

Der Agent schreibt den Plan in den Abschnitt `# Umsetzungsplan` — **knapp**, ohne zu wiederholen, was in der Anforderung schon steht:

1.  **Schritte** in Reihenfolge, jeder klein genug für einen Testlauf.
2.  **Betroffene Dateien** — bestehende und neue.
3.  **Testfälle** — je Akzeptanzkriterium der konkrete Test (Name, erwartetes Ergebnis).
4.  **Bei Design:** welches Entwurfselement zu welcher Komponente bzw. Code-Stelle wird.
5.  **Externe Abhängigkeiten** (Schnittstellen, Dienste, Bibliotheken, Hosting) — je Abhängigkeit, wo das **How-to** festgehalten ist (siehe unten).
6.  **Annahmen und Risiken.**
7.  **Was nicht angefasst wird** — aus Spielraum und Abgrenzung.

**Externe Abhängigkeiten — How-to vorher klären.** Bevor Code gegen eine externe Abhängigkeit geschrieben wird, ist geklärt und festgehalten (in `_kontext/` bzw. der Anforderung):

-   wie sie funktioniert (Dokumentation, Formate, Beispiele),
-   wie der Zugang läuft (ohne Zugangsdaten im Dokument — nur, wo sie liegen bzw. wer sie bereitstellt),
-   wie sie im Test ersetzt oder geprüft wird (z. B. Attrappe, Testumgebung),
-   Grenzen und Fehlerfälle (z. B. Limits, Ausfälle, offline).

Ist etwas davon offen: nicht anfangen, sondern mit dem Nutzer klären — ggf. zurück ins Refinement. Ein kurzer, wegwerfbarer Versuch zum Klären ist erlaubt, wenn der Nutzer zustimmt.

**Grundsatzfrage** im Plan (Architektur, Verhalten, Umfang) → zurück ins Refinement.

Abschluss: Der **Nutzer gibt den Plan frei.** Erst dann folgt 5c.

## 5c: Test zuerst (rot)

-   Wo sinnvoll, zuerst einen Test schreiben, der das gewünschte Verhalten (bei Bugs: die Regression) absichert — Art laut Teststrategie der Anforderung.
-   Der Agent führt die Tests selbst aus; der neue Test muss **ohne die Änderung rot** sein.
-   Ergebnis unter `# Testnachweis → Rot`: Befehl, Anzahl bestanden/fehlgeschlagen, Namen der roten Tests.
-   Lässt sich ein Kriterium nicht sinnvoll automatisch testen: begründen, Prüfung erfolgt manuell in 5f.

## 5d: Umsetzen

-   Nach dem freigegebenen **Plan**, den **Entscheidungen** der Anforderung und der **UI-Richtlinie** (`AGENTS.md`).
-   **Abweichung vom Plan:** Plan aktualisieren und dem Nutzer sagen; ist es eine Grundsatzfrage, zurück ins Refinement.
-   **Bei Design:** Werte, Texte und Logik aus der abgelegten Quelle übernehmen, nicht nachempfinden — umgesetzt mit Tokens und Komponenten des Design-Systems.
-   **Neue Grundsatzfrage** (Architektur, Verhalten, Umfang) → nicht selbst entscheiden: zurück ins Refinement, Nutzer fragen, Entscheidung festhalten.
-   Fehlt etwas im Design-System: wie in `_anweisungen/03-design.md` (benennen, lokal umsetzen, als Idee vermerken).

## 5e: Grün und Prüfung

-   Alle Tests grün — vom Agenten ausgeführt. Ergebnis unter `# Testnachweis → Grün`.
-   Jedes Akzeptanzkriterium prüfen und abhaken; was nur manuell prüfbar ist, für 5f markieren.
-   **Prüflauf der UI-Richtlinie** ausführen (Befehl in `_kontext/projekt.md`) — Ergebnis unter `# Testnachweis → UI-Richtlinie`. Ausnahmen sind markiert und in `_kontext/design.md` eingetragen.
-   **Kann der Prüflauf nicht laufen** (z. B. ohne Container und ohne CI): Der Agent sucht selbst nach festen Werten und Inline-Styles im geänderten Code und vermerkt im Testnachweis, dass der Prüflauf nicht lief.

## 5f: Abnahme

-   Status `review`.
-   Der Nutzer prüft, was sich nicht automatisch prüfen lässt (z. B. am Gerät). Befunde → zurück zu 5d.
-   Zur UI-Richtlinie bleibt von Hand zu prüfen, was der Prüflauf nicht erkennt: z. B. eine eigene Komponente, wo das Design-System schon eine hat.

## 5g: Abschluss

-   **Der Agent committet nie.** Er schlägt eine Commit-Nachricht vor:

    ```
    <typ> - <kurzer-name>: <details>
    ```

    `typ` ∈ `feat`, `fix`, `test`, `refactor`, `chore`, `design`.
-   Der Nutzer committet. Release nach dem Modell in `_kontext/projekt.md`.
-   Status `done`; Dokument nach `anforderungen/done/` verschieben (mit Nummer).

## 5h: Rückblick

Kurz festhalten, was gehakt hat:

-   **Projekt betreffend** → `_kontext/` ergänzen.
-   **Prozess betreffend** → als Vorschlag fürs Template notieren (nicht `_anweisungen/` im Projekt ändern).
