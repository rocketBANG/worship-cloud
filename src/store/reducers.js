import { combineReducers } from 'redux'

import { verses } from './verses'
import { songs } from './songs'
import { backend } from './backend'

const songApp = combineReducers({
    songs,
    verses,
    backend
})

export default songApp
