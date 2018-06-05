import React, { Component } from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import SongList from '../components/SongList';
import '../style/Editor.css';
import { SongLibraryModel } from '../models/SongLibraryModel'
import { observable } from 'mobx';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';

type Props = {
};

export type EditorState = {
    currentSong: Song,
    currentVerse: Verse,
    currentList: SongListModel
}

export default class Editor extends Component<Props> {
    
    editorState: EditorState = observable({
        currentSong: undefined,
        currentVerse: undefined,
        currentList: undefined
    })

    constructor(props) {
        super(props);
        
        this.songList = new SongLibraryModel();
        this.songList.loadSongs();

        this.state = { verses: undefined };

    }

    render() {
        const tabs = [
            {component: <SongList songList={this.songList} state={this.editorState}/>, name: "Song Library"},
            {component: <SongLists editorState={this.editorState}/>, name: "Song Lists"},
        ];
        return (
            <div className='editorPage'>
                <div className='editor'>
                    <TabFrame tabs={tabs} multiple={true} keepOrder={true}/>
                    <VerseList state={this.editorState}/>
                    <VerseOrderList state={this.editorState}/>
                    <SongEditor state={this.editorState}/>
                </div>
            </div>
        );
    }
}