import React from 'react'
import { observer } from 'mobx-react'
// import '../style/PresenterDisplay.css'
import 'any-resize-event'
import PropTypes from 'prop-types'
import Display from '../components/Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';

const PresenterDisplay = observer(class PresenterDisplay extends React.Component {
    state = {
        fontSize: 50
    };

    fontIncrement = 3;

    // true if the font size should increase
    // false if the font size should decrease
    onFontChange = (fontChange) => {
        if(fontChange) {
            this.setState({fontSize: this.state.fontSize + this.fontIncrement});
        } else {
            this.setState({fontSize: this.state.fontSize - this.fontIncrement});
        }
    };

    render() {
        let currentSong = this.props.song || {};
        let currentVerse = currentSong.currentVerse || {};
        let currentPage = currentSong.currentPage || "";

        let title = currentSong.verseIndex > 0 ? "" : currentSong.name || '';
        let words = currentPage || '';
        let backgroundColor = currentSong.backgroundColor;

        if(currentSong.isBlanked) {
            title = '';
            words = '';
        }

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', title);
        localStorage.setItem('display-setWords', words);
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' || false);
        localStorage.setItem('display-setFontSize', this.state.fontSize || 0);
        localStorage.setItem('display-setBackgroundColor', backgroundColor);

        return (
            <div className="PresenterDisplay">
                <Display 
                    fontSize={this.state.fontSize}
                    id='PresenterDisplay' 
                    title={title} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={words}
                    backgroundColor={backgroundColor}>
                    <DisplayControls song={this.props.song} fontChange={this.onFontChange}/>
                </Display>
                <DisplayOverlay pageIndicator="1/2" blankIndicator="blanked" />
            </div>
        );
    }    
    
});

export default PresenterDisplay;