import React from 'react'
import { observer } from 'mobx-react'
import { List } from './List'
import { Song } from '../models/Song'

const VerseList = observer(class VerseList extends React.Component {

    onVerseClick = (name, index) => {
        this.setState({
            currentVerse: name,
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
        const options = (this.props.verses || []).map((verse, index) => ({
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