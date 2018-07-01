import { observable, action, computed, autorun, decorate } from 'mobx';
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

        this.settingsModel.loadSettings();

        autorun(() => {if(song.isLoaded) this.nextVerse()});
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
        this.pageIndex = this.currentPages.length - 1;
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
            return this.prevVerse();
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
        const minLines = this.settingsModel.minimumPageLines;

        // let actualMinimum = weightedLines.reduce((accumulator, val, i) => 
        //     i >= weightedLines.length - minLines - 1 ? accumulator + val.lines : accumulator
        // , 0);

        let currentLine = 0;
        let pageI = 0;

        while(totalLines > 0) {
            this.currentPages.push("");

            let selectedLines = totalLines < maxLines ? totalLines : maxLines;

            // Check if there is enough lines left over for the next page
            if(totalLines - maxLines < minLines && totalLines - maxLines > 0) {
                selectedLines = totalLines - minLines;
            }
            let i = currentLine;
            let usedLines = 0;

            for(i; i < selectedLines + currentLine; i++) {
                let seperator = '\n';
                if(this.currentPages.length === 0) {
                    seperator = "";
                }

                // check there is space for the new lines on this page
                if(i + 1 <= selectedLines + currentLine - weightedLines[i].lines + 1) {
                    this.currentPages[pageI] += seperator + allLines[i];
                    // adjust index for 'lines' that are actually 2 in length
                    currentLine -= weightedLines[i].lines-1;
                    usedLines += weightedLines[i].lines;
                }
            }
            
            currentLine += usedLines;
            totalLines -= usedLines;
            pageI++;
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