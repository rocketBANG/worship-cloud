import * as React from 'react';
import {shallow} from 'enzyme';
import SongEditor from '../../components/SongEditor';
import { Verse } from '../../models/Verse';
import { Song } from '../../models/Song';
import { delay } from '../TestUtils';

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
    }));


    const updateVerse = jest.fn();
    const defaultUpdateVerse = (text: string, songId: string, verseId: string) => {
        return Promise.resolve();
    }

    beforeEach(() => {
        songApiMock.mockClear();

        updateVerse.mockImplementation(defaultUpdateVerse);
        songApiMock.mockImplementation(() => ({
            updateVerse
        }))

    })


    test('Updates with change', async () => {
        let verse = new Verse('0', '0', 'abc');
        let song = new Song('Hello', '0');
        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        expect(songEditor.find('textarea').html()).toBe('<textarea>abc</textarea>');

        songEditor.find('textarea').simulate('change', {target: {value: "test"}});

        expect(songEditor.find('textarea').html()).toBe('<textarea>test</textarea>');
        expect(verse.text).toBe('test');
        expect(updateVerse).toHaveBeenCalledTimes(1);
    });
    
    test('Updates with verse', async () => {
        let verse = new Verse('0', '0', 'abc');
        let song = new Song('Hello', '0');
        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        expect(songEditor.find('textarea').html()).toBe('<textarea>abc</textarea>');

        await verse.updateText('test');
        songEditor.setState({});

        expect(songEditor.find('textarea').html()).toBe('<textarea>test</textarea>');
        expect(verse.text).toBe('test');
    });

})