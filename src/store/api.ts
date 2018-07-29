import openSocket from 'socket.io-client';
import { Verse } from '../models/Verse';

export interface ISongApi {
    uploadSong: (songId: string, songVerses: Verse[], songOrder: string[]) => Promise<any>
    updateSong: (songId: string, updateData) => Promise<any>
    removeSong: (songId: string) => Promise<any>
    fetchSongs: () => Promise<any>
    fetchVerses: (songId: string) => Promise<any>
    addVerse: (text, songId: string) => Promise<any>
    removeVerse: (verseId, songId: string) => Promise<any>
    updateVerse: (text, songId: string, verseId) => Promise<any>
    updateVerseType: (verseId, songId: string, type) => Promise<any>
    updateOrder: (order, songId: string) => Promise<any>
    updateSongTitle: (title, songId: string) => Promise<any>
    getSettings: (username) => Promise<any>
    updateSettings: (username, settings) => Promise<any>
    addSongList: (listName, songIds: string[]) => Promise<any>
    removeSongList: (listId) => Promise<any>
    updateSongList: (listId, songIds: string[]) => Promise<any>
    getSongLists: () => Promise<any>
    downloadSongs: (songIds: string[]) => Promise<any>
}

export class SongApi implements ISongApi {

    private dbUrl = process.env.REACT_APP_API_URL;
    // const socket = openSocket(process.env.REACT_APP_SOCKET_URL);
    // socket.emit('subscribeEvent', 1000);

    public uploadSong = (songName, songVerses = [], songOrder = []) => {
        let song = {
            name: songName,
            verses: songVerses,
            order: songOrder
        };

        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/songs`, {
            credentials: 'include', 
            method: 'POST',
            headers: headers,
            body: JSON.stringify(song)
        }).then(
            response => {
                if(response.status === 200) {
                    return response.json();
                } else {                
                    return Promise.reject('Could not add song');
                }
            },

            error => console.log('An error occured.', error)
        )/*.then(json => {

        });*/
    };

    public updateSong = (songName, updateData) => {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/songs/` + songName, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),
            error => console.log('An error occured.', error)
        )
    };

    public removeSong = (songName) => {
        let headers = new Headers();

        return fetch(this.dbUrl + `/songs/` + songName, {
            credentials: 'include', 
            method: 'DELETE',
            headers: headers
        });
    };

    public fetchSongs = () => {
        let headers = new Headers();
        
        return fetch(this.dbUrl + `/songs`, {
            credentials: 'include', 
            method: 'GET',
            headers: headers,
        })
        .then(
            response => response.json(),
            error => console.log('An error occured.', error)
        );
    };

    public fetchVerses = (songId) => {
        let headers = new Headers();

        return fetch(this.dbUrl + `/songs/` + songId + `/verses`, {
            credentials: 'include', 
            method: 'GET',
            headers: headers,
        })
        .then(
            response => response.json(),
            error => console.log('An error occured.', error)
        );
    };

    public addVerse = (text, songId) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let verse = {
            text,
            type: "verse"
        };

        return fetch(this.dbUrl + `/songs/` + songId + `/verses`, {
            credentials: 'include', 
            method: 'POST',
            headers: headers,
            body: JSON.stringify(verse)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public removeVerse = (verseId, songId) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/songs/` + songId + `/verses/` + verseId, {
            credentials: 'include', 
            method: 'DELETE',
            headers: headers
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public updateVerse = (text, songId, verseId) => {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        let updateData = {
            text: text
        };

        return fetch(this.dbUrl + `/songs/` + songId + `/verses/` + verseId, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),
            error => console.log('An error occured.', error)
        )
    };

    public updateVerseType = (verseId, songId, type) => {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        let updateData = {
            type: type
        };

        return fetch(this.dbUrl + `/songs/` + songId + `/verses/` + verseId, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),
            error => console.log('An error occured.', error)
        )
    };

    public updateOrder = (order, songId) => {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        let updateData = {
            order: order
        };

        return fetch(this.dbUrl + `/songs/` + songId, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),
            error => console.log('An error occured.', error)
        )

    };

    public updateSongTitle = (title, songId) => {
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        let updateData = {
            title: title
        };

        return fetch(this.dbUrl + `/songs/` + songId, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),
            error => console.log('An error occured.', error)
        )

    };

    public getSettings = (username) => {
        return fetch(this.dbUrl + `/settings/` + username, {
            credentials: 'include', 
            method: 'GET',
        }).then(
            response => response.json().then(json => json[0].settings || {})
        )
    }

    public updateSettings = (username, settings) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/settings/` + username, {
            credentials: 'include', 
            method: 'PATCH',
            headers,
            body: JSON.stringify(settings)
        }).then(
            response => response.json()
        )
    }

    public addSongList = (listName, songIds?) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let list = {
            name: listName,
            songs: songIds
        }

        return fetch(this.dbUrl + `/songlists/`, {
            credentials: 'include', 
            method: 'POST',
            headers: headers,
            body: JSON.stringify(list)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public removeSongList = (listId) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/songlists/` + listId, {
            credentials: 'include', 
            method: 'DELETE',
            headers: headers
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public updateSongList = (listId, songIds) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let list = {
            songs: songIds
        }

        return fetch(this.dbUrl + `/songlists/` + listId, {
            credentials: 'include', 
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(list)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public getSongLists = () => {
        return fetch(this.dbUrl + `/songlists/`, {
            credentials: 'include', 
            method: 'GET'
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
        )
    };

    public downloadSongs = (songIds) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return fetch(this.dbUrl + `/songpptx/`, {
            credentials: 'include', 
            method: 'POST',
            headers,
            body: JSON.stringify(songIds)
        }).then(
            response => response.blob(),

            error => console.log('An error occured.', error)
        )
    };
}

function subscribeToSocket(cb) {
    // socket.on('newDataEvent', data => cb(data));
}
export { subscribeToSocket };
