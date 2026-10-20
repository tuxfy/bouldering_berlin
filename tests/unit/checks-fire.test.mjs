import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

// Belegt reproduzierbar, dass jede Prüfung bei einem Verstoß wirklich rot wird.
// Die Fixtures unter tests/fixtures/ sind aus den normalen Läufen ausgenommen
// (siehe .stylelintignore, eslint.config.js ignores, gitleaks.toml allowlist).
function fails(cmd, args) {
  try {
    execFileSync(cmd, args, { stdio: "pipe" });
    return false;
  } catch {
    return true;
  }
}

describe("Prüfungen greifen bei einem Verstoß", () => {
  it("Stylelint meldet eine Hex-Farbe", () => {
    expect(
      fails("npx", [
        "stylelint",
        "tests/fixtures/bad.css",
        "--config",
        "_anweisungen/pruefung/stylelint.json",
      ]),
    ).toBe(true);
  });

  it("ESLint meldet einen fehlerhaften File", () => {
    expect(
      fails("npx", ["eslint", "--no-ignore", "tests/fixtures/bad.js"]),
    ).toBe(true);
  });

  it("gitleaks findet einen privaten Schlüssel", () => {
    expect(
      fails("gitleaks", [
        "detect",
        "--no-git",
        "--no-banner",
        "--source",
        "tests/fixtures/secret",
      ]),
    ).toBe(true);
  });
});
