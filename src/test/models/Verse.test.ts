import { SongApi } from '../../store/api';
import { Verse } from '../../models/Verse';
import { ModelState } from '../../models/ModelState';
import { NetworkError } from '../../errors/NetworkError';

jest.mock('../../store/api');

describe('Test Verse', () => {

    const songApiMock = SongApi as jest.Mock<SongApi>;

    const fetchVerses = jest.fn();
    const defaultFetchVerses = (songId) => {
        return Promise.resolve({verses: []});
    };

    const updateVerseType = jest.fn();
    const defaultUpdateVerseType = (songId) => {
        return Promise.resolve();
    };

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        songApiMock.mockClear();
        fetchVerses.mockClear();
        updateVerseType.mockClear();

        fetchVerses.mockImplementation(defaultFetchVerses);
        updateVerseType.mockImplementation(defaultUpdateVerseType);
        
        songApiMock.mockImplementation(() => ({
            fetchVerses,
            updateVerseType
        }))
    });

    test('Verse create default', () => {
        let verseId = 'abc123';
        let songId = 'cba321';

        let verse = new Verse(verseId, songId);
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe("");
        expect(verse.type).toBe("verse");
        expect(verse.title).toBe("");
        
        expect(SongApi).toHaveBeenCalled();
    });

    test('Verse create with text', () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        let verse = new Verse(verseId, songId, verseText);
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("verse");
        expect(verse.title).toBe("Line 1");
        
        expect(SongApi).toHaveBeenCalled();
    });

    test('Verse create with chorus', () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        let verse = new Verse(verseId, songId, verseText, "chorus");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("chorus");
        
        expect(SongApi).toHaveBeenCalled();
    });

    test('setChorus() set', async () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        let verse = new Verse(verseId, songId, verseText, "verse");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("verse");

        let promise = verse.setChorus();

        expect(verse.state).toBe(ModelState.SAVING);
        expect(verse.type).toBe("chorus");

        await promise;
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.type).toBe("chorus");
        
    });
    
    test('setChorus() set handles reject', async () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        updateVerseType.mockImplementation(() => {
            return Promise.reject();
        })

        let verse = new Verse(verseId, songId, verseText, "verse");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("verse");

        let promise = verse.setChorus();

        expect(verse.state).toBe(ModelState.SAVING);
        expect(verse.type).toBe("chorus");

        try {
            await promise; 
            fail('Should throw NetworkError on reject');
        } catch(e) {
            expect(verse.state).toBe(ModelState.LOADED);
            expect(verse.type).toBe("verse");
    
            if(e.name === NetworkError.name) return;
            throw e;
        }
        
    });

    test('setChorus() unset', async () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        let verse = new Verse(verseId, songId, verseText, "chorus");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("chorus");

        let promise = verse.setChorus();

        expect(verse.state).toBe(ModelState.SAVING);
        expect(verse.type).toBe("verse");

        await promise;
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.type).toBe("verse");
    });

        
    test('setChorus() unset handles reject', async () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        updateVerseType.mockImplementation(() => {
            return Promise.reject();
        })

        let verse = new Verse(verseId, songId, verseText, "chorus");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("chorus");

        let promise = verse.setChorus();

        expect(verse.state).toBe(ModelState.SAVING);
        expect(verse.type).toBe("verse");

        try {
            await promise; 
            fail('Should throw NetworkError on reject');
        } catch(e) {
            expect(verse.state).toBe(ModelState.LOADED);
            expect(verse.type).toBe("chorus");
    
            if(e.name === NetworkError.name) return;
            throw e;
        }
        
    });

    test('Verse set pages', () => {
        let verseId = 'abc123';
        let songId = 'cba321';
        let verseText = "Line 1\nLine 2"

        let verse = new Verse(verseId, songId, verseText, "chorus");
        expect(verse.state).toBe(ModelState.LOADED);
        expect(verse.songId).toBe(songId);
        expect(verse.id).toBe(verseId);
        expect(verse.text).toBe(verseText);
        expect(verse.type).toBe("chorus");
        expect(verse.numPages).toBe(1);

        verse.setNumberOfPages(5);
        expect(verse.numPages).toBe(5);
    });

});
