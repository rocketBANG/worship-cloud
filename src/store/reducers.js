import { combineReducers } from 'redux'

import { verses } from './verses'
import { songs } from './songs'
import { backend } from './backend'
import { editor } from './editor'
import { display } from './display'

const songApp = combineReducers({
    songs,
    verses,
    backend,
    editor, 
    display
})

export default songApp
