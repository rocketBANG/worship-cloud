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
                <button onClick={this.onPrevVerse}>Previous</button>
                <button onClick={this.onNextVerse}>Next</button>
            </div>
        );
    }
});

export default DisplayControls;