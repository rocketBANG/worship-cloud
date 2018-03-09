import { extendObservable, action } from 'mobx';
import { Song } from './Song'

var arrayNumber = -1;
const arrayReducer = (accumulator, currentValue, currentIndex, array) => { 
    if(currentValue !== "") {
        if(currentIndex % 4 === 0) {
        arrayNumber++;
        accumulator[arrayNumber] = currentValue;
        } else {
        accumulator[arrayNumber] = accumulator[arrayNumber] + '\n' + currentValue;
        }
    }
    return accumulator;
}      

export class DisplaySong extends Song {

    verseIndex = -1;
    pageIndex = 0;
    currentPages = [];

    constructor(songName, songTitle) {
        super(songName, songTitle);
        extendObservable(this, {
            currentVerse: undefined,
            currentPage: "",
            nextVerse: action(this.nextVerse),
            prevVerse: action(this.prevVerse),
            nextPage: action(this.nextPage),
            prevPage: action(this.prevPage),
            wordFontSize: "20px",
            titleFontSize: "40px"
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
        if(this.currentPages === undefined) {
            this.setupPages();
        }
        this.pageIndex++;
        if(this.pageIndex > this.currentPages.length - 1) {
            this.pageIndex = 0;
            this.nextVerse();
        }
        this.currentPage = this.currentPages[this.pageIndex];
    };

    prevPage = () => {
        if(this.currentPages === undefined) {
            this.setupPages();
        }
        this.pageIndex--;
        if(this.pageIndex < 0) {
            this.pageIndex = 0;
            this.prevVerse();
        }
        this.currentPage = this.currentPages[this.pageIndex];
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
    }

}