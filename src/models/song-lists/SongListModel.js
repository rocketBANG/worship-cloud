import { decorate, observable } from "mobx";
import { SongListApi } from "../../store/SongListApi";

export class SongListModel {
    
    constructor(id: string, name: string, songIds: string[] = []) {

        this.id = id;
        this.name = name;
        this.songIds = songIds;
        this.api = new SongListApi(this.id);
    }

    async addSong(id: string) {
        await this.api.updateSongList([...this.songIds, id]);
        this.songIds.push(id);
    }

    async removeSong(id: string) {
        let tmpIds = this.songIds.filter(s => s !== id);
        await this.api.updateSongList(tmpIds);
        this.songIds = tmpIds;
    }

}

decorate(SongListModel, {
    songIds: observable,
    name: observable
})

