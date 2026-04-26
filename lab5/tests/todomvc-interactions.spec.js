import { test, expect } from "@playwright/test";
import { TodoDemoPage } from "./pages/TodoDemoPage.js";

test.describe("TodoMVC demo — interactions (toggle, destroy, clear)", () => {
  test.beforeEach(async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.goto();
  });

  test("marking todo completed updates list styling", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Buy milk");
    await todo.toggleTodo("Buy milk");
    await expect(todo.todoItemByText("Buy milk")).toHaveClass(/completed/);
  });

  test("destroy button removes a todo", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Remove me");
    await todo.destroyTodo("Remove me");
    await expect(todo.todoItemByText("Remove me")).toHaveCount(0);
  });

  test("clear completed removes finished items only", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Open");
    await todo.addTodo("Done");
    await todo.toggleTodo("Done");
    await todo.clearCompleted();
    await expect(todo.todoList).toHaveCount(1);
    await expect(page.getByText("Open")).toBeVisible();
  });

  test("toggle twice restores active state", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("Flip");
    await todo.toggleTodo("Flip");
    await expect(todo.todoItemByText("Flip")).toHaveClass(/completed/);
    await todo.toggleTodo("Flip");
    await expect(todo.todoItemByText("Flip")).not.toHaveClass(/completed/);
  });

  test("multiple todos all visible on All filter", async ({ page }) => {
    const todo = new TodoDemoPage(page);
    await todo.addTodo("One");
    await todo.addTodo("Two");
    await todo.addTodo("Three");
    await todo.filterBy("All");
    await expect(todo.todoList).toHaveCount(3);
  });
});
