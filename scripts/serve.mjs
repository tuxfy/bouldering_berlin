#!/usr/bin/env node
// Minimaler statischer Server für den Ordner app/ — ohne Abhängigkeit, build-frei.
// localhost gilt als sicherer Kontext, daher funktioniert der Service Worker lokal.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname } from "node:path";

const ROOT = normalize(join(process.cwd(), process.env.SERVE_ROOT || "app"));
const PORT = Number(process.env.PORT || 5000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const filePath = normalize(join(ROOT, pathname));
    if (filePath !== ROOT && !filePath.startsWith(ROOT + "/")) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      res
        .writeHead(404, { "content-type": "text/plain; charset=utf-8" })
        .end("Not found");
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": TYPES[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(body);
  } catch {
    res.writeHead(500).end("Server error");
  }
});

server.listen(PORT, () =>
  console.log(`serve: http://localhost:${PORT} (root: ${ROOT})`),
);
