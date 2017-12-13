import React, { Component } from 'react';
import SongListVisible from '../components/SongListVisible';
import VerseListVisible from '../components/VerseListVisible';
import VerseOrderListVisible from '../components/VerseOrderListVisible';
import SongEditorVisible from '../components/SongEditorVisible';
import '../style/Editor.css';
import { fetchSongsIfNeeded } from '../store/actions/songActions';
import { fetchVerses } from '../store/actions'
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
