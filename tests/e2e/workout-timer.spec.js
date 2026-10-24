import { test, expect } from "@playwright/test";

const TOOL = "/tools/workout-timer/index.html";

// Kleine Werte, damit der Lauf per page.clock schnell durchläuft.
const preset = (cfg) =>
  `localStorage.setItem('bb:workout-timer', '${JSON.stringify(cfg)}')`;

test.describe("Workout-Timer — Einstellen & Navigation", () => {
  test("von der Shell ins Tool und über ⊞ Tools zurück", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Workout-Timer" }).click();
    await expect(page).toHaveURL(/\/tools\/workout-timer\/index\.html$/);
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();

    await page.getByRole("link", { name: "⊞ Tools" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(".tool-header__title")).toHaveText(
      "Bouldering Berlin",
    );
  });

  test("Gesamtdauer aus den Vorgaben, Stepper und Klemmen", async ({
    page,
  }) => {
    await page.goto(TOOL);
    await expect(page.locator("#total")).toHaveText("16:55"); // Vorgaben

    // Stepper +: Sets 5 → 6, Gesamtdauer steigt.
    await page.getByRole("button", { name: "Sets mehr" }).click();
    await expect(page.getByLabel("Sets", { exact: true })).toHaveValue("6");

    // Eingabe über Grenze wird geklemmt (Sets max 20).
    const sets = page.getByLabel("Sets", { exact: true });
    await sets.fill("999");
    await sets.blur();
    await expect(sets).toHaveValue("20");

    // Negative Direkteingabe wird auf das Minimum geklemmt (Pause min 0).
    const pause = page.getByLabel("Pause", { exact: true });
    await pause.fill("-5");
    await pause.blur();
    await expect(pause).toHaveValue("0");
  });

  test("zuletzt genutzte Werte bleiben über einen Reload erhalten", async ({
    page,
  }) => {
    await page.goto(TOOL);
    const work = page.getByLabel("Work", { exact: true });
    await work.fill("12");
    await work.blur();
    await page.reload();
    await expect(page.getByLabel("Work", { exact: true })).toHaveValue("12");
  });
});

test.describe("Workout-Timer — Lauf", () => {
  test("läuft über die Phasen bis Fertig (gesteuerte Uhr)", async ({
    page,
  }) => {
    await page.clock.install();
    await page.addInitScript(
      preset({ sets: 1, reps: 2, work: 1, rest: 1, pause: 0 }),
    );
    await page.goto(TOOL);
    // Timeline: prep10, work(1,1)1, rest(1,1)1, work(1,2)1 → gesamt 13
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.locator("#label")).toHaveText("GET READY");
    await expect(page.locator("#value")).toHaveText("0:10");

    await page.clock.runFor(10000);
    await expect(page.locator("#label")).toHaveText("WORK");
    await expect(page.locator("#rep")).toHaveText("1 / 2");

    await page.clock.runFor(1000);
    await expect(page.locator("#label")).toHaveText("REST");

    await page.clock.runFor(1000);
    await expect(page.locator("#label")).toHaveText("WORK");
    await expect(page.locator("#rep")).toHaveText("2 / 2");

    await page.clock.runFor(1000);
    await expect(page.locator("#label")).toHaveText("DONE");
    await expect(page.getByRole("button", { name: "Nochmal" })).toBeVisible();
  });

  test("Pause hält an und Weiter setzt fort", async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(
      preset({ sets: 1, reps: 1, work: 20, rest: 1, pause: 0 }),
    );
    await page.goto(TOOL);
    await page.getByRole("button", { name: "Start" }).click();
    await page.clock.runFor(10000); // ins Work (20 s)
    await page.clock.runFor(5000); // 5 s ins Work → rem 15
    await expect(page.locator("#value")).toHaveText("0:15");

    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.locator("#caption")).toHaveText("Angehalten");
    await page.clock.runFor(5000); // angehalten: keine Änderung
    await expect(page.locator("#value")).toHaveText("0:15");

    await page.getByRole("button", { name: "Weiter" }).click();
    await page.clock.runFor(5000);
    await expect(page.locator("#value")).toHaveText("0:10");
  });

  test("Skip beendet die Phase, aus der letzten Phase folgt Fertig", async ({
    page,
  }) => {
    await page.clock.install();
    await page.addInitScript(
      preset({ sets: 1, reps: 1, work: 30, rest: 1, pause: 0 }),
    );
    await page.goto(TOOL);
    // Timeline: prep10, work30
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.locator("#label")).toHaveText("GET READY");
    await page.getByRole("button", { name: "Überspringen" }).click();
    await expect(page.locator("#label")).toHaveText("WORK");
    await page.getByRole("button", { name: "Überspringen" }).click();
    await expect(page.locator("#label")).toHaveText("DONE");
  });

  test("Reset öffnet das Sheet; Weitermachen und Beenden", async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(
      preset({ sets: 1, reps: 1, work: 30, rest: 1, pause: 0 }),
    );
    await page.goto(TOOL);
    await page.getByRole("button", { name: "Start" }).click();
    await page.clock.runFor(10000);

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByText("Workout beenden?")).toBeVisible();
    await page.getByRole("button", { name: "Weitermachen" }).click();
    await expect(page.getByText("Workout beenden?")).toBeHidden();

    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByRole("button", { name: "Beenden" }).click();
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  });

  test("Fertig: Nochmal startet neu, Zurück führt zu Einstellen", async ({
    page,
  }) => {
    await page.clock.install();
    await page.addInitScript(
      preset({ sets: 1, reps: 1, work: 1, rest: 1, pause: 0 }),
    );
    await page.goto(TOOL);
    await page.getByRole("button", { name: "Start" }).click();
    await page.clock.runFor(11000); // prep10 + work1 → Fertig
    await expect(page.locator("#label")).toHaveText("DONE");

    await page.getByRole("button", { name: "Nochmal" }).click();
    await expect(page.locator("#label")).toHaveText("GET READY");

    await page.clock.runFor(11000);
    await page.getByRole("button", { name: "Zurück" }).click();
    await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  });
});

test("Workout-Timer lädt beim direkten Einstieg offline weiter", async ({
  page,
  context,
}) => {
  await page.goto(TOOL);
  await page.waitForFunction(
    () =>
      navigator.serviceWorker && navigator.serviceWorker.controller !== null,
    null,
    { timeout: 20_000 },
  );
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await context.setOffline(false);
});
