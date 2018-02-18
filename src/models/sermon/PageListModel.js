import { extendObservable, action } from "mobx";

export class PageListModel {

    constructor() {
        extendObservable(this, {
            pages: [],
            setPage: action(this.setPage),
            currentPageIndex: -1,
        })
    }

    setPage = (index) => {
        this.currentPageIndex = index;
    }

    addPage = (page) => {
        this.pages.push(page);
    }

}

