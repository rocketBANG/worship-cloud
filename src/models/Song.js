import { extendObservable, action, computed, observable } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'

export class Song {

    isLoaded = false;

    constructor(songName, songTitle) {

        extendObservable(this, {
            name: songName,
            title: songTitle,
            state: "unloaded", // "loading" / "loaded" / "error" / "unloaded"
            chorus: undefined,
            order: [],
            verses: new Map(),
            get songName() {
                return this.title || this.name;
            },
            completeVerses: computed(this.completeVerses),
            verseOrder: computed(this.verseOrder),
            loadSong: action(this.loadSong),
            addVerse: action(this.addVerse),
            addToOrder: action(this.addToOrder),
            removeFromOrder: action(this.removeFromOrder),
            reorder: action(this.reorder),
            setChorus: action(this.setChorus),
        });
    }

    loadSong = () => {
        if(!this.isLoaded) {
            this.state = "loading";
            return API.fetchVerses(this.name).then((json) => {
                json.verses.forEach(verse => {
                    var newVerse = new Verse(verse.id, verse.text, verse.type);
                    this.verses.set(verse.id, newVerse);
                });

                this.order = json.order;
                this.state = "loaded";
                this.isLoaded = true;
            })
        }
        return Promise.resolve();
    }

    addToOrder = (verseId) => {
        this.state = "uploading";
        this.order.push(verseId);
        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    }

    reorder = (from, to) => {
        this.state = "uploading";
        this.order.splice(to, 0, this.order.splice(from, 1)[0]);

        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    }

    removeFromOrder = (index) => {
        this.state = "uploading";
        this.order.splice(index, 1);
        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    }

    completeVerses = () => {
        let verses = this.verses.values();
        return verses;
    }

    verseOrder = () => {
        let verseOrder = [];

        if(this.state !== "loading" && this.state !== "unloaded") {
            this.order.forEach((verseId) => {
                verseOrder.push(this.verses.get(verseId));
            });
        }

        return verseOrder;
    }
 
    addVerse = (text) => {
        this.state = "uploading";
        API.addVerse(text, this.name).then((verse) => {
            this.verses.set(verse.id, new Verse(verse.id, verse.text));
            this.state = "loaded";
        });
    }

    removeVerse = (verseId) => {
        this.state = "uploading";
        this.order = this.order.filter((orderId, index) => {
            return orderId !== verseId;
        });
        this.verses.delete(verseId);
        API.removeVerse(verseId, this.name).then((json) => {
            this.state = "loaded";
        });
        API.updateOrder(this.order, this.name);
    }

    setChorus = (verseId) => {
        this.state = "uploading";
        let selectedVerse = this.verses.get(verseId);
        selectedVerse.setChorus().then(() => this.state = "loaded");

    }
}