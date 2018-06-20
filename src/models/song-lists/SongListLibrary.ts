import { action, decorate, observable } from 'mobx';
import * as API from '../../store/api';
import { SongListModel } from './SongListModel';

class SongListLibrary {

    public lists: SongListModel[] = [];
        
    public load = () => {
        API.getSongLists().then(lists => {
            lists.forEach(l => {
                this.lists.push(new SongListModel(l._id, l.name, l.songIds));
            })
        });
    }

    public addList = (name) => {
        API.addSongList(name).then(list => {
            this.lists.push(new SongListModel(list._id, list.name));
        });
    }
}

decorate(SongListLibrary, {
    addList: action,
    lists: observable,
    load: action,
})

export {SongListLibrary}
