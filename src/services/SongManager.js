import { Song } from "../models/Song";
import { observable, decorate } from "mobx";

export class SongManager {
    songManager: SongManager;

    songs: Song[] = [];

    static getManager = (): SongManager => {
        if(this.songManager === undefined) {
            this.songManager = new SongManager();
        }
        return this.songManager;
    }

    addSong = (songTitle: string, songId: string): Song => {
        let song = this.getSong(songId);
        if(song !== undefined) {
            song.title = songTitle;
            return song;
        }

        song = new Song(songTitle, songId);
        this.songs.push(song);
        return song;
    }

    getSong = (songId: string): Song => {
        return this.songs.find((s) => s.id === songId);
    }
}

decorate(SongManager, {
    songs: observable
})
