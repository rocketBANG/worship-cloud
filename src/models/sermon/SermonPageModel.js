import { extendObservable, action } from "mobx";

export class SermonPageModel {

    constructor(title) {
        extendObservable(this, {
            components: [],
            title: title || '',
            addComponent: action(this.addComponent)
        })
    }

    addComponent = (component) => {
        this.components.push(component);
    }

}

