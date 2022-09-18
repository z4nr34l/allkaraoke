import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        window.Math.random = () => 0.5;

        // @ts-expect-error
        window.isE2ETests = true;
    });
});

test('Remote mic should connect and be selectable', async ({ page, context }) => {
    await page.goto('/');

    // Click [data-test="select-input"]
    await page.locator('[data-test="select-input"]').click();

    const serverUrl = await page.locator('[data-test="server-link-input"]').inputValue();

    const remoteMicPage = await context.newPage();

    await remoteMicPage.goto(serverUrl);
    await remoteMicPage.locator('[data-test="player-name-input"]').fill('E2E Test');
    await remoteMicPage.locator('[data-test="connect-button"]').click();
    await expect(remoteMicPage.locator('[data-test="connect-button"]')).toContainText('Connected', {
        ignoreCase: true,
    });

    await page.locator('[data-test="player-1-source"]').click();
    await page.locator('[data-test="player-1-source"]').click();

    await expect(page.locator('[data-test="player-1-input"]')).toContainText('E2E Test', { ignoreCase: true });
});
