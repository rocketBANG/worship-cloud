import {connect} from 'react-redux'
import SongEditor from './SongEditor'

function getSong(songName, songList) {
    if(songList[songName] !== undefined) {
        return songList[songName];
    } else {
        return {
            songName: "no song"
        }
    }
}

const mapStateToProps = state => {
    return {
        currentSong: getSong(state.editor.currentSong, state.songs.byId)
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

const SongEditorVisible = connect(
    mapStateToProps,
    mapDispatchToProps
)(SongEditor)



export default SongEditorVisible;
