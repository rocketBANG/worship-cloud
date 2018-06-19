import React from 'react'
import { observer } from 'mobx-react'

const DisplayControls = observer(class extends React.Component {
    
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
        } else if(keyName === 'ArrowLeft') {
            this.onPrev();
        } else if(keyName === 'b') {
            this.props.song.setBlack();
        } else if(keyName === 'w') {
            this.props.song.setWhite();
        }
    }

    onNext = () => {
        this.props.song.nextPage();
    };

    onPrev = () => {
        this.props.song.prevPage();
    };

    render() {
        return (
            <div className="DisplayControls">
                <button onClick={this.onPrev} disabled={this.props.song === undefined}>Previous</button>
                <button onClick={this.onNext} disabled={this.props.song === undefined}>Next</button>
                <button onClick={() => this.props.fontChange(false)}>Font-</button>
                <button onClick={() => this.props.fontChange(true)}>Font+</button>
            </div>
        );
    }
});

export default DisplayControls;