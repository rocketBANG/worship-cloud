import { extendObservable, action } from 'mobx';
import * as API from '../../store/api';
import { SongListModel } from './SongListModel';

class SongListLibrary {
        
    constructor() {
        
        extendObservable(this, {
            addList: action(this.addList),
            lists: [],
            load: action(this.load),
        });
    }

    load = () => {
        API.getSongLists().then(lists => {
            lists.forEach(l => {
                this.lists.push(new SongListModel(l.id, l.name, l.songs));
            })
        });
    }

    addList = (name) => {
        API.addSongList(name).then(list => {
            this.lists.push(new SongListModel(list.id, list.name));
        });
    }
}

export {SongListLibrary}
