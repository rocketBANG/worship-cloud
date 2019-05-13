import * as React from 'react';
import '../../style/SettingsInput.css';

export enum SettingsType {
    Number, 
}

interface IProps {
    onChange: (changeData: {name: string, value: number}) => void;
    name: string;
    value: string;
    type?: SettingsType
}

export class SettingsInput extends React.Component<IProps> {

    public state = {
        value: "",
        isError: false,
    }

    constructor(props) {
        super(props);
        this.state = {value: props.value, isError: false};
    }

    public componentWillReceiveProps = (nextProps) => {
        this.setState({value: nextProps.value});
    }

    private onChange = (e) => {
        this.setState({value: e.target.value});
        const parsed = parseFloat(e.target.value);
        if(parsed) {
            this.props.onChange({name: e.target.name, value: parsed});
            this.setState({isError: false});
        } else {
            this.setState({isError: true});
        }
    }

    public render() {
        return (
            <div className="SettingsInput">
                <label htmlFor={this.props.name}>{this.props.name + 
                    (this.state.isError ? "!" : "")}</label>
                <br />
                <input className={this.props.name} name={this.props.name}
                    type="text" value={this.state.value} onChange={this.onChange} />
            </div>
        )
    }
}