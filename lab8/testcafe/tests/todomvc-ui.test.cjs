/**
 * Lab 8 — three UI checks with TestCafe against one page (Playwright TodoMVC demo).
 * CommonJS (`.cjs`) so TestCafe starts reliably on Windows; avoid `"type":"module"` in lab8.
 */
const { fixture, Selector, test } = require("testcafe");

const PAGE = "https://demo.playwright.dev/todomvc/";

fixture`TodoMVC — TestCafe (lab8)`
  .page`${PAGE}`
  .beforeEach(async (t) => {
    await t.expect(Selector("h1").visible).ok({ timeout: 60_000 });
  });

test("Page shows main title", async (t) => {
  await t.expect(Selector("h1").innerText).eql("todos");
});

test("User can add a task and see it in the list", async (t) => {
  const input = Selector("input.new-todo");
  await t.typeText(input, "TestCafe task").pressKey("enter");
  await t.expect(Selector(".todo-list").withText("TestCafe task").visible).ok();
});

test("User can mark a task completed and see completed styling", async (t) => {
  const input = Selector("input.new-todo");
  await t.typeText(input, "Done item").pressKey("enter");
  const item = Selector(".todo-list li").withText("Done item");
  await t.click(item.find("input[type=checkbox]"));
  await t.expect(item.hasClass("completed")).ok();
});
