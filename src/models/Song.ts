import { action, computed, decorate, observable } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'

export class Song {

    public state = "unloaded"
    public chorus = undefined
    public order = []
    public verses = observable(new Map())
    public isLoaded = false
    public title = "";

    constructor(songTitle: string, public id: string) {
        this.title = songTitle;
    }

    public loadSong = () => {
        if(!this.isLoaded) {
            this.state = "loading";
            return API.fetchVerses(this.id).then((json) => {
                json.verses.forEach(verse => {
                    const newVerse = new Verse(verse._id, this.id, verse.text, verse.type);
                    this.verses.set(verse._id, newVerse);
                });

                this.order = json.order;
                this.state = "loaded";
                this.isLoaded = true;
            })
        }
        return Promise.resolve();
    };

    public addToOrder = (verseId) => {
        this.state = "uploading";
        this.order = this.order.concat(verseId);
        API.updateOrder(this.order, this.id).then(() => {
            this.state = "loaded";
        });
    };

    public reorder = (from, to) => {
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

    public removeFromOrder = (index) => {
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
        const verses = Array.from(this.verses.values());
        return verses;
    };

    get verseOrder() {
        const verseOrder = [];

        if(this.state !== "loading" && this.state !== "unloaded") {
            this.order.forEach((verseId) => {
                verseOrder.push(this.verses.get(verseId));
            });
        }

        return verseOrder;
    };
 
    public addVerse = (text) => {
        this.state = "uploading";
        API.addVerse(text, this.id).then((verse) => {
            this.verses.set(verse._id, new Verse(verse._id, this.id, verse.text));
            this.state = "loaded";
        });
    };

    public removeVerse = (verseIds) => {
        this.state = "uploading";
        this.order = this.order.filter((orderId, index) => {
            return verseIds.indexOf(orderId) === -1;
        });
        const promises = [];
        verseIds.forEach(v => { 
            this.verses.delete(v);
            promises.push(API.removeVerse(v, this.id));
        });
        promises.push(API.updateOrder(this.order, this.id));
        Promise.all(promises).then((json) => {
            this.state = "loaded";
        });    
    };

    public setTitle = (newTitle: string) => {
        this.state = "uploading";
        API.updateSongTitle(newTitle, this.id).then(() => {
            this.state = "loaded";
            this.title = newTitle;
        });
    }

    public setChorus = (verseId) => {
        this.state = "uploading";
        const selectedVerse = this.verses.get(verseId);
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
