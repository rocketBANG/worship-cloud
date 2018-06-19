import * as React from 'react';
import SongLibrary from '../components/SongLibrary';
import '../style/Display.css'
import '../style/Presenter.css'

import { observable, autorun, IObservableValue, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import { SongLibraryModel } from '../models/SongLibraryModel';
import { DisplaySong } from '../models/DisplaySong';
import { DisplayVerseList } from '../components/DisplayVerseList';
import PresenterDisplay from '../components/PresenterDisplay';
import { TabFrame } from '../components/general/TabFrame';
import { SongLists } from '../components/editor/SongLists';
import { Song } from '../models/Song';
import { Verse } from '../models/Verse';
import { SongListModel } from '../models/song-lists/SongListModel';


const Presenter = observer(class extends React.Component {
    public state = {
        displaySong: undefined
    }

    private autorun: IReactionDisposer = undefined;

    private displaySongs = [];

    private songLibrary: SongLibraryModel;
    private currentSong: IObservableValue<Song>;
    private currentVerse: IObservableValue<Verse>;
    private currentList: IObservableValue<SongListModel>;

    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();

        this.currentSong = observable.box();
        this.currentSong.set(undefined);
        this.currentVerse = observable.box();
        this.currentVerse.set(undefined);
        this.currentList = observable.box();
        this.currentList.set(undefined);
    }

    public componentWillUnmount() {
        this.autorun();
    }

    public componentDidMount() {
        this.autorun = autorun(() => {
            if(this.currentSong.get() === undefined) {
                this.setState({displaySong: undefined });
                return;
            }
            this.currentSong.get().loadSong();
            this.setState({displaySong: this.getDisplaySong(this.currentSong.get()) });
        });
    }

    public render() {
        const tabs = [
            {component: <SongLibrary library={this.songLibrary} currentSong={this.currentSong}/>, name: "Song Library"},
            {component: <SongLists currentSong={this.currentSong} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className="Presenter">
                <TabFrame tabs={tabs} />
                <DisplayVerseList id='displayVerseList' currentSong={this.state.displaySong} />
                <PresenterDisplay currentSong={this.state.displaySong} />
            </div>
        );
    }

    private getDisplaySong = (song: Song) => {
        let displaySong = this.displaySongs.find(d => d.id === song.id);
        if(displaySong === undefined) {
            displaySong = new DisplaySong(this.currentSong.get());
            this.displaySongs.push(displaySong);
        }
        return displaySong;
    }
});

export default Presenter;
