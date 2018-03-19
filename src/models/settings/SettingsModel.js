import { extendObservable, action } from "mobx";
import * as API from '../../store/api'
import { ModelState } from "../ModelState";

export class SettingsModel {

    savedSettingsObj = {};
    uploadTimer = {};

    constructor() {
        extendObservable(this, {
            wordFontSize: 50,
            titleFontSize: 25,
            lineHeight: 1.3,
            minimumPageLines: 2,
            maximumPageLines: 6,
            topMargin: 3,
            leftMargin: 3,
            rightMargin: 0,
            bottomMargin: 0,
            loadSettings: action(this.loadSettings),
            state: ModelState.UNLOADED,
            changeWordFont: action(this.changeWordFont),
        });
    }

    loadSettings = () => {
        if(this.state !== ModelState.UNLOADED) {
            return;
        }
        this.state = ModelState.LOADING;
        API.getSettings("rocketbang").then(
            json => {
                this.wordFontSize = json.wordFontSize || this.wordFontSize;
                this.titleFontSize = json.titleFontSize || this.titleFontSize;
                this.lineHeight = json.lineHeight || this.lineHeight;
                this.minimumPageLines = json.minimumPageLines || this.minimumPageLines;
                this.maximumPageLines = json.maximumPageLines || this.maximumPageLines;
                this.topMargin = json.topMargin || this.topMargin;
                this.rightMargin = json.rightMargin || this.rightMargin;
                this.leftMargin = json.leftMargin || this.leftMargin;
                this.bottomMargin = json.bottomMargin || this.bottomMargin;
                this.state = ModelState.LOADED;
            },
            err => {
                this.state = ModelState.ERROR;
            }
        );
    }

    saveSettings = (key, value) => {
        this.state = ModelState.DIRTY;
        this[key] = value;
        this.savedSettingsObj[key] = value;
        clearTimeout(this.uploadTimer);
        this.uploadTimer = setTimeout(this.uploadSettings, 1000);
    }

    uploadSettings = () => {
        const settingsToUpload = Object.assign({}, this.savedSettingsObj);
        this.savedSettingsObj = {};
        API.updateSettings("rocketbang", settingsToUpload).then(() => {
            if(Object.keys(this.savedSettingsObj).length === 0) {
                this.state = ModelState.LOADED;
            }
        });

    }

    changeWordFont = (amount) => {
        this.saveSettings("wordFontSize", this.wordFontSize + amount);
    }
}
