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
import PresenterDisplay from '../components/PresenterDisplay';


const Presenter = observer(class Presenter extends Component {
    constructor(props) {
        super(props);
        
        this.songList = new SongListModel(DisplaySong);
        this.songList.loadSongs();

        this.presenterState = observable({
            currentSong: undefined
        });

    }

    render() {
        return (
            <div className="Presenter">
                <SongLibrary songList={this.songList} state={this.presenterState}/>
                <DisplayVerseList id='displayVerseList' song={this.presenterState.currentSong} />
                <PresenterDisplay song={this.presenterState.currentSong} />
            </div>
        );
    }
});

export default Presenter;
