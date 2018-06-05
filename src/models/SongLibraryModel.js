import { action, decorate, observable, computed } from 'mobx';
import { Song } from './Song';
// import { subscribeToSocket } from '../store/api';
import { SongLibraryApi } from '../store/SongLibraryApi';
import { SongManager } from '../services/SongManager';

export class SongLibraryModel {

    state = "done"; // "pending" / "done" / "error",
        
    constructor(apiManager = new SongLibraryApi(), classType = Song) {
        this.classType = classType;
        this.apiManager = apiManager;

        this.songManager = SongManager.getManager();
    }

    get songs(): Song[] {
        return this.songManager.songs || [];
    }
    
    loadSongs = () => {
        this.apiManager.fetchSongs().then((json) => {
            json && json.forEach(songJson => {
                this.songManager.addSong(songJson.title, songJson._id);
                // let song = new this.classType(songJson.title, songJson._id);
                // this.songs.push(song);
            });
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
    songs: computed,
    addSong: action,
    state: observable,
    removeSong: action,
    loadSongs: action,
})
