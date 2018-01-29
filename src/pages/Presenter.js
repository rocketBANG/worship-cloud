import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.css'
import '../style/Display.css'
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SongList } from '../models/SongList';
import { DisplaySong } from '../models/DisplaySong';


const Presenter = observer(class Presenter extends Component {

    state = {
        fontSize: 50
    }

    fontIncrement = 3;

    constructor(props) {
        super(props) 
        
        this.songList = new SongList(DisplaySong);
        this.songList.loadSongs();

        this.currentSong = undefined;

        this.presenterState = observable({
            currentSong: undefined
        });

    }

    // true if the font size should increase
    // false if the font size should decrease
    onFontChange = (fontChange) => {
        if(fontChange) {
            this.setState({fontSize: this.state.fontSize + this.fontIncrement});
        } else {
            this.setState({fontSize: this.state.fontSize - this.fontIncrement});
        }
    }

    render() {
        let currentSong = this.presenterState.currentSong || {};
        let currentVerse = currentSong.currentVerse || {};

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', currentSong.verseIndex > 0 ? "" : currentSong.name || '');
        localStorage.setItem('display-setWords', currentVerse.text || '');
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' || false);
        localStorage.setItem('display-setFontSize', this.state.fontSize || 0);

        return (
            <div className="Presenter">
                <SongLibrary songList={this.songList} state={this.presenterState}/>
                <Display 
                    fontSize={this.state.fontSize}
                    id='PresenterDisplay' 
                    title={currentSong.verseIndex > 0 ? "" : currentSong.name} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={currentVerse.text}>
                    <DisplayControls state={this.presenterState} fontChange={this.onFontChange}/>
                </Display>
            </div>
        );
    }
});

export default Presenter;
