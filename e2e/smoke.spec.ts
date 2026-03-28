import { test, expect } from '@playwright/test';

test.describe('App Smoke Test', () => {
  test('should_load_the_homepage_successfully', async ({ page }) => {
    // Navigate to the base URL (configured in playwright.config.ts)
    await page.goto('/');

    // Verify the page basically works (e.g., check for a specific heading)
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
  });

  test('should_not_have_severe_console_errors', async ({ page }) => {
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') logs.push(msg.text());
    });

    await page.goto('/');

    // Expect no critical errors on mount
    expect(logs).not.toContain(expect.stringContaining('404'));
  });
});
