import React from 'react'
import {connect} from 'react-redux'
import '../style/Display.css'
import 'any-resize-event'

class DisplayInternal extends React.Component {

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
        return (
            <div className="DisplayWrapper"
            ref={(node) => {this.wrapper = node }}>
                <div className="Display" style={{width: this.state.width, height: this.state.height}}>
                    <div className="TitleText" style={{fontSize: this.state.titleFontSize}}>
                        {this.props.showTitle ? this.props.currentSongObject.songName : ""}
                    </div>
                    <div className="VerseText" style={{fontSize: this.state.verseFontSize}}>
                        {this.splitLines(this.props.currentVerse.text)}
                    </div>
                </div>
            </div>
        );
    }
}

function getCurrentVerse(verses, song, verseIndex) {
    if(song !== undefined) {
        let verseId = song.order[verseIndex];
        return verses[verseId];
    }
    return {text: ""};
}

const mapStateToProps = state => {
    return {
        currentVerse: getCurrentVerse(state.verses.byId, state.songs.byId[state.display.currentSong], state.display.currentVerseIndex),
        currentSongObject: state.songs.byId[state.display.currentSong] || {order: []},
        showTitle: state.display.currentVerseIndex < 1
    }
}

const Display = connect(
    mapStateToProps
)(DisplayInternal)

export default Display
