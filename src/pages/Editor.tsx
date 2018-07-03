import * as React from 'react';
import VerseList from '../components/VerseList';
import VerseOrderList from '../components/VerseOrderList';
import SongEditor from '../components/SongEditor';
import '../style/Editor.css';
import { SongLibraryModel } from '../models/SongLibraryModel'
import { observable, IObservableValue, IObservableArray, autorun, IReactionDisposer } from 'mobx';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SongLibraryControls } from '../components/SongLibraryControls';
import { HistoryManager } from '../models/History';

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

    private onKeyDown = (event: KeyboardEvent) => {
        if(event.key === 'z' && event.ctrlKey && !event.shiftKey) {
            event.preventDefault();
            HistoryManager.undo();
        } else if(event.key === 'Z' && event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            HistoryManager.redo();
        }
    }

    public componentWillUnmount() {
        this.autorun.forEach(a => a());
        document.removeEventListener('keydown', this.onKeyDown);
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

        document.addEventListener('keydown', this.onKeyDown);
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