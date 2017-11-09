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
export const REMOVE_VERSE = 'REMOVE_VERSE'

//VERSES
export const UPDATE_VERSE = 'UPDATE_VERSE'
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

export function addSong(songName) {
  return { type: ADD_SONG, songName }
}

export function removeSong(songName) {
  return {type: REMOVE_SONG, songName}
}

export function updateSongOrder(songsongName, order) {
  return { type: UPDATE_SONG_ORDER, songsongName, order }
}

export function updateTitle(songsongName, title) {
  return { type: UPDATE_SONG_TITLE, songsongName, title }
}

export function addVerse(songsongName, text, numVerses, verseType = VerseTypes.NO_CHORUS) {
    return {type: ADD_VERSE, songsongName, text, numVerses, verseType}
}

export function removeVerse(verseIndex, songsongName) {
  return {type: REMOVE_VERSE, songsongName, verseIndex}
}

export function updateVerse(index, text) {
    return {type: UPDATE_VERSE, index, text}
}

export function updateVerseType(index, verseType) {
  return {type: UPDATE_VERSE_TYPE, index, verseType}
}
