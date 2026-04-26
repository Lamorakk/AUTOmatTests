/**
 * User scenario (not an isolated UI check): plan shopping, mark bought items,
 * use filters like “show only still to buy”, then clean up completed.
 */
import { expect, test } from "@playwright/test";
import { TodoDemoPage } from "../../pages/TodoDemoPage.js";

test.describe("Scenario: shopping day", () => {
  test("user plans purchases, completes some, filters list, then clears history", async ({ page }) => {
    const app = new TodoDemoPage(page);

    await test.step("User opens the task app", async () => {
      await app.goto();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("todos");
    });

    await test.step("User adds several items to the list", async () => {
      await app.addTodo("Milk");
      await app.addTodo("Bread");
      await app.addTodo("Cheese");
      await expect(page.locator(".todo-count")).toContainText("3 items left");
    });

    await test.step("User marks bought items as done", async () => {
      await app.toggleTodo("Milk");
      await app.toggleTodo("Bread");
      await expect(app.todoItemByText("Milk")).toHaveClass(/completed/);
    });

    await test.step("User applies filter to see only what is still open", async () => {
      await app.filterBy("Active");
      await expect(page.getByText("Cheese")).toBeVisible();
      await expect(page.getByText("Milk")).toBeHidden();
    });

    await test.step("User checks completed aisle", async () => {
      await app.filterBy("Completed");
      await expect(page.getByText("Milk")).toBeVisible();
      await expect(page.getByText("Bread")).toBeVisible();
      await expect(page.getByText("Cheese")).toBeHidden();
    });

    await test.step("User returns to full list and removes finished from view", async () => {
      await app.filterBy("All");
      await app.clearCompleted();
      await expect(app.todoList).toHaveCount(1);
      await expect(page.getByText("Cheese")).toBeVisible();
      await expect(page.locator(".todo-count")).toContainText("1 item left");
    });
  });
});
