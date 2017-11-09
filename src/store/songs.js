import { ADD_SONG, UPDATE_SONG_TITLE, ADD_VERSE } from "./actions";

export function songs(songs = [], action) {
    switch (action.type) {
        case ADD_SONG:
            return [
                ...songs,
                {
                    title: action.text,
                    verses: [],
                    order: []
                }
            ]
        case UPDATE_SONG_TITLE:
            return songs.map((song, index) => {
                if (index === action.index) {
                    return Object.assign({}, song, {
                        title: action.title
                    })
                }
                return song
            })
        case ADD_VERSE:
            return songs.map((song, index) => {
                if (index === action.songIndex) {
                    return Object.assign({}, song, {
                        verses: [...song.verses, action.numVerses ]
                    })
                }
                return song
            })
        default:
            return songs
    }
}
