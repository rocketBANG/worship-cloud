import React, { Component } from 'react';
import logo from './logo.svg';
import SongView from './SongView';
import Song from './Song';
import './App.css';
import { addSong, setTitle, addVerse } from './store/actions'

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
    store.dispatch(setTitle(0, "Hello"));
    store.dispatch(addVerse(1, "hey there", store.getState().verses.length));
    store.dispatch(addVerse(1, "hi there", store.getState().verses.length));
    
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
