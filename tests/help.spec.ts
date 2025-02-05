import { expect, test } from '@playwright/test';

test('Help', async ({ page }) => {
  await page.goto('/?e2e-test');
  await page.getByTestId('enter-the-game').click();
  await page.getByTestId('skip').click();
  await expect(page.getByTestId('sing-a-song')).toBeVisible();
  await expect(page.getByTestId('help-container')).toHaveAttribute('data-collapsed', 'false');
  await page.keyboard.press('h'); // toggle help
  await expect(page.getByTestId('help-container')).toHaveAttribute('data-collapsed', 'true');
  await page.reload();
  await expect(page.getByTestId('sing-a-song')).toBeVisible();
  await expect(page.getByTestId('help-container')).toHaveAttribute('data-collapsed', 'true');
});
