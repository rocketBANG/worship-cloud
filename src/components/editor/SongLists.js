import React from 'react';
import './SongLists.css';
import { SongListLibrary } from '../../models/song-lists/SongListLibrary';
import { observer } from 'mobx-react';
import { List } from '../List';
import SongList from '../SongList';
import * as API from '../../store/api';
import { Song } from '../../models/Song';
import { SongLibraryModel } from '../../models/SongLibraryModel';
import { observable, IObservableValue, IObservableArray } from 'mobx';
import { SongListModel } from '../../models/song-lists/SongListModel';

type Props = {
    library: SongLibraryModel,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<Song>
}

type State = {}

const SongLists = observer(class extends React.Component<Props, State> {
    state = {
        songListName: "",
        selectedIndexes: [],
    }

    songListLibrary = new SongListLibrary();

    constructor(props: Props) {
        super(props);

        this.songListLibrary.load();
    }

    songListNameChange = (e) => {
        
        this.setState({songListName: e.target.value});
    }

    onAddSongList = () => {
        let {songListName} = this.state;

        if(songListName === "") {
            return;
        }

        this.songListLibrary.addList(songListName);
    }

    onListClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }
        let selectedList = this.songListLibrary.lists[indexes[0]];
        this.props.currentList.set(selectedList);
    }

    onSongClick = (names, indexes) => {
        this.setState({selectedIndexes: indexes});
        if(indexes.length < 1) {
            this.props.editorState.currentList = undefined;
            return;
        }
        let newSong = this.props.editorState.currentList.library.songs[indexes[0]];
        this.props.editorState.currentSong = newSong;
        newSong.loadSong();
    }

    deleteSongList = () => {
        let {currentList} = this.props;
        currentList.get().delete();
    }

    removeSongFromList = () => {
        this.props.library.removeSongs(this.state.selectedIndexes);
    }

    downloadSongList = () => {
        let songIds = this.props.currentList.get().songIds;
        API.downloadSongs(songIds).then(blob => {
            var a = document.createElement("a");
            document.body.appendChild(a);
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = this.props.editorState.currentList.model.name + ".pptx";
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    render() {
        let currentList = this.props.currentList.get();
        let options = this.songListLibrary.lists.map(list => ({
            id: list.id,
            text: list.name,
            altText: list.name
        }));

        let mainView = <List onUpdate={this.onListClick} options={options} />;
        if(currentList !== undefined) {
            mainView = <SongList songList={currentList} selectedSongs={this.props.selectedSongs} library={this.props.library}/>;
        }

        const backButton = currentList !== undefined ? <button onClick={() => this.props.currentList.set(undefined)}>{"<-"}</button> : "";

        let controls;
        if(currentList === undefined && !this.props.hideControls) {
            controls = (<React.Fragment>
                <input value={this.state.songListName} onChange={this.songListNameChange} />
                <button onClick={this.onAddSongList}>Add song list</button>
                </React.Fragment>);
        } else if(!this.props.hideControls){
            controls = (<React.Fragment>
                <button onClick={this.deleteSongList} disabled={true}>Delete this song list</button>
                <button onClick={this.downloadSongList}>Download songs as powerpoint</button>
                </React.Fragment>);
        }

        return (
            <div className="SongLists EditorContainer">
                <div className="ListHeader">{currentList === undefined ? "Song Lists:" : "Song List " + currentList.name + ":"}</div>
                {backButton}
                {mainView}
                <div className="SongListsControls">
                    {controls}
                </div>
            </div>  
        );
    }
});

export { SongLists }