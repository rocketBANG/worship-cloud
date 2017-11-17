import React, { Component } from 'react';
import SongLibraryVisible from './SongLibraryVisible';
import Display from './Display';
import DisplayControls from './DisplayControls';
import './Presenter.css'
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
                <SongLibraryVisible />
                <Display />
                <DisplayControls />
            </div>
        );
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    }
}

export default connect()(Presenter);
