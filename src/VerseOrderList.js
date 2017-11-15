import React from 'react'
import PropTypes from 'prop-types'

const VerseOrderList = ({ verses, songName, onVerseClick, onVerseAdd, onVerseRemove, currentVerse,
    onOrderUp, onOrderDown, onOrderRemove}) => {
    var selectInput;
    const verseOptions = verses.map((element, index) => (
        <option key={element.verseId + index} value={element.verseId}>{
            element.firstLine !== "" ? element.firstLine : "NEW VERSE"
        }</option>));
return (
    <div className="VerseOrderList">
        Verses:<br/>
        <select multiple={true} ref={(node) => selectInput = node} onChange={() => onVerseClick(selectInput.value)}>
            {verseOptions}
        </select>
        <div className="ListControls">
                <button onClick={() => onOrderUp(selectInput.selectedIndex, songName)} >up</button>
                <button onClick={() => onOrderDown(selectInput.selectedIndex, songName)}>down</button>
                <button onClick={() => onOrderRemove(selectInput.selectedIndex, songName)}>x</button>
                </div>
    </div>
)}

VerseOrderList.propTypes = {
    verses: PropTypes.arrayOf(PropTypes.shape({
        verseId: PropTypes.string.isRequired,
        firstLine: PropTypes.string.isRequired,
    })).isRequired,
    songName: PropTypes.string.isRequired,
    currentVerse: PropTypes.string.isRequired,
    onVerseClick: PropTypes.func.isRequired,
    onOrderRemove: PropTypes.func.isRequired,
    onOrderUp: PropTypes.func.isRequired,
    onOrderDown: PropTypes.func.isRequired,
}

export default VerseOrderList
