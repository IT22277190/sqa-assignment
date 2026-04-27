import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: '.',
	testMatch: ['*.spec.ts'],
	testIgnore: ['PixelSuite-Test/**', 'node_modules/**'],
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 1,
	workers: process.env.CI ? 2 : undefined,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report' }],
	],
	use: {
		baseURL: 'https://www.pixelssuite.com',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		viewport: { width: 1280, height: 720 },
		actionTimeout: 15_000,
		navigationTimeout: 30_000,
	},
	outputDir: 'test-results',
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' },
		},
	],
});
