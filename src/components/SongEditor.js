import React from 'react'
import { observer } from 'mobx-react'

const SongEditor = observer(class SongEditor extends React.Component {
    onEdit = (event) => {
        this.props.state.currentVerse.updateText(event.target.value);
    };

    render() {
        const disabled = this.props.state.currentVerse === undefined;
        const verse = this.props.state.currentVerse || {};
        const song = this.props.state.currentSong || {};
        
        return (
            <div className="SongEditor EditorContainer">
                <textarea disabled={disabled} value={verse.text} onChange={this.onEdit} />
                <br/>
                <div className="SaveProgress">
                    {song.state} - {verse.state}
                </div>
            </div>
        )    
    }
});

export default SongEditor;