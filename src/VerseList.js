import React from 'react'
import PropTypes from 'prop-types'
import {List} from './List'

const VerseList = ({ verses, onVerseClick, onVerseAdd, onVerseRemove, maxVerseId, currentVerse, onOrderAdd }) => {

    const options = verses.map((element) => ({
        id: element.verseId,
        text: element.firstLine,
        altText: "NEW VERSE"
    }));
return (
    <div className="VerseList EditorContainer">
        <div className="ListHeader">Verses:</div>
        <List options={options} onUpdate={onVerseClick} />
        <div className="ListControls">
            <button onClick={() => onVerseAdd("v" + (maxVerseId + 1))} >Add Verse</button>
            <button onClick={() => onVerseRemove()}>Remove Verse</button>
            <button onClick={() => onOrderAdd()}>Add to order</button>
        </div>
    </div>
)}

VerseList.propTypes = {
    verses: PropTypes.arrayOf(PropTypes.shape({
        verseId: PropTypes.string.isRequired,
        firstLine: PropTypes.string.isRequired,
    })).isRequired,
    currentVerse: PropTypes.string,
    onVerseClick: PropTypes.func.isRequired,
    onVerseAdd: PropTypes.func.isRequired,
    onVerseRemove: PropTypes.func.isRequired,
    onOrderAdd: PropTypes.func.isRequired,
}

export default VerseList
