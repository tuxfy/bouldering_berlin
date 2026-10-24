#!/usr/bin/env node
// Kopiert den ausgelieferten CSS-Vertrag des Design-Systems (Tokens + Komponenten-CSS)
// samt benötigter Assets aus dem Submodul nach app/vendor/designsystem/.
// React-Quellen (bundle.js, src/, *.d.ts) werden bewusst NICHT kopiert — sie dienen nur als Referenz.
// Siehe _context/design.md.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const SRC = process.env.DS_SRC || "_design-system";
const DEST = process.env.DS_DEST || "app/vendor/designsystem";

// Datei (oder Ordner) im Quell- → Zielbaum, relativ zu SRC/DEST.
const ITEMS = [
  "tokens.css",
  "components/bundle.css",
  "assets/Icons",
  "assets/Logos/app-icon-192.png",
  "assets/Logos/app-icon-512.png",
];

// Diese müssen vorhanden sein, sonst ist das Submodul nicht ausgecheckt.
const REQUIRED = [
  "tokens.css",
  "components/bundle.css",
  "assets/Logos/app-icon-192.png",
  "assets/Logos/app-icon-512.png",
];

const missing = REQUIRED.filter((rel) => !existsSync(join(SRC, rel)));
if (missing.length > 0) {
  console.error(
    `ds-copy: Design-System unter "${SRC}" unvollständig oder nicht ausgecheckt.\n` +
      `Fehlend: ${missing.join(", ")}\n` +
      `Bitte das Submodul holen:  git submodule update --init`,
  );
  process.exit(1);
}

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

for (const rel of ITEMS) {
  const from = join(SRC, rel);
  const to = join(DEST, rel);
  if (!existsSync(from)) continue; // optionale Assets (z. B. Icons) dürfen fehlen
  mkdirSync(dirname(to), { recursive: true });
  // READMEs des Design-Systems nicht mit ausliefern.
  cpSync(from, to, { recursive: true, filter: (s) => !s.endsWith(".md") });
  console.log(`  ${rel}`);
}

console.log(`ds-copy: Design-System kopiert nach ${DEST}`);
