import React, { Component } from 'react';
import SongListVisible from '../components/SongListVisible';
import VerseList from '../components/VerseList';
import VerseOrderListVisible from '../components/VerseOrderListVisible';
import SongEditorVisible from '../components/SongEditorVisible';
import SongList from '../components/SongList';
import '../style/Editor.css';
import { fetchSongsIfNeeded } from '../store/actions/songActions';
import { fetchVerses } from '../store/actions'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { SongList as SongListModel } from '../models/SongList'
import { Song } from '../models/Song'
import { observable, autorun } from 'mobx';

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

    componentDidMount() {
        autorun(() => { 
            this.setState({
                verses: (this.editorState.currentSong || {verses: undefined}).verses
            }); 
            console.log((this.editorState.currentSong || {verses: undefined}).verses);
        });
    }

    render() {
        return (
            <div className="Editor">
                <SongList songList={this.songList} state={this.editorState}/>
                <VerseList verses={this.state.verses} state={this.editorState}/>
                <VerseOrderListVisible />
                <SongEditorVisible />
            </div>
        );
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    }
}

export default connect()(Editor);
