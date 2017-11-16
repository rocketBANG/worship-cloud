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
        onSongRemove: songName => {
            dispatch(removeSong(songName))
        },
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSongRemove() {
        dispatchProps.onSongRemove(stateProps.currentSong)
    }
});

const SongListVisible = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SongList)



export default SongListVisible;
