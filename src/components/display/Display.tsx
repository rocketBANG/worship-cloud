import * as React from 'react'
import { observer } from 'mobx-react'
import '../../style/Display.css'
import 'any-resize-event'

const wordFontSize = 0.0011;
const titleFontSize = 0.0012;

interface IState {
    height: number | string,
    width: number | string,
    titleFontSize: string,
    verseFontSize: string,
}

interface IProps {
    isFullscreen?: boolean,
    fontSize: number,
    lineHeight: number,
    indentAmount: number,
    words: string,
    isItallic: boolean,
    backgroundColor: string,
    backgroundImage?: string,
    title: string,
}

const Display = observer(class extends React.Component<IProps, IState> {
    private ratio = 4.0/3.0;
    private wrapper = undefined;

    private verseText: HTMLDivElement;

    public state = {
        height: 300,
        titleFontSize: "40px",
        verseFontSize: "20px",
        width: 400,
    }

    private splitLines(text) {
        if(text) {
            return text.split("\n").map((line, index) => {
                return (<p key={index}>{line}</p>)
            });
        } else {
            return "";
        }
    }

    private updateSize = (fontSize?: number) => {
        fontSize = fontSize || this.props.fontSize || 50;

        if(this.props.isFullscreen) {    
            this.setState({
                height: '100%',
                titleFontSize: window.innerWidth * fontSize * titleFontSize + "px",
                verseFontSize: window.innerWidth * fontSize * wordFontSize + "px", 
                width: '100%',   
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
                height: "100%",
                titleFontSize: maxWidth * fontSize * titleFontSize + "px",
                verseFontSize: maxWidth * fontSize * wordFontSize + "px",    
                width: maxWidth,
            })
        } else {
            this.setState({
                height: maxHeight,
                titleFontSize: maxHeight * this.ratio * fontSize * titleFontSize + "px",
                verseFontSize: maxHeight * this.ratio * fontSize * wordFontSize + "px",   
                width: "100%", 
            })
        }
    }

    public componentDidMount() {
        this.updateSize();
        this.wrapper.addEventListener('onresize', () => this.updateSize())
    }

    public componentWillUnmount() {
        this.wrapper.removeEventListener('onresize', () => this.updateSize())
    }

    public componentWillReceiveProps(nextProps) {
        if(nextProps.fontSize === this.props.fontSize) {
            return;
        }
        this.updateSize(nextProps.fontSize);
    }

    private getStyles = () => {
        return  {
            fontSize: this.state.verseFontSize,
            lineHeight: this.props.lineHeight,
            paddingLeft: this.props.indentAmount + "em",
            textIndent: (-this.props.indentAmount) + "em"
        };
    }

    public measureLines = (textArray) => {
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

    public render() {
        let wordsToUse = this.props.words;
        const words = this.props.isItallic ? <i>{this.splitLines(wordsToUse)}</i> : this.splitLines(wordsToUse);

        return (
            <div className="DisplayWrapper"
            ref={(node) => {this.wrapper = node }}>
                <div className="Display" style={{
                    backgroundColor: this.props.backgroundImage ? this.props.backgroundColor : "",
                    backgroundImage: this.props.backgroundImage,
                    height: this.state.height, 
                    width: this.state.width, 
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
    
});

export {Display};