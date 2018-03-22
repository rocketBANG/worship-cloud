import React from 'react';
import '../../style/SettingsInput.css';

export class SettingsInput extends React.Component {

    state = {
        value: "",
        isError: false,
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({value: nextProps.value});
    }

    onChange = (e) => {
        this.setState({value: e.target.value});
        if(parseFloat(e.target.value)) {
            this.props.onChange({name: e.target.name, value: parseFloat(e.target.value)});
            this.setState({isError: false});
        } else {
            this.setState({isError: true});
        }
    }

    render() {
        return (
            <div className="SettingsInput">
                <label htmlFor={this.props.name}>{this.props.name + 
                    (this.state.isError ? "!" : "")}</label>
                <br />
                <input id={this.props} className={this.props.name} name={this.props.name}
                    type="text" value={this.state.value} onChange={this.onChange} />
            </div>
        )
    }
}