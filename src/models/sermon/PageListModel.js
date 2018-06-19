import { extendObservable, action } from "mobx";

export class PageListModel {

    constructor() {
        extendObservable(this, {
            pages: [],
            setPage: action(this.setPage),
            currentPageIndex: -1,
            currentPage: {},
        })
    }

    setPage = (index) => {
        this.currentPageIndex = index;
        this.currentPage = this.pages[this.currentPageIndex];
    }

    addPage = (page) => {
        this.pages.push(page);
    }

}

