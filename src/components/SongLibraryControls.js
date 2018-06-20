import { SongLibraryModel } from "../models/SongLibraryModel";
import { IObservableValue, IObservableArray, observable } from "mobx";
import { SongListModel } from "../models/song-lists/SongListModel";
import { Song } from "../models/Song";
import * as React from 'react';
import { observer } from "mobx-react";

type Props = {
    library: SongLibraryModel,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<Song>
};

type State = {
    songText: string,
    selectedSongIds: string[]
}

const SongLibraryControls = observer(class extends React.Component<Props, State> {
    state: State = {
        songText: '',
        selectedSongIds: []
    };

    onSongAdd = async () => {
        const newSong = await this.props.library.addSong(this.state.songText);
        this.props.selectedSongs.clear();
        this.props.selectedSongs.push(newSong);
        newSong.loadSong();
    };

    onSongRemove = () => {
        this.props.selectedSongs.forEach(song => {
            this.props.library.removeSong(song.id);
        })
    };

    handleChange = (event) => {
        this.setState({
            songText: event.target.value
        })
    };
    
    onSongListAdd = () => {
        this.props.selectedSongs.forEach(s => {
            this.props.currentList.get().addSong(s.id);
        });
    };

    render() {
        return (
            <div className="ListControls">
                <input value={this.state.songText} onChange={this.handleChange} />
                <button onClick={this.onSongAdd} >Add Song</button>
                <button onClick={this.onSongRemove}>Remove Song</button>
                <button onClick={this.onSongListAdd} disabled={this.props.currentList.get() === undefined}>Add to Song List</button>
            </div>
        )    

    }

});

export {SongLibraryControls};