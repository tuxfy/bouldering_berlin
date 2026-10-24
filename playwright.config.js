import { defineConfig } from "@playwright/test";

const PORT = 5000;
const baseURL = `http://localhost:${PORT}`;

// Zielgerät: iPhone/Safari. In dieser Umgebung läuft WebKit nicht (fehlende System-Libs,
// kein root), daher Chromium mit iPhone-Emulation. Safari-Eigenheiten → Geräte-Nachprüfung
// (Abnahme/Release), siehe _context/projekt.md.
const iPhone = {
  browserName: "chromium",
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    colorScheme: "dark",
    trace: "on-first-retry",
  },
  projects: [{ name: "iphone", use: { ...iPhone } }],
  webServer: {
    command: "npm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
