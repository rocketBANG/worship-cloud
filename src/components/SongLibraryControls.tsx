import { SongLibraryModel } from "../models/SongLibraryModel";
import { IObservableValue, IObservableArray } from "mobx";
import { SongListModel } from "../models/song-lists/SongListModel";
import { Song } from "../models/Song";
import * as React from 'react';
import { observer } from "mobx-react";
import { SongLibrary } from "./SongLibrary";
import { Popup } from "./general/Popup";
import { IListContextMenu } from "./general/ScrollListContext";

interface IProps {
    library: SongLibraryModel,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<Song>
};

interface IState {
    songText: string,
}

const SongLibraryControls = observer(class extends React.Component<IProps, IState> {
    public state = {
        songText: '',
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

    private onRenameFinish = (newTitle: string) => {
        if(newTitle === this.props.selectedSongs[0].title) return;
         
        this.props.selectedSongs[0].setTitle(newTitle);
    }

    private onRenameSong = () => {
        Popup.showPopup("Rename song", this.props.selectedSongs[0].title, this.onRenameFinish);
    }

    private contextMenu: IListContextMenu[] = [
        { text: 'Delete', onSelect: this.onSongRemove },
        { text: 'Rename song', onSelect: this.onRenameSong },
        { text: 'Add to song list', onSelect: this.onSongListAdd, show: () => this.props.currentList.get() !== undefined },
    ]

    public render() {
        return (
            <div style={{flexDirection: 'column', display: 'flex'}}>
                <SongLibrary contextMenu={this.contextMenu} library={this.props.library} selectedSongs={this.props.selectedSongs}/>
                <div className="ListControls">
                    <input value={this.state.songText} onChange={this.handleChange} />
                    <button onClick={this.onSongAdd} >Add Song</button>
                    <button onClick={this.onSongRemove}>Remove Song</button>
                    <button onClick={this.onSongListAdd} disabled={this.props.currentList.get() === undefined}>Add to Song List</button>
                </div>
            </div>
        )    

    }

});

export {SongLibraryControls};