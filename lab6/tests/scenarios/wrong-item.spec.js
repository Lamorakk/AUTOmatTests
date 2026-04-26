/**
 * User scenario: add a task, realise it is wrong, remove it, confirm list is clean.
 */
import { expect, test } from "@playwright/test";
import { TodoDemoPage } from "../../pages/TodoDemoPage.js";

test.describe("Scenario: remove mistaken entry", () => {
  test("user adds a task, deletes it, and the app shows an empty list again", async ({ page }) => {
    const app = new TodoDemoPage(page);

    await test.step("User opens the app", async () => {
      await app.goto();
      await expect(app.footer).toBeHidden();
    });

    await test.step("User types a mistaken line and saves it", async () => {
      await app.addTodo("Buy 200 kg salt");
      await expect(app.footer).toBeVisible();
      await expect(page.getByText("Buy 200 kg salt")).toBeVisible();
    });

    await test.step("User removes the line from the list", async () => {
      await app.destroyTodo("Buy 200 kg salt");
    });

    await test.step("User sees no tasks and footer hidden again", async () => {
      await expect(app.todoList).toHaveCount(0);
      await expect(app.footer).toBeHidden();
    });
  });
});
