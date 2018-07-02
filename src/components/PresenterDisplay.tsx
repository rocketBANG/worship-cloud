import * as React from 'react'
import { observer } from 'mobx-react'
import '../style/PresenterDisplay.css'
import 'any-resize-event'
import { Display } from '../components/Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../models/settings/SettingsModel';
import { DisplaySong } from '../models/DisplaySong';
import { SongListModel } from '../models/song-lists/SongListModel';
import { IObservableValue, trace, decorate, observable, extendObservable } from 'mobx';

interface IProps {
    currentSong: DisplaySong,
    currentList: IObservableValue<SongListModel>
};

export interface IExtraDisplayProps {
    lineHeight: number,
    indentAmount: number,
    backgroundColor: string,
    fontSize: number
}

export const PresenterDisplay = observer(class extends React.Component<IProps> {
    public settingsModel = SettingsModel.settingsModel;

    private display;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    public componentWillReceiveProps(nextProps) {
        if(nextProps.currentSong) {
            nextProps.currentSong.setDisplay(this.display);
        }
    }

    public render() {
        const currentSong = this.props.currentSong || 
        new DisplaySong(undefined);
        const currentVerse = currentSong.currentVerse || {type: ''};
        const currentPage = currentSong.currentPage;

        let title = currentSong.verseIndex > 0 || currentSong.pageIndex > 0? "" : currentSong.title || '';
        let words = currentPage || '';
        const backgroundColor = currentSong.backgroundColor;

        if(currentSong.isBlanked) {
            title = '';
            words = '';
        }

        const props: IExtraDisplayProps = {
            lineHeight: this.settingsModel.lineHeight,
            indentAmount: this.settingsModel.indentAmount,
            backgroundColor,
            fontSize: this.settingsModel.wordFontSize
        }

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', title);
        localStorage.setItem('display-setWords', words);
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' ?  'true' : 'false');
        localStorage.setItem('display-setStyle', JSON.stringify({...props}));

        return (
            <div className="PresenterDisplay">
                <Display 
                    ref={r => this.display = r}
                    title={title} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={words}
                    {...props}
                />
                <DisplayOverlay currentPage={currentSong && (currentSong.pageIndex+1)}
                    totalPages={currentSong && currentSong.currentNumPages}
                    blankIndicator={currentSong.isBlanked ? "Blanked" : ""} />
            </div>
        );
    }    
    
});