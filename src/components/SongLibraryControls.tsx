import { SongLibraryModel } from "../models/SongLibraryModel";
import { IObservableValue, IObservableArray, observable } from "mobx";
import { SongListModel } from "../models/song-lists/SongListModel";
import { Song } from "../models/Song";
import * as React from 'react';
import { observer } from "mobx-react";

interface IProps {
    library: SongLibraryModel,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<Song>
};

interface IState {
    songText: string,
    selectedSongIds: string[]
}

const SongLibraryControls = observer(class extends React.Component<IProps, IState> {
    public state = {
        songText: '',
        selectedSongIds: []
    };

    private onSongAdd = async () => {
        const newSong = await this.props.library.addSong(this.state.songText);
        this.props.selectedSongs.clear();
        this.props.selectedSongs.push(newSong);
        newSong.loadSong();
    };

    private onSongRemove = () => {
        this.props.selectedSongs.forEach(song => {
            this.props.library.removeSong(song.id);
        })
    };

    private handleChange = (event) => {
        this.setState({
            songText: event.target.value
        })
    };
    
    private onSongListAdd = () => {
        this.props.selectedSongs.forEach(s => {
            this.props.currentList.get().addSong(s.id);
        });
    };

    public render() {
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