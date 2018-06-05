import { action, computed, decorate, observable } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'

export class Song {

    state = "unloaded"
    chorus = undefined
    order = []
    verses = observable(new Map())
    isLoaded = false
    id = "";
    title = "";

    constructor(songTitle: String, id: String) {
        this.id = id;
        this.title = songTitle;
    }

    loadSong = () => {
        if(!this.isLoaded) {
            this.state = "loading";
            return API.fetchVerses(this.id).then((json) => {
                json.verses.forEach(verse => {
                    var newVerse = new Verse(verse._id, this.id, verse.text, verse.type);
                    this.verses.set(verse._id, newVerse);
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
        API.updateOrder(this.order, this.id).then(() => {
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

        API.updateOrder(this.order, this.id).then(() => {
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
        API.updateOrder(this.order, this.id).then(() => {
            this.state = "loaded";
        });
    };

    get completeVerses() {
        let verses = Array.from(this.verses.values());
        console.log(verses);
        return verses;
    };

    get verseOrder() {
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
        API.addVerse(text, this.id).then((verse) => {
            this.verses.set(verse._id, new Verse(verse._id, this.id, verse.text));
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
            promises.push(API.removeVerse(v, this.id));
        });
        promises.push(API.updateOrder(this.order, this.id));
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

decorate(Song, {
    title: observable,
    id: observable,
    state : observable,
    chorus: observable, 
    order: observable,
    isLoaded: observable,
    completeVerses: computed,
    verseOrder: computed,
    loadSong: action,
    addVerse: action,
    addToOrder: action,
    removeFromOrder: action,
    reorder: action,
    setChorus: action,
})
