import { test, expect } from "@playwright/test";

const TOOL = "/tools/boulder-log/";

test.describe("Boulder Log — Eingabe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TOOL);
  });

  test("Navigation: von der Shell ins Tool und über ⊞ Tools zurück", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Boulder Log" }).click();
    await expect(page).toHaveURL(/\/tools\/boulder-log\/$/);
    await expect(page.getByLabel("Grad")).toBeVisible();

    await page.getByRole("link", { name: "⊞ Tools" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(".tool-header__title")).toHaveText(
      "Bouldering Berlin",
    );
  });

  test("Hinzufügen ist ohne Grad deaktiviert, mit Grad aktiv", async ({
    page,
  }) => {
    const add = page.getByRole("button", { name: "Hinzufügen" });
    await expect(add).toBeDisabled();

    await page.getByLabel("Grad").fill("   "); // nur Leerzeichen
    await expect(add).toBeDisabled();

    await page.getByLabel("Grad").fill("6b+");
    await expect(add).toBeEnabled();
  });

  test("Datalist bietet die 18 Font-Grade", async ({ page }) => {
    const options = page.locator("#fb-grades option");
    await expect(options).toHaveCount(18);
    await expect(options.first()).toHaveAttribute("value", "3");
    await expect(options.last()).toHaveAttribute("value", "8a");
  });

  test("Hinzufügen hängt eine Zeile an und setzt die Felder zurück (Grad bleibt)", async ({
    page,
  }) => {
    await page.getByLabel("Grad").fill("6c");
    await page.getByRole("button", { name: "Mehr tries" }).click();
    await page.getByRole("button", { name: "Mehr tries" }).click(); // tries = 3
    await page.getByRole("button", { name: "send", exact: true }).click();
    await page.getByRole("button", { name: "crimp", exact: true }).click();
    await page.getByRole("button", { name: "sloper", exact: true }).click();
    await page.getByRole("button", { name: "Hinzufügen" }).click();

    await expect(page.getByLabel("Boulder Log")).toHaveValue(
      "- 6c: 3 tries (send) - crimp, sloper",
    );
    // Felder zurück, Grad bleibt stehen
    await expect(page.getByLabel("Grad")).toHaveValue("6c");
    await expect(page.locator("#tries")).toHaveText("1");
    await expect(
      page.getByRole("button", { name: "send", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await expect(
      page.getByRole("button", { name: "crimp", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("freie Grad-Eingabe außerhalb der Liste landet korrekt im Log", async ({
    page,
  }) => {
    await page.getByLabel("Grad").fill("7B/C");
    await page.getByRole("button", { name: "Hinzufügen" }).click();
    await expect(page.getByLabel("Boulder Log")).toHaveValue("- 7B/C: 1 try");
  });

  test("mehrere Einträge werden untereinander angehängt", async ({ page }) => {
    await page.getByLabel("Grad").fill("6a");
    await page.getByRole("button", { name: "Hinzufügen" }).click();
    await page.getByLabel("Grad").fill("6b");
    await page.getByRole("button", { name: "Hinzufügen" }).click();
    await expect(page.getByLabel("Boulder Log")).toHaveValue(
      "- 6a: 1 try\n- 6b: 1 try",
    );
  });

  test("Stepper bleibt bei mindestens 1", async ({ page }) => {
    await page.getByRole("button", { name: "Weniger tries" }).click();
    await expect(page.locator("#tries")).toHaveText("1");
  });

  test("leeres Log zeigt den Platzhalter", async ({ page }) => {
    const log = page.getByLabel("Boulder Log");
    await expect(log).toHaveAttribute("placeholder", "Noch keine Einträge.");
    await expect(log).toHaveValue("");
  });
});

test.describe("Boulder Log — Reset", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TOOL);
  });

  async function addOne(page, grade = "6a") {
    await page.getByLabel("Grad").fill(grade);
    await page.getByRole("button", { name: "Hinzufügen" }).click();
  }

  test("Kopieren und Reset sind bei leerem Log deaktiviert, mit Eintrag aktiv", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: "Kopieren" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();

    await addOne(page);

    await expect(page.getByRole("button", { name: "Kopieren" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Reset" })).toBeEnabled();
  });

  test("Reset fragt nach; Abbrechen behält das Log", async ({ page }) => {
    await addOne(page);
    await page.getByRole("button", { name: "Reset" }).click();

    const sheet = page.getByRole("alertdialog", {
      name: "Alle Einträge löschen?",
    });
    await expect(sheet).toBeVisible();

    await page.getByRole("button", { name: "Abbrechen" }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByLabel("Boulder Log")).toHaveValue("- 6a: 1 try");
  });

  test("Reset → Löschen leert das Log", async ({ page }) => {
    await addOne(page);
    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByRole("button", { name: "Löschen" }).click();

    await expect(page.getByRole("alertdialog")).toBeHidden();
    await expect(page.getByLabel("Boulder Log")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  test("Klick auf den Hintergrund schließt das Sheet", async ({ page }) => {
    await addOne(page);
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();

    await page.locator("#sheet").click({ position: { x: 10, y: 10 } });
    await expect(page.getByRole("alertdialog")).toBeHidden();
  });
});
