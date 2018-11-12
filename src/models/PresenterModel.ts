import { observable, action, computed } from "mobx";

export class PresenterModel {
    @observable private blanked = false;

    public set Blanked(blanked: boolean) {
        this.blanked = blanked;
    }

    @computed
    public get Blanked() {
        return this.blanked;
    }

}