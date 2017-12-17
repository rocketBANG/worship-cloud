import React, { Component } from 'react';
import SongListVisible from '../components/SongListVisible';
import VerseListVisible from '../components/VerseListVisible';
import VerseOrderListVisible from '../components/VerseOrderListVisible';
import SongEditorVisible from '../components/SongEditorVisible';
import MobxList from '../components/MobxList';
import '../style/Editor.css';
import { fetchSongsIfNeeded } from '../store/actions/songActions';
import { fetchVerses } from '../store/actions'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { SongList } from '../objects/SongList'
import { Song } from '../objects/Song'

class Editor extends Component {

    constructor(props) {
        super(props)

        var song = new Song("hi", "there");
        song.loadSong();

        this.songList = new SongList();
        this.songList.loadSongs();
        
        let dispatch = this.props.dispatch;
        console.log(props);

        dispatch(fetchVerses()).then(() => { 
            dispatch(fetchSongsIfNeeded()).then(() => { 
            })
        });
    }

    render() {
        return (
            <div className="Editor">
                <MobxList songList={this.songList}/>
                <VerseListVisible />
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
