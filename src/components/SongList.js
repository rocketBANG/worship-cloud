import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { SongLibraryModel } from '../models/SongLibraryModel';
import { SongListModel } from '../models/song-lists/SongListModel';
import { IObservableArray } from 'mobx';

type Props = {
    library: SongLibraryModel,
    selectedSongs: IObservableArray<Song>,
    songList: SongListModel
};

type State = {
    songText: string,
    selectedSongIds: string[]
}

const SongList = observer(class extends React.Component<Props, State> {
    state: State = {
        songText: '',
        selectedSongIds: []
    };

    onSongClick = (names, indexes) => {
        this.props.selectedSongs.clear();

        if(names.length < 1) {
            return;
        }
        this.props.selectedSongs.push(...this.props.library.songs.filter(s => names.indexOf(s.id) > -1));
        this.props.selectedSongs[this.props.selectedSongs.length - 1].loadSong();
    };

    onSongRemove = () => {
        this.props.selectedSongs.forEach(song => {
            this.props.songList.removeSong(song.id);
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

        const selectedSongs = this.props.selectedSongs.map(s => songs.findIndex(song => song.id === s.id));
    
        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <List onUpdate={this.onSongClick} options={options} selectedIndex={selectedSongs} />
                <div className="ListControls">
                    <button onClick={this.onSongRemove}>Remove Song</button>
                </div>
                {this.props.songList.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongList;