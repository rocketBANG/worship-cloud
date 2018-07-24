import { databaseURL } from "./api";

class SongListApi {
    isLoaded = false;
    songs = undefined;
    
    constructor(listId) {
        this.listId = listId;
    }

    load = () => {
        let headers = new Headers();

        if(this.isLoaded) {
            return Promise.resolve();
        }
        let promise = fetch(databaseURL + `/songlists/` + this.listId, {
		credentials: 'include', 
            method: 'GET',
            headers: headers,
        })
        .then(
            response => response.json(),
            error => console.log('An error occured.', error)
        ).then(list => this.songs = list.songs)
        .then(() => this.isLoaded = true);

        return promise;
    }

    fetchSongs = () => {
        let headers = new Headers();
        
        return fetch(databaseURL + `/songlists/` + this.listId, {
		credentials: 'include', 
            method: 'GET',
            headers: headers,
        })
        .then(
            response => response.json(),
            error => console.log('An error occured.', error)
        ).then(response => response.songs);
    };

    addSong = async (song) => {
        if(!this.isLoaded) await this.load();
        this.songs = this.songs || [];
        return this.updateSongList([...this.songs, song.id]).then(response => {
            this.songs = [...this.songs, song];
            console.log(this.songs);
            return {title: song.title, _id: song.id};
        });
    };

    updateSongList(songs) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let list = {
            songs
        }
    
        return fetch(databaseURL + `/songlists/` + this.listId, {
		credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(list)
        }).then(
            response => response.json(),
    
            error => console.log('An error occured.', error)
        )

    }

    removeSong = async (songId) => {
        if(!this.isLoaded) await this.load();
        return this.updateSongList(this.songs.filter(s => s !== songId)).then(response => {
            this.songs = this.songs.filter(s => s !== songId);
            return response;
        });
        
    };
}

export { SongListApi } 