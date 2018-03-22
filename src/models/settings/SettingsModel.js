import { extendObservable, action } from "mobx";
import * as API from '../../store/api'
import { ModelState } from "../ModelState";

export class SettingsModel {

    static settingsModel = new SettingsModel();

    static settingsList = [
        "wordFontSize", 
        "titleFontSize", 
        "lineHeight", 
        "minimumPageLines", 
        "maximumPageLines", 
        "topMargin", 
        "leftMargin", 
        "rightMargin", 
        "titleMargin", 
        "indentAmount",
    ];

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
            titleMargin: 0,
            indentAmount: 1.0,
            loadSettings: action(this.loadSettings),
            state: ModelState.UNLOADED,
            changeWordFont: action(this.changeWordFont),
            changeSetting: action(this.changeSetting)
        });
    }

    loadSettings = () => {
        if(this.state !== ModelState.UNLOADED) {
            return;
        }
        this.state = ModelState.LOADING;
        API.getSettings("rocketbang").then(
            json => {
                SettingsModel.settingsList.forEach((settingName) => {
                    this[settingName] = json[settingName] || this[settingName];
                });
                this.state = ModelState.LOADED;
            },
            err => {
                this.state = ModelState.ERROR;
            }
        );
    }

    changeSetting = (key, value) => {
        this.state = ModelState.DIRTY;
        value = parseInt(value, 10) || 0;
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
        this.changeSetting("wordFontSize", this.wordFontSize + amount);
    }
}
