import { readdirSync, readFileSync } from 'fs';
import { Note, Section, Song } from 'interfaces';
import { invert } from 'lodash-es';
import isNotesSection from 'Scenes/Game/Singing/Helpers/isNotesSection';
import { generateNote } from 'testUtilts';
import convertSongToTxt from 'utils/songs/convertSongToTxt';
import convertTxtToSong, { typesMap } from 'utils/songs/convertTxtToSong';

const invertedMapTypes = invert(typesMap);

const notesToText = (notes: Note[]) =>
    notes
        .map((note) => `${invertedMapTypes[note.type]} ${note.start} ${note.length} ${note.pitch} ${note.lyrics}`)
        .join('\n');

const generateSongTxt = (trackSections: Section[][], data: Partial<Song> = {}) => {
    const lines: string[] = [];
    trackSections.forEach(([first, ...sections]) => {
        if (!isNotesSection(first)) throw Error(`first section must contain notes, got ${JSON.stringify(first)}`);

        lines.push(notesToText(first.notes));
        sections.forEach((section) =>
            lines.push(
                isNotesSection(section)
                    ? `- ${section.start}\n${notesToText(section.notes)}`
                    : `- ${section.start} ${section.end}`,
            ),
        );
    });

    return `
#ARTIST:${data?.artist ?? 'ArtistTest'}
#TITLE:${data?.title ?? 'TitleTest'}
#BPM:${data?.bpm ?? '60'}
#GAP:${data?.gap ?? '0'}
${lines.join('\n')}
E`;
};

const videoUrl = 'https://www.youtube.com/watch?v=videoUrl';
const sourceUrl = 'sourceUrl';
const author = 'author';
const authorUrl = 'authorUrl';

const songStub = {
    sourceUrl,
    author,
    authorUrl,
    artist: 'ArtistTest',
    title: 'TitleTest',
    bpm: 60,
    bar: 4,
    gap: 0,
    video: expect.anything(),
} as any;

describe('convertTxtToSong', () => {
    it('should convert single track', () => {
        const sections: Section[] = [
            { start: 0, type: 'notes', notes: [generateNote(0), generateNote(1)] },
            { start: 5, type: 'notes', notes: [generateNote(7), generateNote(10)] },
        ];

        const inputSongTxt = generateSongTxt([sections]);

        const expectedSong: Song = { ...songStub, tracks: [{ sections }] };

        expect(convertTxtToSong(inputSongTxt, videoUrl, author, authorUrl, sourceUrl)).toEqual(expectedSong);
    });

    it('should convert double track', () => {
        const sections: Section[] = [
            { start: 0, type: 'notes', notes: [generateNote(0), generateNote(1)] },
            { start: 5, type: 'notes', notes: [generateNote(7), generateNote(10)] },
        ];

        const inputSongTxt = generateSongTxt([sections, sections]);

        const expectedSong: Song = { ...songStub, tracks: [{ sections }, { sections }] };

        expect(convertTxtToSong(inputSongTxt, videoUrl, author, authorUrl, sourceUrl)).toEqual(expectedSong);
    });

    describe('validate against real files', () => {
        const SONGS_FOLDER = './public/songs';

        it('should properly convert back and forth all the songs', () => {
            const songs = readdirSync(SONGS_FOLDER);

            for (const file of songs) {
                if (file === 'index.json' || file === 'dummy.json' || file === '.DS_Store') continue;

                // uncomment to get the failing file
                // console.log(file);
                const song: Song = JSON.parse(readFileSync(`${SONGS_FOLDER}/${file}`, { encoding: 'utf-8' }));

                const txt = convertSongToTxt(song);

                expect(convertTxtToSong(txt)).toEqual(song);
            }
        });

        it.skip('Useful to debug specific failing song file', () => {
            const file = 'name';
            const song: Song = JSON.parse(readFileSync(`${SONGS_FOLDER}/${file}`, { encoding: 'utf-8' }));

            expect(convertTxtToSong(convertSongToTxt(song))).toEqual(song);
        });
    });
});