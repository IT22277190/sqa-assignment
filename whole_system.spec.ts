import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.pixelssuite.com/';

async function goToCropToWebp(page: Page) {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'To WebP', exact: true }).first().click();
}

async function assertSectionLoaded(page: Page, expectedPathFragment: string) {
  // Wait for the URL to contain the expected path.
  await expect(page).toHaveURL(new RegExp(expectedPathFragment, 'i'));

  // Define locators for common elements found on these pages.
  const uploadButton = page.getByRole('button', { name: /select (files|images)|choose file/i });
  const heading = page.getByRole('heading').first();

  // Wait for EITHER the upload button OR the primary heading to render.
  await expect(uploadButton.or(heading)).toBeVisible({ timeout: 10000 });
}

test.describe('Pixels Suite - Whole System Coverage (Transliteration Excluded)', () => {
  test('Functional Test: Crop Tool (Crop -> To WebP)', async ({ page }) => {
    await goToCropToWebp(page);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-image.jpg');

    const cropInputs = page.getByRole('spinbutton');
    const xInput = cropInputs.nth(0);
    const yInput = cropInputs.nth(1);
    const widthInput = cropInputs.nth(2);
    const heightInput = cropInputs.nth(3);

    await xInput.fill('10');
    await yInput.fill('10');
    await widthInput.fill('50');
    await heightInput.fill('50');

    await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible();
    await page.screenshot({ path: 'screenshots/04_crop_feature.png' });
  });

  test('System-Wide Navigation Smoke Test (excluding Transliteration)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Intentionally excluding any interaction with Transliteration.
    await page.getByRole('button', { name: 'Image → PDF', exact: true }).click();
    await assertSectionLoaded(page, 'document|pdf|converter');

    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Open Editor →', exact: true }).click();
    await assertSectionLoaded(page, 'edit|editor');

    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Compress Image', exact: true }).click();
    await assertSectionLoaded(page, 'compress');

    await page.goto(BASE_URL);
    await page
      .locator('div')
      .filter({ hasText: /^Image ConverterConvert images to JPG, PNG, or WebP/ })
      .getByRole('button', { name: 'To PNG' })
      .click();
    await assertSectionLoaded(page, 'convert|image');

    await page.screenshot({ path: 'screenshots/05_system_navigation.png' });
  });
});
