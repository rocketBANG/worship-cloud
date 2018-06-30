import { action, computed, decorate, observable } from 'mobx';
import * as API from '../store/api'
import { ModelState } from './ModelState';

export class Verse {
    public state: ModelState = ModelState.LOADED // "loading" / "loaded" / "error" / "unloaded",
    public numPages = -1

    public id;
    public songId;
    public text;
    public type;

    constructor(verseId, songId, text = "", type = "verse") {
        this.id = verseId
        this.songId = songId
        this.text = text
        this.type = type
    }

    public updateText = (text) => {
        this.state = ModelState.SAVING;
        this.text = text;

        API.updateVerse(text, this.songId, this.id).then((verse) => {
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
        return API.updateVerseType(this.id, this.songId, type).then(() => this.state = ModelState.LOADED);
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
})