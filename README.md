# Pixels Suite Playwright Assignment

This project contains a simple Playwright end-to-end test suite in TypeScript for the university SQA assignment.

## What is included

- `resize.spec.ts` with three tests:
  - core app load check
  - resize via input fields
  - resize via drag handle
- `playwright.config.ts` configured to look for tests in the project root and run Chromium by default
- `tsconfig.json` for basic TypeScript support
- `screenshots/` for test output images

## Prerequisites

- Node.js installed
- npm installed

## Install and run

From the project root, run:

```bash
npm install
npx playwright install chromium
npx playwright test resize.spec.ts --project=chromium
```

## Notes

- The selectors in `resize.spec.ts` are placeholders and should be updated after inspecting the live DOM of https://www.pixelssuite.com/.
- Do not test or interact with any Transliteration-related feature.
- Screenshot files will be written into the `screenshots/` folder.

## Project files

- `package.json`
- `playwright.config.ts`
- `resize.spec.ts`
- `tsconfig.json`
