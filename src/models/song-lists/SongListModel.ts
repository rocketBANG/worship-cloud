import { decorate, observable } from "mobx";
import { SongListApi } from "../../store/SongListApi";

export class SongListModel {

    private api: SongListApi;
    
    constructor(public id: string, public name: string, public songIds: string[] = []) {
        this.api = new SongListApi(id);
    }

    public async addSong(id: string) {
        await this.api.updateSongList([...this.songIds, id]);
        this.songIds.push(id);
    }

    public async removeSong(id: string) {
        const tmpIds = this.songIds.filter(s => s !== id);
        await this.api.updateSongList(tmpIds);
        this.songIds = tmpIds;
    }

    public async delete() {
        console.log('not implemented delete');
    }

}

decorate(SongListModel, {
    name: observable,
    songIds: observable
})

