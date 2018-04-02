import React from 'react';
import './SongLists.css';
import { SongListLibrary } from '../../models/song-lists/SongListLibrary';
import { observer } from 'mobx-react';
import { List } from '../List';

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
        let newList = this.songListLibrary.lists[indexes[0]];
        this.props.editorState.currentList = newList;
        newList.loadList();
    }

    onSongClick = (names, indexes) => {
        this.setState({selectedIndexes: indexes});
        if(indexes.length < 1) {
            this.props.editorState.currentList = undefined;
            return;
        }
        let newSong = this.props.editorState.currentList.songs[indexes[0]];
        this.props.editorState.currentSong = newSong;
        newSong.loadSong();
    }

    deleteSongList = () => {
        let {currentList} = this.props.editorState;
        currentList.dlete();
    }

    removeSongFromList = () => {
        let {currentList} = this.props.editorState;
        currentList.removeSongs(this.state.selectedIndexes);
    }

    render() {
        let {currentList} = this.props.editorState;
        let options = this.songListLibrary.lists.map(list => ({
            id: list.id,
            text: list.name,
            altText: list.name
        }));

        let mainView = <List onUpdate={this.onListClick} options={options} />;
        if(currentList !== undefined) {
            options = currentList.songs.map(song => ({
                id: song.name,
                text: song.title,
                altText: song.name
            }));
            mainView = <List onUpdate={this.onSongClick} options={options} />;
        }

        const backButton = currentList !== undefined ? <button onClick={() => this.props.editorState.currentList = undefined}>{"<-"}</button> : "";

        const controls = currentList === undefined
            ? (<button onClick={this.onAddSongList}>Add song list</button>)
            : (<React.Fragment>
                <button onClick={this.deleteSongList} disabled={true}>Delete this song list</button>
                <button onClick={this.removeSongFromList} disabled={this.state.selectedIndexes.length < 1}>Remove song from list</button>
                </React.Fragment>);

        return (
            <div className="SongLists EditorContainer">
                <div className="ListHeader">{currentList === undefined ? "Song Lists:" : "Song List " + currentList.name + ":"}</div>
                {backButton}
                {mainView}
                <div className="SongListsControls">
                    <input value={this.state.songListName} onChange={this.songListNameChange} />
                    {controls}
                </div>
            </div>  
        );
    }
});

export { SongLists }