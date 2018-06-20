import * as React from 'react';
import SongLibrary from '../components/SongLibrary';
import '../style/Display.css'
import '../style/Presenter.css'

import { observable, autorun, IObservableValue, IReactionDisposer, IObservableArray } from 'mobx';
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


const Presenter = observer(class extends React.Component<{}, {displaySong: DisplaySong}> {
    public state = {
        displaySong: undefined
    }

    private autorun: IReactionDisposer = undefined;

    private displaySongs = [];

    private songLibrary: SongLibraryModel;
    private currentVerse: IObservableValue<Verse>;
    private currentList: IObservableValue<SongListModel>;
    private currentSongs: IObservableArray<Song>;

    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();

        this.currentVerse = observable.box();
        this.currentVerse.set(undefined);
        this.currentList = observable.box();
        this.currentList.set(undefined);

        this.currentSongs = observable.array();
    }

    public componentWillUnmount() {
        this.autorun();
    }

    public componentDidMount() {
        this.autorun = autorun(() => {
            const currentSong = this.currentSongs[this.currentSongs.length - 1];
            if(currentSong === undefined) {
                this.setState({displaySong: undefined });
                return;
            }
            currentSong.loadSong();
            this.setState({displaySong: this.getDisplaySong(currentSong) });
        });
    }

    public render() {
        const tabs = [
            {component: <SongLibrary library={this.songLibrary} selectedSongs={this.currentSongs}/>, name: "Song Library"},
            {component: <SongLists selectedSongs={this.currentSongs} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        return (
            <div className="Presenter">
                <TabFrame tabs={tabs} />
                <DisplayVerseList currentSong={this.state.displaySong} />
                <PresenterDisplay currentSong={this.state.displaySong} />
            </div>
        );
    }

    private getDisplaySong = (song: Song) => {
        let displaySong = this.displaySongs.find(d => d.id === song.id);
        if(displaySong === undefined) {
            displaySong = new DisplaySong(song);
            this.displaySongs.push(displaySong);
        }
        return displaySong;
    }
});

export default Presenter;
