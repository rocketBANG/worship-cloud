import * as React from 'react'
import { observer } from 'mobx-react'
import { SongLibraryModel } from '../models/SongLibraryModel';
import { SongListModel } from '../models/song-lists/SongListModel';
import { IObservableArray } from 'mobx';
import { Song } from '../models/Song';
import { ScrollList } from './general/ScrollList';
import { IListItem } from './general/IListItem';

interface IProps {
    library: SongLibraryModel,
    selectedSongs: IObservableArray<Song>,
    songList: SongListModel
};

const SongList = observer(class extends React.Component<IProps> {

    private onSongClick = (items: IListItem[], indexes: number[]) => {
        this.props.selectedSongs.clear();

        if(items.length < 1) {
            return;
        }
        // this.props.selectedSongs.push(...this.props.library.songs.filter(s => items.findIndex(i => i.value === s.id) > -1));
        this.props.selectedSongs.push(...items.map(item => this.props.library.songs.find(s => s.id === item.value)));
        this.props.selectedSongs[this.props.selectedSongs.length - 1].loadSong();
    };

    private onSongRemove = () => {
        this.props.selectedSongs.forEach(song => {
            this.props.songList.removeSong(song.id);
        })
    }

    private getSelectedIndexes = (): number[] => {
        return this.props.selectedSongs
            .map(s => this.props.songList.songIds.indexOf(s.id))
            .filter(index => index !== -1);
    }

    private onSongUp = () => {
        let selectedIndexes = this.getSelectedIndexes();
        selectedIndexes.sort();
        if(selectedIndexes[0] < 1) {
            return;
        }
        this.props.songList.reorder(selectedIndexes, -1);

    }

    private onSongDown = () => {
        let selectedIndexes = this.getSelectedIndexes();
        selectedIndexes.sort();
        let lastIndex = selectedIndexes[selectedIndexes.length - 1];
        if(lastIndex >= this.props.songList.songIds.length - 1) {
            return;
        }
        this.props.songList.reorder(selectedIndexes, +1);
    }
    
    public render() {
        let songs = this.props.songList.songIds.map(songId => this.props.library.songs.find(s => s.id === songId));
        songs = songs.filter(s => s !== undefined); // Remove missing songs

        const items = songs.map(song => ({
            value: song.id,
            label: song.title
        }));

        const selectedSongs = this.props.selectedSongs.map(s => songs.findIndex(song => song.id === s.id));
    
        return (
            <div className="SongList EditorContainer">
                <div className="ListHeader">Songs:</div>
                <ScrollList onUpdate={this.onSongClick} items={items} selected={selectedSongs} />
                <div className="ListControls">
                    <button onClick={this.onSongRemove}>Remove Song</button>
                    <button onClick={this.onSongUp}>up</button>
                    <button onClick={this.onSongDown}>down</button>
                </div>
            </div>
        )    
    }
});

export default SongList;