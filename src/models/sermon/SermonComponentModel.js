import { extendObservable, action } from "mobx";

export class SermonComponentModel {

    constructor(text, a, b) {
        extendObservable(this, {
            text: text,
            x: a,
            y: b,
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

