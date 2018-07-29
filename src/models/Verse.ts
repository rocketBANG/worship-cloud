import { action, computed, decorate, observable } from 'mobx';
import { ModelState } from './ModelState';
import { SongApi } from '../store/api';

export class Verse {
    public static findUniqueTitle(verse: Verse, otherVerses: Verse[]): string {
        if(otherVerses.length === 0) return verse.title;
        let otherLines: string[][] = otherVerses.map(v => v.text.split('\n'));
        let verseLines: string[] = verse.text.split('\n');

        for(let i = 0; i < verseLines.length; i++) {
            let found = true;
            for(let otherLine of otherLines) {
                if(otherLine[i] === verseLines[i]) found = false;
            }
            if(found) {
                return verse.title + ' (' + verseLines[i] + ')';
            }
        }
        return verse.title;
    }

    public state: ModelState = ModelState.LOADED // "loading" / "loaded" / "error" / "unloaded",
    public numPages = 1

    public id: string;
    public songId: string;
    public text: string;
    public type;

    private songApi: SongApi;

    constructor(verseId, songId, text = "", type = "verse") {
        this.id = verseId
        this.songId = songId
        this.text = text
        this.type = type
        this.songApi = new SongApi();
    }

    public updateText = (text) => {
        this.state = ModelState.SAVING;
        this.text = text;

        return this.songApi.updateVerse(text, this.songId, this.id).then((verse) => {
            this.state = ModelState.LOADED;
        });
    };

    get title() {
        return this.text.split("\n")[0];
    };

    public setChorus = () => {
        this.state = ModelState.SAVING;
        let type = this.type === "verse" ? "chorus" : "verse";
        this.type = type;
        return this.songApi.updateVerseType(this.id, this.songId, type).then(() => this.state = ModelState.LOADED);
    }

    public setNumberOfPages = (num) => {
        this.numPages = num;
    }
}

decorate(Verse, {
    id: observable,
    songId: observable,
    text: observable,
    type: observable,
    state: observable, // "loading" / "loaded" / "error" / "unloaded",
    numPages: observable,
    updateText: action,
    title: computed,
    setChorus: action,
    setNumberOfPages: action
})