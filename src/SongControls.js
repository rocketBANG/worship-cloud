import React, { Component } from 'react';
import { addSong, updateTitle } from './store/actions';

export default class SongControls extends Component {
    
    constructor(props) {
        super(props);
        this.state = {songName: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);        
    }

    handleChange(event) {
        this.setState({songName: event.target.value});
    }

    handleClick(event) {
        this.props.store.dispatch(updateTitle(this.props.store.getState().editor.currentSong, this.state.songName));
    }

    render() {
        return (
            <div className="controls">
                Name: <input type="text" value={this.state.songName} onChange={this.handleChange} />
                <button onClick={this.handleClick}>Button</button>
            </div>
        );
    }
}    