import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'

type Props = {
    currentVerse: IObservableValue<Verse>,
    currentSong: IObservableValue<Song>
}

type State = {

}

const VerseList = observer(class VerseList extends React.Component<Props, State> {

    state = {
        index: -1,
        indexes: []
    };

    onVerseClick = (names, indexes) => {
        this.props.currentVerse.set(this.props.currentSong.get().verseOrder[indexes[0]]);
        this.setState({
            index: indexes[0],
            indexes: indexes
        })
    };

    onOrderRemove = () => {
        this.props.currentSong.get().removeFromOrder(this.state.indexes)
    };

    onOrderUp = () => {
        if(this.state.indexes[0] < 1) {
            return;
        }
        this.props.currentSong.get().reorder(this.state.indexes, -1);
        this.setState({indexes: this.state.indexes.map(i => i - 1)});
    };

    onOrderDown = () => {
        if(this.state.indexes[this.state.indexes.length - 1] > this.props.currentSong.get().verseOrder.length - 2) {
            return;
        }
        this.props.currentSong.get().reorder(this.state.indexes, +1);
        this.setState({indexes: this.state.indexes.map(i => i + 1)});
    };
    
    render() {
        let currentSong = this.props.currentSong.get() || {};
        const options = (currentSong.verseOrder || []).map((verse, index) => ({
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