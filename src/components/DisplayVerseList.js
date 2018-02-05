import React from 'react';
import { List } from './List';

class DisplayVerseList extends React.Component {

    onVerseClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }

        this.props.song.setVerse(indexes[0]);
    };


    render = () => {
        let song = this.props.song || {};
        const options = (song.verseOrder || []).map((verse, index) => ({
            id: verse.id,
            text: verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title,
            altText: ""
        }));
    
        return ( 
            <div className="VerseList">
                <div className="ListHeader">Verses:</div>
                <List onUpdate={this.onVerseClick} options={options} selectedIndex={song.verseIndex}/>
            </div>
        )
    }
}

DisplayVerseList.propTypes = {

}

export { DisplayVerseList };