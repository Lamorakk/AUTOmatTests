/**
 * Page object — same target as lab 5: https://demo.playwright.dev/todomvc/
 * (Duplicated here so lab 6 is a self-contained deliverable for the report.)
 */
export class TodoDemoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder("What needs to be done?");
    this.todoList = page.locator(".todo-list li");
    this.footer = page.locator(".footer");
  }

  /** @returns {Promise<void>} */
  async goto() {
    try {
      await this.page.goto("/todomvc/");
      await this.newTodoInput.waitFor({ state: "visible" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.goto failed: ${message}`);
    }
  }

  /** @param {string} text @returns {Promise<void>} */
  async addTodo(text) {
    try {
      await this.newTodoInput.fill(text);
      await this.newTodoInput.press("Enter");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.addTodo failed: ${message}`);
    }
  }

  /** @param {string} label @returns {import('@playwright/test').Locator} */
  todoItemByText(label) {
    return this.page.locator(".todo-list li").filter({ hasText: label });
  }

  /** @param {string} label @returns {Promise<void>} */
  async toggleTodo(label) {
    try {
      await this.todoItemByText(label).getByRole("checkbox").click();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.toggleTodo failed: ${message}`);
    }
  }

  /** @param {"All"|"Active"|"Completed"} name @returns {Promise<void>} */
  async filterBy(name) {
    try {
      await this.page.getByRole("link", { name, exact: true }).click();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.filterBy failed: ${message}`);
    }
  }

  /** @returns {Promise<void>} */
  async clearCompleted() {
    try {
      await this.page.getByRole("button", { name: "Clear completed" }).click();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.clearCompleted failed: ${message}`);
    }
  }

  /** @param {string} label @returns {Promise<void>} */
  async destroyTodo(label) {
    try {
      const item = this.todoItemByText(label);
      await item.hover();
      await item.locator(".destroy").click();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`TodoDemoPage.destroyTodo failed: ${message}`);
    }
  }
}
