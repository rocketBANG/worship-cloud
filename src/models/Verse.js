import { extendObservable, action } from 'mobx';
import * as API from '../store/api'

export class Verse {
    constructor(verseId, text) {
        extendObservable(this, {
            id: verseId,
            text: text,
            state: "loaded", // "loading" / "loaded" / "error" / "unloaded",
            updateText: action(this.updateText),
        });
    }

    updateText = (text) => {
        this.state = "uploading";
        this.text = text;

        API.updateVerse(text, this.id).then((verse) => {
            this.state = "loaded";
        });
    }

}