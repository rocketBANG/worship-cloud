import React from 'react'
import { observer } from 'mobx-react'

const DisplayControls = observer(class DisplayControls extends React.Component {

    onNextVerse = () => {
        this.props.state.currentSong.nextVerse();
    }

    onPrevVerse = () => {
        this.props.state.currentSong.prevVerse();
    }

    render() {
        return (
            <div className="DisplayControls">
                <button onClick={this.onPrevVerse} disabled={this.props.state.currentSong === undefined}>Previous</button>
                <button onClick={this.onNextVerse} disabled={this.props.state.currentSong === undefined}>Next</button>
                <button onClick={() => this.props.fontChange(false)}>Font-</button>
                <button onClick={() => this.props.fontChange(true)}>Font+</button>
            </div>
        );
    }
});

export default DisplayControls;