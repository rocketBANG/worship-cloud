import * as React from 'react';
import { observer } from 'mobx-react';
import { DisplaySong } from '../models/DisplaySong';
import { trace, computed } from 'mobx';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import VerseList from './VerseList';
import { SelectListIndex } from './general/SelectListIndex';
import { ISelectItem } from './general/SelectList';

interface IProps {
    currentSong: DisplaySong,
};

@observer class DisplayVerseList extends React.Component<IProps> {

    private onVerseClick = (items: ISelectItem[], indexes: number[]) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.currentSong.setVerse(indexes[0]);
    };

    @computed private get options() {
        if(this.props.currentSong === undefined) {
            return []
        }
        let song = this.props.currentSong;
        let appendText = song.verseOrder.map(v => v.numPages > 1 ? ' (' + v.numPages + ')' : '');

        return VerseList.MapVerseToISelectItem(song, song.verseOrder, appendText);
    }

    public render() {
        const song = this.props.currentSong;

        let list;
        if(!song || song.verseOrder.length === 0) {
            list = <p>No verses in order</p>;
        } else {
            list = <SelectListIndex onUpdate={this.onVerseClick} items={this.options} selected={[song.verseIndex]}/>;
        }
    
        return ( 
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                {list}
            </div>
        )
    }
};

export { DisplayVerseList };