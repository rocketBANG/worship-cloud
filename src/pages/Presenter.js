import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import '../style/Presenter.css'
import '../style/Display.css'
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { DisplaySong } from '../models/DisplaySong';
import { DisplayVerseList } from '../components/DisplayVerseList';
import PresenterDisplay from '../components/PresenterDisplay';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/Song';


const Presenter = observer(class Presenter extends Component {
    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel(undefined, DisplaySong);
        this.songLibrary.getAllSongs();

        this.currentSong = observable.box(Song);
    }

    render() {
        const tabs = [
            {component: <SongLibrary library={this.songLibrary} currentSong={this.currentSong}/>, name: "Song Library"},
            {component: <SongLists editorState={this.presenterState} songClass={DisplaySong} hideControls={true}/>, name: "Song Lists"},
        ];
        return (
            <div className="Presenter">
                <TabFrame tabs={tabs} />
                <DisplayVerseList id='displayVerseList' song={this.presenterState.currentSong} />
                <PresenterDisplay song={this.presenterState.currentSong} />
            </div>
        );
    }
});

export default Presenter;
