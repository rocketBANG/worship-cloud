import * as API from '../api'
import { removeVerse } from '../actions';

export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const UPDATE_SONG_ORDER = 'UPDATE_SONG_ORDER'
export const UPDATE_SONG_TITLE = 'UPDATE_TITLE'
export const REQUEST_SONGS = 'REQUEST_SONGS'
export const RECEIVE_SONGS = 'RECEIVE_SONGS'
export const SEND_SONGS = 'SEND_SONGS'
export const SEND_SONGS_DONE = 'SEND_SONGS_DONE'
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS'
export const SEND_SONGS_ERROR = 'SEND_SONGS_ERROR'


export function addSong(songName, songVerses = [], songOrder = []) {
    return (dispatch) => {
        dispatch(isUploading(true));

        return API.uploadSong(songName, songVerses, songOrder)
        .then((response) => {
            dispatch(addSongLocal(songName, songVerses, songOrder));
            dispatch(isUploading(false));
        });
    }
}

function addSongLocal(songName, songVerses = [], songOrder = []) {
    return { type: ADD_SONG, songName, songVerses, songOrder }    
}

export function removeSong(songName) {
    return function(dispatch, getState) {
        dispatch(isUploading(true));
        
        let promises = [];

        //Remove all associated verses
        getState().songs.byId[songName].verses.forEach(function(verseId) {
            let removePromise = dispatch(removeVerse(verseId, songName));
            promises.push(removePromise);
        });

        let songPromise = API.removeSong(songName)
        .then((response) => {
            dispatch(removeSongLocal(songName));
        });

        promises.push(songPromise);
        return Promise.all(promises).then(() => dispatch(isUploading(false)));
    }
}

function removeSongLocal(songName) {
    return { type: REMOVE_SONG, songName }    
}

function updateSongOrder(songName, order) {
    return function(dispatch) {
        dispatch(updateSongOrderLocal(songName, order));
        return dispatch(updateSong(songName, {
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

function updateSongOrderLocal(songName, order) {
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

function updateTitleLocal(songName, title) {
    return { type: UPDATE_SONG_TITLE, songName, title }
}

function updateSong(songName, updateData) {
    return function (dispatch) {
        dispatch(isUploading(true));

        return API.updateSong(songName, updateData).then(
            () => dispatch(isUploading(false)),
            () => dispatch(sendSongsError())
        );
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

export function fetchSongsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchSongs(getState())) {
            return dispatch(fetchSongs())
        } else {
            return Promise.resolve()
        }
    }
}

function fetchSongs() {
    return function (dispatch) {
        dispatch(requestSongs());

        return API.fetchSongs().then((json) => {
            if (json !== undefined) {
                dispatch(recieveSongs(json, Date.now()));
            }
        });
    }
}

function requestSongs() {
    return { type: REQUEST_SONGS }
}

function recieveSongs(items, receivedAt) {
    return { type: RECEIVE_SONGS, items, receivedAt }
}

export function sendSongsError() {
    return { type: SEND_SONGS_ERROR }
}

export function isUploading(isUploading) {
    if(isUploading) {
        return { type: SEND_SONGS }        
    } else {
        return { type: SEND_SONGS_DONE }        
    }
}

export function invalidateSongs() {
    return { type: INVALIDATE_SONGS }
}
