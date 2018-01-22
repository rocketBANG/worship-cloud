import React from 'react'
import { observer } from 'mobx-react'
import '../style/Display.css'
import 'any-resize-event'
import PropTypes from 'prop-types'
import { Verse } from '../models/Verse';
import { Song } from '../models/Song';

const Display = observer(class Display extends React.Component {
    ratio = 4.0/3.0;
    wrapper = undefined;

    constructor(props) {
        super(props);
        this.state= {
            width: 400,
            height: 300,
            titleFontSize: "40px",
            verseFontSize: "20px",
        }

        this.updateSize = this.updateSize.bind(this);
    }

    splitLines(text) {
        if(text) {
            return text.split("\n").map((line, index) => {
                return (<span key={index}>{line}<br /></span>)
            });
        } else {
            return "";
        }
    }

    updateSize() {
        if(this.wrapper === undefined) {
            return
        }
        let maxWidth = this.wrapper.offsetHeight * this.ratio;
        let maxHeight = this.wrapper.offsetWidth / this.ratio;
        if(maxWidth < this.wrapper.offsetWidth) {
            this.setState({
                width: maxWidth,
                height: "100%",
                titleFontSize: maxWidth * 0.08 + "px",
                verseFontSize: maxWidth * 0.05 + "px",    
            })
        } else {
            this.setState({
                height: maxHeight,
                width: "100%",
                titleFontSize: maxHeight * this.ratio * 0.08 + "px",
                verseFontSize: maxHeight * this.ratio * 0.05 + "px",    
            })
        }
    }

    componentDidMount() {
        this.wrapper.addEventListener('onresize', this.updateSize)
    }

    componentWillUnmount() {
        this.wrapper.removeEventListener("resize", this.updateSize);
    }


    render() {

        let currentSong = this.props.state.currentSong || {};
        let currentVerse = currentSong.currentVerse || {};

        const words = currentVerse.type === "chorus" ? <i>{this.splitLines(currentVerse.text)}</i> : this.splitLines(currentVerse.text)

        return (
            <div className="DisplayWrapper"
            ref={(node) => {this.wrapper = node }}>
                <div className="Display" style={{width: this.state.width, height: this.state.height}}>
                    <div className="TitleText" style={{fontSize: this.state.titleFontSize}}>
                        {currentSong.verseIndex > 0 ? "" : currentSong.name}
                    </div>
                    <div className="VerseText" style={{fontSize: this.state.verseFontSize}}>
                        {words}
                    </div>
                </div>
            </div>
        );
    }
    
    static propTypes = {
        state: PropTypes.shape({
            currentSong: PropTypes.instanceOf(Song)
        }).isRequired,
        showTite: PropTypes.bool
    };
    
    
});

export default Display;