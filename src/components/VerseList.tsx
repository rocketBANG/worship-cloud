import * as React from 'react'
import { observer } from 'mobx-react'
import { List, IOptions } from './List'
import { IObservableValue, IObservableArray, trace, computed } from 'mobx';
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';
import { DisplaySong } from '../models/DisplaySong';

interface IProps {
    selectedVerses: IObservableArray<Verse>
    currentSong: Song
}

@observer class VerseList extends React.Component<IProps> {

    public static MapVerseToIOptions = (song: Song | DisplaySong, verses: Verse[] = song && song.completeVerses, append?: string[]): IOptions[] => {
        if(song === undefined) return [];

        let versesWithTitles = song.getUniqueVerseTitles;
        let options = verses.map((verse, i): IOptions => {            
            let title = (versesWithTitles.find(v => v.verseId === verse.id) || {title: verse.title}).title;

            let appendText = append && append.length > i && append[i];
            if(appendText) title = title + appendText

            return {
            id: verse.id,
            text: verse.type === "chorus" ? "CHORUS: " + title : title,
            altText: "NEW VERSE"
        }});
        return options;
    }

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
        lastVerse.setChorus();
    };

    @computed private get options() {
        return VerseList.MapVerseToIOptions(this.props.currentSong);
    }
    
    public render() {
        let options = this.options;
        let selectedIndexes = this.props.selectedVerses.map(v => options.findIndex(o => o.id === v.id));

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
};

export default VerseList;