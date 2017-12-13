import React, { Component } from 'react';
import SongLibraryVisible from '../components/SongLibraryVisible';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.css'
import { fetchSongsIfNeeded } from '../store/actions/songActions';
import { fetchVerses } from '../store/actions'
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
