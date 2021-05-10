export default class Task {
    constructor(title, dueDate = null) {
        this._title = title;
        this._dueDate = dueDate;
        this._subTasks = [];
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

    set subTasks(subTasks) {
        this._subTasks = subTasks;
    }

    get subTasks() {
        return this._subTasks;
    }

    hasSubtasks() {
        return !(this.subTasks.length == 0);
    }


    //I should be able to: add task, remove task, filter tasks, search, edit, etc... 
}