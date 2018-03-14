import { extendObservable, action, computed } from 'mobx';
import { Song } from './Song'

const NUM_LINES = 6;

var arrayNumber = -1;
const arrayReducer = (accumulator, currentValue, currentIndex, array) => { 
    if(currentValue !== "") {
        if(currentIndex % NUM_LINES === 0) {
        arrayNumber++;
        accumulator[arrayNumber] = currentValue;
        } else {
        accumulator[arrayNumber] = accumulator[arrayNumber] + '\n' + currentValue;
        }
    }
    return accumulator;
}

export const BLACKED = 1;
export const WHITE = -1;

export class DisplaySong extends Song {

    verseIndex = -1;
    pageIndex = 0;
    currentPages = [];

    constructor(songName, songTitle) {
        super(songName, songTitle);
        extendObservable(this, {
            blanked: 0, // 1 = black, -1 = white
            currentVerse: undefined,
            currentPage: "",
            nextVerse: action(this.nextVerse),
            prevVerse: action(this.prevVerse),
            nextPage: action(this.nextPage),
            prevPage: action(this.prevPage),
            setVerse: action(this.setVerse),
            setupPages: action(this.setupPages),
            wordFontSize: "20px",
            titleFontSize: "40px",
            setWhite: action(this.setWhite),
            setBlack: action(this.setBlack),
            isBlanked: computed(() => this.blanked !== 0),
            backgroundColor: computed(this.getBackgroundColor)
        });
    }

    nextVerse = () => {
        if(this.verseIndex >= this.verseOrder.length - 1) {
            return;
        }
        this.verseIndex++;
        this.currentVerse = this.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
    };

    prevVerse = () => {
        if(this.verseIndex <= 0) {
            return;
        }
        this.verseIndex--;
        this.currentVerse = this.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
    }

    nextPage = () => {
        if(this.blanked !== 0) {
            this.blanked = 0;
            return;
        }

        if(this.currentPages === undefined) {
            this.setupPages();
        }
        if(this.pageIndex >= this.currentPages.length - 1) {
            this.nextVerse();
        } else {
            this.pageIndex++;
            this.currentPage = this.currentPages[this.pageIndex];
        }
    };

    prevPage = () => {
        if(this.blanked !== 0) {
            this.blanked = 0;
            return;
        }

        if(this.currentPages === undefined) {
            this.setupPages();
        }
        if(this.pageIndex <= 0) {
            this.prevVerse();
        } else {
            this.pageIndex--;
            this.currentPage = this.currentPages[this.pageIndex];
        }
    }

    setVerse = (index) => {
        this.verseIndex = index;
        this.currentVerse = this.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
    }

    setupPages = () => {
        arrayNumber = -1;
        this.currentPages = this.currentVerse.text.split('\n').reduce(arrayReducer, []);
        this.currentVerse.setNumberOfPages(this.currentPages.length);
    }

    getBackgroundColor = () => {
        if(this.blanked == BLACKED) {
            return "#000";
        } else if (this.blanked == WHITE) {
            return "#fff";
        } else {
            return "#000";
        }
    }

    setBlack = () => {
        if(this.blanked == BLACKED) {
            this.blanked = 0;
            return;
        }
        this.blanked = BLACKED;
    }

    setWhite = () => {
        if(this.blanked == WHITE) {
            this.blanked = 0;
            return;
        }
        this.blanked = WHITE;
    }

}