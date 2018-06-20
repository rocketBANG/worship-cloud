import * as React from 'react'
import { observer } from 'mobx-react'
import '../style/PresenterDisplay.css'
import 'any-resize-event'
import { Display } from '../components/Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../models/settings/SettingsModel';
import { DisplaySong } from '../models/DisplaySong';

interface IProps {
    currentSong: DisplaySong,
};

class PresenterDisplay extends React.Component<IProps> {
    private fontIncrement = 3;

    private settingsModel = SettingsModel.settingsModel;

    private display;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    // true if the font size should increase
    // false if the font size should decrease
    private onFontChange = (fontChange) => {
        if(fontChange) {
            this.settingsModel.changeWordFont(this.fontIncrement);
        } else {
            this.settingsModel.changeWordFont(-this.fontIncrement);
        }
    };

    public componentWillReceiveProps(nextProps) {
        if(nextProps.currentSong) {
            nextProps.currentSong.setDisplay(this.display);
        }
    }

    public render() {
        const currentSong = this.props.currentSong || 
        {currentVerse: {}, currentPage: "", verseIndex: -1, pageIndex: -1, title: undefined, backgroundColor: undefined
            ,isBlanked: false, currentNumPages: -1};
        const currentVerse = currentSong.currentVerse || {type: ''};
        const currentPage = currentSong.currentPage;

        let title = currentSong.verseIndex > 0 || currentSong.pageIndex > 0? "" : currentSong.title || '';
        let words = currentPage || '';
        const backgroundColor = currentSong.backgroundColor;

        if(currentSong.isBlanked) {
            title = '';
            words = '';
        }

        const props = {
            lineHeight: this.settingsModel.lineHeight,
            indentAmount: this.settingsModel.indentAmount,
            backgroundColor,
            fontSize: this.settingsModel.wordFontSize || 0
        }

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', title);
        localStorage.setItem('display-setWords', words);
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' ?  'true' : 'false');
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
    
}

export default observer(PresenterDisplay);