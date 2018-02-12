import { extendObservable, action } from "mobx";

export class SermonComponentModel {

    constructor(text, x, y) {
        extendObservable(this, {
            text: text,
            x: x,
            y: y,
            selected: false,
            toggleSelected: action(this.toggleSelected),
            move: action(this.move),
            toggleEditing: action(this.toggleEditing),
            deselect: action(() => this.selected = false),
            select: action(() => this.selected = true),
            setPosition: action((x, y) => {this.x = x; this.y = y}),
            isEditing: false,
        })
    }

    toggleSelected = () => {
        this.selected = !this.selected;
    }

    move = (x, y) => {
        this.x += x;
        this.y += y;
    }

    toggleEditing = () => {
        this.isEditing = !this.isEditing;
    }
}

