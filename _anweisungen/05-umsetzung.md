# Stufe 5: Umsetzung

Voraussetzung: Status `refined`, Dokument liegt in `anforderungen/`. Konkrete Befehle (Tests, Start, Deploy) stehen in `_kontext/projekt.md`.

| Schritt | Wer | Ergebnis |
|---|---|---|
| 5a Go | Nutzer | Nummer vergeben, Status `in progress` |
| 5b Plan | Agent schreibt, Rollen prüfen, Nutzer gibt frei | Abschnitt `# Umsetzungsplan`, Zusammenfassung für den Nutzer |
| 5c Test zuerst | Agent | roter Test, Testnachweis „Rot" |
| 5d Umsetzen | Agent | Änderung nach Plan, Entscheidungen und UI-Richtlinie |
| 5e Grün | Agent | alle Tests und Prüflauf grün, Testnachweis „Grün", Status `qa` |

Danach: Stufe 6 (QA), Stufe 7 (Abnahme), Stufe 8 (Release).

## 5a: Go

-   Erst nach ausdrücklichem **„Go"** des Nutzers — vorher kein Code.
-   **Nummer vergeben:** höchste vergebene Nummer in `anforderungen/` und `anforderungen/done/` + 1. Datei umbenennen in `<Nr>-<kurzer-name>.md`, Nummer **dreistellig mit führenden Nullen** (z. B. `007-boulder-log.md`), damit die Dateien richtig sortiert werden. Der Ordner eines Entwurfs (`mockups/<kurzer-name>/`) wird nicht umbenannt.
-   Weiter auf dem Branch der Anforderung (angelegt in Stufe 2).
-   Status `in progress`.

## 5b: Plan

Der Agent schreibt den Plan in den Abschnitt `# Umsetzungsplan` des Anforderungsdokuments — **keine eigene Datei**, **knapp**, ohne zu wiederholen, was in der Anforderung schon steht:

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

**Plan prüfen**, bevor er dem Nutzer vorgelegt wird:

1.  **Selbstprüfung — immer:** Der Agent prüft den Plan mit den Prüfpunkten der Rollen (`_anweisungen/rollen/`), soweit sie den Plan betreffen, und bessert nach.
2.  **Prüfung durch Rollen** — unabhängige Prüfer mit frischem Blick, die nur lesen (in Claude Code als Unteragenten unter `.claude/agents/`; ohne Unteragenten: eigene Sitzung je Rolle):
    -   **Architekt** und **Senior Dev:** bei neuem Projekt oder Grundgerüst, neuen externen Abhängigkeiten oder einem Plan ab etwa fünf Schritten.
    -   **DevOps** zusätzlich, wenn der Plan CI, Hosting, Auslieferung oder das Release-Modell berührt.
    -   Sonst genügt die Selbstprüfung.
3.  **Befunde einarbeiten:** blockierende immer, empfohlene in der Regel; was nicht übernommen wird, mit Grund im Plan unter „Annahmen und Risiken".
4.  **Widersprechen sich Rollen** oder berührt ein Befund eine Entscheidung der Anforderung: nicht selbst auflösen — dem Nutzer als Entscheidung vorlegen, mit beiden Sichtweisen in Alltagssprache.

**Zusammenfassung für den Nutzer** — kurz, in Alltagssprache, nicht im Dokument, sondern im Gespräch:

-   **Was passiert:** drei bis fünf Sätze.
-   **Was du entscheiden oder liefern musst** (z. B. eine Einstellung bestätigen, einmal einen Befehl ausführen).
-   **Was riskant ist** und wie damit umgegangen wird.
-   **Wer geprüft hat** und was sich dadurch am Plan geändert hat.

Abschluss: Der **Nutzer gibt den Plan frei** — er beurteilt Umfang, Entscheidungen und Risiken; die technische Güte sichern Selbstprüfung und Rollen. Der Agent committet den freigegebenen Plan; erst dann folgt 5c.

## 5c: Test zuerst (rot)

-   Wo sinnvoll, zuerst einen Test schreiben, der das gewünschte Verhalten (bei Bugs: die Regression) absichert — Art laut Teststrategie der Anforderung.
-   Der Agent führt die Tests selbst aus; der neue Test muss **ohne die Änderung rot** sein.
-   Ergebnis unter `# Testnachweis → Rot`: Befehl, Anzahl bestanden/fehlgeschlagen, Namen der roten Tests.
-   Lässt sich ein Kriterium nicht sinnvoll automatisch testen: begründen, Prüfung erfolgt manuell in der Abnahme (Stufe 7).

## 5d: Umsetzen

-   Nach dem freigegebenen **Plan**, den **Entscheidungen** der Anforderung und der **UI-Richtlinie** (`AGENTS.md`).
-   **Abweichung vom Plan:** Plan aktualisieren und dem Nutzer sagen; ist es eine Grundsatzfrage, zurück ins Refinement.
-   **Bei Design:** Werte, Texte und Logik aus der abgelegten Quelle übernehmen, nicht nachempfinden — umgesetzt mit Tokens und Komponenten des Design-Systems.
-   **Neue Grundsatzfrage** (Architektur, Verhalten, Umfang) → nicht selbst entscheiden: zurück ins Refinement, Nutzer fragen, Entscheidung festhalten.
-   Fehlt etwas im Design-System: wie in `_anweisungen/03-design.md` (benennen, lokal umsetzen, als Idee vermerken).

## 5e: Grün

-   Alle Tests grün — vom Agenten ausgeführt. Ergebnis unter `# Testnachweis → Grün`.
-   **Sauberer Lauf** (Befehl in `_kontext/projekt.md`) grün — Ergebnis im Testnachweis.
-   Jedes Akzeptanzkriterium prüfen und abhaken; was nur manuell prüfbar ist, für die Abnahme (Stufe 7) markieren.
-   **Prüflauf der UI-Richtlinie** ausführen (Befehl in `_kontext/projekt.md`) — Ergebnis unter `# Testnachweis → UI-Richtlinie`. Ausnahmen sind markiert und in `_kontext/design.md` eingetragen.
-   **Kann der Prüflauf nicht laufen** (z. B. ohne Container und ohne CI): Der Agent sucht selbst nach festen Werten und Inline-Styles im geänderten Code und vermerkt im Testnachweis, dass der Prüflauf nicht lief.
-   Status `qa`; weiter mit `_anweisungen/06-qa.md`.

## Commits

-   Der Agent committet nach dem freigegebenen Plan und nach **jedem grünen Schritt** des Plans auf dem Feature-Branch — mit dem zugehörigen Stand des Testnachweises. Format und Regeln: `AGENTS.md`, Abschnitt „Commits".
