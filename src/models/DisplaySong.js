import { extendObservable, action, computed, autorun } from 'mobx';
import { Song } from './Song'
import { SettingsModel } from './settings/SettingsModel';

export const BLACKED = 1;
export const WHITE = -1;

export class DisplaySong extends Song {

    settingsModel = SettingsModel.settingsModel

    constructor(songName, songTitle) {
        super(songName, songTitle);
        this.settingsModel.loadSettings();
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
            setWhite: action(this.setWhite),
            setBlack: action(this.setBlack),
            isBlanked: computed(() => this.blanked !== 0),
            backgroundColor: computed(this.getBackgroundColor),
            verseIndex: -1,
            currentPages: [],
            currentNumPages: computed(() => this.currentPages.length),
            pageIndex: 0,
            setDisplay: action(this.setDisplay),
            loadSong: action(this.loadSong)
        });

        autorun(() => {if(this.isLoaded) this.nextVerse()});
    }

    setDisplay = (display) => {
        this.display = display;
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
        this.pageIndex = this.currentPages.length - 1;
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
        if(this.display === undefined) {
            return;
        }
        let allLines = this.currentVerse.text.split('\n');
        allLines = allLines.filter(l => l !== "");
        this.currentPages = [];

        let weightedLines = this.display.measureLines(allLines);
        let totalLines = weightedLines.reduce((accumulator, val) => 
            accumulator + val.lines
        , 0);

        let maxLines = this.settingsModel.maximumPageLines;
        let minLines = this.settingsModel.minimumPageLines;

        let currentLine = 0;
        let pageI = 0;

        while(totalLines > 0) {
            let selectedLines = totalLines < maxLines ? totalLines : maxLines;

            // Check if there is enough lines left over for the next page
            if(totalLines - maxLines < minLines && totalLines - maxLines > 0) {
                selectedLines = totalLines - minLines;
            }

            for(let i = currentLine; i < selectedLines + currentLine; i++) {
                let seperator = '\n';
                if(this.currentPages.length - 1 < pageI) {
                    seperator = "";
                    this.currentPages.push("");
                }

                // adjust index for 'lines' that are actually 2 in length
                this.currentPages[pageI] += seperator + allLines[i];
                currentLine -= weightedLines[i].lines-1;
            }
            currentLine += selectedLines;
            totalLines -= selectedLines;
            pageI++;
        }

        this.currentVerse.setNumberOfPages(this.currentPages.length);
    }

    getBackgroundColor = () => {
        if(this.blanked === BLACKED) {
            return "#000";
        } else if (this.blanked === WHITE) {
            return "#fff";
        } else {
            return "#000";
        }
    }

    setBlack = () => {
        if(this.blanked === BLACKED) {
            this.blanked = 0;
            return;
        }
        this.blanked = BLACKED;
    }

    setWhite = () => {
        if(this.blanked === WHITE) {
            this.blanked = 0;
            return;
        }
        this.blanked = WHITE;
    }

}