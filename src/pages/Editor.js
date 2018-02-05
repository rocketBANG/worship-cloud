import React, { Component, ReactFragment } from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import SongList from '../components/SongList';
import '../style/Editor.css';
import { SongListModel } from '../models/SongListModel'
import { observable } from 'mobx';
import { Toolbar } from '../components/Toolbar';

export default class Editor extends Component {

    constructor(props) {
        super(props);
        
        this.songList = new SongListModel();
        this.songList.loadSongs();

        this.state = { verses: undefined };

        this.editorState = observable({
            currentSong: undefined,
            currentVerse: undefined
        })

    }

    render() {
        return (
            <div className='editorPage'>
                <div className='editor'>
                    <SongList songList={this.songList} state={this.editorState}/>
                    <VerseList state={this.editorState}/>
                    <VerseOrderList state={this.editorState}/>
                    <SongEditor state={this.editorState}/>
                </div>
            </div>
        );
    }
}