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
            chorus: undefined,
            order: [],
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
                    if(verse.type !== "chorus") {
                        var newVerse = new Verse(verse.id, verse.text, verse.type);
                        this.verses.push(newVerse);
                    } else {
                        this.chorus = new Verse(verse.id, verse.text, verse.type); 
                    }
                });

                this.order = json.order;
                this.state = "loaded";
                this.isLoaded = true;
            })
        }
        return Promise.resolve();
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

    completeVerses = () => {
        let verses = [];
        verses = verses.concat(this.verses.slice());

        if(this.chorus !== undefined) {
            verses.push(this.chorus);
        }

        return verses;
    }

    verseOrder = () => {
        let verseOrder = [];

        if(this.state !== "loading" && this.state !== "unloaded") {
            this.order.forEach((verseId) => {
                if(verseId !== 'c') {
                    let verseNum = parseInt(verseId, 10);
                    verseOrder.push(this.verses[verseNum]);
                } else {
                    verseOrder.push(this.chorus);
                }
            });
        }

        return verseOrder;
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

    setChorus = (verseIndex) => {
        this.state = "uploading";
        let verseText = this.verses[verseIndex].text;

        API.addChorus(verseText, this.name).then((verse) => {
            let chorus = new Verse(verse.id, verse.text, verse.type);
            this.chorus = chorus;

            this.order = this.order.map((orderChar) => {
                if(orderChar == verseIndex) {
                    return "c";
                } else {
                    return orderChar;
                }
            });
            this.removeVerse(verseIndex);

            API.updateOrder(this.order, this.name).then(() => {
                this.state = "loaded";
            });

        });

    }
}