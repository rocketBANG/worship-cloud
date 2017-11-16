import { ADD_SONG, UPDATE_SONG_TITLE, ADD_VERSE, REMOVE_VERSE, UPDATE_SONG_ORDER, REMOVE_SONG, RECEIVE_SONGS } from "./actions";

/**
 * Handles actions on the song objects
 * @param {*} songsById Associated list of songs with indexes being the song names 
 * @param {*} action Action to perform
 */
function songsById(songsById, action) {
    switch(action.type) {
        //Changing an existing song
        case UPDATE_SONG_ORDER:
        case UPDATE_SONG_TITLE:    
        case ADD_VERSE:
        case REMOVE_VERSE:
            return {
                ...songsById,
                [action.songName]: updateSong(songsById[action.songName], action)
            }
        
        case ADD_SONG:
            return {
                ...songsById,
                [action.songName] : {
                    songName: action.songName,
                    title: action.songName,
                    verses: action.songVerses,
                    order: action.songOrder      
                }
            }
        
        case REMOVE_SONG:
            return Object.keys(songsById).reduce(function(result, key) {
                if(key !== action.songName) {
                    result[key] = songsById[key];
                }
                return result;
            }, {});

        case RECEIVE_SONGS:
            return action.items.reduce(function(result, item) {                
                result[item.name] = {
                    songName: item.name,
                    title: item.title,
                    verses: item.verses,
                    order: item.order,
                };
                return result;                    
            }, {});

        
        default:
            return songsById;
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
                verses: song.verses.concat(action.verseId)
            };

        case REMOVE_VERSE:
        return {
                ...song,
                verses: song.verses.filter(function(verseId){
                    return verseId !== action.verseId;
                }),
                order: song.order.filter(function(verseId){
                    return verseId !== action.verseId;
                })
            };

        default:
            return song;
    }
}

/**
 * Handles actions on the list of song names 
 * @param {*} songs List of keys of all songs
 * @param {*} action Action to perform
 */
function allSongs(songs, action) {
    switch(action.type) {
        case ADD_SONG :
            if(songs.indexOf(action.songName) < 0) { //Check that songs doesn't already exist
                return [...songs, action.songName];
            } else {
                return songs;
            }

        case REMOVE_SONG:
            return songs.filter(function(songName){
                return songName !== action.songName;
            });
        
        case RECEIVE_SONGS:
            return action.items.map(function(item) {
                return item.name;
            });
        
        default:
            return songs;
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
