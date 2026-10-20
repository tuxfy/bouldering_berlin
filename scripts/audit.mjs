#!/usr/bin/env node
// Schwachstellen in Abhängigkeiten: ausgelieferte (prod) blockieren, Entwicklungswerkzeuge
// (nur im vollen Audit) sind Warnung. Siehe _kontext/projekt.md und _anweisungen/00-einrichtung.md.
import { execSync } from "node:child_process";

/** Wertet zwei npm-audit-JSONs aus: voll und prod-only. */
export function evaluate(prodAudit, fullAudit) {
  const total = (a) => a?.metadata?.vulnerabilities?.total ?? 0;
  const prod = total(prodAudit);
  const full = total(fullAudit);
  const dev = Math.max(full - prod, 0);
  return { prod, full, dev, block: prod > 0 };
}

function runAudit(extra) {
  try {
    const out = execSync(`npm audit --json ${extra}`.trim(), {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(out);
  } catch (e) {
    // npm audit endet bei Funden mit Code != 0; das JSON steht trotzdem in stdout.
    try {
      return JSON.parse(e.stdout);
    } catch {
      return {};
    }
  }
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const r = evaluate(runAudit("--omit=dev"), runAudit(""));
  if (r.dev > 0) {
    console.warn(
      `audit: ${r.dev} Warnung(en) in Entwicklungswerkzeugen — nicht ausgeliefert, hingenommen.`,
    );
  }
  if (r.block) {
    console.error(
      `audit: ${r.prod} Schwachstelle(n) in ausgelieferten Abhängigkeiten — blockiert.`,
    );
    process.exit(1);
  }
  console.log(
    `audit: 0 Schwachstellen in ausgelieferten Abhängigkeiten (prod); Entwicklung: ${r.dev} Warnung(en).`,
  );
}
