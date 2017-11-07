import React, { Component } from 'react';
import './App.css';

class SongView extends Component {
  render() {
    return (
      <div className="Song">
          {this.props.song.text}
      </div>
    );
  }
}

export default SongView;
