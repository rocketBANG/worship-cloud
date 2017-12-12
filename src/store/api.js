export const uploadSong = (songName, songVerses, songOrder) => {
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
    )
}