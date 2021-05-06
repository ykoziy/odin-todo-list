export default class Task {
    constructor(title, dueDate = null) {
        // default dueDate is null???
        this._title = title;
        this._dueDate = dueDate;
        this._isDone = false;
    }

    set title(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set dueDate(dueDate) {
        this._dueDate = dueDate;
    }

    get dueDate() {
        return this._dueDate;
    }

    set isDone(isDone) {
        this._isDone = isDone; 
    }

    get isDone() {
        return this._isDone;   
    }
}