import { action, computed, decorate, observable, trace } from 'mobx';
import * as API from '../store/api'
import { Verse } from './Verse'
import { ModelState } from './ModelState';

export class Song {

    public state: ModelState = ModelState.UNLOADED
    public chorus = undefined
    public order = []
    public verses = observable(new Map<string, Verse>())
    public isLoaded = false
    public title = "";
    private isLoading = false;

    constructor(songTitle: string, public id: string) {
        this.title = songTitle;
    }

    public loadSong = async () => {
        if(!this.isLoading) {
            this.isLoading = true;

            this.state = ModelState.LOADING;
            return await API.fetchVerses(this.id).then((json) => {
                json.verses.forEach(verse => {
                    const newVerse = new Verse(verse._id, this.id, verse.text, verse.type);
                    this.verses.set(verse._id, newVerse);
                });
                this.order = json.order;
                this.state = ModelState.LOADED;
                this.isLoaded = true;
            })
        }
        return await Promise.resolve();
    };

    public addToOrder = (verseId) => {
        this.state = ModelState.SAVING;
        this.order = this.order.concat(verseId);
        API.updateOrder(this.order, this.id).then(() => {
            this.state = ModelState.LOADED;
        });
    };

    public reorder = (from, to) => {
        this.state = ModelState.SAVING;
        if(from.constructor === Array) {
            // If going down, for loop in reverse order
            from = to > 0 ? from.slice().reverse() : from;
            from.forEach(i => this.order.splice(i + to, 0, this.order.splice(i, 1)[0]));
        } else {
            this.order.splice(from + to, 0, this.order.splice(from, 1)[0]);
        }

        API.updateOrder(this.order, this.id).then(() => {
            this.state = ModelState.LOADED;
        });
    };

    public removeFromOrder = (index) => {
        this.state = ModelState.SAVING;
        if(index.constructor === Array) {
            this.order = this.order.filter((o, i) => index.indexOf(i) === -1);
            // this.order.splice(index[0], index.length);
        } else {
            this.order.splice(index, 1);
        }
        API.updateOrder(this.order, this.id).then(() => {
            this.state = ModelState.LOADED;
        });
    };

    get completeVerses() {
        const verses = Array.from(this.verses.values());
        return verses;
    };

    get verseOrder(): Verse[] {

        if(this.state === ModelState.LOADING || this.state === ModelState.UNLOADED) {
            return [];
        }

        let verseOrder: Verse[] = [];

        this.order.forEach((verseId) => {
            verseOrder.push(this.verses.get(verseId));
        });

        return verseOrder;
    };

    get getUniqueVerseTitles(): Array<{verseId: string, title: string}> {
        if(this.state === ModelState.LOADING || this.state === ModelState.UNLOADED) {
            return [];
        }

        let verseOrder: Verse[] = [];
        let verses = Array.from(this.verses.values());

        let verseAndTitle = verses.map(v => ({verse: v, title: v.title}));
        verseAndTitle.sort((a, b) => {
            if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
            if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
            return 0;
        });
        for(let i = 0; i < verseAndTitle.length - 1; i++) {
            let matching = [];
            let first = verseAndTitle[i];
            while(i < verseAndTitle.length - 1 && verseAndTitle[i].title === verseAndTitle[i + 1].title) {
                matching.push(verseAndTitle[i + 1]);
                i++;
            }
            first.title = Verse.findUniqueTitle(first.verse, matching.map(m => m.verse));
            matching.forEach(m => 
                m.title = Verse.findUniqueTitle(
                    m.verse, 
                    [first.verse, ...matching.filter(match => match !== m).map(match => match.verse)]
                ));
        }
        return verseAndTitle.map(o => ({verseId: o.verse.id, title: o.title}));
    }
 
    public addVerse = async (text): Promise<Verse> => {
        this.state = ModelState.SAVING;
        return API.addVerse(text, this.id).then((verse) => {
            let newVerse = new Verse(verse._id, this.id, verse.text);
            this.verses.set(verse._id, newVerse);
            this.state = ModelState.LOADED;
            return newVerse;
        });
    };

    public removeVerse = (verseIds) => {
        this.state = ModelState.SAVING;
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
            this.state = ModelState.LOADED;
        });    
    };

    public setTitle = (newTitle: string) => {
        this.state = ModelState.SAVING;
        API.updateSongTitle(newTitle, this.id).then(() => {
            this.state = ModelState.LOADED;
            this.title = newTitle;
        });
    }

    public setChorus = (verseId: string) => {
        this.state = ModelState.SAVING;
        const selectedVerse = this.verses.get(verseId);
        selectedVerse.setChorus().then(() => this.state = ModelState.LOADED);

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
    getUniqueVerseTitles: computed
})
