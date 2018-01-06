import { extendObservable, action } from 'mobx';
import { Song } from './Song'

export class DisplaySong extends Song {

    verseIndex = -1;

    constructor(songName, songTitle) {
        super(songName, songTitle);
        extendObservable(this, {
            currentVerse: undefined,
            nextVerse: action(this.nextVerse),
            prevVerse: action(this.prevVerse),
        });
    }

    nextVerse = () => {
        this.verseIndex++;
        this.currentVerse = this.verseOrder[this.verseIndex];
    }

    prevVerse = () => {
        this.verseIndex--;
        this.currentVerse = this.verseOrder[this.verseIndex];
    }

}