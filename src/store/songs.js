import { ADD_SONG, UPDATE_SONG_TITLE, ADD_VERSE, REMOVE_VERSE, UPDATE_SONG_ORDER, REMOVE_SONG } from "./actions";

/**
 * Handles actions on the song objects
 * @param {*} songsById Associated list of songs with indexes being the song names 
 * @param {*} action Action to perform
 */
function songsById(songsById, action) {
    switch(action.type) {
        case UPDATE_SONG_ORDER:
        case UPDATE_SONG_TITLE:    
        case ADD_VERSE:
        case REMOVE_VERSE:        
            return {
                ...songsById,
                [action.songsongName]: updateSong(songsById[action.songsongName], action)
            }
        
        case ADD_SONG:
            return {
                ...songsById,
                [action.songName] : {
                    songName: action.songName,
                    title: action.songName,
                    verses: [],
                    order: []        
                }
            }
        
        case REMOVE_SONG:
            return Object.keys(songsById).reduce(function(result, key) {
                if(key !== action.songName) {
                    result[key] = songsById[key];
                }
                return result;
            }, {});
        
        default:
            return songsById;
    }
}

/**
 * Handles actions on the list of songs
 * @param {*} songs List of keys of all songs
 * @param {*} action Action to perform
 */
function allSongs(songs, action) {
    switch(action.type) {
        case ADD_SONG :
            return [...songs, action.songName];

        case REMOVE_SONG:
            return songs.filter(function(songName){
                return songName !== action.songName;
            });
        
        default:
            return songs;
    }
}
    
/**
 * Updates the given song with the appropriate action
 * @param {*} song Song to perform the action on
 * @param {*} action Action to perfom
 */
function updateSong(song, action) {
    switch(action.type) {
        case UPDATE_SONG_ORDER:
            return {
                ...song,
            order: action.order
            };

        case UPDATE_SONG_TITLE:
            return {
                ...song,
                title: action.title
            };
    
        case ADD_VERSE:
            return {
                ...song,
            verses: song.verses.concat(action.numVerses)
            };

        case REMOVE_VERSE:
        return {
                ...song,
                verses: song.verses.filter(function(verseIndex){
                    return verseIndex !== action.verseIndex;
                })
            };

        default:
            return song;
    }
}

/**
 * Updates the songs states with the given action
 * @param {*} songs The state of songs
 * @param {*} action The action to handle
 */
export function songs(songs = {}, action) {
    let byId = songs.byId === undefined ? {} : songs.byId;
    let allIds = songs.allIds === undefined ? [] : songs.allIds;

    return {
        byId: songsById(byId, action),
        allIds: allSongs(allIds, action)
    };
}
