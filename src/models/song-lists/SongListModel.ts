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

    public reorder = async (from: number[], to: number) => {
        // If going down, for loop in reverse order
        from = to > 0 ? from.slice().reverse() : from;

        from.forEach(i => this.songIds.splice(i + to, 0, this.songIds.splice(i, 1)[0]));

        return await this.api.updateSongList(this.songIds);
    };

    public async delete() {
        console.log('not implemented delete');
    }

}

decorate(SongListModel, {
    name: observable,
    songIds: observable
})

