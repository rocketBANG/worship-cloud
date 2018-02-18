import { extendObservable, action } from "mobx";

export class SermonPageModel {

    constructor(title) {
        extendObservable(this, {
            components: [],
            title: title | '',
        })
    }

}

