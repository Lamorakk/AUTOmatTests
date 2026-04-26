import { test, expect } from "@playwright/test";
import { TodoDemoPage } from "./pages/TodoDemoPage.js";

test.describe("TodoMVC demo — filters (All / Active / Completed)", () => {
  test.beforeEach(async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
    await todo.addTodo("Active only");
    await todo.addTodo("Will complete");
    await todo.toggleTodo("Will complete");
  });

  test("Active hides completed todos", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.filterBy("Active");
    await expect(todo.todoList).toHaveCount(1);
    await expect(page.getByText("Active only")).toBeVisible();
    await expect(page.getByText("Will complete")).toBeHidden();
  });

  test("Completed shows only finished todos", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.filterBy("Completed");
    await expect(todo.todoList).toHaveCount(1);
    await expect(page.getByText("Will complete")).toBeVisible();
    await expect(page.getByText("Active only")).toBeHidden();
  });

  test("All shows every todo", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.filterBy("Active");
    await todo.filterBy("All");
    await expect(todo.todoList).toHaveCount(2);
  });

  test("Active filter highlights Active link", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.filterBy("Active");
    const activeLink = page.getByRole("link", { name: "Active", exact: true });
    await expect(activeLink).toHaveClass(/selected/);
  });

  test("Completed filter highlights Completed link", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.filterBy("Completed");
    const link = page.getByRole("link", { name: "Completed", exact: true });
    await expect(link).toHaveClass(/selected/);
  });
});
