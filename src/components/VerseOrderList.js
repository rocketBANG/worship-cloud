import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'

const VerseList = observer(class VerseList extends React.Component {

    state = {
        index: -1,
        indexes: []
    };

    onVerseClick = (names, indexes) => {
        this.props.state.currentVerse = this.props.state.currentSong.verseOrder[indexes[0]];
        this.setState({
            index: indexes[0],
            indexes: indexes
        })
    };

    onOrderRemove = () => {
        this.props.state.currentSong.removeFromOrder(this.state.indexes)
    };

    onOrderUp = () => {
        if(this.state.indexes[0] < 1) {
            return;
        }
        this.props.state.currentSong.reorder(this.state.indexes, -1);
        this.setState({indexes: this.state.indexes.map(i => i - 1)});
    };

    onOrderDown = () => {
        if(this.state.indexes[this.state.indexes.length - 1] > this.props.state.currentSong.verseOrder.length - 2) {
            return;
        }
        this.props.state.currentSong.reorder(this.state.indexes, +1);
        this.setState({indexes: this.state.indexes.map(i => i + 1)});
    };
    
    render() {
        let currentSong = this.props.state.currentSong || {};
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