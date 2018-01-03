import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.css'
import { observable } from 'mobx';
import { SongList } from '../models/SongList';
import { DisplaySong } from '../models/DisplaySong';


class Presenter extends Component {

    constructor(props) {
        super(props) 
        
        this.songList = new SongList(DisplaySong);
        this.songList.loadSongs();

        this.presenterState = observable({
            currentSong: undefined
        })

    }

    render() {
        return (
            <div className="Presenter">
                <SongLibrary songList={this.songList} state={this.presenterState}/>
                <Display state={this.presenterState} showTitle={true}/>
                <DisplayControls state={this.presenterState}/>
            </div>
        );
    }
}

export default Presenter;
