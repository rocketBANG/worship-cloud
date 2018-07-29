import { action, decorate, observable } from 'mobx';
import { SongApi } from '../../store/api';
import { SongListModel } from './SongListModel';

class SongListLibrary {

    public lists: SongListModel[] = [];
    private songApi: SongApi;

    constructor() {
        this.songApi = new SongApi();
    }

    public load = () => {
        this.songApi.getSongLists().then(lists => {
            lists.forEach(l => {
                this.lists.push(new SongListModel(l._id, l.name, l.songIds));
            })
        });
    }

    public addList = (name) => {
        this.songApi.addSongList(name).then(list => {
            this.lists.push(new SongListModel(list._id, list.name));
        });
    }

    public removeList = async (id) => {
        return await this.songApi.removeSongList(id).then(() => {
            this.lists = this.lists.filter(l => l.id !== id);
        });
    }
}

decorate(SongListLibrary, {
    addList: action,
    lists: observable,
    load: action,
})

export {SongListLibrary}
