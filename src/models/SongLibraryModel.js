import { extendObservable, action } from 'mobx';
import { Song } from './Song';
import { subscribeToSocket } from '../store/api';
import { SongLibraryApi } from '../store/SongLibraryApi';

export class SongLibraryModel {
    
    addingSong = false;
    
    constructor(apiManager = new SongLibraryApi(), classType = Song) {
        this.classType = classType;
        this.apiManager = apiManager;

        extendObservable(this, {
            songs: [],
            addSong: action(this.addSong),
            state: 'done', // "pending" / "done" / "error",
            removeSong: action(this.removeSong),
            loadSongs: action(this.loadSongs),
        });
    }
    
    loadSongs = () => {
        this.apiManager.fetchSongs().then((json) => {
            json.forEach(songJson => {
                let song = new this.classType(songJson.name, songJson.title);
                this.songs.push(song);
            });
        });
        
        subscribeToSocket(this.onSocketAdd);
        
    };
    
    onSocketAdd = (data) => {
        if(this.state !== 'pending') {
            if(data.action === 'createSong') {
                this.songs.push(new this.classType(data.data.name));
            }
            else if(data.action === 'removeSong') {
                let i = this.songs.findIndex(s => s.name === data.data.name);
                if(i !== -1) {
                    this.songs.splice(i,  1);
                }
            }
        }
    };
    
    addSong = (song) => {
        this.state = 'pending';
        this.addingSong = true;
        
        this.apiManager.addSong(song.name).then(
            body => {
                this.state = 'done';
                this.songs.push(song);
                this.addingSong = false;
            },
            error => {
                this.state = 'done';
                this.addingSong = false;
            },
        );
    };
    
    removeSong = (songName) => {
        this.state = 'pending';
        this.songs = this.songs.filter((song) => {
            return song.name !== songName;
        });
        this.apiManager.removeSong(songName).then(() => this.state = 'done');
    };
}
