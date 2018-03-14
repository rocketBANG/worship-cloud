import React from 'react';
import { List } from './List';
import { observer } from 'mobx-react';

const DisplayVerseList = observer(class DisplayVerseList extends React.Component {

    onVerseClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.song.setVerse(indexes[0]);
    };

    render = () => {
        let song = this.props.song || {};
        const options = (song.verseOrder || []).map((verse, index) => {
            let verseText = verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title;
            if(verse.numPages > 1) {
                verseText += " (" + verse.numPages + ")";
            }
            return {
                id: verse.id,
                text: verseText,
                altText: ""
            }
        });
    
        return ( 
            <div className="VerseList">
                <div className="ListHeader">Verses:</div>
                <List onUpdate={this.onVerseClick} options={options} selectedIndex={song.verseIndex}/>
            </div>
        )
    }
});

export { DisplayVerseList };