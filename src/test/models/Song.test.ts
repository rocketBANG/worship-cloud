import { Song } from "../../models/Song";
import { SongApi } from '../../store/api';
import { ModelState } from "../../models/ModelState";
import { delay } from "../TestUtils";
import { NotLoadedError } from "../../errors/NotLoadedError";

jest.mock('../../store/api');

describe('Test Song', () => {
    const songApiMock = SongApi as jest.Mock<SongApi>;

    const fetchVerses = jest.fn();
    const defaultFetchVerses = (songId) => {
        return Promise.resolve({verses: []});
    };

    const addVerse = jest.fn();
    const defaultAddVerse = (text: string, songId: string) => {
        return Promise.resolve({_id: '123', text});
    }

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        songApiMock.mockClear();

        fetchVerses.mockImplementation(defaultFetchVerses);
        addVerse.mockImplementation(defaultAddVerse);
        songApiMock.mockImplementation(() => ({
            fetchVerses,
            addVerse
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
                expect(song.title).toBe(expectedTitle);
                expect(song.id).toBe(expectedId);
                resolve();
            })
        });

        expect(song.state).toBe(ModelState.LOADING);
        await promise;
    })

    test('loadSong() twice', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        fetchVerses.mockImplementation((songId) => {
            expect(songId).toBe(expectedId);
            return defaultFetchVerses(songId);
        });    

        let song = new Song(expectedTitle, expectedId);

        await song.loadSong().then(async () => {
            expect(song.state).toBe(ModelState.LOADED);
            expect(song.isLoaded).toBe(true);
            const promise = song.loadSong().then(() => {
                expect(song.state).toBe(ModelState.LOADED);
                expect(song.isLoaded).toBe(true);
            })    

            expect(song.isLoaded).toBe(true);
            expect(song.state).toBe(ModelState.LOADED);

            await promise;
        })
    })

    test('loadSong() twice immediate', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        fetchVerses.mockImplementation(async (songId) => {
            expect(songId).toBe(expectedId);
            await delay(200);
            return defaultFetchVerses(songId);
        });

        let song = new Song(expectedTitle, expectedId);
        let promises = [];

        promises.push(song.loadSong().then(() => {
            expect(song.state).toBe(ModelState.LOADED);
            expect(song.isLoaded).toBe(true);
        }));
        expect(song.state).toBe(ModelState.LOADING);
        expect(song.isLoaded).toBe(false);

        await delay(50);
        
        promises.push(song.loadSong().then(() => {
            expect(song.state).toBe(ModelState.LOADED);
            expect(song.isLoaded).toBe(true);
        }));
        expect(song.state).toBe(ModelState.LOADING);
        expect(song.isLoaded).toBe(false);

        await Promise.all(promises);
    })

    test('addVerse() adds correctly', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementation((text, songId) => {
            expect(songId).toBe(expectedId)
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song(expectedTitle, expectedId);
        await song.loadSong();
        let promise = song.addVerse('test text');
        expect(song.state).toBe(ModelState.SAVING);

        await promise;

        expect(song.completeVerses.length).toBe(1);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('test text');
    })

    test('addVerse() adds multiple', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementationOnce((text, songId) => {
            expect(songId).toBe(expectedId)
            return Promise.resolve({_id: '123', text});
        }).mockImplementationOnce((text, songId) => {
            expect(songId).toBe(expectedId)
            return Promise.resolve({_id: 'abc_something', text});
        })

        let song = new Song(expectedTitle, expectedId);
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse 2\nwith line break');

        expect(song.completeVerses.length).toBe(2);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('test text');

        expect(song.completeVerses.find(v => v.id === 'abc_something')).toBeDefined();
        expect(song.completeVerses[1].text).toBe('verse 2\nwith line break');
    })

    test('addVerse() adds multiple', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementationOnce(async (text, songId) => {
            expect(songId).toBe(expectedId)
            await delay(50);
            return {_id: '123', text};
        }).mockImplementationOnce(async (text, songId) => {
            await delay(0);
            return {_id: 'abc_something', text};
        })

        let song = new Song(expectedTitle, expectedId);
        await song.loadSong();
        let promise = song.addVerse('test text');
        await delay(15);
        await song.addVerse('verse 2\nwith line break');
        await promise;

        expect(song.completeVerses.length).toBe(2);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[1].text).toBe('test text');
        
        expect(song.completeVerses.find(v => v.id === 'abc_something')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('verse 2\nwith line break');
    })

    test('addVerse() adds empty text', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementation((text, songId) => {
            expect(songId).toBe(expectedId)
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song(expectedTitle, expectedId);
        await song.loadSong();
        await song.addVerse('');

        expect(song.completeVerses.length).toBe(1);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('');
    })

    test('addVerse() not before load', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementation((text, songId) => {
            expect(songId).toBe(expectedId)
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song(expectedTitle, expectedId);

        try {
            await song.addVerse('test text');
            fail("Song shouldn't add verse if it's not loaded");
        } catch (e) {
            if(e.name === NotLoadedError.name) return;
            throw e;
        }
    })


})