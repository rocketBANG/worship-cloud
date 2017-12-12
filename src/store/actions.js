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
export const RECEIVE_VERSES = 'RECEIVE_VERSES'
export const SEND_SONGS = 'SEND_SONGS'
export const SEND_SONGS_DONE = 'SEND_SONGS_DONE'
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS'

//EDITOR
export const SET_EDITING_SONG = 'SET_EDITING_SONG';
export const SET_EDITING_VERSE = 'SET_EDITING_VERSE';

//DISPLAY
export const SET_DISPLAY_SONG = 'SET_DISPLAY_SONG';
export const SET_DISPLAY_VERSE_INDEX = 'SET_DISPLAY_VERSE_INDEX';

const databaseURL = "http://localhost:3500" // "http://128.199.145.41:5000"

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
    return function(dispatch) {
        return dispatch(uploadSong({
            name: songName,
            verses: songVerses,
            order: songOrder
        })).then(() => dispatch(addSongLocal(songName, songVerses, songOrder)));
    }
}

export function addSongLocal(songName, songVerses = [], songOrder = []) {
    return { type: ADD_SONG, songName, songVerses, songOrder }    
}

export function removeSong(songName) {
    return function(dispatch, getState) {
        //Remove all associated verses
        getState().songs.byId[songName].verses.forEach(function(verseId) {
            dispatch(removeVerse(verseId, songName));
        });

        dispatch(removeSongLocal(songName));
        dispatch(sendSongs());
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));

        return fetch(databaseURL + `/songs/` + songName, {
            method: 'DELETE',
            headers: headers
        }).then(() => dispatch(sendSongsDone()));
    }
}

export function removeSongLocal(songName) {
    return { type: REMOVE_SONG, songName }    
}

export function updateSongOrder(songName, order) {
    return function(dispatch) {
        dispatch(updateSongOrderLocal(songName, order));
        dispatch(updateSong(songName, {
            order: order,
        }));
    }
}

export function rearangeOrder(oldIndex, newIndex, songName) {
    const move = (array, from, to) => array.splice(to, 0, array.splice(from, 1)[0]);

    return function(dispatch, getState) {
        var orderArray = getState().songs.byId[songName].order.slice();
        move(orderArray, oldIndex, newIndex);

        dispatch(updateSongOrder(songName, orderArray));
    }
}

export function removeFromOrder(index, songName) {
    return function(dispatch, getState) {
        var orderArray = getState().songs.byId[songName].order.slice();
        orderArray.splice(index, 1);
        
        dispatch(updateSongOrder(songName, orderArray));
    }
}

export function addToOrder(verseId, songName) {
    return function(dispatch, getState) {
        var orderArray = getState().songs.byId[songName].order.slice();
        orderArray.push(verseId);
        
        dispatch(updateSongOrder(songName, orderArray));
    }
}

export function updateSongOrderLocal(songName, order) {
    return { type: UPDATE_SONG_ORDER, songName, order }
}

export function updateTitle(songName, title) {
    return function(dispatch) {
        dispatch(updateTitleLocal(songName, title));
        return dispatch(updateSong(songName, {
            title: title,
        }));
    }
}

export function updateTitleLocal(songName, title) {
    return { type: UPDATE_SONG_TITLE, songName, title }
}

export function addVerse(songName, text, verseId, verseType = VerseTypes.NO_CHORUS) {
    return function(dispatch, getState) {
        const state = getState();
        dispatch(addVerseLocal(songName, text, verseId, verseType));
        dispatch(updateSong(songName, {
            verses: state.songs.byId[songName].verses.concat(verseId)
        }));
        return dispatch(uploadVerse({
            id: verseId,
            verseType: verseType,
            text: text
        }));
    }
}

export function addVerseLocal(songName, text, verseId, verseType = VerseTypes.NO_CHORUS) {
    return { type: ADD_VERSE, songName, text, verseId, verseType }
}

export function removeVerse(verseId, songName) {
    return function(dispatch, getState) {
        dispatch(removeVerseLocal(verseId, songName));
        dispatch(sendSongs());
        const state = getState();        
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        let song = state.songs.byId[songName];
        
        dispatch(updateSong(songName, {...song, songName: undefined}));

        return fetch(databaseURL + `/verses/` + verseId, {
            method: 'DELETE',
            headers: headers
        }).then(() => dispatch(sendSongsDone()));
    }
}

export function removeVerseLocal(verseId, songName) {
    return { type: REMOVE_VERSE, songName, verseId }
}

export function updateVerseText(verseId, text) {
    return function(dispatch) {
        dispatch(updateVerseTextLocal(verseId, text));
        dispatch(updateVerse(verseId, {
            text: text
        }))
    }
}

export function updateVerseTextLocal(verseId, text) {
    return { type: UPDATE_VERSE, verseId, text }
}

export function updateVerseType(verseId, verseType) {
    return function(dispatch) {
        dispatch(updateVerseTypeLocal(verseId, verseType));
        dispatch(updateVerse(verseId, {
            verseType: verseType
        }))
    }
}

export function updateVerseTypeLocal(verseId, verseType) {
    return { type: UPDATE_VERSE_TYPE, verseId, verseType }
}

export function requestSongs() {
    return { type: REQUEST_SONGS }
}

export function recieveSongs(items, receivedAt) {
    return { type: RECEIVE_SONGS, items, receivedAt }
}

export function recieveVerses(items, receivedAt) {
    return { type: RECEIVE_VERSES, items, receivedAt }
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
            .then(json => {
                dispatch(sendSongsDone());
            });
    }
}

export function uploadVerse(verse) {
    return function (dispatch) {
        dispatch(sendSongs());
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(databaseURL + `/verses`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(verse)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
            )
            .then(json => {
                dispatch(sendSongsDone());
            });
    }
}

export function updateVerse(verseId, updateData) {
    return function (dispatch) {
        dispatch(sendSongs());
        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));
        headers.append('Content-Type', 'application/json');

        return fetch(databaseURL + `/verses/` + verseId, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updateData)
        }).then(
            response => response.json(),

            error => console.log('An error occured.', error)
            )
            .then(json => {
                console.log(json);
                dispatch(sendSongsDone());
            });
    }
}

export function uploadSong(song) {
    return function (dispatch) {
        dispatch(sendSongs());
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
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));

        return fetch(databaseURL + `/songs`, {
            method: 'GET',
            headers: headers,
        })
            .then(
            response => response.json(),
            error => console.log('An error occured.', error)
            )
            .then(json => {
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                if(json !== undefined) {
                    dispatch(recieveSongs(json, Date.now()));
                }
            }
        )
    }
}

export function fetchVerses() {
    return function (dispatch) {

        let headers = new Headers();
        // headers.append('Authorization', 'Basic ' + btoa(user + ":" + pass));

        return fetch(databaseURL + `/verses`, {
            method: 'GET',
            headers: headers,
        })
            .then(
            response => response.json(),
            error => console.log('An error occured.', error)
            )
            .then(json => {
                console.log(json);
                // We can dispatch many times!
                // Here, we update the app state with the results of the API call.
                if(json !== undefined) {
                    dispatch(recieveVerses(json, Date.now()));
                }
            }
        )
    }
}

export function setEditingSong(songName) {
    return { type: SET_EDITING_SONG, songName }
}

export function setEditingVerse(verseId) {
    return { type: SET_EDITING_VERSE, verseId }
}

export function setDisplaySong(songName) {
    return { type: SET_DISPLAY_SONG, songName }
}

export function setDisplayVerseIndex(verseIndex) {
    return { type: SET_DISPLAY_VERSE_INDEX, verseIndex }
}