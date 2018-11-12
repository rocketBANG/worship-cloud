export class NotLoadedError extends Error {
    constructor(message = "") {
        super(message);
        this.name = "NotLoadedError";
    }
}