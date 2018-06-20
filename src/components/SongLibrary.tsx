import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { IObservableValue, IObservableArray } from 'mobx';
import { Song } from '../models/Song';
import { FloatingMenu } from './FloatingMenu';
import { ContextMenu } from './ContextMenu';

interface IProps {
    selectedSongs: IObservableArray<Song>,
    library: SongLibraryModel,
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

    private onSongClick = (names, indexes: string[]) => {
        this.props.selectedSongs.clear();
        if(names.length < 1) {
            return;
        }

        this.props.selectedSongs.push(...this.getFilteredSongs().filter(s => names.indexOf(s.id) > -1));
        this.props.selectedSongs[this.props.selectedSongs.length - 1].loadSong();
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
        let songs = this.props.library.songs.slice().sort(this.songSort);
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

        const selectedSongs = this.props.selectedSongs.map(s => songs.findIndex(song => song.id === s.id));

        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <input onChange={this.searchChange} />
                <ContextMenu items={[{text: "hello"}, {text: "goodbye"}]}>
                    <List onUpdate={this.onSongClick} options={options} selectedIndex={selectedSongs} />
                </ContextMenu>
                {this.props.library.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongLibrary;