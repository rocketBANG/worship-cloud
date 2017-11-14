import { SET_EDITING_SONG, SET_EDITING_VERSE } from "./actions";

export function editor(editor = {}, action) {
    switch(action.type) {
        case SET_EDITING_SONG:
            return {
                ...editor,
                currentSong: action.songName,
                currentVerse: undefined
            };

        case SET_EDITING_VERSE: 
            return {
                ...editor,
                currentVerse: action.verseId
            }

        default:
            return editor;
    }
}
