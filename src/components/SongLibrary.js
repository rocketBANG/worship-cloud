import React from 'react'
import {List} from './List'
import { observer } from 'mobx-react'

const SongLibrary = observer(class SongLibrary extends React.Component {

    onSongClick = (name, index) => {
        this.props.state.currentSong = this.props.songList.songs[index];
        if (this.props.state.currentSong.state == "unloaded") {
            this.props.state.currentSong.loadSong().then(() => {
                this.props.state.currentSong.nextVerse();
            });    
        }
    }

    render = () => {
        const options = this.props.songList.songs.map((song, index) => ({
            id: song.name,
            text: song.title,
            altText: song.name
        }));
    
        return ( 
            <div className="SongLibrary">
                <div className="ListHeader">Songs:</div>
                <List onUpdate={this.onSongClick} options={options}/>
            </div>
        )
    }
});

export default SongLibrary;