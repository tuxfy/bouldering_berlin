import { test, expect } from "@playwright/test";

test("Startseite zeigt den ToolHeader und die Boulder-Log-Kachel (dark)", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".tool-header__title")).toHaveText(
    "Bouldering Berlin",
  );

  const list = page.getByTestId("tool-list");
  await expect(list).toBeAttached();
  await expect(list.locator("> *")).toHaveCount(1);

  const tile = list.getByRole("link", { name: "Boulder Log" });
  await expect(tile).toHaveAttribute("href", "./tools/boulder-log/");

  // Der „Noch keine Tools"-Hinweis entfällt, sobald ein Tool vorhanden ist.
  await expect(page.getByTestId("tool-list-empty")).toHaveCount(0);
});
