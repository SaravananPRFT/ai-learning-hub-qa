# ai-learning-hub-qa

Playwright-based QA automation framework for [AI Learning Hub](https://github.com/SaravananPRFT/ai-learning-hub).

---

## Framework Architecture

```
ai-learning-hub-qa/
├── tests/
│   ├── e2e/             # UI end-to-end tests (browser)
│   ├── api/             # Backend API tests (no browser)
│   └── accessibility/   # WCAG 2.2 AA axe-core scans
├── pages/               # Page Object Model — all selectors live here
├── fixtures/            # Playwright test fixtures (custom test object)
├── helpers/
│   ├── api-client.ts    # Typed API wrapper using APIRequestContext
│   ├── test-data.ts     # Seed data constants and boundary values
│   └── assertions.ts    # Reusable assertion helpers
├── config/
│   └── environments.ts  # Centralised env config (reads .env)
├── scripts/             # Shell scripts for common run modes
├── .github/workflows/   # GitHub Actions CI workflow
├── playwright.config.ts # Main Playwright config
└── .env.example         # Environment variable template
```

### Design Principles

- **Page Object Model**: All CSS selectors and locators are in `/pages/`. Spec files never contain raw selectors.
- **Typed API Client**: All backend calls go through `helpers/api-client.ts`. No raw fetch/axios in specs.
- **Custom Fixtures**: The `test` export from `fixtures/app.fixture.ts` extends Playwright's base with `api` and `ollamaAvailable`.
- **Environment-driven**: Runtime config (URLs, flags) lives in `.env`. Never hardcoded in specs.
- **Ollama-aware**: Tests that require the local LLM are guarded by `skipIfOllamaDown()` and the `OLLAMA_AVAILABLE` flag.

---

## Prerequisites

- Node.js 22+
- The AI Learning Hub application running locally:
  - Backend: `http://localhost:8000` (FastAPI)
  - Frontend: `http://localhost:3000` (Next.js)

### Starting the Application

```bash
# Terminal 1 — Backend
cd "../AI Learning Hub/backend"
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd "../AI Learning Hub/frontend"
npm run dev
```

---

## Setup Guide

```bash
# 1. Clone the QA repo
git clone https://github.com/SaravananPRFT/ai-learning-hub-qa.git
cd ai-learning-hub-qa

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (Chromium only for local dev)
npm run install:browsers

# 4. Configure environment
cp .env.example .env
# Edit .env if your ports differ from defaults
```

---

## Execution Guide

### Run all smoke tests (fastest, < 3 min)
```bash
npm run test:smoke
```

### Run all API tests
```bash
npm run test:api
```

### Run all E2E tests
```bash
npm run test:e2e
```

### Run accessibility tests
```bash
npm run test:a11y
```

### Run full suite
```bash
npm test
```

### Interactive UI mode (visual debugger)
```bash
npm run test:ui
```

### Headed mode (watch browser)
```bash
npm run test:headed
```

### View Playwright HTML report
```bash
npm run report:pw
```

### Generate and open Allure report
```bash
npm run report:allure
```

---

## Test Structure

### Test Tags

Tests are tagged with `@smoke`, `@regression`, and priority markers (`@P0`, `@P1`, `@P2`).

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run P0 + P1 tests
npx playwright test --grep "@P0|@P1"

# Run regression suite
npx playwright test --grep @regression
```

### Ollama-dependent Tests

Tests that require the local Ollama LLM (concept generation, mentor AI responses, interview AI evaluation) are controlled by the `OLLAMA_AVAILABLE` flag:

```bash
# .env
OLLAMA_AVAILABLE=true   # Run Ollama-dependent tests
OLLAMA_AVAILABLE=false  # Skip them (default)
```

When `OLLAMA_AVAILABLE=false`, these tests are automatically skipped with a clear message.

---

## Folder Structure Explanation

| Path | Purpose |
|------|---------|
| `tests/e2e/` | Full browser tests. Each file maps to one application page. |
| `tests/api/` | HTTP-level tests against FastAPI. No browser spawned. |
| `tests/accessibility/` | axe-core WCAG 2.2 AA scans. Runs in browser. |
| `pages/base.page.ts` | Base class: sidebar nav, game mode helpers, wait utilities. |
| `pages/*.page.ts` | One class per route. Locators + interaction methods only. |
| `fixtures/app.fixture.ts` | Extends `test` with `api` (ApiClient) and `ollamaAvailable` fixtures. |
| `helpers/api-client.ts` | All backend API calls centralised and typed. |
| `helpers/test-data.ts` | Constants: known slugs, boundary values, persona IDs. |
| `helpers/assertions.ts` | `expectOkJson`, `assertConceptSummaryShape`, schema validators. |
| `config/environments.ts` | Reads `.env` and exports `ENV` object used everywhere. |

---

## Adding New Tests

### Adding an E2E test

1. Add/update the Page Object in `pages/<feature>.page.ts`
2. Create `tests/e2e/<feature>.spec.ts`
3. Import the page object, not raw Playwright locators
4. Tag with `@smoke` if it should run on every commit

### Adding an API test

1. Add the API call to `helpers/api-client.ts`
2. Create `tests/api/<feature>.api.spec.ts`
3. Use `expectOkJson()` and `assertXxxShape()` from `helpers/assertions.ts`
4. Use the `api` fixture from `fixtures/app.fixture.ts`

---

## Known Assumptions & Gaps

| # | Item | Detail |
|---|------|--------|
| 1 | No `data-testid` attributes | The app has no test IDs. E2E selectors rely on ARIA roles and text. **Recommend adding test IDs to key elements in the next dev sprint.** |
| 2 | Shared `guest` user | All progress tests share the `guest` user_id. Tests are not isolated — running `complete_concept` affects subsequent `view` tests. |
| 3 | SQLite WAL mode | SQLite in WAL mode handles concurrent reads but may conflict under heavy parallel writes. `workers: 2` in config prevents this. |
| 4 | view_count side-effect | `GET /concepts/{slug}` increments `view_count`. API tests that call this endpoint will increment it on every run. |
| 5 | Assessment scoring stub | Current scoring logic (`len(answer) > 20 = correct`) is a stub. Tests reflect the current behaviour, not intended behaviour. |
| 6 | Roadmap page selectors | The `/roadmap` page was not read in full — roadmap.page.ts uses flexible selectors. Verify on first run and refine. |
| 7 | Interview page selectors | Same as above — interview.page.ts uses flexible selectors pending UI verification. |

---

## Onboarding Guide for New QA Engineers

### Day 1 — Run the suite

```bash
git clone https://github.com/SaravananPRFT/ai-learning-hub-qa.git
cd ai-learning-hub-qa
npm install && npm run install:browsers
cp .env.example .env
# Make sure the app is running on localhost:3000 and localhost:8000
npm run test:smoke
npm run report:pw
```

### Day 2 — Understand the architecture

1. Read `playwright.config.ts` — understand the three projects (e2e-chromium, api, accessibility)
2. Read `fixtures/app.fixture.ts` — understand how `api` and `ollamaAvailable` are injected
3. Read `helpers/api-client.ts` — understand how API calls are made
4. Read one spec file end-to-end (`tests/api/concepts.api.spec.ts` is a good start)
5. Read one E2E spec (`tests/e2e/explore.spec.ts`) and its page object (`pages/explore.page.ts`)

### Day 3 — Write your first test

Pick a failing or missing test from the P1 list, add the page object selectors, and write the spec. Follow the existing pattern exactly.

### Debugging a failing test

```bash
# Headed mode — watch the browser
npx playwright test tests/e2e/explore.spec.ts --headed

# Debug mode — step through
npx playwright test tests/e2e/explore.spec.ts --debug

# UI mode — visual timeline
npx playwright test --ui
```

Failed tests automatically save:
- Screenshot → `test-results/artifacts/`
- Trace → `test-results/artifacts/` (open with `npx playwright show-trace <file>`)
- Video → `test-results/artifacts/`
