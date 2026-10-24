// Reine Logik für das Boulder-Log: eine Log-Zeile bauen und ans Log anhängen.
// Keine DOM-/Browser-APIs, damit per Unit-Test prüfbar. Format und Regeln aus dem
// freigegebenen Entwurf (_requirements/mockups/boulder-log/Main.dc.html).

/**
 * Baut eine Log-Zeile im Format `- <grad>: <n> tries[ (send)][ - <tags>]`.
 * `1 try` bei genau einem Versuch, sonst `<n> tries`. Styles und optionale
 * „Weitere Angaben" (note) bilden die Tag-Liste (note hinten), verbunden mit ", ".
 * @param {{grade: string, tries: number, send: boolean, styles: string[], note: string}} e
 * @returns {string}
 */
export function formatLine({ grade, tries, send, styles = [], note = "" }) {
  const g = String(grade).trim();
  const n = String(note).trim();
  const tags = n ? [...styles, n] : [...styles];
  return (
    "- " +
    g +
    ": " +
    tries +
    (tries === 1 ? " try" : " tries") +
    (send ? " (send)" : "") +
    (tags.length ? " - " + tags.join(", ") : "")
  );
}

/**
 * Hängt eine Zeile an das bestehende Log an. Leeres oder nur aus Leerraum
 * bestehendes Log ergibt keine führende Leerzeile; ein vorhandener Trailing-
 * Zeilenumbruch wird nicht verdoppelt.
 * @param {string} log
 * @param {string} line
 * @returns {string}
 */
export function appendLine(log, line) {
  const base = String(log).replace(/\s+$/, "");
  return base ? base + "\n" + line : line;
}
