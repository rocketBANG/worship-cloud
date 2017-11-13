import React from 'react'
import PropTypes from 'prop-types'

const SongEditor = ({ currentSong }) => (
    <div className="SongEditor">
        <textarea>

        </textarea><br/>
        {currentSong.songName}
    </div>
)

SongEditor.propTypes = {
    currentSong: 
        PropTypes.shape({
            songName: PropTypes.string.isRequired
        }).isRequired
}

export default SongEditor
