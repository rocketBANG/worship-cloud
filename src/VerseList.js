import React from 'react'
import PropTypes from 'prop-types'

const VerseList = ({ verses, songName, onVerseClick, onVerseAdd, onVerseRemove, maxVerseId, currentVerse }) => {
    var selectInput;
    const verseOptions = verses.map((element, index) => (
        <option key={element.verseId} value={element.verseId}>{
            element.firstLine !== "" ? element.firstLine : "NEW VERSE"
        }</option>));
return (
    <div className="VerseList">
        Verses:<br/>
        <select multiple={true} ref={(node) => selectInput = node} onChange={() => onVerseClick(selectInput.value)}>
            {verseOptions}
        </select>
        <div className="ListControls">
                <button onClick={() => onVerseAdd("v" + (maxVerseId + 1), songName)} >Add Verse</button>
                <button onClick={() => onVerseRemove(selectInput.value, songName)}>Remove Verse</button>
        </div>
    </div>
)}

VerseList.propTypes = {
    verses: PropTypes.arrayOf(PropTypes.shape({
        verseId: PropTypes.string.isRequired,
        firstLine: PropTypes.string.isRequired,
    })).isRequired,
    songName: PropTypes.string.isRequired,
    currentVerse: PropTypes.string.isRequired,
    onVerseClick: PropTypes.func.isRequired,
    onVerseAdd: PropTypes.func.isRequired,
    onVerseRemove: PropTypes.func.isRequired
}

export default VerseList
