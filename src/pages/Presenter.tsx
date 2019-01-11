import { autorun, IObservableArray, IObservableValue, IReactionDisposer, observable, intercept } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { PresenterDisplayPreview } from 'src/components/display/PresenterDisplayPreview';
import { PresenterModel } from 'src/models/display/PresenterModel';
import DisplayControls from '../components/display/DisplayControls';
import { DisplayVerseList } from '../components/display/DisplayVerseList';
import { SongLists } from '../components/editor/SongLists';
import { TabFrame } from '../components/general/TabFrame';
import { PresenterDisplay } from '../components/display/PresenterDisplay';
import { SongLibrary } from '../components/editor/SongLibrary';
import { DisplaySong } from '../models/songs/DisplaySong';
import { Song } from '../models/songs/Song';
import { SongListModel } from '../models/song-lists/SongListModel';
import { SongLibraryModel } from '../models/songs/SongLibraryModel';
import '../style/Display.css';
import '../style/Presenter.css';


interface IState {
    isFullscreen: boolean,
}

const Presenter = observer(class extends React.Component<{}, IState> {
    public state: IState = {
        isFullscreen: false
    }

    private fullscreenStyle: React.CSSProperties = {
        width: '100%',
        display: 'block',
        backgroundColor: '#000'
    }

    private autorun: IReactionDisposer = undefined;

    private displaySongs = [];

    private songLibrary: SongLibraryModel;
    private currentList: IObservableValue<SongListModel>;
    private currentSongs: IObservableArray<Song>;
    private presenterModel: PresenterModel;

    private presenterDiv: HTMLElement;

    constructor(props) {
        super(props);
        
        this.songLibrary = new SongLibraryModel();
        this.songLibrary.getAllSongs();

        this.presenterModel = new PresenterModel();

        this.currentList = observable.box();
        this.currentList.set(undefined);

        this.currentSongs = observable.array();

        this.currentList.intercept((change) => {
            if (change.newValue !== undefined) {
                change.newValue.loadAllSongs(this.songLibrary);
            }
            return change;
        })
    }

    private getNextSongInList = (offset: number = 1): Song => {
        const currentList = this.currentList.get();
        if(currentList === undefined) return;

        const currentSongIndex = currentList.songIds.findIndex(s => s === this.presenterModel.Song.id);
        if(currentSongIndex + offset >= currentList.songIds.length || currentSongIndex + offset < 0) return;

        return this.songLibrary.songs.find(s => s.id === currentList.songIds[currentSongIndex + offset]);
    }

    private onNextSong = () => {
        let newSong = this.getNextSongInList();
        if(newSong === undefined) return;

        this.currentSongs.clear();
        this.currentSongs.push(newSong);
    }

    private onPrevSong = () => {
        let newSong = this.getNextSongInList(-1);
        if(newSong === undefined) return;

        this.currentSongs.clear();
        this.currentSongs.push(newSong);
    }

    private onFullscreen = () => {
        if (this.presenterDiv.requestFullscreen) {
            this.presenterDiv.requestFullscreen();
        // @ts-ignore
        } else if (this.presenterDiv.mozRequestFullScreen) {
        // @ts-ignore
            this.presenterDiv.mozRequestFullScreen();
        // @ts-ignore
        } else if (this.presenterDiv.webkitRequestFullScreen) {
        // @ts-ignore   
            this.presenterDiv.webkitRequestFullScreen();
        }
        this.setState({isFullscreen: true});
    }

    private exitFullscreen = () => {
        // @ts-ignore
        if (document.fullscreenElement != null) {
            this.setState({isFullscreen: false});
        }
        // @ts-ignore
        if(document.mozFullScreen === false) {
            this.setState({isFullscreen: false});
        }
        // @ts-ignore   
        if(document.webkitIsFullScreen === false) {
            this.setState({isFullscreen: false});
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if(event.key === 'F5') {
            event.preventDefault();
            this.onFullscreen();
        }
    }

    public componentWillUnmount() {
        this.autorun();
        document.removeEventListener("mozfullscreenchange", this.exitFullscreen);
        document.removeEventListener("webkitfullscreenchange", this.exitFullscreen);
        document.removeEventListener("fullscreenchange", this.exitFullscreen);
        document.removeEventListener('keydown', this.onKeyDown);
    }

    public componentDidMount() {
        this.autorun = autorun(() => {
            const currentSong = this.currentSongs[this.currentSongs.length - 1];
            if(currentSong === undefined) {
                this.presenterModel.Song = undefined;
                return;
            }
            this.presenterModel.Song = this.getDisplaySong(currentSong);
        });
        document.addEventListener("mozfullscreenchange", this.exitFullscreen);
        document.addEventListener("webkitfullscreenchange", this.exitFullscreen);
        document.addEventListener("fullscreenchange", this.exitFullscreen);
        document.addEventListener('keydown', this.onKeyDown);
    }

    public render() {
        const tabs = [
            {component: <SongLibrary library={this.songLibrary} selectedSongs={this.currentSongs}/>, name: "Song Library"},
            {component: <SongLists selectedSongs={this.currentSongs} library={this.songLibrary} currentList={this.currentList}/>, name: "Song Lists"},
        ];
        const fullscreenDependant = (
            <React.Fragment>
                <TabFrame tabs={tabs} />
                <DisplayVerseList currentSong={this.presenterModel.Song} />
            </React.Fragment>
        )
        return (
            <div 
                className="Presenter"
                ref={(el) => this.presenterDiv = el}
                style={this.state.isFullscreen ? this.fullscreenStyle : {}}>
                {!this.state.isFullscreen && fullscreenDependant}

                <PresenterDisplay 
                currentList={this.currentList} 
                presenterModel={this.presenterModel}/>

                {/* <PresenterDisplayPreview 
                currentList={this.currentList} 
                presenterModel={this.presenterModel}/> */}

                <DisplayControls 
                    list={this.currentList.get()} 
                    presenterModel={this.presenterModel} 
                    onNext={this.onNextSong} 
                    onPrev={this.onPrevSong}
                    onFullscreen={this.onFullscreen}
                    showButtons={!this.state.isFullscreen}
                    presenter={this.presenterModel}
                    />
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
