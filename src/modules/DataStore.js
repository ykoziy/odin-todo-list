import Project from './Project';
import Task from './Task';
import { parseISO } from 'date-fns';

export default class DataStore {
    static saveTodoData(data) {
        function replacer(key, value) {
            if(value instanceof Map) {
                return {
                  dataType: 'Map',
                  value: Array.from(value.entries()),
                };
              } else {
                return value;
              }
        }

        localStorage.setItem('todo', JSON.stringify(data, replacer));
    }

    static parseProjects(data) {
        return data.map(item => Object.assign(new Project(), item));
    }

    static convertMap(data) {
        const newMap = new Map();
        for (const [key, value] of data) {
            const task = Object.assign(new Task(), value);
            if (task.dueDate) {
                task.dueDate = parseISO(task.dueDate);
            }
            if (task.creationDate) {
                task.creationDate = parseISO(task.creationDate);
            }
            if (task.hasSubtasks()) {
                task.subTasks = this.convertMap(task.subTasks);
            }
            newMap.set(key, task);
        }
        return newMap;
    }

    static parseTasks(data) {
        for (let i = 0; i < data.length; i++) {
            let projectTasks = data[i].tasks;
            data[i].tasks = this.convertMap(projectTasks);
        }
    }

    static getTodoData() {
        function reviver(key, value) {
            if(typeof value === 'object' && value !== null) {
                if (value.dataType === 'Map') {
                    return new Map(value.value);
                }
            }
            return value;
        }

        const data = JSON.parse(localStorage.getItem('todo'), reviver);
        let projects = this.parseProjects(data);
        this.parseTasks(projects);
        return projects;
    }

    static isDatastoreEmpty() {
        if (localStorage.getItem('todo')) {
            return false;
        } else {
            return true;
        }
        
    }
}