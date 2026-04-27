const fs = require('fs-extra');
const path = require('path');
const { DOWNLOADS_DIR, SCREENSHOTS_DIR, UPLOADS_DIR } = require('../config/paths');

function createArtifactContext() {
  const runLabel = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
  const runScreenshotsDir = path.join(SCREENSHOTS_DIR, `run-${runLabel}`);

  return { runLabel, runScreenshotsDir };
}

async function ensureRunDirectories(runScreenshotsDir) {
  await fs.ensureDir(UPLOADS_DIR);
  await fs.ensureDir(DOWNLOADS_DIR);
  await fs.ensureDir(runScreenshotsDir);
}

async function screenshot(page, runScreenshotsDir, name) {
  const filePath = path.join(runScreenshotsDir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

module.exports = {
  createArtifactContext,
  ensureRunDirectories,
  screenshot,
};
