import * as React from 'react';
import './Popup.css';

interface IState {
    title: string,
    text: string,
    hidden: boolean,
    inputText: string,
}

class PopupManager {
    public static popup: Popup;

    public static showPopup(title: string, text: string, onClose?: (text: string) => void) {
        this.popup.show(title, text, onClose);
    }
}

export class Popup extends React.Component<{}, IState> {
    private static initialState = {
        title: "",
        text: "",
        hidden: true,
        inputText: "",
    }

    public state = Popup.initialState;

    private onClose: (text: string) => void;

    public static showPopup(title: string, text: string, onClose?: (text: string) => void) {
        PopupManager.showPopup(title, text, onClose);
    }

    public finishPopup = () => {
        if(this.onClose !== undefined) this.onClose(this.state.inputText);

        this.setState(Popup.initialState);
    }

    public componentDidMount() {
        PopupManager.popup = this;
    }

    public componentWillUnmount() {
        if(PopupManager.popup !== this) return;
        PopupManager.popup = undefined;
    }

    private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({inputText: e.target.value});
    }

    public show(title: string, text: string, onClose?: (text: string) => void) {
        this.setState({title, inputText: text, hidden: false});
        this.onClose = onClose;
    }

    public render() {
        let popup;
        if (!this.state.hidden) {
            popup = (
                <div className='popup'>
                    <p>{this.state.title}</p>
                    <form onSubmit={this.finishPopup}>
                        <input onChange={this.onInputChange} value={this.state.inputText} />
                        <input type="submit" value='Ok' />
                    </form>
                </div>
            );
        }
        
        return (
            <div className={this.state.hidden ? 'popupHidden' : 'popupBlackout'}>
                {popup}
            </div>
        );
    }
}