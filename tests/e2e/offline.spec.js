import { test, expect } from "@playwright/test";

test("App lädt nach dem ersten Besuch offline weiter", async ({
  page,
  context,
}) => {
  await page.goto("/");

  // Auf den aktiven, kontrollierenden Service Worker warten (kein Flaky durch Timing):
  await page.waitForFunction(
    () =>
      navigator.serviceWorker && navigator.serviceWorker.controller !== null,
    null,
    { timeout: 20_000 },
  );

  // Netzwerk kappen und neu laden — die Hülle muss weiterhin erscheinen.
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator(".tool-header__title")).toHaveText(
    "Bouldering Berlin",
  );
  await context.setOffline(false);
});
