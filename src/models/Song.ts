import { action, computed, decorate, observable, trace } from 'mobx';
import { SongApi } from '../store/api'
import { Verse } from './Verse'
import { ModelState } from './ModelState';
import { NotLoadedError } from '../errors/NotLoadedError';

export class Song {

    public state: ModelState = ModelState.UNLOADED
    public order = []
    public verses = observable(new Map<string, Verse>())
    public isLoaded = false
    public title = "";
    private api: SongApi;

    private loadingPromise: Promise<any>;

    constructor(songTitle: string, public id: string) {
        this.title = songTitle;
        this.api = new SongApi();
    }

    public loadSong = async () => {
        if(!this.isLoaded) {
            if(this.loadingPromise !== undefined) {
                return await this.loadingPromise;
            }

            this.state = ModelState.LOADING;
            this.loadingPromise = this.api.fetchVerses(this.id).then((json) => {
                json.verses.forEach(verse => {
                    const newVerse = new Verse(verse._id, this.id, verse.text, verse.type);
                    this.verses.set(verse._id, newVerse);
                });
                this.order = json.order || [];
                this.state = ModelState.LOADED;
                this.isLoaded = true;
            }).catch(err => {
                this.isLoaded = false;
                this.state = ModelState.UNLOADED;
                this.loadingPromise = undefined;
            })
            return await this.loadingPromise;
        }
        return await Promise.resolve();
    };

    public addToOrder = async (verseId) => {
        this.state = ModelState.SAVING;
        this.order = this.order.concat(verseId);
        return await this.api.updateOrder(this.order, this.id).then(() => {
            this.state = ModelState.LOADED;
        });
    };

    public reorder = async (from: number[], to) => {
        this.state = ModelState.SAVING;
        // If going down, for loop in reverse order
        from = to > 0 ? from.slice().reverse() : from;
        from.forEach(i => this.order.splice(i + to, 0, this.order.splice(i, 1)[0]));

        return await this.api.updateOrder(this.order, this.id).then(() => {
            this.state = ModelState.LOADED;
        });
    };

    public removeFromOrder = (indexes: number[]) => {
        this.state = ModelState.SAVING;
        this.order = this.order.filter((o, i) => indexes.indexOf(i) === -1);
        this.api.updateOrder(this.order, this.id).then(() => {
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
        if(this.state === ModelState.UNLOADED) throw new NotLoadedError("Song wasn't loaded first");
        this.state = ModelState.SAVING;

        return this.api.addVerse(text, this.id).then((verse) => {
            let newVerse = new Verse(verse._id, this.id, verse.text);
            this.verses.set(verse._id, newVerse);
            this.state = ModelState.LOADED;
            return newVerse;
        });
    };

    public removeVerse = async (verseIds: string[]) => {
        this.state = ModelState.SAVING;
        this.order = this.order.filter((orderId, index) => {
            return verseIds.indexOf(orderId) === -1;
        });
        const promises = [];
        verseIds.forEach(v => { 
            this.verses.delete(v);
            promises.push(this.api.removeVerse(v, this.id));
        });
        promises.push(this.api.updateOrder(this.order, this.id));
        await Promise.all(promises).then((json) => {
            this.state = ModelState.LOADED;
        });    
    };

    public setTitle = (newTitle: string) => {
        this.state = ModelState.SAVING;
        this.api.updateSongTitle(newTitle, this.id).then(() => {
            this.state = ModelState.LOADED;
            this.title = newTitle;
        });
    }

}

decorate(Song, {
    title: observable,
    id: observable,
    state : observable,
    order: observable,
    isLoaded: observable,
    completeVerses: computed,
    verseOrder: computed,
    loadSong: action,
    addVerse: action,
    addToOrder: action,
    removeFromOrder: action,
    reorder: action,
    getUniqueVerseTitles: computed,
    removeVerse: action
})
