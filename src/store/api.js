import openSocket from 'socket.io-client';

export const databaseURL = process.env.REACT_APP_API_URL;
const socket = openSocket(process.env.REACT_APP_SOCKET_URL);
socket.emit('subscribeEvent', 1000);

export const uploadSong = (songName, songVerses = [], songOrder = []) => {
    let song = {
        name: songName,
        verses: songVerses,
        order: songOrder
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
    )/*.then(json => {

    });*/
};

export const updateSong = (songName, updateData) => {
    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/songs/` + songName, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData)
    }).then(
        response => response.json(),
        error => console.log('An error occured.', error)
    )
};

export const removeSong = (songName) => {
    let headers = new Headers();

    return fetch(databaseURL + `/songs/` + songName, {
        method: 'DELETE',
        headers: headers
    });
};

export const fetchSongs = () => {
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

export const fetchVerses = (songName) => {
    let headers = new Headers();

    return fetch(databaseURL + `/songs/` + songName + `/verses`, {
        method: 'GET',
        headers: headers,
    })
    .then(
        response => response.json(),
        error => console.log('An error occured.', error)
    );
};

export const addChorus = (text, songName) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let verse = {
        text,
        songName: songName,
        type: "chorus"
    };

    return fetch(databaseURL + `/songs/` + songName + `/chorus`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(verse)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const addVerse = (text, songName) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let verse = {
        text,
        songName: songName,
        type: "verse"
    };

    return fetch(databaseURL + `/songs/` + songName + `/verses`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(verse)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const removeVerse = (verseId, songName) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/verses/` + verseId, {
        method: 'DELETE',
        headers: headers
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const updateVerse = (text, verseId) => {
    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
    headers.append('Content-Type', 'application/json');

    let updateData = {
        text: text
    };

    return fetch(databaseURL + `/verses/` + verseId, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData)
    }).then(
        response => response.json(),
        error => console.log('An error occured.', error)
    )
};

export const updateVerseType = (verseId, type) => {
    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
    headers.append('Content-Type', 'application/json');

    let updateData = {
        type: type
    };

    return fetch(databaseURL + `/verses/` + verseId, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData)
    }).then(
        response => response.json(),
        error => console.log('An error occured.', error)
    )
};

export const updateOrder = (order, songName) => {
    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
    headers.append('Content-Type', 'application/json');

    let updateData = {
        order: order
    };

    return fetch(databaseURL + `/songs/` + songName, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(updateData)
    }).then(
        response => response.json(),
        error => console.log('An error occured.', error)
    )

};

export const getSettings = (username) => {
    return fetch(databaseURL + `/settings/` + username, {
        method: 'GET',
    }).then(
        response => response.json().then(json => json[0].settings || {})
    )
}

export const updateSettings = (username, settings) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/settings/` + username, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(settings)
    }).then(
        response => response.json()
    )
}

export const addSongList = (listName, songIds) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let list = {
        name: listName,
        songs: songIds
    }

    return fetch(databaseURL + `/songlists/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(list)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const updateSongList = (listId, songIds) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let list = {
        songs: songIds
    }

    return fetch(databaseURL + `/songlists/` + listId, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(list)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const getSongLists = () => {
    return fetch(databaseURL + `/songlists/`, {
        method: 'GET'
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const loadSongList = (listId) => {
    return fetch(databaseURL + `/songlists/` + listId, {
        method: 'GET'
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
};

export const downloadSongs = (songNames) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/songpptx/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(songNames)
    }).then(
        response => response.blob(),

        error => console.log('An error occured.', error)
    )
};


function subscribeToSocket(cb) {
    socket.on('newDataEvent', data => cb(data));
}
export { subscribeToSocket };
  