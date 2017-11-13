import React from 'react'
import PropTypes from 'prop-types'

const SongList = ({ verses, onVerseClick }) => (
    <div className="VerseList">
        Verses:<br/>
        <select multiple>
            {
                verses.map((element, index) => (
                <option key={index} onClick={() => onVerseClick(element.verseId)} >{
                    element.firstLine
                }</option>
            ))}
        </select>
    </div>
)

SongList.propTypes = {
    verses: PropTypes.arrayOf(PropTypes.shape({
        verseId: PropTypes.string.isRequired,
        firstLine: PropTypes.string.isRequired,
    })).isRequired,
    onVerseClick: PropTypes.func.isRequired
}

export default SongList
