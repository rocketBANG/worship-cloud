import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import '../style/Presenter.css'
import '../style/Display.css'
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { DisplaySong } from '../models/DisplaySong';
import { DisplayVerseList } from '../components/DisplayVerseList';
import PresenterDisplay from '../components/PresenterDisplay';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';


const Presenter = observer(class Presenter extends Component {

    autorun = undefined;

    state = {
        displaySong: undefined
    }

    displaySongs = [];

    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();

        this.currentSong = observable.box(Song);
        this.currentSong.set(undefined);
        this.currentVerse = observable.box(Verse);
        this.currentVerse.set(undefined);
        this.currentList = observable.box(SongListModel);
        this.currentList.set(undefined);
    }

    componentWillUnmount() {
        this.autorun();
    }

    getDisplaySong = (song: Song) => {
        let displaySong = this.displaySongs.find(d => d.id === song.id);
        if(displaySong === undefined) {
            displaySong = new DisplaySong(this.currentSong.get());
            this.displaySongs.push(displaySong);
        }
        return displaySong;
    }

    componentDidMount() {
        this.autorun = autorun(() => {
            if(this.currentSong.get() === undefined) {
                this.setState({displaySong: undefined });
                return;
            }
            this.currentSong.get().loadSong();
            this.setState({displaySong: this.getDisplaySong(this.currentSong.get()) });
        });
    }

    render() {
        const tabs = [
            {component: <SongLibrary library={this.songLibrary} currentSong={this.currentSong}/>, name: "Song Library"},
            {component: <SongLists currentSong={this.currentSong} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className="Presenter">
                <TabFrame tabs={tabs} />
                <DisplayVerseList id='displayVerseList' currentSong={this.state.displaySong} />
                <PresenterDisplay currentSong={this.state.displaySong} />
            </div>
        );
    }
});

export default Presenter;
