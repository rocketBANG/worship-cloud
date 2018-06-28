import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { SongLibraryModel } from '../models/SongLibraryModel';
import { SongListModel } from '../models/song-lists/SongListModel';
import { IObservableArray } from 'mobx';
import { Song } from '../models/Song';

interface IProps {
    library: SongLibraryModel,
    selectedSongs: IObservableArray<Song>,
    songList: SongListModel
};

interface IState {
    songText: string,
    selectedSongIds: string[]
}

const SongList = observer(class extends React.Component<IProps, IState> {
    public state = {
        songText: '',
        selectedSongIds: []
    };

    private onSongClick = (names, indexes) => {
        this.props.selectedSongs.clear();

        if(names.length < 1) {
            return;
        }
        this.props.selectedSongs.push(...this.props.library.songs.filter(s => names.indexOf(s.id) > -1));
        this.props.selectedSongs[this.props.selectedSongs.length - 1].loadSong();
    };

    private onSongRemove = () => {
        this.props.selectedSongs.forEach(song => {
            this.props.songList.removeSong(song.id);
        })
    }
    
    public render() {
        let songs = this.props.songList.songIds.map(songId => this.props.library.songs.find(s => s.id === songId));
        songs = songs.filter(s => s !== undefined); // Remove missing songs

        const options = songs.map(song => ({
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
            </div>
        )    
    }
});

export default SongList;