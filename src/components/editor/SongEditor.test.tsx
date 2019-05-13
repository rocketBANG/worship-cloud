import * as React from 'react';
import {shallow} from 'enzyme';
import SongEditor from './SongEditor';
import { Verse } from '../../models/songs/Verse';
import { Song } from '../../models/songs/Song';
import { delay } from '../../utils/TestUtils';

import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { SongApi } from '../../store/api';

configure({ adapter: new Adapter() });

jest.mock('../../store/api');

describe('Test SongEditor', () => {
    const songApiMock = SongApi as jest.Mock<SongApi>;

    songApiMock.mockImplementation(() => ({
        updateVerse: (text: string, songId: string, verseId: string) => {
            return Promise.resolve();
        }
    } as any));


    const updateVerse = jest.fn();
    const defaultUpdateVerse = (text: string, songId: string, verseId: string) => {
        return Promise.resolve();
    }

    beforeEach(() => {
        songApiMock.mockClear();

        updateVerse.mockImplementation(defaultUpdateVerse);
        songApiMock.mockImplementation(() => ({
            updateVerse
        } as any))

    })


    test('Updates with change', async () => {
        let verse = new Verse('0', '0', 'abc');
        let song = new Song('Hello', '0');
        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        expect(songEditor.find('textarea').props().value).toBe('abc');

        songEditor.find('textarea').simulate('change', {target: {value: "test"}});

        expect(songEditor.find('textarea').props().value).toBe('test');
        expect(verse.text).toBe('test');
        expect(updateVerse).toHaveBeenCalledTimes(1);
    });
    
    test('Updates with verse', async () => {
        let verse = new Verse('0', '0', 'abc');
        let song = new Song('Hello', '0');
        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        expect(songEditor.find('textarea').props().value).toBe('abc');

        await verse.updateText('test');
        songEditor.setState({});

        expect(songEditor.find('textarea').props().value).toBe('test');
        expect(verse.text).toBe('test');
    });

    test('Works with no current verse', () => {
        let song = new Song('Hello', '0');
        const songEditor = shallow(<SongEditor  currentVerse={undefined} currentSong={song} />);

        expect(songEditor.find('textarea').props().value).toBe('');
        expect(songEditor.find('textarea').props().disabled).toBe(true);    
    })

    test('Works when unsetting verse', () => {
        let song = new Song('Hello', '0');
        let verse = new Verse('0', '0', 'abc');

        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);
        expect(songEditor.find('textarea').props().value).toBe('abc');
        expect(songEditor.find('textarea').props().disabled).toBe(false);    

        songEditor.setProps({currentVerse: undefined});

        expect(songEditor.find('textarea').props().value).toBe('');
        expect(songEditor.find('textarea').props().disabled).toBe(true);    
    })

    test('Works with no current song', () => {
        const songEditor = shallow(<SongEditor  currentVerse={undefined} currentSong={undefined} />);

        expect(songEditor.find('textarea').props().value).toBe('');
        expect(songEditor.find('textarea').props().disabled).toBe(true);    
    })

    test('Works when unsetting song', () => {
        let song = new Song('Hello', '0');
        let verse = new Verse('0', '0', 'abc');

        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);
        expect(songEditor.find('textarea').props().value).toBe('abc');
        expect(songEditor.find('textarea').props().disabled).toBe(false);    

        songEditor.setProps({currentVerse: undefined, currentSong: undefined});

        expect(songEditor.find('textarea').props().value).toBe('');
        expect(songEditor.find('textarea').props().disabled).toBe(true);    
    })

    test('Doesn\'t change regular paste', () => {
        let song = new Song('Hello', '0');
        let verse = new Verse('0', '0', 'abc');

        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);
        songEditor.find('textarea').simulate('paste', {clipboardData: {getData: (s) => "test"}});

        expect(songEditor.find('textarea').props().value).toBe('abc');

    })

    test('Changes paste with special characters', () => {
        let song = new Song('Hello', '0');
        let verse = new Verse('0', '0', 'abc');

        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        try {
            songEditor.find('textarea').simulate('paste', {clipboardData: {getData: (s) => "testline2"}});
            expect(songEditor.find('textarea').props().value).toBe('test\nline2');
        } catch(e) {
            if (e.name !== TypeError.name) {
                throw e;
            }
            let te = e as TypeError;
            if (te.message !== "document.queryCommandSupported is not a function") {
                throw e;
            }
        }

    })

})