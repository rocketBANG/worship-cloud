import React, { Component } from 'react';
import Display from '../components/Display';
import '../style/viewer.css'
import '../style/Display.css'

class Viewer extends Component {
    state = {
        words: undefined, 
        title: undefined,
        isItallic: undefined,
        isFullscreen: false,
        fontSize: 0,
        backgroundColor: "#000"
    };

    constructor(props) {
        super(props);

        document.addEventListener("mozfullscreenchange", () => {
            if(!document.mozFullScreen) {
                this.setState({isFullscreen: false});
            }
        });

        document.addEventListener("webkitfullscreenchange", () => {
            if(!document.webkitIsFullScreen) {
                this.setState({isFullscreen: false});
            }
        });

        document.addEventListener("fullscreenchange", () => {
            if(!document.webkitIsFullScreen) {
                this.setState({isFullscreen: false});
            }
        });

        window.addEventListener('storage', this.onUpdateLocalStorage);
    }

    onFullscreenClick = () => {
        // go full-screen
        if (this.viewer.requestFullscreen) {
            this.viewer.requestFullscreen();
        } else if (this.viewer.mozRequestFullScreen) {
            this.viewer.mozRequestFullScreen();
        } else if (this.viewer.webkitRequestFullScreen) {
            this.viewer.webkitRequestFullScreen(this.viewer.ALLOW_KEYBOARD_INPUT);
        }

        this.setState({isFullscreen: true});
    };

    onUpdateLocalStorage = (event) => {
        if (event.key === 'display-setWords') {
            this.setState({words: localStorage.getItem('display-setWords')});
        }

        if (event.key === 'display-setTitle') {
            this.setState({title: localStorage.getItem('display-setTitle')});
        }

        if (event.key === 'display-setIsItallic') {
            this.setState({isItallic: localStorage.getItem('display-setIsItallic')});
        }

        if (event.key === 'display-setFontSize') {
            this.setState({fontSize: localStorage.getItem('display-setFontSize')});
        }

        if (event.key === 'display-setBackgroundColor') {
            this.setState({backgroundColor: localStorage.getItem('display-setBackgroundColor')});
        }
        
        if (event.key === 'display-setLineHeight') {
            this.setState({lineHeight: localStorage.getItem('display-setLineHeight')});
        }

        if (event.key === 'display-setIndentAmount') {
            this.setState({indentAmount: localStorage.getItem('display-setIndentAmount')});
        }

        // if (event.key == 'display-setColor') {
        //     document.getElementById("main").style.backgroundColor = localStorage.getItem('display-setColor');
        // }

        // if (event.key == 'display-setFontSize') {
        //     document.getElementById("songWords").style.fontSize = localStorage.getItem('display-setFontSize') + "vw";
        // }
    };

    render() {
        return (
            <div ref={viewer => this.viewer = viewer} className="Viewer">
                <Display 
                    title={this.state.title} 
                    isItallic={this.state.isItallic === 'true'} 
                    words={this.state.words} 
                    isFullscreen={this.state.isFullscreen}
                    fontSize={this.state.fontSize}
                    backgroundColor={this.state.backgroundColor}
                    lineHeight={this.state.lineHeight}
                    indentAmount={this.state.indentAmount}/>
                { !this.state.isFullscreen && <div className='viewerControls'>
                    <button onClick={this.onFullscreenClick}>Go fullscreen</button>
                </div> }
            </div>
        );
    }
}

export default Viewer;
