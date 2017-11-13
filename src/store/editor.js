import { SET_EDITING_SONG } from "./actions";

export function editor(editor = {}, action) {
    switch(action.type) {
        case SET_EDITING_SONG:
            return {
                ...editor,
                currentSong: action.songName
            };

        default:
            return editor;
    }
}
