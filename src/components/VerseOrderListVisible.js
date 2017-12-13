import {connect} from 'react-redux'
import VerseOrderList from './VerseOrderList'
import '../style/App.css';
import { setEditingVerse } from '../store/actions';
import { removeFromOrder, rearangeOrder } from '../store/actions/songActions'

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
