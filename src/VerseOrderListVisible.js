import {connect} from 'react-redux'
import VerseOrderList from './VerseOrderList'
import './App.css';
import { updateTitle, removeSong, setEditingVerse, addVerse, removeVerse, removeFromOrder, rearangeOrder } from './store/actions';

function getVerses(songName, songList, verses) {
    let VerseOrderList = [];
    if(songList[songName] !== undefined) {
        songList[songName].order.forEach(function (verse) {
            let firstLine = verses[verse].text.split("\n")[0];
            VerseOrderList.push({
                verseId: verse,
                firstLine: firstLine
            })            
        });
    }
    
    return VerseOrderList;
}

function getMaxId(verses) {
    if(verses.length < 1) {
        return 0;
    }
    verses.sort();
    let lastVerse = verses[verses.length - 1];
    return parseInt(lastVerse.replace("v", ""), 10);
}

const mapStateToProps = state => {
    return {
        verses: getVerses(state.editor.currentSong, state.songs.byId, state.verses.byId),
        songName: state.editor.currentSong,
        currentVerse: state.editor.currentVerse
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onVerseClick: verseId => {
            dispatch(setEditingVerse(verseId))
        },
        onOrderRemove: (index, songName) => {
            dispatch(removeFromOrder(index, songName))
        },
        onOrderUp: (index, songName) => {
            dispatch(rearangeOrder(index, index-1, songName))
        },
        onOrderDown: (index, songName) => {
            dispatch(rearangeOrder(index, index+1, songName))
        },
    }
}

const VerseOrderListVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(VerseOrderList)



export default VerseOrderListVisible;
