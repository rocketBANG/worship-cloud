import { ADD_VERSE } from "./actions";

export function verses(verses = [], action) {
    switch (action.type) {
        case ADD_VERSE:
            return [
                ...verses,
                {
                    text: action.verseText,
                    type: action.verseType,
                }
            ]
        default:
            return verses;
    }
}
