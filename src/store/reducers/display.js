import { SET_DISPLAY_SONG, SET_DISPLAY_VERSE_INDEX } from "../actions";

export function display(display = {currentVerseIndex: 0}, action) {
    switch(action.type) {

        case SET_DISPLAY_SONG:
            return {
                ...display,
                currentSong: action.songName
            }
        
        case SET_DISPLAY_VERSE_INDEX:
            return {
                ...display,
                currentVerseIndex: action.verseIndex
            }

        default: 
            return display;
    }
}