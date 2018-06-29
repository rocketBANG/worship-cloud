import * as React from 'react';
import './SongLists.css';
import { SongListLibrary } from '../../models/song-lists/SongListLibrary';
import { observer } from 'mobx-react';
import { List, IListContextMenu } from '../List';
import SongList from '../SongList';
import * as API from '../../store/api';
import { Song } from '../../models/Song';
import { SongLibraryModel } from '../../models/SongLibraryModel';
import { observable, IObservableValue, IObservableArray } from 'mobx';
import { SongListModel } from '../../models/song-lists/SongListModel';

interface IProps {
    library: SongLibraryModel,
    currentList: IObservableValue<SongListModel>,
    selectedSongs: IObservableArray<Song>,
    hideControls?: boolean,
}

interface IState {
    songListName: string,
    selectedIndexes: number[]
}

const SongLists = observer(class extends React.Component<IProps, IState> {
    public state = {
        songListName: "",
        selectedIndexes: [],
    }

    private songListLibrary = new SongListLibrary();

    constructor(props) {
        super(props);

        this.songListLibrary.load();
    }

    private songListNameChange = (e) => {
        
        this.setState({songListName: e.target.value});
    }

    private onAddSongList = () => {
        const {songListName} = this.state;

        if(songListName === "") {
            return;
        }

        this.songListLibrary.addList(songListName);
    }

    private onListClick = (names, indexes) => {
        if(indexes.length < 1) {
            return;
        }
        const selectedList = this.songListLibrary.lists[indexes[0]];
        this.props.currentList.set(selectedList);
    }

    private deleteSongList = (index : number) => {
        this.songListLibrary.removeList(this.songListLibrary.lists[index].id);
    }

    private deleteCurrentSongList = () => {
        const {currentList} = this.props;
        this.songListLibrary.removeList(currentList.get().id);
        this.onBackClick();
    }

    private downloadSongList = () => {
        const songIds = this.props.currentList.get().songIds;
        API.downloadSongs(songIds).then(blob => {
            const a = document.createElement("a");
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = this.props.currentList.get().name + ".pptx";
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    private onBackClick = () => {
        this.props.currentList.set(undefined);
    }

    private contextMenu: IListContextMenu[] = [
        { text: 'Delete', onSelect: this.deleteSongList },
    ]

    public render() {
        const currentList = this.props.currentList.get();
        const options = this.songListLibrary.lists.map(list => ({
            id: list.id,
            text: list.name,
            altText: list.name
        }));

        let mainView = <List contextMenu={this.contextMenu} onUpdate={this.onListClick} options={options} />;
        if(currentList !== undefined) {
            mainView = <SongList songList={currentList} selectedSongs={this.props.selectedSongs} library={this.props.library}/>;
        }

        const backButton = currentList !== undefined ? <button onClick={this.onBackClick}>{"<-"}</button> : "";

        let controls;
        if(currentList === undefined && !this.props.hideControls) {
            controls = (<React.Fragment>
                <input value={this.state.songListName} onChange={this.songListNameChange} />
                <button onClick={this.onAddSongList}>Add song list</button>
                </React.Fragment>);
        } else if(!this.props.hideControls){
            controls = (<React.Fragment>
                <button onClick={this.deleteCurrentSongList}>Delete this song list</button>
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