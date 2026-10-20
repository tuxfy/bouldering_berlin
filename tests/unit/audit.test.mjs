import { describe, it, expect } from "vitest";
import { evaluate } from "../../scripts/audit.mjs";

const mk = (total) => ({ metadata: { vulnerabilities: { total } } });

describe("audit evaluate", () => {
  it("blockiert bei Schwachstellen in ausgelieferten (prod) Abhängigkeiten", () => {
    const r = evaluate(mk(2), mk(5));
    expect(r.block).toBe(true);
    expect(r.prod).toBe(2);
    expect(r.dev).toBe(3);
  });

  it("blockiert nicht bei reinen Entwicklungs-Schwachstellen (nur Warnung)", () => {
    const r = evaluate(mk(0), mk(5));
    expect(r.block).toBe(false);
    expect(r.dev).toBe(5);
  });

  it("meldet sauber, wenn nichts gefunden wird", () => {
    const r = evaluate(mk(0), mk(0));
    expect(r.block).toBe(false);
    expect(r.dev).toBe(0);
  });
});
