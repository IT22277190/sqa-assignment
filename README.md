# Pixels Suite Playwright Assignment

This repository contains Playwright end-to-end automation in TypeScript for a university SQA assignment.

## Scope

- Feature-level validation for the Resize workflow
- Whole-system navigation smoke coverage across key tools
- Strict exclusion of any Transliteration-related interaction

## Test Suites

- `resize.spec.ts`
  - Verify resize tool loads
  - Upload and resize via numeric inputs
  - Verify Keep Aspect Ratio behavior
- `whole_system.spec.ts`
  - Functional crop flow (`To WebP`)
  - System-wide smoke navigation across selected tool cards

## Prerequisites

- Node.js
- npm

## Setup

From the project root:

```bash
npm install
npx playwright install chromium
```

## Run Tests

Run Resize suite:

```bash
npx playwright test resize.spec.ts --project=chromium
```

Run Whole-System suite:

```bash
npx playwright test whole_system.spec.ts --project=chromium
```

Run all tests:

```bash
npx playwright test --project=chromium
```

## View HTML Report

```bash
npx playwright show-report
```

## Screenshots

Screenshots are saved under `screenshots/`, including:

- `01_app_load.png`
- `02_resize_inputs.png`
- `03_aspect_ratio.png`
- `04_crop_feature.png`
- `05_system_navigation.png`

## Important Notes

- `test-image.jpg` must exist in the workspace root for upload-based tests.
- Navigation in this app is SPA-driven; tests intentionally use tool-card interactions for reliable state transitions.
- Transliteration is explicitly excluded from test coverage.

## Key Files

- `package.json`
- `playwright.config.ts`
- `tsconfig.json`
- `resize.spec.ts`
- `whole_system.spec.ts`
- `TEST_UPDATE_SEQUENCE.md`
