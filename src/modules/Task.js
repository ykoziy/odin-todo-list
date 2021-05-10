import { nanoid } from 'nanoid';

export default class Task {
    constructor(title, dueDate = null) {
        this._title = title;
        this._dueDate = dueDate;
        this._subTasks = new Map();
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

    get subTasks() {
        return this._subTasks;
    }

    hasSubtasks() {
        return !(this.subTasks.size == 0);
    }

    addSubtask(task) {
        let subtaskId = nanoid(6);
        do {
            subtaskId = nanoid(6);
        } while (this._subTasks.has(subtaskId));
        this._subTasks.set(subtaskId, task);
    }

    getSubtask(id) {
        return this._subTasks.get(id);
    }


    //I should be able to: add task, remove task, filter tasks, search, edit, etc... 
}