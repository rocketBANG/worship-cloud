import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'

const VerseList = observer(class VerseList extends React.Component {

    onVerseClick = (name, index) => {
        this.props.state.currentVerse = this.props.state.currentSong.verses[index];
        this.setState({
            selectedIndex: index
        })
    }

    onVerseAdd = () => {
        this.props.state.currentSong.addVerse("");
    }

    onVerseRemove = () => {
        this.props.state.currentSong.removeVerse(this.state.selectedIndex);
    }
    
    render() {
        let currentSong = this.props.state.currentSong || {};
        const options = (currentSong.verses || []).map((verse, index) => ({
            id: verse.id,
            text: verse.text,
            altText: "NEW VERSE"
        }));
    
        return (
            <div className="VerseList EditorContainer">
                <div className="ListHeader">Verses:</div>
                <List onUpdate={this.onVerseClick} options={options} />
                <div className="ListControls">
                    <button onClick={this.onVerseAdd} >Add Verse</button>
                    <button onClick={this.onVerseRemove}>Remove Verse</button>
                </div>
            </div>
        )    
    }
})

export default VerseList;