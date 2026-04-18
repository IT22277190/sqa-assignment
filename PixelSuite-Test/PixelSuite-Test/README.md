# PixelSuite Test Suite

This project is a modular Puppeteer automation suite for the PixelSuite web app. The entrypoint is [test.js](test.js), and the shared logic has been split into `src/` so the project reads like a small internal service layout instead of one long script.

## Structure

- [test.js](test.js) - test runner and execution report
- [src/config/paths.js](src/config/paths.js) - shared folder paths
- [src/utils/browser.js](src/utils/browser.js) - upload, click, sleep, and file helpers
- [src/services/artifacts.js](src/services/artifacts.js) - run-specific screenshot output
- [src/services/sample-files.js](src/services/sample-files.js) - generated fixtures
- [src/services/result-tracker.js](src/services/result-tracker.js) - pass/fail aggregation

## Runtime Folders

- `uploads/` stores generated input fixtures.
- `downloads/` stores browser download output.
- `screenshots/` stores run-specific screenshot evidence.
- `.puppeteer-user-data/` stores the browser profile used by Puppeteer.

## What It Covers

- Homepage load check
- Resize, bulk resize, enlarge, compress, rotate, and flip flows
- JPG, PNG, WebP, and GIF conversions
- PDF editor flow
- Crop tools
- Meme generator and color picker checks
- OCR flow for image-to-text extraction

## Requirements

- Node.js 18 or newer
- npm
- A Chromium-compatible browser

The suite uses Puppeteer. In this workspace, Microsoft Edge was used successfully when Chrome was not available locally.

## Install

```bash
npm install
```

If Puppeteer has not downloaded a browser yet, install Chrome with:

```bash
npx puppeteer browsers install chrome
```

## Run

```bash
npm test
```

If you want to run against a locally installed Edge browser, set the executable path first:

```powershell
$env:PUPPETEER_EXECUTABLE_PATH='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm test
```

## Output

- Screenshots are saved under [screenshots](screenshots) in run-specific subfolders
- Downloaded files are saved under [downloads](downloads)
- Sample upload fixtures are created in [uploads](uploads) if they do not already exist

## Notes

- The script targets `https://www.pixelssuite.com`.
- The OCR check may fail if the site requires additional server-side processing or if the page behavior changes.
- The `screenshots/`, `downloads/`, `uploads/`, and `.puppeteer-user-data/` directories are generated at runtime.