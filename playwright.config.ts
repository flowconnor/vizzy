import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: './tests/smoke',
	use: {
		baseURL: 'http://127.0.0.1:3333',
		headless: true,
	},
	webServer: {
		command: 'npm run dev -- --port 3333',
		port: 3333,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
	},
};

export default config;


