import { observer } from "mobx-react";
import * as React from 'react';
import "../style/SettingsPage.css"
import { SettingsInput } from "../components/settings/SettingsInput";
import { SettingsModel } from "../models/settings/SettingsModel";
const SettingsPage = observer(class extends React.Component {

    public state = { }

    private settingsModel = SettingsModel.settingsModel;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    private handleSettingsChange = (changeEvent) => {
        this.settingsModel.changeSetting(changeEvent.name, changeEvent.value);
    }

    public render() {

        const allSettings = SettingsModel.settingsList.map((setting) => 
            <SettingsInput 
                key={setting}
                name={setting} 
                value={this.settingsModel[setting]} 
                onChange={this.handleSettingsChange} />
        );
        return (
            <div className="SettingsPage">
                <div className="SettingsList">
                    {allSettings}
                </div>
            </div>
        )
    }
});

export { SettingsPage };