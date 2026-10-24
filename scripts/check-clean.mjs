#!/usr/bin/env node
// Sauberer Lauf (Stufe-0-Standardpruefung "immer", siehe _agent-process/anweisungen/00-einrichtung.md
// und _context/projekt.md): klont den AKTUELLEN COMMIT in einen leeren Temp-Ordner
// OHNE Submodule, ohne vorhandene Abhaengigkeiten und ohne ungetrackte Dateien, und
// fuehrt dort wie die CI `npm ci` + `npm test` aus. Findet damit, "was nur lokal
// vorhanden ist" (z. B. ein lokal ausgechecktes Submodul, das der CI fehlt).
//
// Laeuft bewusst gegen den committeten Stand (git clone zieht nur HEAD) und NICHT
// gegen das Arbeitsverzeichnis — sonst kaeme das lokal ausgecheckte Submodul mit und
// der Lauf waere gruen, obwohl die CI rot ist. Kein Teil von `npm test` (sonst Rekursion).
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

const work = mkdtempSync(join(tmpdir(), "clean-run-"));
const clone = join(work, "repo");

function sh(cmd, args, opts = {}) {
  execFileSync(cmd, args, { stdio: "inherit", ...opts });
}

try {
  console.log(`[sauberer Lauf] klone ${repoRoot} (ohne Submodule) -> ${clone}`);
  // Einfacher Klon: zieht nur den committeten Stand. git clone initialisiert
  // KEINE Submodule (kein --recurse-submodules) und uebernimmt keine
  // ungetrackten / Arbeitsverzeichnis-Dateien — genau die CI-Bedingung.
  sh("git", ["clone", "--quiet", repoRoot, clone]);

  // Selbsttest (load-bearing): das Submodul-Verzeichnis MUSS im Klon leer sein,
  // sonst reproduziert der Lauf die CI-Bedingung nicht.
  const sub = join(clone, "_design-system");
  const subEmpty = !existsSync(sub) || readdirSync(sub).length === 0;
  console.log(
    `[sauberer Lauf] Selbsttest "_design-system leer": ${subEmpty ? "ja" : "NEIN"}`,
  );
  if (!subEmpty) {
    throw new Error(
      "Sauberer Lauf ungueltig: Submodul ist im Klon vorhanden — die CI-Bedingung (ohne Submodul) wird nicht reproduziert.",
    );
  }

  console.log("[sauberer Lauf] npm ci");
  sh("npm", ["ci"], { cwd: clone });

  // Browser wie die CI bereitstellen (ci.yml: `npx playwright install ... chromium`).
  // --with-deps entfaellt: die System-Libs sind in der Agent-Umgebung schon vorhanden.
  console.log("[sauberer Lauf] npx playwright install chromium");
  sh("npx", ["playwright", "install", "chromium"], { cwd: clone });

  console.log("[sauberer Lauf] npm test");
  sh("npm", ["test"], { cwd: clone });

  console.log(
    "[sauberer Lauf] gruen — alle Pruefungen ohne Submodul bestanden.",
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}
