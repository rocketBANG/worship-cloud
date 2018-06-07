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
    selectedSongIds: string[]
}

const SongLibrary = observer(class SongLibrary extends React.Component<Props, State> {
    state: State = {
        songText: '',
    };

    onSongClick = (names, indexes) => {
        if(names.length < 1) {
            this.props.currentSong.set(undefined);
            
            if(this.props.selectedSongs === undefined) return;
            this.props.selectedSongs.clear();
            return;
        }
        
        this.props.currentSong.set(this.props.library.songs[indexes[0]]);
        this.props.currentSong.get().loadSong();

        if(this.props.selectedSongs === undefined) return;
        this.props.selectedSongs.clear();
        this.props.selectedSongs.push(...names);
    };

    render() {
        const options = this.props.library.songs.map(song => ({
            id: song.id,
            text: song.title,
            altText: ""
        }));

        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <List onUpdate={this.onSongClick} options={options} />
                {this.props.library.state === "pending" ? "Saving" : ""}
            </div>
        )    
    }
});

export default SongLibrary;