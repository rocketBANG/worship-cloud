import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { IObservableValue, IObservableArray } from 'mobx';

type Props = {
    currentSong: IObservableValue<Song>,
    library: SongLibraryModel,
    selectedSongs: IObservableArray<string>
};

type State = {
    songText: string,
    selectedSongIds: string[],
    search: string
}

const SongLibrary = observer(class extends React.Component<Props, State> {
    state: State = {
        songText: '',
        search: '',
    };

    onSongClick = (names, indexes) => {
        if(names.length < 1) {
            this.props.currentSong.set(undefined);
            
            if(this.props.selectedSongs === undefined) { return; }
            this.props.selectedSongs.clear();
            return;
        }
        
        this.props.currentSong.set(this.props.library.songs.sort(this.songSort)[indexes[0]]);
        this.props.currentSong.get().loadSong();

        if(this.props.selectedSongs === undefined) return;
        this.props.selectedSongs.clear();
        this.props.selectedSongs.push(...names);
    };

    searchChange = (change) => {
        this.setState({search: change.target.value.toLowerCase()});
    }

    songSort = (songA, songB) => {
        let a = songA.title.toLowerCase();
        let b = songB.title.toLowerCase();
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    }

    render() {
        let songs = this.props.library.songs.sort(this.songSort);
        if(this.state.search !== '') {
            songs = songs.filter(s => s.title.toLowerCase().indexOf(this.state.search) !== -1);
        }
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