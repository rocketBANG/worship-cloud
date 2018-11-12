export class NetworkError extends Error {

    constructor(message = "", public userMessage = "", public errorCode = -1) {
        super(message);
        this.name = "NetworkError";
    }
}