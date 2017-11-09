//@ts-check

import {user, pass} from "./auth"

/*
 * action types
 */
//SONGS
export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const UPDATE_SONG_ORDER = 'UPDATE_SONG_ORDER'
export const UPDATE_SONG_TITLE = 'UPDATE_TITLE'

//SONGS + VERSES
export const ADD_VERSE = 'ADD_VERSE'
export const REMOVE_VERSE = 'REMOVE_VERSE'

//VERSES
export const UPDATE_VERSE = 'UPDATE_VERSE'
export const UPDATE_VERSE_TYPE = 'UPDATE_VERSE_TYPE'

//API
export const REQUEST_SONGS = 'REQUEST_SONGS'
export const RECEIVE_SONGS = 'RECEIVE_SONGS'
export const SEND_SONGS = 'SEND_SONGS'
export const SEND_SONGS_DONE = 'SEND_SONGS_DONE'
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS'

/*
 * other constants
 */

export const VerseTypes = {
    CHORUS: 'CHORUS',
    NO_CHORUS: 'NO_CHORUS'
}

/*
 * action creators
 */

export function addSong(songName, songVerses = [], songOrder = []) {
    return { type: ADD_SONG, songName, songVerses, songOrder }
}

export function removeSong(songName) {
    return { type: REMOVE_SONG, songName }
}

export function updateSongOrder(songName, order) {
    return { type: UPDATE_SONG_ORDER, songName, order }
}

export function updateTitle(songName, title) {
    return { type: UPDATE_SONG_TITLE, songName, title }
}

export function addVerse(songName, text, verseId, verseType = VerseTypes.NO_CHORUS) {
    return { type: ADD_VERSE, songName, text, verseId, verseType }
}

export function removeVerse(verseId, songName) {
    return { type: REMOVE_VERSE, songName, verseId }
}

export function updateVerse(index, text) {
    return { type: UPDATE_VERSE, index, text }
}

export function updateVerseType(index, verseType) {
    return { type: UPDATE_VERSE_TYPE, index, verseType }
}

export function requestSongs() {
    return { type: REQUEST_SONGS }
}

export function recieveSongs(items, receivedAt) {
    return { type: RECEIVE_SONGS, items, receivedAt }
}

export function sendSongs() {
    return { type: SEND_SONGS }
}

export function sendSongsDone() {
    return { type: SEND_SONGS_DONE }
}

export function invalidateSongs() {
    return { type: INVALIDATE_SONGS }
}

export function updateSong(songName, updateData) {
    return function (dispatch) {
        dispatch(sendSongs());
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(`http://128.199.145.41:5000/songs/` + songName, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
            )
            .then(json => {
                dispatch(sendSongsDone());
            });
    }
}


export function uploadSong(song) {
    return function (dispatch) {
        dispatch(sendSongs());
        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(`http://128.199.145.41:5000/songs`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(song)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
            )
            .then(json => {
                dispatch(sendSongsDone());
            });
    }
}

function shouldFetchSongs(state) {
    const backend = state.backend;
    if (!backend) {
        return true;
    } else if (backend.isFetching) {
        return false;
    } else {
        return backend.didInvalidate;
    }
}

export function fetchSongsIfNeeded(subreddit) {  
    return (dispatch, getState) => {
      if (shouldFetchSongs(getState())) {
        // Dispatch a thunk from thunk!
        return dispatch(fetchSongs())
      } else {
        // Let the calling code know there's nothing to wait for.
        return Promise.resolve()
      }
    }
  }
  
export function fetchSongs() {
    return function (dispatch) {
        dispatch(requestSongs());

        let headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));


        return fetch(`http://128.199.145.41:5000/songs`, {
            method: 'GET',
            headers: headers,
        })
            .then(
            response => response.json(),
            // Do not use catch, because that will also catch
            // any errors in the dispatch and resulting render,
            // causing a loop of 'Unexpected batch number' errors.
            // https://github.com/facebook/react/issues/6895
            error => console.log('An error occured.', error)
            )
            .then(json => {
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                dispatch(recieveSongs(json._items, Date.now()));
            }
        )

    }
}
