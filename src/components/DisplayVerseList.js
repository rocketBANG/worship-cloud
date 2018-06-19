import React from 'react';
import { List } from './List';
import { observer } from 'mobx-react';
import { DisplaySong } from '../models/DisplaySong';

type Props = {
    currentSong: DisplaySong,
};

type State = {
}

const DisplayVerseList = observer(class extends React.Component<Props, State> {

    onVerseClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.currentSong.setVerse(indexes[0]);
    };

    render() {
        let song = this.props.currentSong || {};
        const options = (song.verseOrder || []).map((verse, index) => {
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
    
        return ( 
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                <List onUpdate={this.onVerseClick} options={options} selectedIndex={song.verseIndex}/>
            </div>
        )
    }
});

export { DisplayVerseList };