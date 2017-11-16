import React, { Component } from 'react';
import logo from './logo.svg';
import SongListVisible from './SongListVisible';
import VerseListVisible from './VerseListVisible';
import VerseOrderListVisible from './VerseOrderListVisible';
import SongControls from './SongControls';
import SongEditorVisible from './SongEditorVisible';
import Song from './Song';
import './App.css';
import './index.css';
import { fetchSongsIfNeeded, fetchVerses, addSong, addVerse, removeSong } from './store/actions';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


class Editor extends Component {

    constructor(props) {
        super(props)

        let dispatch = this.props.dispatch;

        dispatch(fetchVerses()).then(() => { 
            dispatch(fetchSongsIfNeeded()).then(() => { 
            })
        });
    }

    render() {
        return (
            <div className="Editor">
                <SongListVisible />
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
