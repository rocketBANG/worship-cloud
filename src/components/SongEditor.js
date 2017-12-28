import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { Song } from '../models/Song'

const SongEditor = observer(class SongEditor extends React.Component {

    onVerseClick = (name, index) => {
        this.setState({
            currentVerse: name,
            selectedIndex: index
        })
    }

    onVerseAdd = () => {
        this.props.state.currentSong.addVerse("");
    }

    onVerseRemove = () => {
        this.props.state.currentSong.removeVerse(this.state.selectedIndex);
    }
    
    render() {
        const options = (this.props.verses || []).map((verse, index) => ({
            id: verse.id,
            text: verse.text,
            altText: "NEW VERSE"
        }));
    
        return (
            <div className="SongEditor EditorContainer">
                <textarea value={initialText} ref={node => (textArea = node)} onChange={() => onEdit(verseId, textArea.value)} />
                <br/>
                <div className="SaveProgress">
                    {saving ? "Saving" : ""}
                </div>
            </div>
        )    
    }
})

export default SongEditor;