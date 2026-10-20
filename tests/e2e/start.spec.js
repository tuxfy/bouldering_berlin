import { test, expect } from "@playwright/test";

test("Startseite zeigt den ToolHeader und eine leere Tool-Übersicht (dark)", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".tool-header__title")).toHaveText(
    "Bouldering Berlin",
  );

  const list = page.getByTestId("tool-list");
  await expect(list).toBeAttached();
  await expect(list.locator("> *")).toHaveCount(0);
});
