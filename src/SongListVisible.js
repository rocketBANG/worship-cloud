import {connect} from 'react-redux'
import SongList from './SongList'
import './App.css';
import { updateTitle, removeSong, setEditingSong } from './store/actions';

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
        }
    }
}

const SongListVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongList)



export default SongListVisible;
