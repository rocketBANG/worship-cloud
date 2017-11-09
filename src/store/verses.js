import { ADD_VERSE, UPDATE_VERSE, UPDATE_VERSE_TYPE, REMOVE_VERSE } from "./actions";

export function verses(verses = [], action) {
    switch (action.type) {
        case ADD_VERSE:
            return [
                ...verses,
                {
                    text: action.text,
                    type: action.verseType,
                }
            ]

        case UPDATE_VERSE:
            return verses.map((verse, index) => {
                if (index === action.index) {
                    return Object.assign({}, verse, {
                        text: action.text
                    })
                }
                return verse
            })
            
        case UPDATE_VERSE_TYPE:
            return verses.map((verse, index) => {
                if (index === action.index) {
                    return Object.assign({}, verse, {
                        type: action.verseType
                    })
                }
                return verse
            })

        case REMOVE_VERSE:
            return verses.filter(function(verse, index) {
                return index !== action.verseIndex;
            });

        default:
            return verses;
    }
}
