export default class Project {
    constructor(title, description = null) {
        this._title = title;
        this._description = description
        this._tasks = [];
        this._isDone = false;
    }

    set title(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set description(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set tasks(tasks) {
        this._tasks = tasks;
    }

    addTask(task) {
        this._tasks.push(task);
    }

    get tasks() {
        return this._tasks;
    }
    
    set isDone(isDone) {
        this._isDone = isDone; 
    }

    get isDone() {
        return this._isDone;   
    }    
}