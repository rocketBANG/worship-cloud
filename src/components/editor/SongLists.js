import React from 'react';
import './SongLists.css';
import { SongListLibrary } from '../../models/song-lists/SongListLibrary';
import { observer } from 'mobx-react';
import { List } from '../List';
import SongList from '../SongList';
import { SongLibraryModel } from '../../models/SongLibraryModel';
import { SongListApi } from '../../store/SongListApi';
import * as API from '../../store/api';

const SongLists = observer(class SongLists extends React.Component {
    state = {
        songListName: "",
        selectedIndexes: [],
    }

    songListLibrary = new SongListLibrary();

    constructor(props) {
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
        let api = new SongListApi(selectedList.id);
        api.load();
        this.props.editorState.currentList = { library: new SongLibraryModel(api, selectedList.songIds), model: selectedList};
        this.props.editorState.currentList.library.loadSongs();
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
        let {currentList} = this.props.editorState;
        currentList.model.delete();
    }

    removeSongFromList = () => {
        let currentList = this.props.editorState.currentList;
        currentList.library.removeSongs(this.state.selectedIndexes);
    }

    downloadSongList = () => {
        let songs = this.props.editorState.currentList.library.songs.map(s => s.id);
        API.downloadSongs(songs).then(blob => {
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
        let currentList = this.props.editorState.currentList;
        let options = this.songListLibrary.lists.map(list => ({
            id: list.id,
            text: list.name,
            altText: list.name
        }));

        let mainView = <List onUpdate={this.onListClick} options={options} />;
        if(currentList !== undefined) {
            mainView = <SongList songList={currentList.library} filteredLibrary={true} state={this.props.editorState} hideControls={this.props.hideControls}/>;
        }

        const backButton = currentList !== undefined ? <button onClick={() => this.props.editorState.currentList = undefined}>{"<-"}</button> : "";

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
                <div className="ListHeader">{currentList === undefined ? "Song Lists:" : "Song List " + currentList.model.name + ":"}</div>
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