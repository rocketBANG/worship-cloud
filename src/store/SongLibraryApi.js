import { databaseURL } from "./api";

class SongLibraryApi {
    fetchSongs = () => {
        let headers = new Headers();
        
        return fetch(databaseURL + `/songs`, {
            method: 'GET',
            headers: headers,
        })
        .then(
            response => response.json(),
            error => console.log('An error occured.', error)
        );
    };

    addSong = (songTitle) => {
        let song = {
            title: songTitle,
            verses: [],
            order: []
        };
    
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');
    
        return fetch(databaseURL + `/songs`, {
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
        )
    };

    removeSong = (songId) => {
        let headers = new Headers();
    
        return fetch(databaseURL + `/songs/` + songId, {
            method: 'DELETE',
            headers: headers
        });
    };
}

export { SongLibraryApi } 