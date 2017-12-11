import { combineReducers } from 'redux'

import { verses } from './reducers/verses'
import { songs } from './reducers/songs'
import { backend } from './reducers/backend'
import { editor } from './reducers/editor'
import { display } from './reducers/display'

const songApp = combineReducers({
    songs,
    verses,
    backend,
    editor, 
    display
})

export default songApp
