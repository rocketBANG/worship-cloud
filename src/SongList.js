import React from 'react'
import PropTypes from 'prop-types'

const SongList = ({ songs, onSongClick, onSongAdd, onSongRemove }) => {
    var songSelect;
    var addInput;
return (
    <div className="SongList">
        Songs:<br/>
        <select multiple ref={(node) => songSelect = node}>
            {Object.keys(songs).map((element, index) => (
                <option key={index} onClick={() => onSongClick(songs[element].songName)} value={songs[element].songName} >{
                    songs[element].title !== undefined ? songs[element].title : songs[element].songName
                }</option>
            ))}
        </select>
        <div className="ListControls">
            <input ref={(node) => addInput = node} />
            <button onClick={() => onSongAdd(addInput.value)} >Add Song</button>
            <button onClick={() => onSongRemove(songSelect.value)}>Remove Song</button>
        </div>
    </div>
)}

SongList.propTypes = {
    songs: PropTypes.objectOf(
        PropTypes.shape({
            songName: PropTypes.string.isRequired,
            title: PropTypes.string
        }).isRequired
    ).isRequired,
    onSongClick: PropTypes.func.isRequired,
    onSongAdd: PropTypes.func.isRequired,
    onSongRemove: PropTypes.func.isRequired
}

export default SongList
