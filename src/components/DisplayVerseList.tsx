import * as React from 'react';
import { List } from './List';
import { observer } from 'mobx-react';
import { DisplaySong } from '../models/DisplaySong';

interface IProps {
    currentSong: DisplaySong,
};

const DisplayVerseList = observer(class extends React.Component<IProps> {

    private onVerseClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.currentSong.setVerse(indexes[0]);
    };

    public render() {
        const song = this.props.currentSong || {verseOrder: [], verseIndex: undefined};

        let list;

        if(song.verseOrder.length === 0) {
            list = <p>No verses in order</p>;
        } else {
            let options = song.verseOrder.map((verse, index) => {
                let verseText = verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title;
                if(verse.numPages > 1) {
                    verseText += " (" + verse.numPages + ")";
                }
                return {
                    altText: "",
                    id: verse.id,
                    text: verseText,
                }
            });    
            list = <List onUpdate={this.onVerseClick} options={options} selectedIndex={song.verseIndex}/>;
        }
    
        return ( 
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                {list}
            </div>
        )
    }
});

export { DisplayVerseList };