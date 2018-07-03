import * as React from 'react';
import {Display} from '../components/Display';
import '../style/viewer.css'
import '../style/Display.css'
import { IExtraDisplayProps } from '../components/PresenterDisplay';

interface IState {
    words: string, 
    title: string,
    isItallic: string,
    isFullscreen: boolean,
    props: IExtraDisplayProps
}

class Viewer extends React.Component<{}, IState> {
    public state = {
        words: undefined, 
        title: undefined,
        isItallic: undefined,
        isFullscreen: false,
        props: undefined
    };

    private viewer: HTMLDivElement;

    constructor(props) {
        super(props);

        document.addEventListener("mozfullscreenchange", () => {
            // @ts-ignore
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

    private onKeyDown = (event: KeyboardEvent) => {
        if(event.key === 'F5') {
            event.preventDefault();
            this.onFullscreenClick();
        }
    }

    public componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown);
    }

    public componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
    }


    private onFullscreenClick = () => {
        // go full-screen
        if (this.viewer.requestFullscreen) {
            this.viewer.requestFullscreen();
        // @ts-ignore
        } else if (this.viewer.mozRequestFullScreen) {
            // @ts-ignore
            this.viewer.mozRequestFullScreen();
        } else if (this.viewer.webkitRequestFullScreen) {
            this.viewer.webkitRequestFullScreen();
        }

        this.setState({isFullscreen: true});
    };

    private onUpdateLocalStorage = (event) => {
        if (event.key === 'display-setWords') {
            this.setState({words: localStorage.getItem('display-setWords')});
        }

        if (event.key === 'display-setTitle') {
            this.setState({title: localStorage.getItem('display-setTitle')});
        }

        if (event.key === 'display-setIsItallic') {
            this.setState({isItallic: localStorage.getItem('display-setIsItallic')});
        }

        if (event.key === 'display-setStyle') {
            this.setState({props: JSON.parse(localStorage.getItem('display-setStyle'))});
        }

    };

    public render() {
        return (
            <div ref={viewer => this.viewer = viewer} className="Viewer">
                <Display 
                    title={this.state.title} 
                    isItallic={this.state.isItallic === 'true'} 
                    words={this.state.words} 
                    isFullscreen={this.state.isFullscreen}
                    {...this.state.props}
                    />
                { !this.state.isFullscreen && <div className='viewerControls'>
                    <button onClick={this.onFullscreenClick}>Go fullscreen (F5)</button>
                </div> }
            </div>
        );
    }
}

export default Viewer;