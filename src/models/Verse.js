import { action, computed, decorate, observable } from 'mobx';
import * as API from '../store/api'

export class Verse {
    state = "loaded" // "loading" / "loaded" / "error" / "unloaded",
    numPages = -1

    constructor(verseId, songId, text = "", type = "verse") {
        this.id = verseId
        this.songId = songId
        this.text = text
        this.type = type
    }

    updateText = (text) => {
        this.state = "uploading";
        this.text = text;

        API.updateVerse(text, this.songId, this.id).then((verse) => {
            this.state = "loaded";
        });
    };

    get title() {
        return this.text.split("\n")[0];
    };

    setChorus = () => {
        this.state = "uploading";
        let type = this.type === "verse" ? "chorus" : "verse";
        this.type = type;
        return API.updateVerseType(this.id, this.songId, type).then(() => this.state = "loaded");
    }

    setNumberOfPages = (num) => {
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