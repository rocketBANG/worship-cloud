import React from 'react'
import PropTypes from 'prop-types'
import {List} from './List'

const SongLibrary = ({ songs, onSongClick }) => {
    const options = Object.keys(songs).map((element, index) => ({
        id: songs[element].songName,
        text: songs[element].title,
        altText: songs[element].songName
    }));
return (
    <div className="SongLibrary">
        <div className="ListHeader">Songs:</div>
        <List onUpdate={onSongClick} options={options}/>
    </div>
)}

SongLibrary.propTypes = {
    songs: PropTypes.objectOf(
        PropTypes.shape({
            songName: PropTypes.string.isRequired,
            title: PropTypes.string
        }).isRequired
    ).isRequired,
    onSongClick: PropTypes.func.isRequired,
}

export default SongLibrary
