import React from 'react';
import '../../style/SettingsInput.css';

export class SettingsInput extends React.Component {

    render() {
        return (
            <div className="SettingsInput">
                <label htmlFor={this.props.name}>{this.props.name}</label>
                <br />
                <input id={this.props} className={this.props.name} name={this.props.name}
                    type="text" value={this.props.value} onChange={this.props.onChange} />
            </div>
        )
    }
}