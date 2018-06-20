import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { IObservableValue } from 'mobx';
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';

interface IProps {
    currentVerse: IObservableValue<Verse>,
    currentSong: Song
}

interface IState {
    selectedId: string,
    selectedIds: string[],
}

const VerseList = observer(class extends React.Component<IProps, IState> {

    private onVerseClick = (names, indexes) => {

        this.props.currentVerse.set(this.props.currentSong.completeVerses[indexes[0]]);
        
        this.setState({
            selectedId: names[0],
            selectedIds: names
        })
    };

    private onVerseAdd = () => {
        this.props.currentSong.addVerse("");
    };

    private onVerseRemove = () => {
        this.props.currentSong.removeVerse(this.state.selectedIds);
    };

    private onAddToOrder = () => {
        const song = this.props.currentSong;

        song.addToOrder(this.state.selectedIds);
    };

    private onSetChorus = () => {
        this.props.currentSong.setChorus(this.state.selectedId);
    };
    
    public render() {
        const currentSong = this.props.currentSong || {completeVerses: []};
        const options = currentSong.completeVerses.map((verse, index) => ({
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