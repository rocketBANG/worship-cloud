import { observable, computed, extendObservable, action } from 'mobx';

export class Song {
    constructor(songName, songTitle) {
        extendObservable(this, {
            name: songName,
            title: songTitle,
            state: "unloaded", // "loading" / "loaded" / "error" / "unloaded"
            verses: [],
            order: [],
            get songName() {
                return this.title || this.name;
            },
            loadSong: action(this.loadSong)
        });
    }

    loadSong = () => {
        this.state = "pending";
    }
}