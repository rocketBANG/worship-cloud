export const REQUEST_SONGS = 'REQUEST_SONGS'
export const RECEIVE_SONGS = 'RECEIVE_SONGS'
export const SEND_SONGS = 'SEND_SONGS'
export const SEND_SONGS_DONE = 'SEND_SONGS_DONE'
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS'
export const SEND_SONGS_ERROR = 'SEND_SONGS_ERROR'

export const RECEIVE_VERSES = 'RECEIVE_VERSES'

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

export function sendSongsError() {
    return { type: SEND_SONGS_ERROR }
}

export function invalidateSongs() {
    return { type: INVALIDATE_SONGS }
}
