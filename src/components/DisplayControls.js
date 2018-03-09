import React from 'react'
import { observer } from 'mobx-react'

const DisplayControls = observer(class DisplayControls extends React.Component {
    
    componentDidMount = () => {
        window.addEventListener('keydown', this.processKeyDown)
    }

    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.processKeyDown)
    }

    processKeyDown = (keyEvent) => {
        const keyName = keyEvent.key;

        if(keyName === 'ArrowRight') {
            this.onNext();
        } else if(keyName == 'ArrowLeft') {
            this.onPrev();
        } else if(keyName == 'b') {
            this.props.state.currentSong.setBlack();
        } else if(keyName == 'w') {
            this.props.state.currentSong.setWhite();
        }
    }

    onNext = () => {
        this.props.state.currentSong.nextPage();
    };

    onPrev = () => {
        this.props.state.currentSong.prevPage();
    };

    render() {
        return (
            <div className="DisplayControls">
                <button onClick={this.onPrev} disabled={this.props.state.currentSong === undefined}>Previous</button>
                <button onClick={this.onNext} disabled={this.props.state.currentSong === undefined}>Next</button>
                <button onClick={() => this.props.fontChange(false)}>Font-</button>
                <button onClick={() => this.props.fontChange(true)}>Font+</button>
            </div>
        );
    }
});

export default DisplayControls;