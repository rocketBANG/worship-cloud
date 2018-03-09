import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.css'
import '../style/Display.css'
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SongListModel } from '../models/SongListModel';
import { DisplaySong } from '../models/DisplaySong';
import { DisplayVerseList } from '../components/DisplayVerseList';


const Presenter = observer(class Presenter extends Component {

    state = {
        fontSize: 50
    };

    fontIncrement = 3;

    constructor(props) {
        super(props);
        
        this.songList = new SongListModel(DisplaySong);
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
    };

    render() {
        let currentSong = this.presenterState.currentSong || {};
        let currentVerse = currentSong.currentVerse || {};
        let currentPage = currentSong.currentPage || "";

        let title = currentSong.verseIndex > 0 ? "" : currentSong.name || '';
        let words = currentPage || '';
        let backgroundColor = currentSong.backgroundColor;

        if(currentSong.isBlanked) {
            title = '';
            words = '';
        }

        // Broadcast to viewer
        localStorage.setItem('display-setTitle', title);
        localStorage.setItem('display-setWords', words);
        localStorage.setItem('display-setIsItallic', currentVerse.type === 'chorus' || false);
        localStorage.setItem('display-setFontSize', this.state.fontSize || 0);
        localStorage.setItem('display-setBackgroundColor', backgroundColor);

        return (
            <div className="Presenter">
                <SongLibrary songList={this.songList} state={this.presenterState}/>
                <DisplayVerseList id='displayVerseList' song={this.presenterState.currentSong} />
                <Display 
                    fontSize={this.state.fontSize}
                    id='PresenterDisplay' 
                    displaySong={currentSong}
                    title={title} 
                    isItallic={currentVerse.type === 'chorus'} 
                    words={words}
                    backgroundColor={backgroundColor}>
                    <DisplayControls state={this.presenterState} fontChange={this.onFontChange}/>
                </Display>
            </div>
        );
    }
});

export default Presenter;
