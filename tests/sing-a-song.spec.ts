import { expect, test } from '@playwright/test';
import { initTestMode, mockSongs } from './helpers';

test.beforeEach(async ({ page, context }) => {
    await initTestMode({ page, context });
    await mockSongs({ page, context });
});

test('Basic sing a song', async ({ page }) => {
    test.slow();
    await page.goto('/?e2e-test');
    await page.getByTestId('advanced').click({ force: true });
    await page.getByTestId('save-button').click({ force: true });

    await page.getByTestId('sing-a-song').click({ force: true });

    await expect(page.getByTestId('song-e2e-test.json')).toBeVisible();

    await page.keyboard.press('Enter'); // enter first song
    await expect(page.getByTestId('next-step-button')).toBeVisible();
    await page.keyboard.press('Backspace'); // escape
    await expect(page.getByTestId('next-step-button')).not.toBeVisible();
    await page.keyboard.press('ArrowRight'); // next song
    await page.keyboard.press('Enter'); // focus
    await expect(page.getByTestId('next-step-button')).toBeVisible();

    // Game mode
    await page.keyboard.press('ArrowUp'); // game mode
    await page.keyboard.press('Enter'); // change to pass the mic
    await expect(page.getByTestId('game-mode-setting')).toHaveAttribute('data-test-value', 'Pass The Mic');

    // Difficulty
    await page.keyboard.press('ArrowUp'); // difficulty
    await page.keyboard.press('Enter'); // change to hard
    await expect(page.getByTestId('difficulty-setting')).toHaveAttribute('data-test-value', 'Hard');

    await page.keyboard.press('ArrowUp'); // Next step button
    await page.keyboard.press('Enter', { delay: 40 }); // Go to next step

    // Player 1
    // Name
    await expect(page.getByTestId('player-1-name')).toBeVisible();
    await page.keyboard.press('ArrowDown', { delay: 40 }); // Setup mics
    await page.keyboard.press('ArrowDown', { delay: 40 }); // player 1 name
    await page.keyboard.press('Enter', { delay: 40 }); // activate
    await expect(page.getByTestId('player-1-name')).toBeFocused();
    await page.keyboard.type('E2E Player 1'); // enter
    await page.keyboard.press('Enter'); // save
    await expect(page.getByTestId('player-1-name')).not.toBeFocused();
    // Track
    await page.keyboard.press('ArrowDown'); // player 1 track
    await page.keyboard.press('Enter'); // change to track 2
    await expect(page.getByTestId('player-1-track-setting')).toHaveAttribute('data-test-value', '2');

    // Player 2
    // Name
    await page.keyboard.press('ArrowDown'); // player 2 name
    await page.keyboard.press('Enter'); // activate
    await expect(page.getByTestId('player-2-name')).toBeFocused();
    await page.keyboard.type('E2E Player 2'); // enter
    // Track
    await page.keyboard.press('ArrowDown'); // player 2 track
    await expect(page.getByTestId('player-2-name')).not.toBeFocused();
    await page.keyboard.press('Enter'); // change to track 1
    await expect(page.getByTestId('player-2-track-setting')).toHaveAttribute('data-test-value', '1');

    // Start song
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const p1CL = '[data-test="lyrics-current-player-1"]';
    const p1NL = '[data-test="lyrics-next-player-1"]';
    const p2CL = '[data-test="lyrics-current-player-2"]';
    const p2NL = '[data-test="lyrics-next-player-2"]';

    await Promise.all(['Track 2', 'Section', '1'].map((text) => expect(page.locator(p1CL)).toContainText(text)));
    await Promise.all(['Track 2', 'Section', '2'].map((text) => expect(page.locator(p1NL)).toContainText(text)));
    await Promise.all(['Track 1', 'Section 1'].map((text) => expect(page.locator(p2CL)).toContainText(text)));
    await Promise.all(['Track 1', 'Section 2'].map((text) => expect(page.locator(p2NL)).toContainText(text)));

    await Promise.all(['Track 2', 'Section', '2'].map((text) => expect(page.locator(p1CL)).toContainText(text)));
    await Promise.all(['Track 1', 'Section 2'].map((text) => expect(page.locator(p2CL)).toContainText(text)));
    await Promise.all(['Track 2', 'Section 3'].map((text) => expect(page.locator(p1NL)).toContainText(text)));

    await Promise.all(['Track 2', 'Section 3'].map((text) => expect(page.locator(p1CL)).toContainText(text)));
    await expect(page.locator(p1NL)).not.toBeVisible();
    await Promise.all(['Track 1 Section 3'].map((text) => expect(page.locator(p2CL)).toContainText(text)));
    await expect(page.locator(p2NL)).not.toBeVisible();

    // Song ending
    await expect(page.getByTestId('highscores-button')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('player-1-name')).toHaveText('E2E Player 1');
    await expect(page.getByTestId('player-2-name')).toHaveText('E2E Player 2');

    // High scores
    await page.getByTestId('highscores-button').click({ force: true });

    await expect(page.locator('[data-test="input-edit-highscore"][data-original-name="E2E Player 1"]')).toBeVisible();
    await expect(page.locator('[data-test="input-edit-highscore"][data-original-name="E2E Player 2"]')).toBeVisible();

    // Edit a highscore name
    await page.keyboard.press('ArrowDown'); // highest score player
    await page.keyboard.type('Updated name');
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(500); // It takes 300ms to save the score

    // Check next song
    await page.getByTestId('play-next-song-button').click({ force: true });
    await expect(page.getByTestId('song-e2e-test-multitrack.json')).toBeVisible();
    await expect(
        page.locator('[data-test="song-e2e-test-multitrack.json"] >> [data-test="song-stat-indicator"]'),
    ).toContainText('Played today', { ignoreCase: true });

    // Check next song player names
    await page.keyboard.press('Enter'); // enter first song
    await expect(page.getByTestId('next-step-button')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('player-1-name')).toHaveAttribute('placeholder', 'E2E Player 1');
    await expect(page.getByTestId('player-2-name')).toHaveAttribute('placeholder', 'E2E Player 2');

    // Check if recent player list contains updated name
    await page.getByTestId('player-1-name').click();
    await expect(page.locator('role=listbox')).toContainText('Updated name');
    await page.keyboard.press('Enter');
    await page.getByTestId('play-song-button').click({ force: true });

    // Check updated highscore
    await expect(page.locator(p1CL)).toBeVisible();
    await page.waitForTimeout(300); // otherwise the click might happen before the game actually starts
    await page.locator('body').click({ force: true, position: { x: 350, y: 350 } });
    await page.getByTestId('button-finish-song').click({ force: true });
    await page.getByTestId('highscores-button').click({ force: true });
    await expect(page.getByTestId('highscores-container')).toContainText('Updated name');
});
