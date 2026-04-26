/**
 * Lab 8 — three UI checks with WebdriverIO (same page as TestCafe for fair comparison).
 */
const { expect, browser, $ } = require("@wdio/globals");

const PAGE = "https://demo.playwright.dev/todomvc/";

describe("TodoMVC — WebdriverIO (lab8)", () => {
  beforeEach(async () => {
    await browser.url(PAGE);
    await $("input.new-todo").waitForDisplayed({ timeout: 15_000 });
  });

  it("shows main title", async () => {
    await expect($("h1")).toHaveText("todos");
  });

  it("lets user add a task and see it in the list", async () => {
    await $("input.new-todo").setValue("WebdriverIO task");
    await browser.keys("Enter");
    const row = await $(`//*[contains(@class,'todo-list')]//*[contains(.,'WebdriverIO task')]`);
    await expect(row).toBeDisplayed();
  });

  it("lets user complete a task and filter Active list", async () => {
    await $("input.new-todo").setValue("Still open");
    await browser.keys("Enter");
    await $("input.new-todo").setValue("Already done");
    await browser.keys("Enter");
    const doneRow = await $(`//*[contains(@class,'todo-list')]//*[contains(.,'Already done')]`);
    await doneRow.$("input[type=checkbox]").click();
    await $('a[href="#/active"]').click();
    await expect(await $(`//*[contains(.,'Still open')]`)).toBeDisplayed();
    await expect(await $(`//*[contains(@class,'todo-list')]//*[contains(.,'Already done')]`)).not.toBeDisplayed();
  });
});
