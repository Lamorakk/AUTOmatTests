/**
 * User scenario: clear everything completed and reach “inbox zero” on active items.
 */
import { expect, test } from "@playwright/test";
import { TodoDemoPage } from "../../pages/TodoDemoPage.js";

test.describe("Scenario: inbox zero", () => {
  test("user finishes all tasks, clears completed, and sees an empty inbox", async ({ page }) => {
    const app = new TodoDemoPage(page);

    await test.step("User opens inbox", async () => {
      await app.goto();
    });

    await test.step("User captures two quick wins", async () => {
      await app.addTodo("Call");
      await app.addTodo("Pay bill");
    });

    await test.step("User completes both", async () => {
      await app.toggleTodo("Call");
      await app.toggleTodo("Pay bill");
      await expect(page.locator(".todo-count")).toContainText("0 items left");
    });

    await test.step("User clears completed to empty the done pile", async () => {
      await app.clearCompleted();
      await expect(app.todoList).toHaveCount(0);
      await expect(app.footer).toBeHidden();
    });
  });
});
