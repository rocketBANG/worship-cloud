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

    private handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            this.settingsModel.changeSetting("backgroundImage", reader.result);
        }

        reader.readAsDataURL(file);
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
                    <input type="file" onChange={this.handleUploadFile} />
                    <img src={this.settingsModel.backgroundImage} alt="" style={{maxWidth: "300px"}}/>
                </div>
            </div>
        )
    }
});

export { SettingsPage };