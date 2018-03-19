import React from 'react';

export class SettingsInput extends React.Component {

    render() {
        return (
            <span className="SettingsInput">
                <label htmlFor={this.props.name}>{this.props.name}</label>
                <input id={this.props} className={this.props.name} 
                    type="text" value={this.props.value} onChange={this.props.onChange} />
            </span>
        )
    }
}