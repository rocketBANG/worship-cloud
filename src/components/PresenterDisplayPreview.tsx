import * as React from 'react'
import { observer } from 'mobx-react'
import '../style/PresenterDisplay.css'
import 'any-resize-event'
import { Display } from '../components/Display';
import DisplayOverlay from './DisplayOverlay';
import { SettingsModel } from '../models/settings/SettingsModel';
import { SongListModel } from '../models/song-lists/SongListModel';
import { IObservableValue } from 'mobx';
import { PresenterModel } from 'src/models/PresenterModel';

interface IProps {
    currentList: IObservableValue<SongListModel>,
    presenterModel: PresenterModel
};

export interface IExtraDisplayProps {
    lineHeight: number,
    indentAmount: number,
    backgroundColor: string,
    fontSize: number
}

export const PresenterDisplayPreview = observer(class extends React.Component<IProps> {
    public settingsModel = SettingsModel.settingsModel;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    public render() {
        const props = this.props.presenterModel.PreviewDisplayProps;

        return (
            <div className="PresenterDisplay">
                <Display 
                    {...props}
                />
                <DisplayOverlay currentPage={props.currentPage}
                    totalPages={props.pagesInVerse}
                    blankIndicator={this.props.presenterModel.Blanked ? "Blanked" : ""} />
            </div>
        );
    }
    
});