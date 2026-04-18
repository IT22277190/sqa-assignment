import { test, expect } from '@playwright/test';

test.describe('Pixels Suite resize feature', () => {
  const appUrl = 'https://www.pixelssuite.com/';

  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl);
  });

  test('Core Navigation: application loads with title and heading', async ({ page }) => {
    // Update these assertions after inspecting the live DOM and page copy.
    // Keep this test focused on the core app shell and do not interact with Transliteration-related features.
    await expect(page).toHaveTitle(/pixel/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.screenshot({ path: 'screenshots/01_app_load.png', fullPage: true });
  });

  test('Resize via Inputs: resize element using width and height fields', async ({ page }) => {
    // Replace these placeholder selectors with the real DOM selectors from the live application.
    // Do not target any Transliteration feature or related controls.
    const widthInput = page.locator('input[name="width"]');
    const heightInput = page.locator('input[name="height"]');
    const resizeButton = page.getByRole('button', { name: /resize|apply/i });
    const resizableElement = page.locator('.resizable-element');

    await expect(widthInput).toBeVisible();
    await expect(heightInput).toBeVisible();
    await expect(resizeButton).toBeVisible();
    await expect(resizableElement).toBeVisible();

    await widthInput.fill('800');
    await heightInput.fill('600');
    await resizeButton.click();

    await expect(resizableElement).toHaveCSS('width', '800px');
    await expect(resizableElement).toHaveCSS('height', '600px');

    await page.screenshot({ path: 'screenshots/02_resize_inputs.png', fullPage: true });
  });

  test('Resize via Drag Handle: resize element with mouse actions', async ({ page }) => {
    // Replace these placeholder selectors with the real DOM selectors from the live application.
    // The resize handle should belong to the resizable element and must not be part of Transliteration UI.
    const resizableElement = page.locator('.resizable-element');
    const resizeHandle = page.locator('.resize-handle');

    await expect(resizableElement).toBeVisible();
    await expect(resizeHandle).toBeVisible();

    const initialBox = await resizableElement.boundingBox();
    expect(initialBox).not.toBeNull();
    if (!initialBox) {
      throw new Error('Resizable element bounding box was not available. Check the selector and DOM state.');
    }

    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox.x + initialBox.width + 120, initialBox.y + initialBox.height + 80, {
      steps: 10,
    });
    await page.mouse.up();

    const finalBox = await resizableElement.boundingBox();
    expect(finalBox).not.toBeNull();
    if (!finalBox) {
      throw new Error('Resizable element bounding box was not available after dragging.');
    }

    expect(finalBox.width).toBeGreaterThan(initialBox.width);
    expect(finalBox.height).toBeGreaterThan(initialBox.height);

    await page.screenshot({ path: 'screenshots/03_resize_drag.png', fullPage: true });
  });
});
