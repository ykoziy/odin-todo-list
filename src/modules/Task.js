import { nanoid } from 'nanoid';

export default class Task {
    constructor(title, dueDate = null, isUrgent = null) {
        this._title = title;
        this._dueDate = dueDate;
        this._creationDate = new Date();
        this._subTasks = new Map();
        this._isDone = false;
        this._isUrgent = isUrgent;
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

    set creationDate(creationDate) {
        this._creationDate = creationDate;
    }

    get creationDate() {
        return this._creationDate;
    }

    set isDone(isDone) {
        this._isDone = isDone; 
    }

    get isDone() {
        return this._isDone;   
    }

    set isUrgent(isUrgent) {
        this._isUrgent = isUrgent; 
    }

    get isUrgent() {
        return this._isUrgent;   
    }

    get subTasks() {
        return this._subTasks;
    }

    set subTasks(subtasks) {
        this._subTasks = subtasks;
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

    deleteSubtask(id) {
        return this._subTasks.delete(id);
    }

    getSubtask(id) {
        return this._subTasks.get(id);
    }

    areSubtasksDone() {
        if (this.subTasks.size == 0) {
            return true;
        } else {
            const arr = Array.from(this.subTasks.values());
            return arr.every(item => item.isDone == true);
        }
    }


    //I should be able to: add task, remove task, filter tasks, search, edit, etc... 
}