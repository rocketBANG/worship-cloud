import React, { Component } from 'react';
import SongLibrary from '../components/SongLibrary';
import Display from '../components/Display';
import DisplayControls from '../components/DisplayControls';
import '../style/Presenter.scss'
import { observable } from 'mobx';
import { SongList } from '../models/SongList';
import { DisplaySong } from '../models/DisplaySong';

class Viewer extends Component {

    // window.addEventListener('storage', function (event)
    // {
    //     if(event.key == 'display-setWords')
    //     {
    //         var wordstxt = document.getElementById('songWords');
    //         var setWords = localStorage.getItem('display-setWords');
    //         if(setWords != "none")
    //         {
    //             wordstxt.innerHTML = setWords;
    //         }
    //         else
    //         {
    //             wordstxt.innerHTML = "";
    //         }
    //     }
        
    //     if(event.key == 'display-setTitle')
    //     {
    //         var titletxt = document.getElementById('songTitle');
    //         var setTitle = localStorage.getItem('display-setTitle');
    
    //         if(setTitle != "none")
    //         {
    //             titletxt.innerHTML = setTitle;
    //         }
    //         else
    //         {
    //             titletxt.innerHTML = "";
    //         }
    //     }
    
    //     if(event.key == 'display-setColor')
    //     {
    //         document.getElementById("main").style.backgroundColor = localStorage.getItem('display-setColor');
    //     }
    
    //     if(event.key == 'display-setFontSize')
    //     {
    //         document.getElementById("songWords").style.fontSize = localStorage.getItem('display-setFontSize') + "vw";
    //     }
    // });

    //localStorage.setItem('display-setTitle', title);

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Viewer">
                <Display state={this.presenterState} showTitle={true}/>
            </div>
        );
    }
}

export default Viewer;
