import mobx, { extendObservable, action } from "mobx";
import { Song } from './Song'
import * as API from '../store/api'

export class SongList {
    constructor(songName, songTitle) {
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
                let song = new Song(songJson.name, songJson.title);
                song.verses = songJson.verses;
                song.order = songJson.order;
                this.songs.push(song);
            });
        })
    }

    addSong = (song) => {
        this.state = "pending";
        this.songs.push(song);
        API.uploadSong(song.name).then(() => this.state = "done");
    }

    removeSong = (songName) => {
        this.state = "pending";
        this.songs = this.songs.filter((song) => {
            return song.name !== songName;
        });
        API.removeSong(songName).then(() => this.state = "done");
    }
}
