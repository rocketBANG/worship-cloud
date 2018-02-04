import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'

const VerseList = observer(class VerseList extends React.Component {

    onVerseClick = (names, indexes) => {

        this.props.state.currentVerse = this.props.state.currentSong.completeVerses[indexes[0]];
        
        this.setState({
            selectedId: names[0]
        })
    };

    onVerseAdd = () => {
        this.props.state.currentSong.addVerse("");
    };

    onVerseRemove = () => {
        this.props.state.currentSong.removeVerse(this.state.selectedId);
    };

    onAddToOrder = () => {
        let song = this.props.state.currentSong;

        song.addToOrder(this.state.selectedId);
    };

    onSetChorus = () => {
        this.props.state.currentSong.setChorus(this.state.selectedId);
    };
    
    render() {
        let currentSong = this.props.state.currentSong || {};
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