import * as React from 'react'
import { observer } from 'mobx-react'

type Props = {
    currentVerse: IObservableValue<Verse>,
    currentSong: Song
}

type State = {

}

const SongEditor = observer(class extends React.Component<Props, State> {
    onEdit = (event) => {
        this.props.currentVerse.get().updateText(event.target.value);
    };

    render() {
        const disabled = this.props.currentVerse.get() === undefined;
        const verse = this.props.currentVerse.get() || {};
        const song = this.props.currentSong || {};
        
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