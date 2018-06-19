import { action, decorate, observable } from 'mobx';
import { Song } from './Song';
import { SongLibraryApi } from '../store/SongLibraryApi';

export type SongLibraryState = {
    currentSong: Song,
    currentVerse: Verse,
    currentList: SongListModel
}

export class SongLibraryModel {

    state = "done"; // "pending" / "done" / "error",

    songs: Song[] = [];
        
    constructor() {
        this.apiManager = new SongLibraryApi();
    }
    
    getAllSongs = async () => {
        return await this.apiManager.fetchSongs().then((json) => {
            if(json) {
                    json.forEach(songJson => {
                    this.songs.push(new Song(songJson.title, songJson._id));        
                });
            }
        });
    };
        
    addSong = (songTitle) => {
        this.state = 'pending';
        this.addingSong = true;
        this.apiManager.addSong(songTitle).then(
            song => {
                this.state = 'done';
                this.songs.push(new Song(song.title, song._id));        
            },
            error => {
                console.log(error);
                this.state = 'done';
            },
        );
    };
    
    removeSong = (songId: string) => {
        this.state = 'pending';
        this.songs = this.songs.filter((song) => {
            return song.id !== songId;
        });
        this.apiManager.removeSong(songId).then(() => this.state = 'done');
    };
}

decorate(SongLibraryModel, {
    addSong: action,
    state: observable,
    removeSong: action,
    getAllSongs: action,
    songs: observable
})
