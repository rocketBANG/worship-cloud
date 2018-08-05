import { Song } from "../../models/Song";
import { SongApi } from '../../store/api';
import { ModelState } from "../../models/ModelState";
import { delay } from "../TestUtils";
import { NotLoadedError } from "../../errors/NotLoadedError";
import { NetworkError } from "../../errors/NetworkError";

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

    const updateOrder = jest.fn();
    const defaultUpdateOrder = (order: string[], verseId: string) => {
        return Promise.resolve();
    }

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        songApiMock.mockClear();

        fetchVerses.mockImplementation(defaultFetchVerses);
        addVerse.mockImplementation(defaultAddVerse);
        updateOrder.mockImplementation(defaultUpdateOrder);
        
        songApiMock.mockImplementation(() => ({
            fetchVerses,
            addVerse,
            updateOrder
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
            song.loadSong().then(() => { fail("should throw NetworkError"); resolve() },
            (e) => {
                if (e.name !== NetworkError.name) {
                    throw e;
                }
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
        expect(song.completeVerses.length).toBe(0);

        await promise;
        expect(song.state).toBe(ModelState.LOADED);

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

    test('addVerse() handles reject', async () => {
        let expectedId = 'song_id';
        let expectedTitle = 'song title';

        addVerse.mockImplementation((text, songId) => {
            return Promise.reject();
        })

        let song = new Song(expectedTitle, expectedId);
        song.loadSong();

        try {
            await song.addVerse('test text');
            fail("rejected promise should throw a network error");
        } catch(e) {
            if(e.name === NetworkError.name) return;
            throw e;
        }
    })

    test('addToOrder() works', async () => {
        addVerse.mockImplementation((text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        let verse = await song.addVerse('test text');

        expect(song.completeVerses.length).toBe(1);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('test text');

        song.addToOrder('123');
        expect(song.verseOrder[0].id).toBe(verse.id)
        expect(song.verseOrder.length).toBe(1);

    })

    test('addToOrder() twice with the same verse', async () => {
        addVerse.mockImplementation((text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        let verse = await song.addVerse('test text');

        expect(song.completeVerses.length).toBe(1);
        expect(song.completeVerses.find(v => v.id === '123')).toBeDefined();
        expect(song.completeVerses[0].text).toBe('test text');

        song.addToOrder('123');
        song.addToOrder('123');
        expect(song.verseOrder[0].id).toBe(verse.id)
        expect(song.verseOrder[1].id).toBe(verse.id)
        expect(song.verseOrder.length).toBe(2)

    })

    
    test('addToOrder() with different verses', async () => {
        addVerse.mockImplementationOnce((text, songId) => {
            return Promise.resolve({_id: '123', text});
        })
        addVerse.mockImplementationOnce((text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        let verse1 = await song.addVerse('test text');
        let verse2 = await song.addVerse('verse2');

        expect(song.completeVerses.length).toBe(2);

        song.addToOrder('123');
        song.addToOrder('456');
        song.addToOrder('123');
        expect(song.verseOrder[0].id).toBe(verse1.id)
        expect(song.verseOrder[1].id).toBe(verse2.id)
        expect(song.verseOrder[2].id).toBe(verse1.id)
        expect(song.verseOrder.length).toBe(3)

    })

    test('addToOrder() updates model state', async () => {
        addVerse.mockImplementation(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })
        updateOrder.mockImplementation(async () => {
            await delay(100);
            return Promise.resolve();
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');

        expect(song.verseOrder.length).toBe(0);
        let promise = song.addToOrder('123');
        expect(song.state).toBe(ModelState.SAVING);
        expect(song.verseOrder.length).toBe(1);

        await promise;
        expect(song.state).toBe(ModelState.LOADED);

    })

    test('addToOrder() fails on incorrect id', async () => {
        addVerse.mockImplementation(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })
        updateOrder.mockImplementation(async () => {
            await delay(300);
            return Promise.resolve();
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');

        try {
            await song.addToOrder('1234');
            fail("Should fail on adding incorrect id")
        } catch(e) {
            return;
        }

    })

    test('addToOrder() handles reject', async () => {
        addVerse.mockImplementation(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })
        updateOrder.mockImplementation(async () => {
            await delay(100);
            return Promise.reject();
        })


        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');

        let promise = song.addToOrder('123');
        expect(song.verseOrder.length).toBe(1);
        expect(song.verseOrder[0].id).toBe('123');

        try {
            await promise;
            fail("rejected promise should throw a network error");
        } catch(e) {
            if(e.name === NetworkError.name) {
                expect(song.verseOrder.length).toBe(0);
                return;
            };
            throw e;
        }
    })

    test('removeFromOrder() handles reject', async () => {
        addVerse.mockImplementation(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })
        updateOrder.mockImplementationOnce(async () => {
            return Promise.resolve();
        })
        updateOrder.mockImplementationOnce(async () => {
            await delay(100);
            return Promise.reject();
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');

        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(1);
        expect(song.verseOrder[0].id).toBe('123');

        let promise = song.removeFromOrder([0]);
        expect(song.verseOrder.length).toBe(0);

        try {
            await promise;
            fail("rejected promise should throw a network error");
        } catch(e) {
            if(e.name === NetworkError.name) {
                expect(song.verseOrder.length).toBe(1);
                expect(song.verseOrder[0].id).toBe('123');
                return;
            };
            throw e;
        }
    })

    test('removeFromOrder() removes verse', async () => {
        addVerse.mockImplementation(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');

        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(1);

        await song.removeFromOrder([0]);
        expect(song.verseOrder.length).toBe(0);

    })

    test('removeFromOrder() updates verse indexes', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('123');

        await song.removeFromOrder([0]);
        expect(song.verseOrder.length).toBe(2);
        expect(song.verseOrder[0].id).toBe('456');
        expect(song.verseOrder[1].id).toBe('123');

    })

    test('removeFromOrder() works on last verse', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([2]);
        expect(song.verseOrder.length).toBe(2);
        expect(song.verseOrder[0].id).toBe('123');
        expect(song.verseOrder[1].id).toBe('456');

    })

    test('removeFromOrder() works on middle verse', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([1]);
        expect(song.verseOrder.length).toBe(2);
        expect(song.verseOrder[0].id).toBe('123');
        expect(song.verseOrder[1].id).toBe('123');

    })

    test('removeFromOrder() works with multiple', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([0, 1, 2]);
        expect(song.verseOrder.length).toBe(0);

    })

    test('removeFromOrder() works with multiple at the end', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([1, 2]);
        expect(song.verseOrder.length).toBe(1);
        expect(song.verseOrder[0].id).toBe('123');

    })

    test('removeFromOrder() works with multiple at the start', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([0, 1]);
        expect(song.verseOrder.length).toBe(1);
        expect(song.verseOrder[0].id).toBe('123');

    })

    test('removeFromOrder() works with multiple at each end', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        await song.removeFromOrder([0, 2]);
        expect(song.verseOrder.length).toBe(1);
        expect(song.verseOrder[0].id).toBe('456');

    })

    test('removeFromOrder() throws error at out of bounds', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('123');
        expect(song.verseOrder.length).toBe(3);

        try {
            await song.removeFromOrder([3]);
            fail("Should throw out of bounds error")
        } catch(e) {
            return;
        }

    })

    test('reorder() works going up', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([0], 1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('456');
        expect(song.verseOrder[1].id).toBe('123');
        expect(song.verseOrder[2].id).toBe('789');
    })

    test('reorder() works going down', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([2], -1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('123');
        expect(song.verseOrder[1].id).toBe('789');
        expect(song.verseOrder[2].id).toBe('456');
    })

    test('reorder() works going up with multiple', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([0, 1], 1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('789');
        expect(song.verseOrder[1].id).toBe('123');
        expect(song.verseOrder[2].id).toBe('456');
    })

    
    test('reorder() works going down with multiple', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([1, 2], -1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('456');
        expect(song.verseOrder[1].id).toBe('789');
        expect(song.verseOrder[2].id).toBe('123');
    })
    
    test('reorder() squashes going up', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([0, 2], 1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('456');
        expect(song.verseOrder[1].id).toBe('123');
        expect(song.verseOrder[2].id).toBe('789');
    })
    
    test('reorder() squashes going down', async () => {
        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '123', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '456', text});
        })

        addVerse.mockImplementationOnce(async (text, songId) => {
            return Promise.resolve({_id: '789', text});
        })

        let song = new Song('title', 'id');
        await song.loadSong();
        await song.addVerse('test text');
        await song.addVerse('verse2');
        await song.addVerse('verse3');

        await song.addToOrder('123');
        await song.addToOrder('456');
        await song.addToOrder('789');

        await song.reorder([0, 2], -1);

        expect(song.verseOrder.length).toBe(3);
        expect(song.verseOrder[0].id).toBe('123');
        expect(song.verseOrder[1].id).toBe('789');
        expect(song.verseOrder[2].id).toBe('456');
    })

})