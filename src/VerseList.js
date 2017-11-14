import React from 'react'
import PropTypes from 'prop-types'

const VerseList = ({ verses, songName, onVerseClick, onVerseAdd, onVerseRemove, maxVerseId }) => {
    var selectInput;
return (
    <div className="VerseList">
        Verses:<br/>
        <select multiple ref={(node) => selectInput = node}>
            {
                verses.map((element, index) => (
                <option key={index} value={element.verseId} onClick={() => onVerseClick(element.verseId)} >{
                    element.firstLine
                }</option>
            ))}
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
    onVerseClick: PropTypes.func.isRequired,
    onVerseAdd: PropTypes.func.isRequired,
    onVerseRemove: PropTypes.func.isRequired
}

export default VerseList
