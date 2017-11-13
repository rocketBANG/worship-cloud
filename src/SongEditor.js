import React from 'react'
import PropTypes from 'prop-types'
import { addSong, updateTitle, updateVerseText } from './store/actions';

const SongEditor = ({ text, verseId, onEdit }) => {
    let textArea;
    let initialText = text;

    return (
        <div className="SongEditor">
            <textarea value={initialText} ref={node => (textArea = node)} onChange={() => onEdit(verseId, textArea.value)} />
            <br/>
        </div>
    )}


SongEditor.propTypes = {
    text: PropTypes.string.isRequired
}

export default SongEditor
