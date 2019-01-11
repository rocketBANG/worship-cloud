import * as React from 'react'
import { observer } from 'mobx-react'
import '../../style/PresenterDisplay.css'
import 'any-resize-event'
import { Display } from './Display';
import DisplayControls from './DisplayControls';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../../models/settings/SettingsModel';
import { DisplaySong } from '../../models/songs/DisplaySong';
import { SongListModel } from '../../models/song-lists/SongListModel';
import { IObservableValue, trace, decorate, observable, extendObservable } from 'mobx';
import { PresenterModel } from 'src/models/display/PresenterModel';
import { IExtraDisplayProps } from './PresenterDisplayPreview';

interface IProps {
    currentList: IObservableValue<SongListModel>,
    presenterModel: PresenterModel
};

export const PresenterDisplay = observer(class extends React.Component<IProps> {
    public settingsModel = SettingsModel.settingsModel;

    private display;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    public componentWillReceiveProps(nextProps) {
        if(nextProps.presenterModel && nextProps.presenterModel.Song) {
            nextProps.presenterModel.Song.setDisplay(this.display);
        }
    }

    public render() {
        const currentSong = this.props.presenterModel.Song || new DisplaySong(undefined);

        const props = this.props.presenterModel.LiveDisplayProps;

        return (
            <div className="PresenterDisplay">
                <Display 
                    ref={r => this.display = r}
                    {...props}
                />
                <DisplayOverlay currentPage={props.currentPage}
                    totalPages={props.pagesInVerse}
                    blankIndicator={this.props.presenterModel.Blanked ? "Blanked" : ""} />
            </div>
        );
    }
    
});