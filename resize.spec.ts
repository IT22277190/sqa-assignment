import { test, expect } from '@playwright/test';

test.describe('Pixels Suite - Resize Automation (Member 1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.pixelssuite.com/');
    await page.getByRole('button', { name: 'Resize', exact: true }).click();
    await expect(page.getByRole('button', { name: /Select files/i })).toBeVisible();
  });

  // Feature 1: Core Navigation
  test('Verify resize tool loads', async ({ page }) => {
    await expect(page).toHaveTitle(/Pixels/i);
    await page.screenshot({ path: 'screenshots/resize/01_app_load.png' });
  });

  // Feature 2: Resize via Dimension Inputs
  test('Upload image and resize via input fields', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-image.jpg');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const keepAspectCheckbox = page.getByRole('checkbox');
    if (await keepAspectCheckbox.isChecked()) {
      await keepAspectCheckbox.uncheck();
    }

    const inputs = page.getByRole('spinbutton');
    const widthInput = inputs.nth(0);
    const heightInput = inputs.nth(1);

    await widthInput.fill('800');
    await heightInput.fill('600');
    await page.locator('body').click();

    await expect(canvas).toHaveAttribute('width', '800');
    await page.screenshot({ path: 'screenshots/resize/02_resize_inputs.png' });
  });

  // Feature 3: Aspect Ratio Lock
  test('Verify Keep Aspect Ratio functionality', async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles('test-image.jpg');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const keepAspectCheckbox = page.getByRole('checkbox');
    if (!(await keepAspectCheckbox.isChecked())) {
      await keepAspectCheckbox.check();
    }

    const inputs = page.getByRole('spinbutton');
    const widthInput = inputs.nth(0);
    const heightInput = inputs.nth(1);

    const initialHeight = await heightInput.inputValue();

    await widthInput.fill('500');
    await page.locator('body').click();

    const newHeight = await heightInput.inputValue();
    expect(newHeight).not.toBe(initialHeight);

    await page.screenshot({ path: 'screenshots/resize/03_aspect_ratio.png' });
  });
});
