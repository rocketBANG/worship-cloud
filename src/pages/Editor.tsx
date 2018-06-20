import * as React from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import '../style/Editor.css';
import { SongLibraryModel } from '../models/SongLibraryModel'
import { observable, IObservableValue, IObservableArray, autorun, IReactionDisposer } from 'mobx';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import SongLibrary from '../components/SongLibrary';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SongLibraryControls } from '../components/SongLibraryControls';

export default class Editor extends React.Component<{}, {currentSong: Song}> {

    private songLibrary: SongLibraryModel;
    private currentVerse: IObservableValue<Verse>;
    private currentList: IObservableValue<SongListModel>;
    private selectedSongs: IObservableArray<Song>;

    private autorun: IReactionDisposer;

    public state = {
        currentSong: undefined
    }
    
    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();
        
        this.currentVerse = observable.box();
        this.currentVerse.set(undefined);
        this.currentList = observable.box();
        this.currentList.set(undefined);

        this.selectedSongs = observable.array();
    }

    public componentWillUnmount() {
        this.autorun();
    }

    public componentDidMount() {
        this.autorun = autorun(() => {
            this.setState({currentSong: this.selectedSongs[this.selectedSongs.length - 1]});
        });
    }

    public render() {
        const tabs = [
            {component: 
                <React.Fragment>
                    <SongLibrary library={this.songLibrary} selectedSongs={this.selectedSongs}/>
                    <SongLibraryControls library={this.songLibrary} currentList={this.currentList} selectedSongs={this.selectedSongs} />
                </React.Fragment>, name: "Song Library"},
            {component: <SongLists selectedSongs={this.selectedSongs} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className='editorPage'>
                <div className='editor'>
                    <TabFrame tabs={tabs} multiple={true} keepOrder={true}/>
                    <VerseList currentSong={this.state.currentSong} currentVerse={this.currentVerse}/>
                    <VerseOrderList currentSong={this.state.currentSong} currentVerse={this.currentVerse}/>
                    <SongEditor currentSong={this.state.currentSong} currentVerse={this.currentVerse}/>
                </div>
            </div>
        );
    }
}