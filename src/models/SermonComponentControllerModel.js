import { extendObservable, action } from "mobx";

export class SermonComponentControllerModel {

    constructor() {
        extendObservable(this, {
            moveX: 0,
            moveY: 0,
            move: action(this.move),
        })
    }

    move = (x, y) => {
        this.moveX = x;
        this.moveY = y;
    }
}

