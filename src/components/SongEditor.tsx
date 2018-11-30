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

    private getFullSongText = (song: Song) => {
        let fullText = "";
        if (song === undefined) return fullText;

        song.verseOrder.forEach(v => {
            fullText += v.text;
            fullText += "\n\n";
        });

        return fullText;
    }

    public render() {
        const disabled = this.props.currentVerse === undefined;
        const verse = this.props.currentVerse;
        const song = this.props.currentSong;

        let text = verse && verse.text;
        if (text === undefined) {
            text = this.getFullSongText(song);
        }
        
        return (
            <div className="SongEditor EditorContainer">
                <textarea disabled={disabled} value={text} onChange={this.onEdit} onPaste={this.onPaste} />
                <br/>
                <div className="SaveProgress">
                    {StateToString(song ? song.state : ModelState.UNLOADED)} - {StateToString(verse ? verse.state : ModelState.UNLOADED)}
                </div>
            </div>
        )    
    }
});

export default SongEditor;