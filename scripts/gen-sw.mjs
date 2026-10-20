#!/usr/bin/env node
// Erzeugt app/sw-precache.js aus dem Inhalt von app/ — Precache-Liste und Cache-Kennung
// werden erzeugt, nicht von Hand gepflegt. Ein neuer Baustein unter app/ wird automatisch
// mitgecacht. Lokal: Version "dev". Im Deploy: SW_VERSION aus dem Tag.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "app";
const OUT = join(ROOT, "sw-precache.js");
const EXCLUDE_FILES = new Set(["sw.js", "sw-precache.js"]);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(ROOT, full).split(/[\\/]/).join("/");
    if (EXCLUDE_FILES.has(rel)) continue;
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (!rel.endsWith(".md")) acc.push("./" + rel);
  }
  return acc;
}

const assets = walk(ROOT).sort();
const version = process.env.SW_VERSION || "dev";
const body =
  "// Generiert von scripts/gen-sw.mjs — nicht von Hand bearbeiten.\n" +
  `self.__PRECACHE = ${JSON.stringify({ version, assets }, null, 2)};\n`;
writeFileSync(OUT, body);
console.log(`gen-sw: ${assets.length} Dateien, Version "${version}" -> ${OUT}`);
