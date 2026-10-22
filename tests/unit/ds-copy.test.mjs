import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = "scripts/ds-copy.mjs";

function run(env) {
  return execFileSync("node", [SCRIPT], {
    env: { ...process.env, ...env },
    stdio: "pipe",
  });
}

describe("ds-copy", () => {
  it("kopiert den CSS-Vertrag und Icons, aber keine React-Quellen", () => {
    const dest = mkdtempSync(join(tmpdir(), "ds-ok-"));
    try {
      // Quelle ist das eingecheckte Fixture statt des Submoduls: deterministisch
      // und submodul-unabhaengig (laeuft so auch in der CI, wo das Submodul fehlt).
      // Das Fixture enthaelt bewusst React-Quellen-Attrappen, damit die
      // Ausschluss-Pruefung unten echt greift (keine Abschwaechung).
      run({ DS_SRC: "tests/fixtures/designsystem", DS_DEST: dest });
      expect(existsSync(join(dest, "tokens.css"))).toBe(true);
      expect(existsSync(join(dest, "components/bundle.css"))).toBe(true);
      expect(existsSync(join(dest, "assets/Logos/app-icon-192.png"))).toBe(
        true,
      );
      expect(existsSync(join(dest, "assets/Logos/app-icon-512.png"))).toBe(
        true,
      );
      // React-Quellen dürfen NICHT mitkopiert werden:
      expect(existsSync(join(dest, "components/bundle.js"))).toBe(false);
      expect(existsSync(join(dest, "components/src"))).toBe(false);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("bricht bei fehlendem Submodul mit klarer Meldung und Exit != 0 ab", () => {
    const base = mkdtempSync(join(tmpdir(), "ds-err-"));
    let err;
    try {
      run({ DS_SRC: join(base, "nope"), DS_DEST: join(base, "out") });
    } catch (e) {
      err = e;
    }
    expect(err, "Skript hätte fehlschlagen müssen").toBeDefined();
    expect(err.status).not.toBe(0);
    const msg = String(err.stderr) + String(err.stdout);
    expect(msg).toMatch(/submodule update --init/);
    rmSync(base, { recursive: true, force: true });
  });
});
