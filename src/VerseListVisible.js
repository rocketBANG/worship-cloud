import {connect} from 'react-redux'
import VerseList from './VerseList'
import './App.css';
import { updateTitle, removeSong, setEditingVerse } from './store/actions';

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

const mapStateToProps = state => {
    return {
        verses: getVerses(state.editor.currentSong, state.songs.byId, state.verses.byId)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onVerseClick: verseId => {
            dispatch(setEditingVerse(verseId))
        }
    }
}

const VerseListVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(VerseList)



export default VerseListVisible;
