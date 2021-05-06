import Task from './Task';

export default class TaskList extends Task {
    constructor(title, dueDate = null) {
        super(title, dueDate);
        this._tasks = [];
        this._isDone = false;
    }

    set tasks(tasks) {
        this._tasks = tasks;
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

    //I should be able to: add task, remove task, filter tasks, search..... 
}