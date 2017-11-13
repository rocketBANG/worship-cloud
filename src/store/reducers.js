import { combineReducers } from 'redux'

import { verses } from './verses'
import { songs } from './songs'
import { backend } from './backend'
import { editor } from './editor'

const songApp = combineReducers({
    songs,
    verses,
    backend,
    editor
})

export default songApp
