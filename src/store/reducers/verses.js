import { ADD_VERSE, UPDATE_VERSE, UPDATE_VERSE_TYPE, REMOVE_VERSE, RECEIVE_VERSES } from "../actions";

/**
 * Handles actions on the verse objects
 * @param {*} songsById Associated list of verses with indexes being the verse ids 
 * @param {*} action Action to perform
 */
function versesById(versesById, action) {
    switch (action.type) {
        case ADD_VERSE:
            return {
                ...versesById,
                [action.verseId]: {
                    text: action.text,
                    type: action.verseType,
                    verseId: action.verseId
                }
            }

        case REMOVE_VERSE:
            return Object.keys(versesById).reduce(function(result, key) {
                if(key !== action.verseId) {
                    result[key] = versesById[key];
                }
                return result;
            }, {});

        case RECEIVE_VERSES:
            return action.items.reduce(function(result, item) {                
                result[item.id] = {
                    verseId: item.id,
                    text: item.text,
                    type: item.verseType,
                };
                return result;                    
            }, {});


        case UPDATE_VERSE:
        case UPDATE_VERSE_TYPE:
            return {
                ...versesById,
                [action.verseId]: updateVerse(versesById[action.verseId], action)
            };

        default:
            return versesById;
    }
        
}

/**
 * Updates the given verse with the appropriate action
 * @param {*} song Verse to perform the action on
 * @param {*} action Action to perfom
 */
function updateVerse(verse, action) {
    switch(action.type) {
        case UPDATE_VERSE:
            return {
                ...verse,
                text: action.text,
            }
        
        case UPDATE_VERSE_TYPE:
            return {
                ...verse,
                type: action.type
            }
        
        

        default:
            return verse;
    }
}

/**
 * Handles actions on the list of verse ids 
 * @param {*} songs List of ids of all verses
 * @param {*} action Action to perform
 */
function allVerses(verses, action) {
    switch (action.type) {
        case ADD_VERSE: 
            return [...verses, action.verseId];

        case REMOVE_VERSE:
            return verses.filter(function(verseId){
                return verseId !== action.verseId;
            })

        case RECEIVE_VERSES:
            return action.items.map(function(item) {    
                return item.id;
            });
    
        default:
            return verses;

    }
}

/**
 * Updates the verse's states with the given action
 * @param {*} songs The state of verses
 * @param {*} action The action to handle
 */
export function verses(verses = {}, action) {
    let byId = verses.byId === undefined ? {} : verses.byId;
    let allIds = verses.allIds === undefined ? [] : verses.allIds;

    return {
        byId: versesById(byId, action),
        allIds: allVerses(allIds, action),
    }
}
