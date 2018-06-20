import * as React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { Verse } from '../models/Verse';
import { IObservableValue } from 'mobx';
import { Song } from '../models/Song';

interface IProps {
    currentVerse: IObservableValue<Verse>,
    currentSong: Song
}

interface IState {
    index: number,
    indexes: number[],
}

const VerseList = observer(class extends React.Component<IProps, IState> {

    public state = {
        index: -1,
        indexes: []
    };

    private onVerseClick = (names, indexes) => {
        this.props.currentVerse.set(this.props.currentSong.verseOrder[indexes[0]]);
        this.setState({
            index: indexes[0],
            indexes
        })
    };

    private onOrderRemove = () => {
        this.props.currentSong.removeFromOrder(this.state.indexes)
    };

    private onOrderUp = () => {
        if(this.state.indexes[0] < 1) {
            return;
        }
        this.props.currentSong.reorder(this.state.indexes, -1);
        this.setState({indexes: this.state.indexes.map(i => i - 1)});
    };

    private onOrderDown = () => {
        if(this.state.indexes[this.state.indexes.length - 1] > this.props.currentSong.verseOrder.length - 2) {
            return;
        }
        this.props.currentSong.reorder(this.state.indexes, +1);
        this.setState({indexes: this.state.indexes.map(i => i + 1)});
    };
    
    public render() {
        const currentSong = this.props.currentSong || {verseOrder: []};
        const options = currentSong.verseOrder.map((verse, index) => ({
            id: verse.id,
            text: verse.type === "chorus" ? "CHORUS: " + verse.title : verse.title,
            altText: "NEW VERSE"
        }));
    
        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Order:</div>
                <List selectedIndex={this.state.indexes} onUpdate={this.onVerseClick} options={options} />
                <div className="ListControls">
                <button onClick={this.onOrderUp} >up</button>
                <button onClick={this.onOrderDown}>down</button>
                <button onClick={this.onOrderRemove}>x</button>
            </div>
            </div>
        )    
    }
});

export default VerseList;