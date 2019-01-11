import * as React from 'react'
import { observer } from 'mobx-react'
import { IObservableValue, IObservableArray, trace, computed } from 'mobx';
import { Verse } from '../models/songs/Verse';
import { Song } from '../models/songs/Song';
import { DisplaySong } from '../models/songs/DisplaySong';
import { IListItem } from './general/IListItem';
import { ScrollList } from './general/ScrollList';

interface IProps {
    selectedVerses: IObservableArray<Verse>
    currentSong: Song
}

@observer class VerseList extends React.Component<IProps> {

    public static MapVerseToISelectItem = (song: Song | DisplaySong, verses: Verse[] = song && song.completeVerses, append?: string[]): IListItem[] => {
        if(song === undefined) return [];

        let versesWithTitles = song.getUniqueVerseTitles;
        let options = verses.map((verse, i): IListItem => {
            let title = (versesWithTitles.find(v => v.verseId === verse.id) || {title: verse.title}).title;

            let appendText = append && append.length > i && append[i];
            if(appendText) title = title + appendText

            return {
                value: verse.id,
                label: verse.type === "chorus" ? "CHORUS: " + title : title,
                altLabel: "NEW VERSE"
        }});
        return options;
    }

    private onVerseClick = (items: IListItem[], indexes: number[]) => {

        this.props.selectedVerses.clear();
        let newVerses = items.map(item => this.props.currentSong.completeVerses.find(v => v.id === item.value));
        this.props.selectedVerses.push(...newVerses);
        
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
        return VerseList.MapVerseToISelectItem(this.props.currentSong);
    }
    
    public render() {
        let options = this.options;
        let selectedIndexes = this.props.selectedVerses.map(v => options.findIndex(o => o.value === v.id));

        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                <ScrollList selected={selectedIndexes} onUpdate={this.onVerseClick} items={options} />
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