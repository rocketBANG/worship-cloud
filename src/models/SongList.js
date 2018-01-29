import { extendObservable, action } from "mobx";
import { Song } from './Song'
import * as API from '../store/api'

export class SongList {
    constructor(classType = Song) {
        this.classType = classType;

        extendObservable(this, {
            songs: [],
            addSong: action(this.addSong),
            state: "done", // "pending" / "done" / "error",
            removeSong: action(this.removeSong),
            loadSongs: action(this.loadSongs)
        });
    }

    loadSongs = () => {
        API.fetchSongs().then((json) => {
            json.forEach(songJson => {
                let song = new this.classType(songJson.name, songJson.title);
                this.songs.push(song);
            });
        })
    }

    addSong = (song) => {
        this.state = "pending";
        API.uploadSong(song.name).then(body => { this.state = "done"; this.songs.push(song); }, error => {this.state = "done"});
    }

    removeSong = (songName) => {
        this.state = "pending";
        this.songs = this.songs.filter((song) => {
            return song.name !== songName;
        });
        API.removeSong(songName).then(() => this.state = "done");
    }
}
