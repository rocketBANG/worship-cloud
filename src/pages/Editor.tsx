import * as React from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/editor/SongEditor';
import '../style/Editor.css';
import { SongLibraryModel } from '../models/songs/SongLibraryModel'
import { observable, IObservableValue, IObservableArray, autorun, IReactionDisposer } from 'mobx';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/songs/Song';
import { Verse } from '../models/songs/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SongLibraryControls } from '../components/editor/SongLibraryControls';

export default class Editor extends React.Component<{}, {currentSong: Song, currentVerse: Verse}> {

    private songLibrary: SongLibraryModel;
    private currentList: IObservableValue<SongListModel>;
    private selectedSongs: IObservableArray<Song>;
    private selectedVerses: IObservableArray<Verse>;

    private autorun: IReactionDisposer[] = [];

    public state = {
        currentSong: undefined,
        currentVerse: undefined
    }
    
    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();
        
        this.currentList = observable.box();
        this.currentList.set(undefined);

        this.selectedSongs = observable.array();
        this.selectedVerses = observable.array();
    }

    public componentWillUnmount() {
        this.autorun.forEach(a => a());
    }

    public componentDidMount() {
        this.autorun.push(autorun(() => {
            let newCurrentSong = this.selectedSongs[this.selectedSongs.length - 1];
            this.setState({currentSong: newCurrentSong});
            if(newCurrentSong === undefined) {
                this.selectedVerses.clear();
            }
        }))
        this.autorun.push(autorun(() => {
            this.setState({currentVerse: this.selectedVerses[this.selectedVerses.length - 1]});
        }));
    }

    public render() {
        const tabs = [
            {component: 
                <SongLibraryControls library={this.songLibrary} currentList={this.currentList} selectedSongs={this.selectedSongs}/>, name: "Song Library"},
            {component: <SongLists selectedSongs={this.selectedSongs} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className='editorPage'>
                <div className='editor'>
                    <TabFrame tabs={tabs} multiple={true} keepOrder={true}/>
                    <VerseList currentSong={this.state.currentSong} selectedVerses={this.selectedVerses}/>
                    <VerseOrderList currentSong={this.state.currentSong} selectedVerses={this.selectedVerses}/>
                    <SongEditor currentSong={this.state.currentSong} currentVerse={this.state.currentVerse}/>
                </div>
            </div>
        );
    }
}