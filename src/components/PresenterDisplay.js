import React from 'react'
import { observer } from 'mobx-react'
import '../style/PresenterDisplay.css'
import 'any-resize-event'
import Display from '../components/Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../models/settings/SettingsModel';

const PresenterDisplay = observer(class PresenterDisplay extends React.Component {
    fontIncrement = 3;

    settingsModel = new SettingsModel();

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    // true if the font size should increase
    // false if the font size should decrease
    onFontChange = (fontChange) => {
        if(fontChange) {
            this.settingsModel.changeWordFont(this.fontIncrement);
        } else {
            this.settingsModel.changeWordFont(-this.fontIncrement);
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
        localStorage.setItem('display-setFontSize', this.settingsModel.wordFontSize || 0);
        localStorage.setItem('display-setBackgroundColor', backgroundColor);

        return (
            <div className="PresenterDisplay">
                <Display 
                    fontSize={this.settingsModel.wordFontSize}
                    id='PresenterDisplay' 
                    title={title} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={words}
                    backgroundColor={backgroundColor}>
                    <DisplayControls song={currentSong} fontChange={this.onFontChange}/>
                </Display>
                <DisplayOverlay currentPage={currentSong && (currentSong.pageIndex+1)}
                    totalPages={currentSong && currentSong.currentNumPages}
                    blankIndicator={currentSong.isBlanked ? "Blanked" : ""} />
            </div>
        );
    }    
    
});

export default PresenterDisplay;