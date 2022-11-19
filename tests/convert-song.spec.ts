import { expect, test } from '@playwright/test';
import { Song } from '../src/interfaces';

const VIDEO_ID = '8YKAHgwLEMg';
const FINAL_LANG = 'Polish';
const FINAL_YEAR = '2000';
const FINAL_SONG_BPM = '100';
const FINAL_SOURCE_URL = 'https://example.com/source-url';
const FINAL_AUTHOR = 'Author E2E Test';
const FINAL_AUTHOR_URL = 'https://example.com/author-url';
const FINAL_VIDEO_GAP = '40';
const FINAL_GAP = '4000';
const FINAL_BPM = '200';
const FINAL_TRACKS = 2;
const FINAL_TRACK_1_SECTIONS = 10;

test('Convert song', async ({ page }) => {
    await page.goto('/?e2e-test');
    await page.locator('[data-test="convert-song"]').click();

    await expect(page.locator('[data-test="basic-data"]')).toBeVisible();
    await expect(page.locator('[data-test="previous-button"]')).toBeDisabled();

    await page.locator('[data-test="source-url"] input').fill('');
    await page.locator('[data-test="source-url"] input').type(FINAL_SOURCE_URL);

    await page.locator('[data-test="input-txt"]').fill('');
    await page.locator('[data-test="input-txt"]').fill(txtfile);

    await page.locator('[data-test="next-button"]').click();
    await expect(page.locator('[data-test="basic-data"]')).not.toBeVisible();
    await expect(page.locator('[data-test="previous-button"]')).not.toBeDisabled();
    await expect(page.locator('[data-test="author-and-vid"]')).toBeVisible();

    await page.locator('[data-test="previous-button"]').click();
    await expect(page.locator('[data-test="basic-data"]')).toBeVisible();
    await expect(page.locator('[data-test="author-and-vid"]')).not.toBeVisible();
    await expect(page.locator('[data-test="previous-button"]')).toBeDisabled();
    await page.locator('[data-test="next-button"]').click();

    // Author and vid
    await expect(page.locator('[data-test="search-video"]')).not.toBeDisabled();

    await page.locator('[data-test="author-name"] input').fill('');
    await page.locator('[data-test="author-name"] input').type(FINAL_AUTHOR);

    await page.locator('[data-test="author-url"] input').fill('');
    await page.locator('[data-test="author-url"] input').type(FINAL_AUTHOR_URL);

    await page.locator('[data-test="video-url"] input').fill('');
    await page.locator('[data-test="video-url"] input').type(`https://www.youtube.com/watch?v=${VIDEO_ID}`);

    // Make sure the data stays
    await page.locator('[data-test="next-button"]').click();
    await expect(page.locator('[data-test="author-and-vid"]')).not.toBeVisible();
    await page.locator('[data-test="previous-button"]').click();
    await expect(page.locator('[data-test="author-and-vid"]')).toBeVisible();
    await expect(page.locator('[data-test="video-url"] input')).toHaveValue(
        `https://www.youtube.com/watch?v=${VIDEO_ID}`,
    );
    await page.locator('[data-test="next-button"]').click();

    // Sync lyrics
    // Playback control
    const timeControls = ['+0.5', '+1', '+5', '+10', '-0.5', '-1', '-5', '-10'];

    for (const control of timeControls) {
        await page.locator(`[data-test="seek${control}s"]`).click();
        await page.waitForTimeout(50);
    }
    const speedControls = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    for (const control of speedControls) {
        await page.locator(`[data-test="speed-${control}"]`).click();
        await expect(page.locator('[data-test="current-speed"]')).toHaveText(`${control * 100}%`);
    }
    // Video gap
    const videoGapControls = ['+1', '+5', '+10', '-1', '-5', '-10'];
    {
        let previousValue = 0;
        for (const control of videoGapControls) {
            previousValue = +control + previousValue;
            await page.locator(`[data-test="shift-video-gap${control}s"]`).click();
            await expect(page.locator('[data-test="shift-video-gap"] input')).toHaveValue(String(previousValue));
        }
    }
    await page.locator('[data-test="shift-video-gap"] input').fill('10');

    // Lyrics gap
    const gapControls = ['+0.05', '+0.5', '+1', '-0.05', '-0.5', '-1'];
    {
        let previousValue = 0;
        for (const control of gapControls) {
            previousValue = +control * 1000 + previousValue;
            await page.locator(`[data-test="shift-gap${control}s"]`).click();
            await expect(page.locator('[data-test="shift-gap"] input')).toHaveValue(String(previousValue));
        }
    }
    await page.locator('[data-test="shift-gap"] input').fill('1000');

    // BPM Manipulation
    await page.locator('[data-test="desired-end"] input').fill('29575'); // Initial value + final gap / 2
    await expect(page.locator('[data-test="desired-bpm"]')).toContainText('200');

    await page.locator('[data-test="change-bpm"] input').fill(FINAL_BPM);

    // Edit sections
    await page.locator('[data-test="track-2"]').click();
    await expect(page.locator('[data-test="section-0"]')).toContainText('Second Track');
    await page.locator('[data-test="track-1"]').click();
    await expect(page.locator('[data-test="section-0"]')).not.toContainText('Second Track');
    await page.locator('[data-test="section-0"]').click();
    await expect(page.locator('[data-test="use-gap-info"]')).toBeVisible();

    // Moving a section changes the time of subsequent sections
    await page.locator('[data-test="section-1"]').click();
    await page.locator('[data-test="change-start-beat"] input').fill('40');
    await page.locator('[data-test="section-2"]').click();
    await expect(page.locator('[data-test="change-start-beat"] input')).toHaveValue('76');
    await page.locator('[data-test="undo-change"]').click();
    await expect(page.locator('[data-test="change-start-beat"] input')).toHaveValue('56');

    // Deleting a section doesn't change the time of subsequent sections
    await page.locator('[data-test="delete-section"]').click();
    await expect(page.locator('[data-test="change-start-beat"] input')).toHaveValue('103'); // next section
    await page.locator('[data-test="undo-change"]').click();
    await page.locator('[data-test="section-3"]').click();
    await expect(page.locator('[data-test="change-start-beat"] input')).toHaveValue('103'); // next section

    await page.locator('[data-test="section-9"]').click();
    await page.locator('[data-test="delete-section"]').click();

    await page.locator('[data-test="next-button"]').click();
    await page.locator('[data-test="previous-button"]').click();

    await expect(page.locator('[data-test="shift-video-gap"] input')).toHaveValue('10');
    await expect(page.locator('[data-test="shift-gap"] input')).toHaveValue('1000');
    await expect(page.locator('[data-test="change-bpm"] input')).toHaveValue(FINAL_BPM);

    await page.locator('[data-test="next-button"]').click();

    // Song metadata
    await expect(page.locator('[data-test="song-language"] input')).toHaveValue('English');
    await page.locator('[data-test="song-language"] input').fill('');
    await page.locator('[data-test="song-language"] input').type(FINAL_LANG);

    await expect(page.locator('[data-test="release-year"] input')).toHaveValue('1992');
    await page.locator('[data-test="release-year"] input').fill('');
    await page.locator('[data-test="release-year"] input').type(FINAL_YEAR);

    await page.locator('[data-test="song-bpm"] input').fill('');
    await page.locator('[data-test="song-bpm"] input').type(FINAL_SONG_BPM);

    // Download song
    await expect(page.locator('[data-test="next-button"]')).not.toBeVisible();
    await expect(page.locator('[data-test="download-button"]')).toBeVisible();

    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('[data-test="download-button"]').click(),
    ]);

    const downloadStream = await download.createReadStream();
    const chunks = [];
    if (downloadStream === null) throw new Error('File download failed');

    for await (let chunk of downloadStream) {
        chunks.push(chunk);
    }
    const downloadContent: Song = JSON.parse(Buffer.concat(chunks).toString('utf-8'));

    expect(downloadContent.video).toEqual(VIDEO_ID);
    expect(downloadContent.sourceUrl).toEqual(FINAL_SOURCE_URL);
    expect(downloadContent.author).toEqual(FINAL_AUTHOR);
    expect(downloadContent.authorUrl).toEqual(FINAL_AUTHOR_URL);
    expect(downloadContent.language).toEqual(FINAL_LANG);
    expect(downloadContent.year).toEqual(FINAL_YEAR);
    expect(downloadContent.realBpm).toEqual(+FINAL_SONG_BPM);
    expect(downloadContent.videoGap).toEqual(+FINAL_VIDEO_GAP);
    expect(downloadContent.gap).toEqual(+FINAL_GAP);
    expect(downloadContent.bpm).toEqual(+FINAL_BPM);
    expect(downloadContent.tracks).toHaveLength(FINAL_TRACKS);
    expect(downloadContent.tracks[0].sections).toHaveLength(FINAL_TRACK_1_SECTIONS);
});

const txtfile = `
#TITLE:Friday I'm in Love
#ARTIST:The Cure
#LANGUAGE:English
#YEAR:1992
#VIDEOGAP:30
#BPM:100
#GAP:3000
: 7 4 59 When
: 11 4 59  you're
- 20
: 20 4 59 And
: 24 4 59  life
: 28 4 59  is
: 32 4 61  mak
: 36 4 64 ing
: 40 4 61  you
: 44 8 59  lone
: 52 3 63 ly
- 56
: 56 4 66 You
: 60 4 63  can
: 64 4 64  al
: 68 7 68 ways
: 75 12 59  go
- 90
: 103 8 64 Down
: 111 8 59 town
- 121
: 127 4 59 When
: 131 4 59  you've
: 135 4 59  got
: 139 7 59  wor
: 146 3 59 ries
- 150
: 150 4 59 All
: 154 4 59  the
: 158 4 61  noise
: 162 4 64  and
: 166 4 61  the
: 170 8 59  hur
: 178 3 63 ry
- 182
: 182 4 66 Seems
: 186 4 63  to
: 190 4 64  help
: 194 8 68  I
: 202 12 59  know
: 230 8 64  down
: 238 8 59 town
- 248
: 250 4 59 Just
: 254 4 69  li
: 258 4 68 sten
: 262 4 68  to
: 266 4 66  the
: 270 4 69  mu
: 274 3 68 sic
- 278
: 278 4 68 Of
: 282 4 66  the
: 286 4 64  traf
: 290 4 66 fic
: 294 4 64  in
: 298 4 63  the
: 302 2 61  ci
: 304 6 64 ty
- 312
: 318 4 69 Lin
: 322 4 68 ger
: 326 4 68  on
: 330 4 66  the
: 334 4 69  side
: 338 3 68 walk
: 7 4 59 Second
: 11 4 59  Track
`;
