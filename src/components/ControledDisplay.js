import React from 'react'
import { observer } from 'mobx-react'
import '../style/Display.css'
import 'any-resize-event'
import PropTypes from 'prop-types'
import Display from './Display'

const ControlledDisplay = observer(class ControlledDisplay extends Display {
    ratio = 4.0/3.0;
    wrapper = undefined;

    constructor(props) {
        super(props);
        this.state= {
            width: 400,
            height: 300,
            titleFontSize: "40px",
            verseFontSize: "20px",
        };

    }

    componentDidMount() {
        this.updateSize();
        this.wrapper.addEventListener('onresize', () => this.updateSize())
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.fontSize === this.props.fontSize) {
            return;
        }
        this.updateSize(nextProps.fontSize);
    }

    render() {
        const words = this.props.isItallic ? <i>{this.splitLines(this.props.words)}</i> : this.splitLines(this.props.words);

        return (
            <div className="DisplayWrapper"
            ref={(node) => {this.wrapper = node }}>
                <div className="Display" style={{width: this.state.width, height: this.state.height}}>
                    <div className="TitleText" style={{fontSize: this.state.titleFontSize}}>
                        {this.props.title}
                    </div>
                    <div className="VerseText" style={{fontSize: this.state.verseFontSize}}>
                        {words}
                    </div>
                </div>
                <div className='displayChildren'>
                    {this.props.children}
                </div>
            </div>
        );
    }    
    
});

export default ControlledDisplay;