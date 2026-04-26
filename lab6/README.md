# Lab 6 — User scenario tests (Playwright)

## Difference from lab 5

| Lab 5 | Lab 6 (this folder) |
|--------|---------------------|
| Many **small** checks (one assertion focus) | Few **end-to-end journeys**: open app → several user steps → final outcome |
| “Does this label exist?” | “Does the **user goal** succeed?” (e.g. shop list + filters + clear) |

Same **resource** as lab 5: **[Playwright TodoMVC demo](https://demo.playwright.dev/todomvc/)** — one page, no login. Scenarios are written as **story flows** using `test.step()` so each stage reads like user actions.

## Scenarios (automated)

All live under `tests/scenarios/`:

1. **`shopping-day.spec.js`** — add items, complete some, use **Active / Completed / All** filters, clear completed, assert final counter.  
2. **`wrong-item.spec.js`** — add a mistaken task, **delete** it, assert empty list.  
3. **`weekly-review.spec.js`** — several tasks, complete subset, review **Completed**, reopen one task.  
4. **`inbox-zero.spec.js`** — complete all, **clear completed**, assert inbox empty.

## Commands

```bash
cd lab6
npm install
npx playwright install chromium
npm test
```

From repository root:

```bash
npm run test:lab6
```

Interactive UI: `npm run test:ui` inside `lab6`.

## GitHub

Push the repository and put the **repository URL** in your report.

## Note on CI

Continuous integration for the whole repo lives in **`.github/workflows/ci.yml`** (not “lab 6 content” by itself). Lab **6** in the curriculum sense is **this Playwright scenario package**.
