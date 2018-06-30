import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { IObservableValue, IObservableArray } from 'mobx';
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';

interface IProps {
    selectedVerses: IObservableArray<Verse>
    currentSong: Song
}

const VerseList = observer(class extends React.Component<IProps> {

    private onVerseClick = (names, indexes) => {

        this.props.selectedVerses.clear();
        this.props.selectedVerses.push(...this.props.currentSong.completeVerses.filter(v => names.indexOf(v.id) !== -1));
        
    };

    private onVerseAdd = async () => {
        let newVerse = await this.props.currentSong.addVerse("");
        this.props.selectedVerses.clear();
        this.props.selectedVerses.push(newVerse);
    };

    private onVerseRemove = () => {
        this.props.currentSong.removeVerse(this.props.selectedVerses.map(v => v.id));
    };

    private onAddToOrder = () => {
        const song = this.props.currentSong;

        song.addToOrder(this.props.selectedVerses.map(v => v.id));
    };

    private onSetChorus = () => {
        let lastVerse = this.props.selectedVerses[this.props.selectedVerses.length - 1];
        this.props.currentSong.setChorus(lastVerse);
    };
    
    public render() {
        const currentSong = this.props.currentSong || {completeVerses: []};
        let selectedIndexes = [];
        const options = currentSong.completeVerses.map((verse, index) => {
            if(this.props.selectedVerses.find(v => v.id === verse.id) !== undefined) selectedIndexes.push(index);
            return {
            id: verse.id,
            text: verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title,
            altText: "NEW VERSE"
        }});
    
        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                <List selectedIndex={selectedIndexes} onUpdate={this.onVerseClick} options={options} />
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