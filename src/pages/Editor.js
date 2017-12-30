import React, { Component } from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import SongList from '../components/SongList';
import '../style/Editor.css';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { SongList as SongListModel } from '../models/SongList'
import { observable } from 'mobx';

class Editor extends Component {

    constructor(props) {
        super(props) 
        
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
            <div className="Editor">
                <SongList songList={this.songList} state={this.editorState}/>
                <VerseList state={this.editorState}/>
                <VerseOrderList state={this.editorState}/>
                <SongEditor state={this.editorState}/>
            </div>
        );
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    }
}

export default connect()(Editor);
