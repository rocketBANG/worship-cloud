import { SongLibraryModel } from "../models/SongLibraryModel";
import { IObservableValue, IObservableArray } from "mobx";
import { SongListModel } from "../models/song-lists/SongListModel";
import { Song } from "../models/Song";
import React from 'react';
import { observer } from "mobx-react";

type Props = {
    library: SongLibraryModel,
    currentSong: IObservableValue<Song>,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<string>
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

    onSongAdd = () => {
        this.props.library.addSong(this.state.songText);
    };

    onSongRemove = () => {
        this.props.selectedSongs.forEach(songId => {
            this.props.library.removeSong(songId);
        })
    };

    handleChange = (event) => {
        this.setState({
            songText: event.target.value
        })
    };
    
    onSongListAdd = () => {
        this.props.currentList.get().addSong(this.props.currentSong.get().id);
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