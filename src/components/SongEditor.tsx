import * as React from 'react'
import { observer } from 'mobx-react'
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';
import { StateToString, ModelState } from '../models/ModelState';
import { HistoryManager } from '../models/History';

interface IProps {
    currentVerse: Verse,
    currentSong: Song
}

const SongEditor = observer(class extends React.Component<IProps> {
    private onEdit = (event) => {
        const currentText = this.props.currentVerse.text;
        const nextText = event.target.value;
        const target = event.target as HTMLTextAreaElement;
        const currentCarret = target.selectionStart;
        const verse = this.props.currentVerse;

        HistoryManager.addHistory({
            name: 'updateText',
            object: this,
            redo: () => { verse.updateText(nextText); 
                target.selectionStart = currentCarret; 
                target.selectionEnd = currentCarret},
            undo: () => { verse.updateText(currentText); 
                target.selectionStart = currentCarret - 1; 
                target.selectionEnd = currentCarret - 1 }
        });

        this.props.currentVerse.updateText(nextText);
    };

    public render() {
        const disabled = this.props.currentVerse === undefined;
        const verse = this.props.currentVerse || {state: ModelState.UNLOADED, text: ""};
        const song = this.props.currentSong || {state: ModelState.UNLOADED};

        let text = verse && verse.text || '';
        let state = verse && verse.state || ModelState.UNLOADED;
        
        return (
            <div className="SongEditor EditorContainer">
                <textarea disabled={disabled} value={verse.text} onChange={this.onEdit} />
                <br/>
                <div className="SaveProgress">
                {StateToString(song.state)} - {StateToString(verse.state)}
                </div>
            </div>
        )    
    }
});

export default SongEditor;