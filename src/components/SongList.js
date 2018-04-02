import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { Song } from '../models/Song'

const SongList = observer(class SongList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songText: '',
            selectedSongNames: []
        };
      }    

    onSongClick = (names, indexes) => {
        if(names.length < 1) {
            this.props.state.currentSong = undefined;
            this.setState({
                selectedSongNames: []
            })    
            return;
        }
        
        this.props.state.currentSong = this.props.songList.songs[indexes[0]];
        this.props.state.currentSong.loadSong();
        this.setState({
            selectedSongNames: names
        })

    };

    onSongAdd = () => {
        this.props.songList.addSong(new Song(this.state.songText));
    };

    onSongListAdd = () => {
        this.props.state.currentList.addSong(this.props.state.currentSong);
    };

    onSongRemove = () => {
        this.state.selectedSongNames.forEach(songName => {
            this.props.songList.removeSong(songName);
        })
    };

    handleChange = (event) => {
        this.setState({
            songText: event.target.value
        })
    };
    
    render() {
        const options = this.props.songList.songs.map((song, index) => ({
            id: song.name,
            text: song.title,
            altText: song.name
        }));
    
        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <List onUpdate={this.onSongClick} options={options} />
                <div className="ListControls">
                    <input value={this.state.songText} onChange={this.handleChange} />
                    <button onClick={this.onSongAdd} >Add Song</button>
                    <button onClick={this.onSongRemove}>Remove Song</button>
                    <button onClick={this.onSongListAdd} disabled={this.props.state.currentList === undefined}>Add to Song List</button>
                </div>
                {this.props.songList.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongList;