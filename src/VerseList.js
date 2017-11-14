import React from 'react'
import PropTypes from 'prop-types'

const VerseList = ({ verses, songName, onVerseClick, onVerseAdd, onVerseRemove }) => {
    var addInput;
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
                <input ref={(node) => addInput = node} />
                <button onClick={() => onVerseAdd(addInput.value, songName)} >Add Verse</button>
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
