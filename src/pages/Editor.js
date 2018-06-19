import React, { Component } from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import '../style/Editor.css';
import { SongLibraryModel, SongLibraryState } from '../models/SongLibraryModel'
import { observable } from 'mobx';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import SongLibrary from '../components/SongLibrary';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SongLibraryControls } from '../components/SongLibraryControls';

type Props = {
};

export default class Editor extends Component<Props> {
    
    editorState: SongLibraryState = observable({
        currentSong: undefined,
        currentVerse: undefined,
        currentList: undefined
    })

    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();
        
        this.currentSong = observable.box(Song);
        this.currentVerse = observable.box(Verse);
        this.currentVerse.set(undefined);
        this.currentList = observable.box(SongListModel);
        this.currentList.set(undefined);

        this.selectedSongs = observable.array();

        this.state = { verses: undefined };

    }

    render() {
        const tabs = [
            {component: 
                <React.Fragment>
                    <SongLibrary library={this.songLibrary} currentSong={this.currentSong} selectedSongs={this.selectedSongs}/>
                    <SongLibraryControls library={this.songLibrary} currentSong={this.currentSong} currentList={this.currentList} selectedSongs={this.selectedSongs} />
                </React.Fragment>, name: "Song Library"},
            {component: <SongLists currentSong={this.currentSong} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className='editorPage'>
                <div className='editor'>
                    <TabFrame tabs={tabs} multiple={true} keepOrder={true}/>
                    <VerseList currentSong={this.currentSong} currentVerse={this.currentVerse}/>
                    <VerseOrderList currentSong={this.currentSong} currentVerse={this.currentVerse}/>
                    <SongEditor currentSong={this.currentSong} currentVerse={this.currentVerse}/>
                </div>
            </div>
        );
    }
}