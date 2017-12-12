import {uploadSong} from '../api'

export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const UPDATE_SONG_ORDER = 'UPDATE_SONG_ORDER'
export const UPDATE_SONG_TITLE = 'UPDATE_TITLE'

export function addSong(songName, songVerses = [], songOrder = []) {
    return (dispatch) => {
        dispatch(sendSongs());

        return uploadSong(songName, songVerses, songOrder)
        .then((response) => {
            dispatch(addSongLocal(songName, songVerses, songOrder));
            dispatch(sendSongsDone());
        });
    }
}

function addSongLocal(songName, songVerses = [], songOrder = []) {
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