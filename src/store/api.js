const databaseURL = "http://localhost:3500" // "http://128.199.145.41:5000"

export const uploadSong = (songName, songVerses = [], songOrder = []) => {
    let song = {
        name: songName,
        verses: songVerses,
        order: songOrder
    }

    let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/songs`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(song)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )/*.then(json => {

    });*/
}

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
}

export const removeSong = (songName) => {
    let headers = new Headers();

    return fetch(databaseURL + `/songs/` + songName, {
        method: 'DELETE',
        headers: headers
    });
}

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
}

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
}


export const addVerse = (text, songName, type) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let verse = {
        text,
        songName: songName,
        verseType: type,
    }

    return fetch(databaseURL + `/songs/` + songName + `/verses`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(verse)
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}

export const removeVerse = (verse, songName) => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return fetch(databaseURL + `/verses/` + verse.id, {
        method: 'DELETE',
        headers: headers
    }).then(
        response => response.json(),

        error => console.log('An error occured.', error)
    )
}