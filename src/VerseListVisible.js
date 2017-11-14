import {connect} from 'react-redux'
import VerseList from './VerseList'
import './App.css';
import { updateTitle, removeSong, setEditingVerse, addVerse, removeVerse } from './store/actions';

function getVerses(songName, songList, verses) {
    let verseList = [];
    if(songList[songName] !== undefined) {
        
        songList[songName].verses.forEach(function (verse) {
            let firstLine = verses[verse].text.split("\n")[0];
            verseList.push({
                verseId: verse,
                firstLine: firstLine
            })            
        });
    }
    
    return verseList;
}

function getMaxId(verses) {
    if(verses.length < 1) {
        return 0;
    }
    verses.sort();
    let lastVerse = verses[verses.length - 1];
    return parseInt(lastVerse.replace("v", ""));
}

const mapStateToProps = state => {
    return {
        verses: getVerses(state.editor.currentSong, state.songs.byId, state.verses.byId),
        maxVerseId: getMaxId(state.verses.allIds),
        songName: state.editor.currentSong
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onVerseClick: verseId => {
            dispatch(setEditingVerse(verseId))
        },
        onVerseAdd: (verseId, songName) => {
            if(verseId === undefined || verseId === "") {
                return;
            }
            dispatch(addVerse(songName, "", verseId))
        },
        onVerseRemove: (verseId, songName) => {
            if(verseId === undefined || verseId === "") {
                return;
            }
            dispatch(removeVerse(verseId, songName))
        },
    }
}

const VerseListVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(VerseList)



export default VerseListVisible;
