import {connect} from 'react-redux'
import SongLibrary from './SongLibrary'
import '../style/App.css';
import { setDisplaySong } from '../store/actions';

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
            dispatch(setDisplaySong(songName))
        }
    }
}

const SongLibraryVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongLibrary)



export default SongLibraryVisible;
