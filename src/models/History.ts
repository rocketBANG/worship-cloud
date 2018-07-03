export interface IHistoryChange {
    name: string,
    object: object,
    undo: () => void | Promise<any>,
    redo: () => void | Promise<any>
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

    public undo = async (): Promise<any> => {
        let undone = this.undoList.pop();
        if(undone === undefined) return;

        this.redoList.push(undone);
        await undone.undo();
    }

    public redo = async (): Promise<any> => {
        let redone = this.redoList.pop();
        if(redone === undefined) return;

        this.undoList.push(redone);
        await redone.redo();
    }
}

const HistoryManager = new History();

export {HistoryManager}