import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const URLS = {
  jpg: '/convert-to-jpg',
  png: '/convert-to-png',
  webp: '/convert-to-webp',
} as const;

const TEST_IMAGE = path.resolve('test-image.jpg');
const SCREENSHOT_DIR = path.resolve('screenshots/convert');
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

test.describe('Pixels Suite - Convert Image Coverage', () => {
  test('TC01 - Converter pages load successfully', async ({ page }) => {
    for (const [format, route] of Object.entries(URLS)) {
      await page.goto(route);
      await expectUploaderReady(page);
      await page.screenshot({ path: screenshotPath(`01_convert_${format}_load.png`) });
    }
  });

  test('TC02 - Upload image on all converter pages', async ({ page }) => {
    for (const [format, route] of Object.entries(URLS)) {
      await page.goto(route);
      await expectUploaderReady(page);
      await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE);

      await expect(page.getByRole('button', { name: /download/i })).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });
      await page.screenshot({ path: screenshotPath(`02_convert_${format}_upload.png`) });
    }
  });

  test('TC03 - Unsupported upload behavior on JPG converter', async ({ page }) => {
    const pdfPath = createDummyPdf();

    await page.goto(URLS.jpg);
    await expectUploaderReady(page);
    await page.locator('input[type="file"]').setInputFiles(pdfPath);

    await expect(page).toHaveURL(/convert-to-jpg/i);
    await expectUploaderReady(page);
    await page.screenshot({ path: screenshotPath('03_convert_invalid_file.png') });
  });

  test('TC04 - Converter pages are responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    for (const [format, route] of Object.entries(URLS)) {
      await page.goto(route);
      await expectUploaderReady(page);
      await page.screenshot({ path: screenshotPath(`04_convert_${format}_mobile.png`) });
    }
  });

  test('TC05 - Navigation links exist on converter pages', async ({ page }) => {
    for (const [format, route] of Object.entries(URLS)) {
      await page.goto(route);
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
      await expect(links.first()).toBeVisible();
      await page.screenshot({ path: screenshotPath(`05_convert_${format}_navigation.png`) });
    }
  });
});
