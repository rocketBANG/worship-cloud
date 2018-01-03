import { extendObservable, action, computed } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'
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
        this.currentVerse = this.completeVerses[this.verseIndex];
    }

    prevVerse = () => {
        this.verseIndex--;
        this.currentVerse = this.completeVerses[this.verseIndex];
    }

}