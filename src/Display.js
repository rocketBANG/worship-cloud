import React from 'react'
import {connect} from 'react-redux'
import './Display.css'

class DisplayInternal extends React.Component {

    splitLines(text) {
        var br = React.createElement('br');
        if(text) {
            return text.split("\n").map(line => {
                return (<span>{line}<br /></span>)
            });
        } else {
            return "";
        }
    }

    render() {
        return (
            <div className="Display">
                <div className="TitleText">
                    {this.props.showTitle ? this.props.currentSongObject.songName : ""}
                </div>
                <div className="VerseText">
                    {this.splitLines(this.props.currentVerse.text)}
                </div>
            </div>
        );
    }
}

function getCurrentVerse(verses, song, verseIndex) {
    if(song !== undefined) {
        let verseId = song.order[verseIndex];
        return verses[verseId];
    }
    return {text: ""};
}

const mapStateToProps = state => {
    return {
        currentVerse: getCurrentVerse(state.verses.byId, state.songs.byId[state.display.currentSong], state.display.currentVerseIndex),
        currentSongObject: state.songs.byId[state.display.currentSong] || {order: []},
        showTitle: state.display.currentVerseIndex < 1
    }
}

const Display = connect(
    mapStateToProps
)(DisplayInternal)

export default Display
