import React, { Component } from 'react';
import logo from './logo.svg';
import SongListVisible from './SongListVisible';
import SongControls from './SongControls';
import SongEditorVisible from './SongEditorVisible';
import Song from './Song';
import './App.css';
import { fetchSongsIfNeeded } from './store/actions';

class App extends Component {

    constructor(props) {
        super(props)

        let store = this.props.store;

        console.log(store.getState());
        const unsubscribe = store.subscribe(() =>
            console.log(store.getState())
        )

        store.dispatch(fetchSongsIfNeeded()).then(() => {});
    }

    render() {
        return (
            <div className="App">
                <SongListVisible />
                <SongEditorVisible />
            </div>
        );
    }
}

export default App;
