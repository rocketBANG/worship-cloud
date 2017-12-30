import { extendObservable, action } from 'mobx';
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
            loadSong: action(this.loadSong),
            addVerse: action(this.addVerse),
        });
    }

    loadSong = () => {
        if(!this.isLoaded) {
            this.state = "loading";
            API.fetchVerses(this.name).then((json) => {
                json.verses.forEach(verse => {
                    var newVerse = new Verse(verse.id, verse.text);
                    this.verses.push(newVerse);
                });
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