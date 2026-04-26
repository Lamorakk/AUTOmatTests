import { test, expect } from "@playwright/test";
import { TodoDemoPage } from "./pages/TodoDemoPage.js";

test.describe("TodoMVC demo — smoke (page opens, core UI)", () => {
  test("loads main heading and new-todo field", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("todos");
    await expect(todo.newTodoInput).toBeVisible();
    await expect(todo.newTodoInput).toBeEditable();
  });

  test("footer is hidden until first item is added", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await expect(todo.footer).toBeHidden();
    await todo.addTodo("First task");
    await expect(todo.footer).toBeVisible();
  });

  test("counter shows singular item left", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await todo.addTodo("Single");
    await expect(page.locator(".todo-count")).toContainText("1 item left");
  });

  test("counter shows plural items left", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await todo.addTodo("A");
    await todo.addTodo("B");
    await expect(page.locator(".todo-count")).toContainText("2 items left");
  });

  test("todo text appears inside main section after add", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await todo.addTodo("In list");
    await expect(page.locator("section.main")).toContainText("In list");
  });
});
