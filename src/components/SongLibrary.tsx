import * as React from 'react'
import { observer } from 'mobx-react'
import { SongLibraryModel } from '../models/SongLibraryModel';
import { IObservableArray } from 'mobx';
import { Song } from '../models/Song';
import { ModelState } from '../models/ModelState';
import { IListContextMenu, SelectListIndexContext } from './general/SelectListIndexContext';
import { ISelectItem } from './general/SelectList';

interface IProps {
    selectedSongs: IObservableArray<Song>,
    library: SongLibraryModel,
    contextMenu?: IListContextMenu[],
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

    private onSongContext = (item: ISelectItem, index: number) => {
        this.onSongClick([ item ]);
    }

    private onSongClick = (items: ISelectItem[]) => {
        this.props.selectedSongs.clear();
        if(items.length < 1) {
            return;
        }

        console.log(items);
        this.props.selectedSongs.push(...this.getFilteredSongs().filter(s => items.findIndex(item => item.value === s.id) > -1));
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
        const items = songs.map(song => ({
            value: song.id,
            label: song.title,
            altLabel: ""
        }));

        const selectedSongs = this.props.selectedSongs.map(s => songs.findIndex(song => song.id === s.id));

        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <input onChange={this.searchChange} />
                <SelectListIndexContext 
                    onItemContextMenu={this.onSongContext} 
                    contextMenu={this.props.contextMenu} 
                    onUpdate={this.onSongClick} 
                    items={items} 
                    selected={selectedSongs} />
                {this.props.library.state === ModelState.LOADING ? "Saving" : ""}
            </div>
        )    
    }
});

export { SongLibrary };