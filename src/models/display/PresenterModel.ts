import { autorun, computed, observable } from "mobx";
import { DisplaySong } from "../songs/DisplaySong";
import { SettingsModel } from "../settings/SettingsModel";

export class PresenterModel {
    @observable private blanked = false;
    @observable private song: DisplaySong;

    @observable private frozen = false;

    @observable private liveDisplayProps: IDisplayProps;
    @observable private previewDisplayProps: IDisplayProps;

    private settingsModel = SettingsModel.settingsModel;
    private auto;

    constructor() {
        this.auto = autorun(() => {
            const currentSong = this.song || new DisplaySong(undefined);
            
            let title = currentSong.verseIndex > 0 || currentSong.pageIndex > 0 ? '' : currentSong.title || '';

            let words = currentSong.currentPage || '';
            const backgroundColor = '#000';
    
            if(this.blanked) {
                title = '';
                words = '';
            }

            const props: IDisplayProps = {
                lineHeight: this.settingsModel.lineHeight,
                indentAmount: this.settingsModel.indentAmount,
                backgroundColor,
                fontSize: this.settingsModel.wordFontSize,
                title,
                words,
                isItallic: currentSong.currentVerse && currentSong.currentVerse.type === 'chorus',
                currentPage: currentSong.pageIndex+1,
                pagesInVerse: currentSong.currentNumPages
            }
            
            if (!this.frozen) {
                this.liveDisplayProps = props;
                // Broadcast to viewer
                localStorage.setItem('display-setStyle', JSON.stringify({...props}));    
            }

            this.previewDisplayProps = props;
        })
    }

    public get LiveDisplayProps() {
        return this.liveDisplayProps;
    }

    public get PreviewDisplayProps() {
        return this.previewDisplayProps;
    }

    @computed
    public get Blanked() {
        return this.blanked;
    }

    public set Blanked(blanked: boolean) {
        this.blanked = blanked;
    }

    @computed
    public get Frozen() {
        return this.frozen;
    }

    public set Frozen(frozen: boolean) {
        this.frozen = frozen;
    }

    @computed
    public get Song() {
        return this.song;
    }

    public set Song(song: DisplaySong) {
        this.song = song;
    }

}

export interface IPresenterProps {
    title: string,
    words: string,
    isItalic: boolean,
    lineHeight: number,
    indentAmount: number,
    backgroundColor: string,
    fontSize: number
}

export interface IDisplayProps {
    lineHeight: number,
    indentAmount: number,
    backgroundColor: string,
    fontSize: number,
    title: string,
    words: string,
    isItallic: boolean,
    currentPage: number,
    pagesInVerse: number
}

