# Stufe 2: Klärung

**Beginn:** Greift der Nutzer einen Eintrag auf, legt der Agent den Branch `feature/<kurzer-name>` (bei Bugs `fix/<kurzer-name>`) von `main` an; alle weiteren Stufen dieser Anforderung bis zur Abnahme laufen dort. Voraussetzung: Der Eintrag ist schon auf `main` (Backlog-Pull-Request zusammengeführt).

Der Nutzer greift eine Idee auf. Bevor über Lösungen nachgedacht wird, klärt der Agent den **Rahmen**.

## Start

-   Auslöser: Der Nutzer greift eine Idee ausdrücklich auf.
-   Status `idea` → `new`. Das Dokument bleibt in `anforderungen/backlog/`.
-   Das Dokument wird nach `_anweisungen/vorlagen/anforderung.md` erweitert; der Abschnitt „Idee" bleibt unverändert erhalten.

## Was der Agent macht

1.  **Ist-Stand beschreiben** → Abschnitt „Hintergrund": Wie funktioniert der betroffene Teil heute? Bei Bugs: beobachtetes Fehlverhalten.
2.  **Art bestimmen**: Feature, Bug, Design oder technisch.
3.  **Spielraum vorschlagen** — welche Bereiche dürfen sich ändern:
    -   **Darstellung** — wie es aussieht oder formuliert ist
    -   **Verhalten** — was es aus Nutzersicht tut
    -   **Struktur** — wie es intern gebaut ist, nach außen unverändert
    -   **Schnittstellen/Daten** — Formate, gespeicherte Daten, APIs

    Alles, was **nicht** angekreuzt ist, bleibt unverändert. **Der Nutzer entscheidet** den Spielraum.

    **So fragen:** nicht abstrakt („Welcher Spielraum?"), sondern
    1.  in ein, zwei Sätzen erklären, wofür der Spielraum da ist — er legt fest, was sich durch die Anforderung ändern darf, und schützt alles andere vor ungewollten Änderungen (z. B. dass ein Redesign nicht still das Verhalten ändert),
    2.  einen **konkreten Vorschlag** für genau diese Idee machen, je Bereich mit kurzer Begründung (z. B. „Verhalten: ja — die Funktion ist neu"; „Schnittstellen/Daten: ja — es wird lokal gespeichert"),
    3.  dann um Bestätigung oder Korrektur bitten.

    Bei einem **neuen Projekt** ohne bestehenden Stand gilt meist alles als änderbar — dann das kurz sagen statt vier Einzelfragen zu stellen.
4.  **Offene Fragen sammeln** — als Liste, noch ohne Antworten.
5.  **Weg vorschlagen**: Braucht es ein Design (→ Stufe 3)? Bei einem Bug: Ursache bestätigen und „Welche Prüfung hätte ihn finden müssen?" sind Pflicht (siehe `_anweisungen/01-idee.md`, Weg eines Bugs).

## Was noch nicht hineingehört

Lösungen, Akzeptanzkriterien, Design, Implementierungsdetails.

## Abschluss

Die Klärung ist abgeschlossen, wenn der **Nutzer Spielraum und Weg bestätigt** hat. Offene Fragen dürfen bleiben — sie werden in Stufe 3 bzw. 4 beantwortet.
