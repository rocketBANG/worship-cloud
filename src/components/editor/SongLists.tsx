import * as React from 'react';
import { SongListLibrary } from '../../models/song-lists/SongListLibrary';
import { observer } from 'mobx-react';
import SongList from './SongList';
import { Song } from '../../models/songs/Song';
import { SongLibraryModel } from '../../models/songs/SongLibraryModel';
import { observable, IObservableValue, IObservableArray } from 'mobx';
import { SongListModel } from '../../models/song-lists/SongListModel';
import { SongApi } from '../../store/api';
import { IListContextMenu, ScrollListContext } from '../general/ScrollListContext';
import { IListItem } from '../general/IListItem';

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
    private songApi: SongApi;

    constructor(props) {
        super(props);

        this.songListLibrary.load();
        this.songApi = new SongApi();
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

    private onListClick = (names: IListItem[], indexes: number[]) => {
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
        this.songApi.downloadSongs(songIds).then(blob => {
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
            value: list.id,
            label: list.name,
            altLabel: list.name
        }));

        let mainView = <ScrollListContext contextMenu={this.contextMenu} onUpdate={this.onListClick} items={options} />;
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