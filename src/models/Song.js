import { extendObservable, action, computed } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'

export class Song {

    isLoaded = false;

    constructor(songName, songTitle) {
        extendObservable(this, {
            name: songName,
            title: songTitle,
            state: "unloaded", // "loading" / "loaded" / "error" / "unloaded"
            verses: [],
            order: [],
            get songName() {
                return this.title || this.name;
            },
            verseOrder: computed(this.verseOrder),
            loadSong: action(this.loadSong),
            addVerse: action(this.addVerse),
            addToOrder: action(this.addToOrder),
            removeFromOrder: action(this.removeFromOrder),
            reorder: action(this.reorder),
        });
    }

    addToOrder = (verseIndex) => {
        this.state = "uploading";
        this.order.push(verseIndex);
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

    removeFromOrder = (verseIndex) => {
        this.state = "uploading";
        this.order.splice(verseIndex, 1);
        API.updateOrder(this.order, this.name).then(() => {
            this.state = "loaded";
        });
    }

    verseOrder = () => {
        let verseOrder = [];

        if(this.state !== "loading" && this.state !== "unloaded") {
            this.order.forEach((verseId) => {
                if(verseId !== 'c') {
                    let verseNum = parseInt(verseId, 10);
                    verseOrder.push(this.verses[verseNum]);
                }
            });
        }

        return verseOrder;
    }

    loadSong = () => {
        if(!this.isLoaded) {
            this.state = "loading";
            API.fetchVerses(this.name).then((json) => {
                json.verses.forEach(verse => {
                    var newVerse = new Verse(verse.id, verse.text);
                    this.verses.push(newVerse);
                });
                this.order = json.order;
                this.state = "loaded";
                this.isLoaded = true;
            })
        }
    }
 
    addVerse = (text) => {
        this.state = "uploading";
        API.addVerse(text, this.name).then((verse) => {
            this.verses.push(new Verse(verse.id, verse.text));
            this.state = "loaded";
        });
    }

    removeVerse = (index) => {
        this.state = "uploading";
        var removedVerse = this.verses[index];
        this.verses.splice(index, 1);
        this.order = this.order.filter((verse, index) => {
            return verse.id !== removedVerse.id;
        })
        API.removeVerse(removedVerse, this.name).then((json) => {
            this.state = "loaded";
        });
    }
}