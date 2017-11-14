import {connect} from 'react-redux'
import SongList from './SongList'
import './App.css';
import { updateTitle, removeSong, addSong, setEditingSong } from './store/actions';

function getSongs(songs) {
    return songs;
}

const mapStateToProps = state => {
    return {
        songs: getSongs(state.songs.byId)
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

const SongListVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongList)



export default SongListVisible;
