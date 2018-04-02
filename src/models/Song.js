import { extendObservable, action, computed } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'

export class Song {

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
            isLoaded: false,
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
    };

    addToOrder = (verseId) => {
        this.state = "uploading";
        this.order = this.order.concat(verseId);
        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    };

    reorder = (from, to) => {
        this.state = "uploading";
        if(from.constructor === Array) {
            // If going down, for loop in reverse order
            from = to > 0 ? from.slice().reverse() : from;
            from.forEach(i => this.order.splice(i + to, 0, this.order.splice(i, 1)[0]));
        } else {
            this.order.splice(from + to, 0, this.order.splice(from, 1)[0]);
        }

        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    };

    removeFromOrder = (index) => {
        this.state = "uploading";
        if(index.constructor === Array) {
            this.order = this.order.filter((o, i) => index.indexOf(i) === -1);
            // this.order.splice(index[0], index.length);
        } else {
            this.order.splice(index, 1);
        }
        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    };

    completeVerses = () => {
        let verses = this.verses.values();
        return verses;
    };

    verseOrder = () => {
        let verseOrder = [];

        if(this.state !== "loading" && this.state !== "unloaded") {
            this.order.forEach((verseId) => {
                verseOrder.push(this.verses.get(verseId));
            });
        }

        return verseOrder;
    };
 
    addVerse = (text) => {
        this.state = "uploading";
        API.addVerse(text, this.name).then((verse) => {
            this.verses.set(verse.id, new Verse(verse.id, verse.text));
            this.state = "loaded";
        });
    };

    removeVerse = (verseIds) => {
        this.state = "uploading";
        this.order = this.order.filter((orderId, index) => {
            return verseIds.indexOf(orderId) === -1;
        });
        let promises = [];
        verseIds.forEach(v => { 
            this.verses.delete(v);
            promises.push(API.removeVerse(v, this.name));
        });
        promises.push(API.updateOrder(this.order, this.name));
        Promise.all(promises).then((json) => {
            this.state = "loaded";
        });    
    };

    setChorus = (verseId) => {
        this.state = "uploading";
        let selectedVerse = this.verses.get(verseId);
        selectedVerse.setChorus().then(() => this.state = "loaded");

    }
}