import { observer } from "mobx-react";
import React from 'react';
import "../style/SettingsPage.css"
import { SettingsInput } from "../components/settings/SettingsInput";
import { SettingsModel } from "../models/settings/SettingsModel";
const SettingsPage = observer(class extends React.Component {

    state = { }

    settingsModel = SettingsModel.settingsModel;

    constructor(props) {
        super(props);
        this.settingsModel.loadSettings();
    }

    handleSettingsChange = (changeEvent) => {
        this.settingsModel.changeSetting(changeEvent.name, changeEvent.value);
    }

    render() {

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