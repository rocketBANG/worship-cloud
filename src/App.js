import React, { Component } from 'react';
import logo from './logo.svg';
import SongListVisible from './SongListVisible';
import VerseListVisible from './VerseListVisible';
import SongControls from './SongControls';
import SongEditorVisible from './SongEditorVisible';
import Song from './Song';
import './App.css';
import { fetchSongsIfNeeded, fetchVerses, addSong, addVerse, removeSong } from './store/actions';

class App extends Component {

    constructor(props) {
        super(props)

        let store = this.props.store;

        console.log(store.getState());
        const unsubscribe = store.subscribe(() =>
            console.log(store.getState())
        )

        store.dispatch(fetchVerses()).then(() => { 
            store.dispatch(fetchSongsIfNeeded()).then(() => { 
                // store.dispatch(addSong("test"));
                // store.dispatch(addVerse("test", "hello there \n haha", "v1"));
            })
        });
    }

    render() {
        return (
            <div className="App">
                <SongListVisible />
                <VerseListVisible />
                <SongEditorVisible />
            </div>
        );
    }
}

export default App;
