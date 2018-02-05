import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List';

const SongLibrary = observer(class SongLibrary extends React.Component {

    onSongClick = (names, indexes) => {
        if(indexes.length < 1) {
            this.props.state.currentSong = undefined;
            return;
        }

        this.props.state.currentSong = this.props.songList.songs[indexes[0]];
        if (this.props.state.currentSong.state === "unloaded") {
            this.props.state.currentSong.loadSong().then(() => {
                this.props.state.currentSong.nextVerse();
            });
        }
    };

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