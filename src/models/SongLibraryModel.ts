import { action, decorate, observable, IObservableArray } from 'mobx';
import { Song } from './Song';
import { SongLibraryApi } from '../store/SongLibraryApi';
import { Verse } from './Verse';
import { SongListModel } from './song-lists/SongListModel';

export interface ISongLibraryState {
    currentSong: Song,
    currentVerse: Verse,
    currentList: SongListModel
}

export class SongLibraryModel {

    public state = "done"; // "pending" / "done" / "error",

    public songs: Song[] = [];

    private addingSong = false;
    private apiManager: SongLibraryApi
        
    constructor() {
        this.apiManager = new SongLibraryApi();
    }
    
    public getAllSongs = async () => {
        return await this.apiManager.fetchSongs().then((json) => {
            if(json) {
                    json.forEach(songJson => {
                    this.songs.push(new Song(songJson.title, songJson._id));        
                });
            }
        });
    };
        
    public addSong = async (songTitle): Promise<Song> => {
        this.state = 'pending';
        this.addingSong = true;
        return this.apiManager.addSong(songTitle).then(
            song => {
                this.state = 'done';
                const newSong = new Song(song.title, song._id);
                this.songs.push(newSong);   
                return newSong;     
            },
            error => {
                console.log(error);
                this.state = 'done';
                return undefined;
            },
        );
    };
    
    public removeSong = (songId: string) => {
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
