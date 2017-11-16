import React, { Component } from 'react';
import SongListVisible from './SongListVisible';
import VerseListVisible from './VerseListVisible';
import VerseOrderListVisible from './VerseOrderListVisible';
import SongEditorVisible from './SongEditorVisible';
import './App.css';
import './index.css';
import { fetchSongsIfNeeded, fetchVerses } from './store/actions';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


class Presenter extends Component {

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
            <div className="Presenter">
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

export default connect()(Presenter);
