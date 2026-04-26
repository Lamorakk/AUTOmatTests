# Lab 8 — Variant: **TestCafe** vs **WebdriverIO** (UI automation on JavaScript)

This lab replaces the earlier “general tools overview”. Here we **compare only two tools**, run **three UI tests in each** against the **same page** (fair comparison), and record **experience + conclusion**.

**Target page (same for both tools):** [Playwright TodoMVC demo](https://demo.playwright.dev/todomvc/) — one screen, no login.

---

## 1. Comparison table (as required)

| Інструмент / **Instrument** | Сильна сторона / **Strong side** | Слабка сторона / **Weak side** | Типові задачі / **Typical tasks** |
|------------------------------|-----------------------------------|----------------------------------|-----------------------------------|
| **TestCafe** | Не потрібен WebDriver: свій проксі-клієнт, один `npm i`, зручний fluent API (`fixture` / `test` / `Selector`). | Важчий рантайм; інколи капризний **headless** на Windows/CI; менший “дефолтний” стек ніж у Playwright для нових проєктів. | Регресійні **E2E** веб-застосунків, smoke по продакшену, демо-автотести без окремого драйвера. |
| **WebdriverIO** | Стандартний **WebDriver** / **BiDi**, інтеграція з Mocha/Jasmine, гнучка конфігурація, зрілий стек для **Grid** і корпоративних пайплайнів. | Більше “складок” у конфігу; швидкість E2E часто нижча за нативні CDP-раннери; доводиться стежити за версією Chrome ↔ драйвер (у v9 багато що автоматизовано, але не завжди безболісно). | **Крос-браузерні E2E**, мобільні сценарії через **Appium**, інтеграція з **Selenium Grid**, гібридні команди (WD + CDP). |

---

## 2. Short description of each tool

### TestCafe

- **For what:** End-to-end **browser tests** written in JS/TS; runs tests by injecting automation into the page via a **proxy**, without Selenium WebDriver for classic mode.
- **Pros:** Quick start for teams that do not want to manage drivers; readable tests; built-in assertions and parallel runs.
- **Cons:** Different architecture from WebDriver-first tools; occasional flakiness on **slow networks** unless waits/timeouts are tuned (see `.testcaferc.json` and `beforeEach` wait in our tests).

### WebdriverIO

- **For what:** **WebDriver BiDi**-centric browser automation with familiar `browser.$` / `expect` patterns; often used with **Mocha**.
- **Pros:** Industry-standard protocol; excellent when you already have Grid/Cloud browsers; strong docs and ecosystem.
- **Cons:** More boilerplate than TestCafe for tiny demos; mental overhead of runner + config + capabilities.

---

## 3. Tests in this folder

| Runner | Path | What |
|--------|------|------|
| **TestCafe** | `testcafe/tests/todomvc-ui.test.cjs` | 3 tests: title visible, add task, mark completed |
| **WebdriverIO** | `webdriverio/tests/specs/todomvc-ui.spec.cjs` | 3 tests: title, add task, complete + **Active** filter |

### Commands

```bash
cd lab8
npm install
```

**WebdriverIO** (usually the most stable in headless CI):

```bash
npm run test:wdio
```

**TestCafe**:

```bash
npm run test:testcafe
```

If **TestCafe** fails to attach to `chrome:headless` on your PC, try headed Chrome or Edge headless:

```bash
npm run test:testcafe:headed
# or: npm run test:testcafe:edge
```

From the **repository root**, use `npm run test:testcafe:headed` or `npm run test:lab8:testcafe:headed` (both run the lab8 headed script).

Run **both** (what `npm test` does here):

```bash
npm test
```

From **repository root**:

```bash
npm run test:lab8
npm run test:lab8:testcafe
npm run test:lab8:testcafe:headed
npm run test:lab8:wdio
```

---

## 4. Brief experience note (for the report)

- **TestCafe:** tests read like **linear user stories**; little setup. On some machines **`chrome:headless`** needs troubleshooting (browser connection / network); we use **CommonJS** (`.cjs`) tests and **`--hostname 127.0.0.1`**, plus **longer page timeouts** (`.testcaferc.json`) and an explicit **wait for `h1`** in `beforeEach`.
- **WebdriverIO:** slightly more **config**, but the same three scenarios were **stable and fast** with **Chrome headless** using the stock WDIO v9 runner (no extra service in this minimal demo).

---

## 5. Which tool is more practical here?

For a **small student / training repo** focused on **quick UI checks** without Selenium infrastructure, **TestCafe** is attractive because of **zero WebDriver**. For **long-term, cross-browser, enterprise-style** UI automation, **WebdriverIO** is often the safer default because it follows **WebDriver** everywhere (including cloud grids).

**Our existing course repo** already uses **Playwright** for most E2E (labs 5–7); neither TestCafe nor WebdriverIO replaces Playwright there — this lab only **compares two requested tools** on equal UI.

---

## 6. GitHub

Push this repository to GitHub (or your university Git) and paste the **repository URL** into the Word/PDF report.

---

## 7. Ukrainian summary (для звіту)

У **лабораторній №8 (варіант)** виконано **порівняння двох інструментів** — **TestCafe** та **WebdriverIO**: заповнено **таблицю** (сильні / слабкі сторони, типові задачі), реалізовано **по три UI-тести** на кожному для **однієї й тієї ж сторінки** TodoMVC. Додано **короткий аналіз досвіду** роботи з обома раннерами та **рекомендації** щодо застосування. Посилання на **GitHub** додається до звіту після публікації коду.
