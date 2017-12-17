import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { Song } from '../objects/Song'

const MobxList = observer(class MobxList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songText: '',
        };
    
      }    

    onSongClick = (name) => {
        this.setState({
            currentSong: name
        })
    }

    onSongAdd = () => {
        this.props.songList.addSong(new Song(this.state.songText));
    }

    onSongRemove = () => {
        this.props.songList.removeSong(this.state.currentSong);
    }

    handleChange = (event) => {
        this.setState({
            songText: event.target.value
        })
    }
    
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
                </div>
                {this.props.songList.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
})

export default MobxList;