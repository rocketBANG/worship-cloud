import * as React from 'react'
import { observer } from 'mobx-react'
import { DisplaySong } from '../models/DisplaySong';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SettingsModel } from '../models/settings/SettingsModel';

interface IProps {
    song: DisplaySong,
    list: SongListModel,
    onNext?: () => void,
    onPrev?: () => void,
    onFullscreen?: () => void,
    showButtons?: boolean
}

class DisplayControls extends React.Component<IProps> {
    private settingsModel = SettingsModel.settingsModel;
    private fontIncrement = 3;

    public componentDidMount() {
        window.addEventListener('keydown', this.processKeyDown);
        this.settingsModel.loadSettings();
    }

    public componentWillUnmount() {
        window.removeEventListener('keydown', this.processKeyDown)
    }

    private processKeyDown = (keyEvent: KeyboardEvent) => {
        const keyName = keyEvent.key;

        if(keyName === 'ArrowRight') {
            keyEvent.preventDefault();
            this.onNext();
        } else if(keyName === 'ArrowLeft') {
            keyEvent.preventDefault();
            this.onPrev();
        } else if(keyName === 'b') {
            keyEvent.preventDefault();
            this.props.song.setBlack();
        } else if(keyName === 'w') {
            keyEvent.preventDefault();
            this.props.song.setWhite();
        }
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


    private onNext = () => {
        const goNext = this.props.song.nextPage();
        if(goNext) return;
        if(this.props.onNext) this.props.onNext();
    };

    private onPrev = () => {
        const goPrev = this.props.song.prevPage();
        if(goPrev) return;
        if(this.props.onNext) this.props.onPrev();
    };

    private onFullscreen = () => {
        if(this.props.onFullscreen) this.props.onFullscreen();
    }

    public render() {

        const buttons = (
            <React.Fragment>
                <button onClick={this.onPrev} disabled={this.props.song === undefined}>Previous</button>
                <button onClick={this.onNext} disabled={this.props.song === undefined}>Next</button>
                <button onClick={() => this.onFontChange(false)}>Font-</button>
                <button onClick={() => this.onFontChange(true)}>Font+</button>
                <button onClick={this.onFullscreen}>Fullscreen</button>
            </React.Fragment>
        )

        return (
            <div className="DisplayControls">
                {this.props.showButtons !== undefined ? this.props.showButtons && buttons : buttons}
            </div>
        );
    }
};

export default observer(DisplayControls);