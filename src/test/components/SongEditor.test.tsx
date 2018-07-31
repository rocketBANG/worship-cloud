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


    test('Allows paste', async () => {
        let verse = new Verse('0', '0', 'abc');
        let song = new Song('Hello', 'There');
        const songEditor = shallow(<SongEditor  currentVerse={verse} currentSong={song} />);

        let textArea = songEditor.find('textarea');

        expect(textArea.html()).toBe('<textarea>abc</textarea>');

        textArea.simulate('paste', {
            clipboardData: {
                getData: () => 'testing'
            },
            preventDefault: () => {return}
        })
        await delay(100);

        expect(textArea.html()).toBe('<textarea>abc</textarea>');
    });

}