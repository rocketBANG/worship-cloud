import { Song } from "../../models/Song";
import { SongApi } from '../../store/api';
import { ModelState } from "../../models/ModelState";

jest.mock('../../store/api');

describe('Test Song', () => {
    const songApiMock = SongApi as jest.Mock<SongApi>;

    const fetchVerses = jest.fn();
    const defaultFetchVerses = (songId) => {
        return Promise.resolve({verses: []});
    };

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        songApiMock.mockClear();

        fetchVerses.mockImplementation(defaultFetchVerses);
        songApiMock.mockImplementation(() => ({
            fetchVerses,
        }))
    });
    
    test('Song create', () => {
        let expectedId = 'abc123';
        let expectedTitle = 'title';

        let song = new Song(expectedTitle, expectedId);
        expect(song.isLoaded).toBe(false);
        expect(song.state).toBe(ModelState.UNLOADED);
        expect(song.title).toBe(expectedTitle);
        expect(song.id).toBe(expectedId);
        expect(SongApi).toHaveBeenCalled();
    });

    test('loadSong() correctly', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        fetchVerses.mockImplementation((songId) => {
            expect(songId).toBe(expectedId);
            return defaultFetchVerses(songId); 
        });    

        let song = new Song(expectedTitle, expectedId);

        const promise = new Promise(resolve => {
            song.loadSong().then(() => {
                expect(song.state).toBe(ModelState.LOADED);
                expect(song.isLoaded).toBe(true);
                resolve();
            })
        });

        expect(song.state).toBe(ModelState.LOADING);

        await promise;
    })

    test('loadSong() error', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        fetchVerses.mockImplementation((songId) => {
            expect(songId).toBe(expectedId);
            return Promise.reject();
        });    

        let song = new Song(expectedTitle, expectedId);

        let promise =  new Promise(resolve => {
            song.loadSong().then(() => {
                expect(song.state).toBe(ModelState.UNLOADED);
                expect(song.isLoaded).toBe(false);
                resolve();
            }).catch(err => {
                expect(song.state).toBe(ModelState.UNLOADED);
                expect(song.isLoaded).toBe(false);
                expect(song.title).toBe(expectedTitle);
                expect(song.id).toBe(expectedId);
                resolve();
            })
        });

        expect(song.state).toBe(ModelState.LOADING);
        await promise;
    })

})