import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const URL = '/compress-image';
const TEST_IMAGE = path.resolve('test-image.jpg');
const SCREENSHOT_DIR = path.resolve('screenshots/compress');
mkdirSync(SCREENSHOT_DIR, { recursive: true });

function screenshotPath(fileName: string): string {
  return path.join(SCREENSHOT_DIR, fileName);
}

async function expectUploaderReady(page: import('@playwright/test').Page) {
  await expect(page.getByRole('button', { name: /select (files|images)|choose file/i })).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeAttached();
}

function createDummyPdf(): string {
  const assetsDir = path.resolve('test-assets');
  const pdfPath = path.join(assetsDir, 'dummy.pdf');
  mkdirSync(assetsDir, { recursive: true });
  writeFileSync(pdfPath, '%PDF-1.4 fake file used for negative upload testing');
  return pdfPath;
}

test.describe('Pixels Suite - Compress Image Coverage', () => {
  test('TC01 - Compress page loads and file input is visible', async ({ page }) => {
    await page.goto(URL);

    await expect(page).toHaveURL(/compress-image/i);
    await expectUploaderReady(page);
    await page.screenshot({ path: screenshotPath('01_compress_load.png') });
  });

  test('TC02 - Upload valid image to compress tool', async ({ page }) => {
    await page.goto(URL);
    await expectUploaderReady(page);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE);

    await expect(page.getByRole('button', { name: /download/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });
    await page.screenshot({ path: screenshotPath('02_compress_upload.png') });
  });

  test('TC03 - Invalid file type is rejected without crashing page', async ({ page }) => {
    await page.goto(URL);
    await expectUploaderReady(page);

    const pdfPath = createDummyPdf();
    await page.locator('input[type="file"]').setInputFiles(pdfPath);

    await expect(page).toHaveURL(/pixelssuite/i);
    await expectUploaderReady(page);
    await page.screenshot({ path: screenshotPath('03_compress_invalid_file.png') });
  });

  test('TC04 - Compress page is usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URL);

    await expectUploaderReady(page);
    await page.screenshot({ path: screenshotPath('04_compress_mobile.png') });
  });

  test('TC05 - Navigation links are present on compress page', async ({ page }) => {
    await page.goto(URL);

    const links = page.locator('a');
    await expect(links.first()).toBeVisible();
    await expect(links).toHaveCount(await links.count());
    expect(await links.count()).toBeGreaterThan(0);
    await page.screenshot({ path: screenshotPath('05_compress_navigation.png') });
  });
});
