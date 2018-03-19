import { observer } from "mobx-react";
import React from 'react';
import "../style/SettingsPage.css"
import { SettingsInput } from "../components/settings/SettingsInput";
const SettingsPage = observer(class SettingsPage extends React.Component {

    state = { firstInput: ""}

    handleSettingsChange = (changeEvent) => {
        this.setState({[changeEvent.target.name]: changeEvent.target.value})
    }

    render() {
        return (
            <div className="SettingsPage">
                <SettingsInput name="firstInput" value={this.state.firstInput} onChange={this.handleSettingsChange} />
                <SettingsInput name="secondInput" value={this.state.firstInput} onChange={this.handleSettingsChange} />
            </div>
        )
    }
});

export { SettingsPage };