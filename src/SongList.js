import React from 'react'
import PropTypes from 'prop-types'
import {List} from './List'

const SongList = ({ songs, onSongClick, onSongAdd, onSongRemove }) => {
    var addInput;

    const options = Object.keys(songs).map((element, index) => ({
        id: songs[element].songName,
        text: songs[element].title,
        altText: songs[element].songName
    }));
return (
    <div className="SongList">
        Songs:<br/>
        <List onUpdate={onSongClick} options={options}/>
        <div className="ListControls">
            <input ref={(node) => addInput = node} />
            <button onClick={() => onSongAdd(addInput.value)} >Add Song</button>
            <button onClick={() => onSongRemove()}>Remove Song</button>
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
