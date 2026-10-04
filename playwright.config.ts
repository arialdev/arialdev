import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,
	workers: process.env['CI'] ? 1 : undefined,
	reporter: process.env['CI'] ? 'list' : 'html',
	use: {
		baseURL: 'http://127.0.0.1:3000/',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
	],
	webServer: {
		command: 'npm run start -- --host 127.0.0.1 --port 3000 --ignore-lock',
		url: 'http://127.0.0.1:3000/',
		reuseExistingServer: !process.env['CI'],
	},
});
