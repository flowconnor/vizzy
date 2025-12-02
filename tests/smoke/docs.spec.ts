import { test, expect } from '@playwright/test';

const pages = [
	'/en/docs/line-chart',
	'/en/docs/bar-chart',
	'/en/docs/stacked-bar-chart',
];

for (const path of pages) {
	test(`docs smoke test for ${path}`, async ({ page }) => {
		await page.goto(path);
		await expect(page.getByRole('heading').first()).toBeVisible();
		await expect(page.locator('svg')).toBeVisible();
	});
}


