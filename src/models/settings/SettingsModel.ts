import { action, decorate, observable } from "mobx";
import { SongApi } from '../../store/api';
import { ModelState } from "../general/ModelState";

export class SettingsModel {

    private songApi: SongApi = new SongApi();

    private static settingsModelObject;
    public static get settingsModel(): SettingsModel {
        if(this.settingsModelObject === undefined) {
            this.settingsModelObject = new SettingsModel();
        }
        return this.settingsModelObject;
    }

    public static settingsList = [
        "wordFontSize", 
        "lineHeight", 
        "minimumPageLines", 
        "maximumPageLines", 
        "topMargin", 
        "leftMargin", 
        "rightMargin", 
        "titleMargin", 
        "indentAmount",
        "backgroundImage",
    ];

    private savedSettingsObj = {};
    private uploadTimer: NodeJS.Timer;

    public wordFontSize = 50
    public titleFontSize = 25
    public lineHeight = 1.3
    public minimumPageLines = 2
    public maximumPageLines = 6
    public topMargin = 3
    public leftMargin = 3
    public rightMargin = 0
    public titleMargin = 0
    public indentAmount = 1.0
    public state = ModelState.UNLOADED
    public backgroundImage: string;


    public loadSettings = () => {
        if(this.state !== ModelState.UNLOADED) {
            return;
        }
        this.state = ModelState.LOADING;
        this.songApi.getSettings("rocketbang").then(
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

    public changeSetting = (key, value) => {
        this.state = ModelState.DIRTY;
        this[key] = value;
        this.savedSettingsObj[key] = value;
        clearTimeout(this.uploadTimer);
        this.uploadTimer = setTimeout(this.uploadSettings, 1000);
    }

    public uploadSettings = () => {
        const settingsToUpload = Object.assign({}, this.savedSettingsObj);
        this.savedSettingsObj = {};
        this.songApi.updateSettings("rocketbang", settingsToUpload).then(() => {
            if(Object.keys(this.savedSettingsObj).length === 0) {
                this.state = ModelState.LOADED;
            }
        });
    }

    public changeWordFont = (amount: number) => {
        this.changeSetting("wordFontSize", this.wordFontSize + amount);
    }
}

decorate(SettingsModel, {
    wordFontSize: observable,
    titleFontSize: observable,
    lineHeight: observable,
    minimumPageLines: observable,
    maximumPageLines: observable,
    topMargin: observable,
    leftMargin: observable,
    rightMargin: observable,
    titleMargin: observable,
    indentAmount: observable,
    state: observable,
    loadSettings: action,
    changeWordFont: action,
    changeSetting: action
    
})