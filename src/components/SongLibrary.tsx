import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { IObservableValue, IObservableArray } from 'mobx';
import { Song } from '../models/Song';

interface IProps {
    currentSong: IObservableValue<Song>,
    library: SongLibraryModel,
    selectedSongs?: IObservableArray<string>
};

interface IState {
    songText: string,
    selectedSongIds: string[],
    search: string
}

const SongLibrary = observer(class extends React.Component<IProps, IState> {
    public state = {
        songText: '',
        search: '',
        selectedSongIds: []
    };

    private onSongClick = (names, indexes) => {
        if(names.length < 1) {
            this.props.currentSong.set(undefined);
            
            if(this.props.selectedSongs === undefined) { return; }
            this.props.selectedSongs.clear();
            return;
        }
        
        this.props.currentSong.set(this.getFilteredSongs()[indexes[0]]);
        this.props.currentSong.get().loadSong();

        if(this.props.selectedSongs === undefined) return;
        this.props.selectedSongs.clear();
        this.props.selectedSongs.push(...names);
    };

    private searchChange = (change) => {
        this.setState({search: change.target.value.toLowerCase()});
    }

    private songSort = (songA, songB) => {
        const a = songA.title.toLowerCase();
        const b = songB.title.toLowerCase();
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    }

    private getFilteredSongs = (): Song[] => {
        let songs = this.props.library.songs.sort(this.songSort);
        if(this.state.search !== '') {
            songs = songs.filter(s => s.title.toLowerCase().indexOf(this.state.search) !== -1);
        }
        return songs;
    }

    public render() {
        const songs = this.getFilteredSongs();
        const options = songs.map(song => ({
            id: song.id,
            text: song.title,
            altText: ""
        }));

        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <input onChange={this.searchChange} />
                <List onUpdate={this.onSongClick} options={options} />
                {this.props.library.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongLibrary;