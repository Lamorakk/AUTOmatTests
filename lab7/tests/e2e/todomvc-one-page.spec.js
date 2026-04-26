/**
 * E2E — single page only: https://demo.playwright.dev/todomvc/
 * Minimum five scenarios (lab manual). Page object in /pages (DRY).
 */
import { test, expect } from "@playwright/test";
import { TodoDemoPage } from "../../pages/TodoDemoPage.js";
import { EXPECT_TIMEOUT_MS } from "../../utils/timeouts.js";

test.describe("TodoMVC — one page (lab7 unified E2E)", () => {
  test.beforeEach(async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
  });

  test("heading and new-todo field are visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("todos", { timeout: EXPECT_TIMEOUT_MS });
    const todo = new TodoDemoPage(page);
    await expect(todo.newTodoInput).toBeVisible();
  });

  test("adding a todo shows text in the list", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Study automation");
    await expect(page.getByText("Study automation")).toBeVisible();
  });

  test("footer shows counter for multiple items", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("One");
    await todo.addTodo("Two");
    await expect(page.locator(".todo-count")).toContainText("2 items left");
  });

  test("Active filter hides completed items", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Open task");
    await todo.addTodo("Done task");
    await todo.toggleTodo("Done task");
    await todo.filterBy("Active");
    await expect(page.getByText("Open task")).toBeVisible();
    await expect(page.getByText("Done task")).toBeHidden();
  });

  test("Completed filter shows only finished todos", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Keep");
    await todo.addTodo("Finish");
    await todo.toggleTodo("Finish");
    await todo.filterBy("Completed");
    await expect(page.getByText("Finish")).toBeVisible();
    await expect(page.getByText("Keep")).toBeHidden();
  });

  test("toggle completed adds visual completed state", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Checkbox");
    await todo.toggleTodo("Checkbox");
    await expect(todo.todoItemByText("Checkbox")).toHaveClass(/completed/);
  });
});
