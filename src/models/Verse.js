import { observable, computed, extendObservable, action } from 'mobx';
import * as API from '../store/api'

export class Verse {
    constructor(verseId, text) {
        extendObservable(this, {
            id: verseId,
            text: text,
            state: "unloaded", // "loading" / "loaded" / "error" / "unloaded"
        });
    }

}