import React from 'react'
import { observer } from 'mobx-react'
import '../style/PresenterDisplay.css'
import 'any-resize-event'
import Display from '../components/Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../models/settings/SettingsModel';
import { DisplaySong } from '../models/DisplaySong';

type Props = {
    currentSong: DisplaySong,
};

type State = {
}

const PresenterDisplay = observer(class extends React.Component<Props, State> {
    fontIncrement = 3;

    settingsModel = SettingsModel.settingsModel;

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

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.currentSong) {
            nextProps.currentSong.setDisplay(this.display);
        }
    }

    render() {
        let currentSong = this.props.currentSong || {};
        let currentVerse = currentSong.currentVerse || {};
        let currentPage = currentSong.currentPage || "";

        let title = currentSong.verseIndex > 0 || currentSong.pageIndex > 0? "" : currentSong.title || '';
        let words = currentPage || '';
        let backgroundColor = currentSong.backgroundColor;

        if(currentSong.isBlanked) {
            title = '';
            words = '';
        }

        let props = {
            lineHeight: this.settingsModel.lineHeight,
            indentAmount: this.settingsModel.indentAmount,
            backgroundColor: backgroundColor,
            fontSize: this.settingsModel.wordFontSize || 0
        }

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', title);
        localStorage.setItem('display-setWords', words);
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' || false);
        localStorage.setItem('display-setStyle', JSON.stringify(props));

        return (
            <div className="PresenterDisplay">
                <Display 
                    ref={r => this.display = r}
                    id='PresenterDisplay' 
                    title={title} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={words}
                    {...props}
                >
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