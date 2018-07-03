import { observable, action, computed, autorun, decorate, trace } from 'mobx';
import { Song } from './Song'
import { SettingsModel } from './settings/SettingsModel';

export const BLACKED = 1;
export const WHITE = -1;

export class DisplaySong {

    // TODO change this to be a wrapper for a song
    // When a song is selected from the song library, add extra functionality to it using this class

    private settingsModel = SettingsModel.settingsModel
    private display;

    public blanked = 0; // 1 = black, -1 = white,
    public currentVerse = undefined;
    public currentPage = "";
    public pageIndex = 0;
    public verseIndex = -1;
    public currentPages = [];
    public id = '';
    public title = '';

    constructor(private song: Song) {
        if(song === undefined) return;
        this.title = song.title;
        this.id = song.id;

        if(!song.isLoaded) song.loadSong();

        this.settingsModel.loadSettings();
        let auto;
        auto = autorun(() => {if(song.isLoaded)  { this.nextVerse(); auto() }});
    }

    public setDisplay = (display) => {
        this.display = display;
    }

    public nextVerse = (): boolean => {
        if(this.verseIndex >= this.song.verseOrder.length - 1) {
            return false;
        }
        this.verseIndex++;
        this.currentVerse = this.song.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
        return true;
    };

    public prevVerse = (): boolean => {
        if(this.verseIndex <= 0) {
            return false;
        }
        this.verseIndex--;
        this.currentVerse = this.song.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
        return true;
    }

    public nextPage = (): boolean => {
        if(this.blanked !== 0) {
            this.blanked = 0;
            return true;
        }

        if(this.currentPages === undefined) {
            this.setupPages();
        }
        if(this.pageIndex >= this.currentPages.length - 1) {
            return this.nextVerse();
        } else {
            this.pageIndex++;
            this.currentPage = this.currentPages[this.pageIndex];
        }
        return true;
    };

    public prevPage = (): boolean => {
        if(this.blanked !== 0) {
            this.blanked = 0;
            return true;
        }

        if(this.currentPages === undefined) {
            this.setupPages();
        }
        if(this.pageIndex <= 0) {
            let changedVerse = this.prevVerse();
            if(changedVerse) {
                this.pageIndex = this.currentPages.length - 1;
                this.currentPage = this.currentPages[this.pageIndex];
            }
            return changedVerse;
        } else {
            this.pageIndex--;
            this.currentPage = this.currentPages[this.pageIndex];
        }
        return true;
    }

    public setVerse = (index) => {
        this.verseIndex = index;
        this.currentVerse = this.song.verseOrder[this.verseIndex];
        this.setupPages();
        this.pageIndex = 0;
        this.currentPage = this.currentPages[this.pageIndex];
    }

    public setupPages = () => {
        if(this.display === undefined) {
            return;
        }
        let allLines = this.currentVerse.text.split('\n');
        allLines = allLines.filter(l => l !== "");
        this.currentPages = [];

        const weightedLines = this.display.measureLines(allLines);
        let totalLines = weightedLines.reduce((accumulator, val) => 
            accumulator + val.lines
        , 0);

        const maxLines = this.settingsModel.maximumPageLines;

        let numMinPages = Math.ceil(totalLines / maxLines);
        let baseLinesPerPage = Math.floor(totalLines / numMinPages);
        let extraLines = totalLines % numMinPages;
        let extraLinesPerPage = Math.ceil(extraLines / numMinPages);

        let pageNumbers = [];
        // Set up ideal split
        for(let i = 0; i < numMinPages; i++) {
            let extraNumber = Math.min(extraLinesPerPage, extraLines);
            pageNumbers.push(baseLinesPerPage + extraNumber);
            extraLines -= extraNumber;
        }

        let actualPageNumbers = [];
        let index = 0;
        let pageI = 0;

        // Find realistic split
        while(pageI < weightedLines.length) {
            actualPageNumbers.push(0);
            while(actualPageNumbers[index] < pageNumbers[index]) {
                if(pageI > weightedLines.length - 1) break;
                actualPageNumbers[index] += weightedLines[pageI].lines;
                pageI++;
            }
            // Push overflow lines to the end
            if(actualPageNumbers[index] > pageNumbers[index] && index < pageNumbers.length - 1) {
                pageI--;
                actualPageNumbers[index] -= weightedLines[pageI].lines;
                pageNumbers[index + 1] += weightedLines[pageI].lines;
            }
            index++;
        }

        let lineI = 0;
        let seperator = '\n';
        // Create actual pages
        for(let pageLines of actualPageNumbers) {
            this.currentPages.push("");
            while(pageLines > 0) {
                this.currentPages[this.currentPages.length - 1] += seperator + weightedLines[lineI].text;
                pageLines -= weightedLines[lineI].lines;
                lineI++;
            }
        }

        this.currentVerse.setNumberOfPages(this.currentPages.length);
    }

    get backgroundColor() {
        if(this.blanked === BLACKED) {
            return "#000";
        } else if (this.blanked === WHITE) {
            return "#fff";
        } else {
            return "#000";
        }
    }

    public setBlack = () => {
        if(this.blanked === BLACKED) {
            this.blanked = 0;
            return;
        }
        this.blanked = BLACKED;
    }

    public setWhite = () => {
        if(this.blanked === WHITE) {
            this.blanked = 0;
            return;
        }
        this.blanked = WHITE;
    }

    get isBlanked() {
        return this.blanked !== 0;
    }

    get currentNumPages() {
        return this.currentPages.length;
    }

    get verseOrder() {
        return this.song.verseOrder;
    }

}

decorate(DisplaySong, {
    blanked: observable, // 1 = black, -1 = white,
    title: observable,
    currentVerse: observable,
    currentPage: observable,
    pageIndex: observable,
    verseIndex: observable,
    currentPages: observable,
    nextVerse: action,
    prevVerse: action,
    nextPage: action,
    prevPage: action,
    setVerse: action,
    setupPages: action,
    setWhite: action,
    setBlack: action,
    isBlanked: computed,
    backgroundColor: computed,
    currentNumPages: computed,
    verseOrder: computed,
    setDisplay: action
})