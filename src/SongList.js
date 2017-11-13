import React from 'react'
import PropTypes from 'prop-types'

const SongList = ({ songs, onSongClick }) => (
    <div className="SongList">
        Songs:<br/>
        <select multiple>
            {Object.keys(songs).map((element, index) => (
                <option key={index} onClick={() => onSongClick(songs[element].songName)} >{
                    songs[element].title !== undefined ? songs[element].title : songs[element].songName
                }</option>
            ))}
        </select>
    </div>
)

SongList.propTypes = {
    songs: PropTypes.objectOf(
        PropTypes.shape({
            songName: PropTypes.string.isRequired,
            title: PropTypes.string
        }).isRequired
    ).isRequired,
    onSongClick: PropTypes.func.isRequired
}

export default SongList
