export interface IHistoryChange {
    name: string,
    object: object,
    undo: () => void | Promise<any>,
    redo: () => void | Promise<any>,
    shouldChange?: () => boolean
}

export class History {
    private undoList: IHistoryChange[] = [];
    private redoList: IHistoryChange[] = [];

    public addHistory = (history: IHistoryChange) => {
        this.undoList.push(history);
        this.redoList = [];
    }

    public clearHistory = (name: string) => {
        this.undoList = this.undoList.filter(u => u.name !== name);
        this.redoList = this.redoList.filter(u => u.name !== name);
    }

    private findNextShouldChange = (list: IHistoryChange[]): IHistoryChange => {
        for(let i = list.length - 1; i > -1; i--) {
            let possibleUndone = list[i];
            if(possibleUndone.shouldChange === undefined || possibleUndone.shouldChange()) {
                return possibleUndone;
            }
        }
        return undefined;
    }

    public undo = async (): Promise<any> => {
        let undone = this.findNextShouldChange(this.undoList);

        if(undone === undefined) return;
        this.undoList = this.undoList.filter(u => u !== undone);

        this.redoList.push(undone);
        await undone.undo();
    }

    public redo = async (): Promise<any> => {
        let redone = this.findNextShouldChange(this.redoList);

        if(redone === undefined) return;
        this.redoList = this.redoList.filter(r => r !== redone);

        this.undoList.push(redone);
        await redone.redo();
    }
}

const HistoryManager = new History();

export {HistoryManager}