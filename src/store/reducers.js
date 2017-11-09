import { combineReducers } from 'redux'

import { verses } from './verses'
import { songs } from './songs'

const songApp = combineReducers({
    songs,
    verses
})

export default songApp
