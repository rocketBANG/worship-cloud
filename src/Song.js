
class Song {
    constructor(callback) {
        this.onChangeFunc = callback;
        this.text = "hello";
    }

    setText(text) {
        this.text = text;
        this.onChangeFunc();
    }
}

export default Song;
