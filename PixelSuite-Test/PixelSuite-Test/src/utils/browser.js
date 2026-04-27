const fs = require('fs-extra');
const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

async function waitForDownload(directory, timeout = 30000) {
  const before = new Set(fs.readdirSync(directory));
  const start = Date.now();
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const after = fs.readdirSync(directory);
      const newFiles = after.filter(f => !before.has(f) && !f.endsWith('.crdownload') && !f.endsWith('.tmp'));
      if (newFiles.length > 0) {
        clearInterval(interval);
        resolve(path.join(directory, newFiles[0]));
      }
      if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(null);
      }
    }, 500);
  });
}

async function uploadFile(page, filePath) {
  const selectors = [
    'input[type="file"]',
    'input[accept*="image"]',
    'input[accept*="pdf"]',
    '#file-input',
    '.file-input',
    '[name="file"]',
  ];

  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        await element.uploadFile(filePath);
        return true;
      }
    } catch {
      // Try next selector.
    }
  }

  return false;
}

async function clickAction(page) {
  const buttonSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button.btn-primary',
    'button.convert',
    'button.resize',
    'button.compress',
    'button.crop',
    'button.rotate',
    'button.flip',
    'button.upload',
    'button[class*="btn"]',
    'button',
  ];

  for (const selector of buttonSelectors) {
    try {
      const buttons = await page.$$(selector);
      for (const button of buttons) {
        const text = (await page.evaluate(element => element.innerText, button) || '').toLowerCase();
        if (
          text.includes('resize') || text.includes('compress') || text.includes('convert') ||
          text.includes('crop') || text.includes('rotate') || text.includes('flip') ||
          text.includes('submit') || text.includes('start') || text.includes('process') ||
          text.includes('upload') || text.includes('generate') || text.includes('extract')
        ) {
          await button.click();
          return true;
        }
      }
    } catch {
      // Try next selector.
    }
  }

  return false;
}

module.exports = {
  sleep,
  fileSize,
  waitForDownload,
  uploadFile,
  clickAction,
};
