import { nanoid } from 'nanoid';

export default class Project {
    constructor(title, description = null) {
        this._title = title;
        this._description = description
        this._tasks = new Map();
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
        let taskId = nanoid(6);
        do {
            taskId = nanoid(6);
        } while (this._tasks.has(taskId));
        this._tasks.set(taskId, task);
    }

    getTask(taskId) {
        return this._tasks.get(taskId);
    }

    deleteTask(taskId) {
        return this._tasks.delete(taskId);
    }

    hasTaskId(taskId) {
        return this._tasks.has(taskId);
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
    
    getPercentComplete() {
        let totalCount = 0;
        let doneCount = 0;
        this._tasks.forEach(task => {
            if (task.isDone) {
                doneCount++;
            }
            totalCount++;
            task.subTasks.forEach(subtask => {
                if (subtask.isDone) {
                    doneCount++;
                }
                totalCount++;
            });
        });
        return 100*(doneCount/totalCount);
    }
}