import React from 'react'
import PropTypes from 'prop-types'

const SongEditor = ({ text, verseId, onEdit, saving }) => {
    let textArea;
    let initialText = text;

    return (
        <div className="SongEditor">
            <textarea value={initialText} ref={node => (textArea = node)} onChange={() => onEdit(verseId, textArea.value)} />
            <br/>
            <div className="SaveProgress">
                {saving ? "Saving" : ""}
            </div>
        </div>
    )}


SongEditor.propTypes = {
    text: PropTypes.string.isRequired
}

export default SongEditor
