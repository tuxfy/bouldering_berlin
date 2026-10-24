import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// Guard: Nach dem Repo-Umzug (Prozess als Submodul _agent-process/, Ordner
// umbenannt) darf keine LEBENDE Code-/Konfig-/Workflow-/Test-Datei mehr auf die
// alten Pfade verweisen. Siehe _requirements/003-prozess-repo-umstellen.md.
//
// Erlaubt sind die neuen Namen (_context, _requirements, _releases, _agent-process,
// _design-system). Verboten sind die alten Tokens unten.
//
// Bewusst NICHT geprüft: eingefrorene Historie (_requirements/done/, _releases/),
// Submodule (_agent-process/, _design-system/), die Vendor-Kopie app/vendor/ und
// diese Datei selbst (sie enthält die Tokens als Suchmuster).

const FILES = [
  "eslint.config.js",
  ".prettierignore",
  ".stylelintignore",
  "package.json",
  "gitleaks.toml",
  "playwright.config.js",
  "scripts/ds-copy.mjs",
  "scripts/check-clean.mjs",
  "scripts/audit.mjs",
  "scripts/gen-sw.mjs",
  ".github/workflows/ci.yml",
  ".github/workflows/deploy.yml",
  "tests/unit/checks-fire.test.mjs",
  "tests/unit/ci-workflows.test.mjs",
];

// Alte Pfade, die es nicht mehr geben darf.
const FORBIDDEN = [/_kontext/, /_anweisungen/, /anforderungen\//];

describe("Keine Verweise auf alte Pfade (Repo-Umzug)", () => {
  for (const file of FILES) {
    it(`${file}: keine Alt-Pfade`, () => {
      const text = readFileSync(file, "utf8");
      const hits = FORBIDDEN.filter((re) => re.test(text)).map((re) =>
        re.toString(),
      );
      expect(hits).toEqual([]);
    });
  }
});
