import {connect} from 'react-redux'
import SongList from './SongList'
import './App.css';
import { removeSong, addSong, setEditingSong } from './store/actions';

function getSongs(songs) {
    return songs;
}

const mapStateToProps = state => {
    return {
        songs: getSongs(state.songs.byId),
        currentSong: state.editor.currentSong
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSongClick: songName => {
            dispatch(setEditingSong(songName))
        },
        onSongAdd: songName => {
            dispatch(addSong(songName))
        },
        removeSong: songName => {
            dispatch(removeSong(songName))
        },
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSongRemove() {
        dispatchProps.removeSong(stateProps.currentSong) //Passes the current state to dispatch
    }
});

const SongListVisible = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SongList)



export default SongListVisible;
