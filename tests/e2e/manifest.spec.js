import { test, expect } from "@playwright/test";

test("Manifest ist gültig und installierbar (standalone, Icons 192/512)", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href, 'kein <link rel="manifest">').toBeTruthy();

  const manifestUrl = new URL(href, page.url());
  const res = await request.get(manifestUrl.toString());
  expect(res.ok(), "Manifest nicht erreichbar").toBeTruthy();

  const m = await res.json();
  expect(m.display).toBe("standalone");
  expect(String(m.name)).toContain("Bouldering Berlin");

  const sizes = (m.icons || []).map((i) => i.sizes);
  expect(sizes).toContain("192x192");
  expect(sizes).toContain("512x512");

  // Jedes referenzierte Icon lädt wirklich:
  for (const icon of m.icons) {
    const ir = await request.get(new URL(icon.src, manifestUrl).toString());
    expect(ir.ok(), `Icon fehlt: ${icon.src}`).toBeTruthy();
  }
});
