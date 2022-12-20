import { expect, test } from '@playwright/test';
import { initTestMode, mockSongs, stubUserMedia } from './helpers';

test.beforeEach(async ({ page, context }) => {
    await initTestMode({ page, context });
    await mockSongs({ page, context });
});

test('Source selection', async ({ page, context }) => {
    const { connectDevices, disconnectDevices } = await stubUserMedia({ page, context });

    await page.goto('/?e2e-test');

    await page.getByTestId('mics').click({ force: true });
    await expect(page.getByTestId('setup-not-completed')).toBeVisible();

    const singstarDevice = {
        id: 'test',
        label: 'wireless mic #2137',
        channels: 2,
    };

    await connectDevices(singstarDevice);

    await expect(page.getByTestId('setup-completed')).toBeVisible();
    await disconnectDevices(singstarDevice);
    await expect(page.getByTestId('setup-not-completed')).toBeVisible();
});