import { action, decorate, observable, computed } from 'mobx';
import { Song } from './Song';
// import { subscribeToSocket } from '../store/api';
import { SongLibraryApi } from '../store/SongLibraryApi';
import { SongManager } from '../services/SongManager';

export class SongLibraryModel {

    // TODO Change this to only be for entire library
    // MOve controls out of SongList.js and have it only as a list which can take the entire library or a song list (filtered library)
    // Controls interact directly with the songLibrary or the songList models

    state = "done"; // "pending" / "done" / "error",
        
    constructor(apiManager = new SongLibraryApi(), displaySongs: string[] = undefined) {
        this.apiManager = apiManager;
        this.displaySongs = displaySongs;
        this.songManager = SongManager.getManager();
    }

    get songs(): Song[] {
        let returnedSongs = (this.displaySongs !== undefined && this.songManager.songs.filter(s => this.displaySongs.indexOf(s.id) > -1))
            || this.songManager.songs
            || [];
        return returnedSongs;
    }
    
    loadSongs = () => {
        this.apiManager.fetchSongs().then((json) => {
            json && json.forEach(songJson => {
                this.songManager.addSong(songJson.title, songJson._id);
            });
        });
    };
        
    addSong = (songTitle) => {
        this.state = 'pending';
        this.addingSong = true;
        this.apiManager.addSong(songTitle).then(
            song => {
                this.state = 'done';
                this.songManager.addSong(song.title, song._id);
            },
            error => {
                console.log(error);
                this.state = 'done';
            },
        );
    };
    
    removeSong = (songId: string) => {
        this.state = 'pending';
        this.songManager.removeSong(songId);
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
