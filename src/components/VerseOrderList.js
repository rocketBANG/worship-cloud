import React from 'react'
import PropTypes from 'prop-types'
import {List} from './List'

class VerseOrderList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            index: -1
        };
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.songName !== this.props.songName) {
            this.setState({
                index: -1
            });    
        }
    }    

    handleUpdate(value, index) {
        this.setState({
            index: index
        });
        this.props.onVerseClick(value);
    }

    setIndex(index) {
        this.setState({
            index: index
        });
    }

    render() {
        let { verses, songName, onOrderUp, onOrderDown, onOrderRemove} = this.props;

        const options = verses.map((element) => {
            return {
            id: element.verseId,
            text: element.firstLine,
            altText: "NEW VERSE"
        }});
    
        return (
            <div className="VerseOrderList EditorContainer">
                <div className="ListHeader">Order:</div>
                <List selectedIndex={this.state.index} options={options} onUpdate={this.handleUpdate} />
                <div className="ListControls">
                    <button onClick={() => {this.setIndex(this.state.index - 1); onOrderUp(this.state.index, songName)}} >up</button>
                    <button onClick={() => {this.setIndex(this.state.index + 1); onOrderDown(this.state.index, songName)}}>down</button>
                    <button onClick={() => {this.setIndex(this.state.index - 1); onOrderRemove(this.state.index, songName)}}>x</button>
                </div>
            </div>
        )
    }

    static propTypes = {
        verses: PropTypes.arrayOf(PropTypes.shape({
            verseId: PropTypes.string.isRequired,
            firstLine: PropTypes.string.isRequired,
        })).isRequired,
        songName: PropTypes.string,
        currentVerse: PropTypes.string,
        onVerseClick: PropTypes.func.isRequired,
        onOrderRemove: PropTypes.func.isRequired,
        onOrderUp: PropTypes.func.isRequired,
        onOrderDown: PropTypes.func.isRequired,
    }
}

export default VerseOrderList
