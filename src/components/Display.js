import React from 'react'
import { observer } from 'mobx-react'
import '../style/Display.css'
import 'any-resize-event'
import PropTypes from 'prop-types'

const wordFontSize = 0.0011;
const titleFontSize = 0.0012;

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
        };

        this.updateSize = this.updateSize.bind(this);
    }

    splitLines(text) {
        if(text) {
            return text.split("\n").map((line, index) => {
                return (<p key={index}>{line}</p>)
            });
        } else {
            return "";
        }
    }

    updateSize(fontSize) {
        fontSize = fontSize || this.props.fontSize || 50;

        if(this.props.isFullscreen) {    
            this.setState({
                width: '100%',
                height: '100%',
                titleFontSize: window.innerWidth * fontSize * titleFontSize + "px",
                verseFontSize: window.innerWidth * fontSize * wordFontSize + "px",    
            });
            return;
        }

        if(this.wrapper === undefined) {
            return
        }
        let maxWidth = this.wrapper.offsetHeight * this.ratio;
        let maxHeight = this.wrapper.offsetWidth / this.ratio;
        if(maxWidth < this.wrapper.offsetWidth) {
            this.setState({
                width: maxWidth,
                height: "100%",
                titleFontSize: maxWidth * fontSize * titleFontSize + "px",
                verseFontSize: maxWidth * fontSize * wordFontSize + "px",    
            })
        } else {
            this.setState({
                height: maxHeight,
                width: "100%",
                titleFontSize: maxHeight * this.ratio * fontSize * titleFontSize + "px",
                verseFontSize: maxHeight * this.ratio * fontSize * wordFontSize + "px",    
            })
        }
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

    getStyles = () => {
        return  {
            fontSize: this.state.verseFontSize,
            lineHeight: this.props.lineHeight,
            paddingLeft: this.props.indentAmount + "em",
            textIndent: (-this.props.indentAmount) + "em"
        };
    }

    measureLines = (textArray) => {
        let div = document.createElement("div");
        document.body.appendChild(div);

        div.classList.add("VerseText");

        let styles = this.getStyles();
        for(let style in styles) {
            if(styles.hasOwnProperty(style)) {
                div.style[style] = styles[style];
            }
        }
        div.style.boxSizing = "border-box";
        div.style.width = this.verseText.clientWidth-1 + "px";
        div.innerHTML = "<p>test</p>";
        let singleLineHeight = div.clientHeight;

        let weightedLines = textArray.map(t => {
            div.innerHTML = "<p>" + t + "</p>";
            return {text: t, lines: div.clientHeight / singleLineHeight};
        })

        document.body.removeChild(div);
        return weightedLines;
    }

    render() {
        let wordsToUse = this.words || this.props.words;
        const words = this.props.isItallic ? <i>{this.splitLines(wordsToUse)}</i> : this.splitLines(wordsToUse);

        return (
            <div className="DisplayWrapper"
            ref={(node) => {this.wrapper = node }}>
                <div className="Display" style={{
                    width: this.state.width, 
                    height: this.state.height, 
                    backgroundColor: this.props.backgroundColor,
                }}>
                    <div className="TitleText" style={{fontSize: this.state.titleFontSize}}>
                        {this.props.title}
                    </div>
                    <div
                        ref = {r => this.verseText = r}
                        className="VerseText" style={this.getStyles()}>
                        {words}
                    </div>
                </div>
                <div className='displayChildren'>
                    {this.props.children}
                </div>
            </div>
        );
    }
    
    static propTypes = {
        words: PropTypes.string,
        title: PropTypes.string,
        isItallic: PropTypes.bool
    };
    
    
});

export default Display;