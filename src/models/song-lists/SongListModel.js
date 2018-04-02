import { extendObservable, action } from 'mobx';
import * as API from '../../store/api';
import { Song } from '../Song';

export class SongListModel {
        
    constructor(id, name, songs = []) {

        this.id = id;
        
        extendObservable(this, {
            songs: [],
            addSong: action(this.addSong),
            removeSongs: action(this.removeSongs),
            loadList: action(this.loadList),
            name: name
        });
    }

    loadList = () => {
        API.loadSongList(this.id).then(list => {
            this.songs = list.songs.map(song => new Song(song));
        });
    }

    addSong = (newSong) => {
        let newSongs = this.songs.concat([newSong]).map(s => s.name);
        API.updateSongList(this.id, newSongs).then(list => {
            this.songs = list.songs.map(song => new Song(song));
        });
    }

    removeSongs = (removeSongIndexes) => {
        let newSongs = this.songs.filter((s, i) => removeSongIndexes.indexOf(i) === -1).map(s => s.name);
        API.updateSongList(this.id, newSongs).then(list => {
            this.songs = list.songs.map(song => new Song(song));
        });
    }


}
