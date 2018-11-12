import * as React from 'react'
import { observer } from 'mobx-react'
import { DisplaySong } from '../models/DisplaySong';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SettingsModel } from '../models/settings/SettingsModel';
import { PresenterModel } from 'src/models/PresenterModel';

interface IProps {
    presenterModel: PresenterModel,
    list: SongListModel,
    onNext?: () => void,
    onPrev?: () => void,
    onFullscreen?: () => void,
    showButtons?: boolean,
    presenter: PresenterModel
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

            if (this.props.presenter.Blanked) {
                this.props.presenter.Blanked = false;
                return;
            }
            this.onNext();

        } else if(keyName === 'ArrowLeft') {
            keyEvent.preventDefault();

            if (this.props.presenter.Blanked) {
                this.props.presenter.Blanked = false;
                return;
            }
            this.onPrev();

        } else if(keyName === 'b') {
            keyEvent.preventDefault();
            this.props.presenter.Blanked = !this.props.presenter.Blanked;

        } else if(keyName === 'l') {
            keyEvent.preventDefault();
            this.props.presenter.Frozen = !this.props.presenter.Frozen;

        } else if (keyName === 'ArrowUp') {
            keyEvent.preventDefault();
            this.onPrevVerse();

        } else if (keyName === 'ArrowDown') {
            keyEvent.preventDefault();
            this.onNextVerse();

        }
    }

    private onNextVerse = () => {
        const goNext = this.props.presenterModel.Song.nextVerse();
        if(goNext) return;
        if(this.props.onNext) this.props.onNext();
    }

    private onPrevVerse = () => {
        const goPrev = this.props.presenterModel.Song.prevVerse();
        if(goPrev) return;
        if(this.props.onPrev) this.props.onPrev();
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
        const goNext = this.props.presenterModel.Song.nextPage();
        if(goNext) return;
        if(this.props.onNext) this.props.onNext();
    };

    private onPrev = () => {
        const goPrev = this.props.presenterModel.Song.prevPage();
        if(goPrev) return;
        if(this.props.onPrev) this.props.onPrev();
    };

    private onFullscreen = () => {
        if(this.props.onFullscreen) this.props.onFullscreen();
    }

    private onSetBlanked = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.presenter.Blanked = event.target.checked;
    }

    public render() {

        const buttons = (
            <React.Fragment>
                <button onClick={this.onPrev} disabled={this.props.presenterModel.Song === undefined}>Previous</button>
                <button onClick={this.onNext} disabled={this.props.presenterModel.Song === undefined}>Next</button>
                <button onClick={() => this.onFontChange(false)}>Font-</button>
                <button onClick={() => this.onFontChange(true)}>Font+</button>
                <button onClick={this.onFullscreen}>Fullscreen</button>

                <label>
                    Blanked
                    <input type='checkbox' checked={this.props.presenter.Blanked} onChange={this.onSetBlanked} />
                </label>
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