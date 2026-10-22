# Stufe 1: Idee oder Bug

Festhalten, nicht lösen. Ein Eintrag ist bewusst kurz — er dient dem **Festhalten**, nicht dem Refinement.

| Art | Vorlage | Status | Inhalt |
|---|---|---|---|
| **Idee** — etwas Neues oder anders | `_anweisungen/vorlagen/idee.md` | `idea` | was stört oder fehlt · was danach anders sein soll |
| **Bug** — etwas funktioniert nicht wie festgelegt | `_anweisungen/vorlagen/bug.md` | `bug` | was passiert · was erwartet war · wie es auftritt · Stand |

-   Ablage: `anforderungen/backlog/<kurzer-name>.md`.
-   Festhalten darf **jeder** — auch der Agent mitten im Gespräch.
-   Der Agent schärft einen Eintrag **nicht von sich aus** aus; das passiert erst, wenn der Nutzer ihn aufgreift (→ Stufe 2).
-   **Meldet der Nutzer einen Fehler oder Wunsch** oder kommt im Gespräch etwas Neues auf: **zuerst** festhalten — nicht sofort beheben, planen oder Code schreiben. Auch nicht „schnell nebenbei".
-   Gehört ein Fehler zu einer Anforderung, die noch in Arbeit ist (vor der Abnahme): kein eigener Bug — zurück in deren Stufe 5. Gehört er zu etwas Abgenommenem oder Ausgeliefertem: eigener Bug.

## Weg eines Bugs

Derselbe Prozess, nur kürzer:

1.  **Klärung (Stufe 2):** Ursache bestätigen ist Pflicht; Spielraum in der Regel nur „Verhalten" der betroffenen Stelle.
2.  **Design (Stufe 3):** meist nicht nötig — bei einem UI-Bug steht das erwartete Aussehen schon fest (freigegebener Entwurf, Design-System); korrigiert wird dorthin. **Nötig,** wenn die Korrektur eine neue Gestaltungsentscheidung braucht (z. B. ein Fall, den weder Entwurf noch Design-System abdecken) — dann wie in Stufe 3, Entscheidung in der Klärung.
3.  **Refinement (Stufe 4):** kurz — Ursache, erwartetes Verhalten, Kriterium „Test zeigt den Fehler (rot), nach der Korrektur grün".
4.  **Umsetzung (Stufe 5):** Branch `fix/<Nr>-<kurzer-name>`; zuerst der Test, der den Fehler zeigt.
5.  **QA (Stufe 6):** automatische Prüfungen und Reviewer; Klicktester bei UI, Security bei Bedarf.
6.  **Abnahme und Release (Stufen 7, 8):** wie sonst; ein Release nur mit Bugs erhöht die Patch-Version (z. B. `v0.1.1`).
