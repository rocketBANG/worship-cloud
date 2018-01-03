import { extendObservable, action, computed } from 'mobx';
import * as API from '../store/api'

export class Verse {
    constructor(verseId, text = "", type = "verse") {
        extendObservable(this, {
            id: verseId,
            text: text,
            type: type,
            state: "loaded", // "loading" / "loaded" / "error" / "unloaded",
            updateText: action(this.updateText),
            title: computed(this.getTitle),
        });
    }

    updateText = (text) => {
        this.state = "uploading";
        this.text = text;

        API.updateVerse(text, this.id).then((verse) => {
            this.state = "loaded";
        });
    }

    getTitle = () => {
        return this.text.split("\n")[0];
    }

}