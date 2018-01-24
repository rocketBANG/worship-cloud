import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.css'
import { observable } from 'mobx';
import { SongList } from '../models/SongList';
import { DisplaySong } from '../models/DisplaySong';

class Viewer extends Component {
    state = {
        words: undefined, 
        title: undefined,
        isItallic: undefined
    }

    constructor(props) {
        super(props);

        window.addEventListener('storage', this.onUpdateLocalStorage);
    }

    onUpdateLocalStorage = (event) => {
        if (event.key == 'display-setWords') {
            this.setState({words: localStorage.getItem('display-setWords')});
        }

        if (event.key == 'display-setTitle') {
            this.setState({title: localStorage.getItem('display-setTitle')});
        }

        if (event.key == 'display-setIsItallic') {
            this.setState({isItallic: localStorage.getItem('display-setIsItallic')});
        }

        // if (event.key == 'display-setColor') {
        //     document.getElementById("main").style.backgroundColor = localStorage.getItem('display-setColor');
        // }

        // if (event.key == 'display-setFontSize') {
        //     document.getElementById("songWords").style.fontSize = localStorage.getItem('display-setFontSize') + "vw";
        // }
    }

    render() {
        return (            
            <div className="Presenter">
                <div className="Viewer">
                    <Display title={this.state.title} isItallic={this.state.isItallic === 'true'} words={this.state.words}/>
                </div>
            </div>
        );
    }
}

export default Viewer;
