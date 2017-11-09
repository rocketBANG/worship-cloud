//@ts-check

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

//VERSES
export const UPDATE_VERSE = 'UPDATE_VERSE'
export const REMOVE_VERSE = 'REMOVE_VERSE'
export const UPDATE_VERSE_TYPE = 'UPDATE_VERSE_TYPE'

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

export function addSong(text) {
  return { type: ADD_SONG, text }
}

export function addVerse(songIndex, verseText, numVerses, verseType = VerseTypes.NO_CHORUS) {
    return {type: ADD_VERSE, songIndex, verseText, numVerses, verseType}
}

export function updateVerse(verseIndex, text) {
    return {type: UPDATE_VERSE, verseIndex, text}
}

export function removeVerse(verseIndex, songIndex) {
    return {type: REMOVE_VERSE, songIndex, verseIndex}
}

export function setTitle(index, title) {
  return { type: UPDATE_SONG_TITLE, index, title }
}
