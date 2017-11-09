import React, { Component } from 'react';
import logo from './logo.svg';
import SongView from './SongView';
import Song from './Song';
import './App.css';
import { addSong, updateTitle, addVerse, removeSong, removeVerse } from './store/actions'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {song: new Song(function() {
      this.setState(function(prevState, props) {
        return {
          song: prevState.song
        };
      });
    }.bind(this))}

    let store = this.props.store;

    console.log(store.getState());    
    const unsubscribe = store.subscribe(() =>
      console.log(store.getState())
    )
  
    store.dispatch(addSong("Amazing Grace"));
    store.dispatch(addSong("Awesome Grace"));
    store.dispatch(updateTitle("Amazing Grace", "Hello"));
    store.dispatch(addVerse("Amazing Grace", "hey there", "verse1"));
    store.dispatch(addVerse("Amazing Grace", "hi there", "verse2"));
    store.dispatch(removeVerse("verse1", "Amazing Grace"));
    console.log("removed verse");
    store.dispatch(removeSong("Amazing Grace"));
    
    this.handleClick = this.handleClick.bind(this);    
  }

  handleClick() {
    this.state.song.setText("test");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello</h1>
        </header>
        <SongView name="hi" song={this.state.song}/>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <button onClick={this.handleClick}>Button</button>
        </p>
      </div>
    );
  }
}

export default App;
