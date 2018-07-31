import * as React from 'react'
import { observer } from 'mobx-react'
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';
import { StateToString, ModelState } from '../models/ModelState';

interface IProps {
    currentVerse: Verse,
    currentSong: Song
}

const SongEditor = observer(class extends React.Component<IProps> {
    private onEdit = (event) => {
        this.props.currentVerse.updateText(event.target.value);
    };

    private onPaste = (event) => {
        let text: string = event.clipboardData.getData("text/plain");
        let newText: string = text.replace(//g, "\n");

        if(newText === text || !document.queryCommandSupported('insertText') || !document.queryCommandEnabled('insertText')) {
            return;
        }

        event.preventDefault();
        document.execCommand("insertText", false, newText);
    }

    public render() {
        const disabled = this.props.currentVerse === undefined;
        const verse = this.props.currentVerse || {state: ModelState.UNLOADED, text: ""};
        const song = this.props.currentSong || {state: ModelState.UNLOADED};
        
        return (
            <div className="SongEditor EditorContainer">
                <textarea disabled={disabled} value={verse.text} onChange={this.onEdit} onPaste={this.onPaste} />
                <br/>
                <div className="SaveProgress">
                    {StateToString(song.state)} - {StateToString(verse.state)}
                </div>
            </div>
        )    
    }
});

export default SongEditor;