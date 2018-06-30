import * as React from 'react'
import { observer } from 'mobx-react'
import { IObservableValue } from 'mobx';
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';

interface IProps {
    currentVerse: Verse,
    currentSong: Song
}

const SongEditor = observer(class extends React.Component<IProps> {
    private onEdit = (event) => {
        this.props.currentVerse.updateText(event.target.value);
    };

    public render() {
        const disabled = this.props.currentVerse === undefined;
        const verse = this.props.currentVerse || {state: "", text: ""};
        const song = this.props.currentSong || {state: ""};
        
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