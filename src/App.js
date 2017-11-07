import React, { Component } from 'react';
import logo from './logo.svg';
import SongView from './SongView';
import Song from './Song';
import './App.css';

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

    this.handleClick = this.handleClick.bind(this);    
  }

  handleClick() {
    this.state.song.setText("test");
  }

  render() {
    let song = new Song();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
          <SongView name="hi" song={this.state.song}/>
          <button onClick={this.handleClick}>Button</button>
        </p>
      </div>
    );
  }
}

export default App;
