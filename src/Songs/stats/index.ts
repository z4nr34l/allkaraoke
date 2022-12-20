import localForage from 'localforage';
import events from 'Scenes/Game/Singing/GameState/GameStateEvents';
import { getSongKey, SongStats, storeSongStats } from 'Songs/stats/common';

events.songEnded.subscribe(async (song, setup, scores) => {
    let currentState = await localForage.getItem<SongStats>(getSongKey(song));

    const score = { setup, scores, date: new Date().toISOString() };
    if (currentState) {
        // there might be cases where only { plays: number } is stored
        currentState.scores = [...(currentState?.scores ?? []), score];
        currentState.plays = currentState.scores.length;
    } else {
        currentState = {
            plays: 1,
            scores: [score],
        };
    }

    await storeSongStats(song, currentState);
    events.songStatStored.dispatch(getSongKey(song), currentState);
});