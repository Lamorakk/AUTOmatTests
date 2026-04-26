/**
 * User scenario: review week — mark several tasks done, use “Completed” summary,
 * then undo one item and verify counts.
 */
import { expect, test } from "@playwright/test";
import { TodoDemoPage } from "../../pages/TodoDemoPage.js";

test.describe("Scenario: weekly review", () => {
  test("user completes most tasks, reviews done work, then reopens one task", async ({ page }) => {
    const app = new TodoDemoPage(page);

    await test.step("User opens the planner", async () => {
      await app.goto();
    });

    await test.step("User enters tasks for the week", async () => {
      await app.addTodo("Report");
      await app.addTodo("Email team");
      await app.addTodo("Backup");
    });

    await test.step("User marks routine items finished", async () => {
      await app.toggleTodo("Report");
      await app.toggleTodo("Backup");
    });

    await test.step("User opens completed view to verify what is done", async () => {
      await app.filterBy("Completed");
      await expect(page.getByText("Report")).toBeVisible();
      await expect(page.getByText("Backup")).toBeVisible();
      await expect(page.getByText("Email team")).toBeHidden();
    });

    await test.step("User reopens one task (not actually finished)", async () => {
      await app.toggleTodo("Report");
      await app.filterBy("Active");
      await expect(page.getByText("Report")).toBeVisible();
      await expect(page.getByText("Email team")).toBeVisible();
      await expect(page.locator(".todo-count")).toContainText("2 items left");
    });
  });
});
