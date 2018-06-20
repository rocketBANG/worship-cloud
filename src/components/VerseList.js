import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { IObservableValue } from 'mobx';
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';

type Props = {
    currentVerse: IObservableValue<Verse>,
    currentSong: Song
}

type State = {

}

const VerseList = observer(class extends React.Component<Props, State> {

    onVerseClick = (names, indexes) => {

        this.props.currentVerse.set(this.props.currentSong.completeVerses[indexes[0]]);
        
        this.setState({
            selectedId: names[0],
            selectedIds: names
        })
    };

    onVerseAdd = () => {
        this.props.currentSong.addVerse("");
    };

    onVerseRemove = () => {
        this.props.currentSong.removeVerse(this.state.selectedIds);
    };

    onAddToOrder = () => {
        let song = this.props.currentSong;

        song.addToOrder(this.state.selectedIds);
    };

    onSetChorus = () => {
        this.props.currentSong.setChorus(this.state.selectedId);
    };
    
    render() {
        let currentSong = this.props.currentSong || {};
        const options = (currentSong.completeVerses || []).map((verse, index) => ({
            id: verse.id,
            text: verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title,
            altText: "NEW VERSE"
        }));
    
        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                <List onUpdate={this.onVerseClick} options={options} />
                <div className="ListControls">
                    <button onClick={this.onVerseAdd} >Add Verse</button>
                    <button onClick={this.onVerseRemove}>Remove Verse</button>
                    <button onClick={this.onAddToOrder}>Add to Order</button>
                    <button onClick={this.onSetChorus}>Set as chorus</button>
                </div>
            </div>
        )    
    }
});

export default VerseList;