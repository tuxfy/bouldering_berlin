import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// Guard: Kein Workflow-Checkout darf Submodule ziehen. Das private Submodul
// _design-system ist in der CI nicht erreichbar und für `npm test` nicht
// nötig — das Design-System liegt eingecheckt unter app/vendor/designsystem/.
// Invariante über ALLE Jobs beider Dateien (schützt auch den deploy-Job),
// nicht auf eine feste Anzahl Fundstellen fixiert.
// Siehe _requirements/done/002-ci-submodul-designsystem.md.

const WORKFLOWS = [".github/workflows/ci.yml", ".github/workflows/deploy.yml"];

// Alle `submodules:`-Angaben einer Datei mit ihrem Wert einsammeln.
function submoduleSettings(path) {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.match(/^\s*submodules\s*:\s*(\S+)/))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

// `true` und `recursive` ziehen Submodule; `false` nicht.
const ZIEHT = new Set(["true", "recursive"]);

describe("CI-Workflows ziehen keine Submodule", () => {
  for (const path of WORKFLOWS) {
    it(`${path}: kein actions/checkout mit truthy submodules`, () => {
      const truthy = submoduleSettings(path).filter((v) => ZIEHT.has(v));
      expect(truthy).toEqual([]);
    });
  }
});
