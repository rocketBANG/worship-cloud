import {connect} from 'react-redux'
import VerseList from './VerseList'
import '../style/App.css';
import { setEditingVerse, addVerse, removeVerse, addToOrder } from '../store/actions';

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
    return parseInt(lastVerse.replace("v", ""), 10);
}

const mapStateToProps = state => {
    return {
        verses: getVerses(state.editor.currentSong, state.songs.byId, state.verses.byId),
        maxVerseId: getMaxId(state.verses.allIds),
        currentSong: state.editor.currentSong,
        currentVerse: state.editor.currentVerse
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
        onOrderAdd: (verseId, songName) => {
            if(verseId === undefined || verseId === "") {
                return;
            }
            dispatch(addToOrder(verseId, songName))
        },
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onVerseAdd(verseId) {
        console.log("adding " + verseId);
        dispatchProps.onVerseAdd(verseId, stateProps.currentSong)
    }, 
    onVerseRemove() {
        dispatchProps.onVerseRemove(stateProps.currentVerse, stateProps.currentSong)
    }, 
    onOrderAdd() {
        dispatchProps.onOrderAdd(stateProps.currentVerse, stateProps.currentSong)
    },
});

const VerseListVisible = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(VerseList)



export default VerseListVisible;
