import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { SongLibraryModel } from '../models/SongLibraryModel';
import { SongListModel } from '../models/song-lists/SongListModel';

type Props = {
    library: SongLibraryModel,
    currentSong: ObservableValue<Song>,
    songList: SongListModel
};

type State = {
    songText: string,
    selectedSongIds: string[]
}

const SongList = observer(class SongList extends React.Component<Props, State> {
    state: State = {
        songText: '',
        selectedSongIds: []
    };

    onSongClick = (names, indexes) => {
        if(names.length < 1) {
            this.props.currentSong.set(undefined)
            this.setState({
                selectedSongIds: []
            })    
            return;
        }        
        this.props.currentSong.set(this.props.library.songs.find(s => s.id === names[0]))
        this.props.currentSong.get().loadSong();
        this.setState({
            selectedSongIds: names
        })
    };

    onSongRemove = () => {
        this.state.selectedSongIds.forEach(id => {
            this.props.songList.removeSong(id);
        })
    }
    
    render() {
        let songs = this.props.library.songs;
        songs = songs.filter(s => this.props.songList.songIds.indexOf(s.id) !== -1);

        const options = songs.map((song, index) => ({
            id: song.id,
            text: song.title,
            altText: ""
        }));
    
        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <List onUpdate={this.onSongClick} options={options} />
                <div className="ListControls">
                    <button onClick={this.onSongRemove}>Remove Song</button>
                </div>
                {this.props.songList.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongList;