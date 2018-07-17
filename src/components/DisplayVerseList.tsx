import * as React from 'react';
import { List, IOptions } from './List';
import { observer } from 'mobx-react';
import { DisplaySong } from '../models/DisplaySong';
import { trace, computed } from 'mobx';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import VerseList from './VerseList';

interface IProps {
    currentSong: DisplaySong,
};

@observer class DisplayVerseList extends React.Component<IProps> {

    private onVerseClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.currentSong.setVerse(indexes[0]);
    };

    private getOptions = computed((): IOptions[] => {
        let versesWithTitles = this.props.currentSong.getUniqueVerseTitles;
        return this.props.currentSong.verseOrder.map(verse => {
            let title = versesWithTitles.find(v => v.verseId === verse.id).title;
            let verseText = verse.type === "chorus" ? "CHORUS: " + title : title;
            if(verse.numPages > 1) {
                verseText += " (" + verse.numPages + ")";
            }
            return {
                altText: "",
                id: verse.id,
                text: verseText,
            }
        });    

    })

    @computed private get options() {
        if(this.props.currentSong === undefined) {
            return []
        }
        let song = this.props.currentSong;
        let appendText = song.verseOrder.map(v => v.numPages > 1 ? ' (' + v.numPages + ')' : '');

        return VerseList.MapVerseToIOptions(song, song.verseOrder, appendText);
    }

    public render() {
        const song = this.props.currentSong;

        let list;
        if(!song || song.verseOrder.length === 0) {
            list = <p>No verses in order</p>;
        } else {
            list = <List onUpdate={this.onVerseClick} options={this.options} selectedIndex={[song.verseIndex]}/>;
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