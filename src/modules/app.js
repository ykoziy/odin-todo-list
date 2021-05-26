import Task from './Task';
import Project from './Project';
import DataStore from './DataStore.js';
import { isToday, isThisWeek, parseISO, startOfYesterday, isWithinInterval} from 'date-fns';

import {renderHTML as renderSideNav} from './dom/SideNav';
import {renderHTML as renderMainContent} from './dom/MainContent';
import {renderHTML as renderModal} from './dom/Modal';
import PubSub from 'pubsub-js';

class App {
    constructor(projects) {
        this.projects = projects;
    }

    addNewProject(msg, data) {
        console.log('New project added.');
        const proj = new Project(data.name, data.description);
        this.projects.push(proj);
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectsUpdated', this.projects);
    }
    
    // TODO: finish, adding task without project.
    addNewTask(msg, data) {
        console.log(`Adding task to the project with id: ${data.id}`);
        const task = new Task(data.title, parseISO(data.duedate));
        console.log(task);
        if (data.id == null) {
            console.log('project was null, add to the inbox?!?');
            return;
        }
    
        let project = null;

        this.projects[data.id].addTask(task);
        project = this.projects[data.id];
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectUpdated', {id: data.id, project: project});
    }

    addNewSubtask(msg, data) {
        console.log(`Adding subtask to the task with id: ${data.taskID}`);
        const subtask = new Task(data.title, parseISO(data.duedate));
        const task = this.projects[data.projectID].getTask(data.taskID);
        task.addSubtask(subtask);
        const project = this.projects[data.projectID];
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectUpdated', {id: data.projectID, project: project});        
    }

    completeTaskHandler(msg, data) {
        const project = this.projects[Number(data.projectId)];
        if (project.hasTaskId(data.taskId)) {
            const task = project.getTask(data.taskId);
            const subtask = task.getSubtask(data.subtaskId);
            if (subtask) {
                subtask.isDone = !subtask.isDone;
                if (task.areSubtasksDone()) {
                    task.isDone = true;
                } else {
                    task.isDone = false;
                }
            } else if (!task.hasSubtasks()) {
                task.isDone = !task.isDone;
            }
        }
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectUpdated', {id: data.projectId, project: project});
    }

    getProject(msg, idx) {
        const data = {id:idx, project:this.projects[idx]};
        PubSub.publish('returnProject', data);
    }
    
    filterTasks(func) {
        const result = [];
        for (let i = 0; i < this.projects.length; i++) {
            const project = this.projects[i];
            const title = project.title;
            if (project.tasks.size > 0) {
                for (const item of project.tasks) {
                    const task = item[1];
                    if (func(task)) {
                        result.push({projectID: i, parentID: null, taskID: item[0], task: task});
                    }
                    for (const sub of task.subTasks) {
                        const subtask = sub[1];
                        if (func(subtask)) {
                            result.push({projectID: i, parentID: item[0], taskID: sub[0], task: subtask});
                        }                        
                    }
                }
            }
        }
        return result;
    }    

    inboxClickHandler() {
        console.log('inbox clicked');
        //! get the projects created today and yesterday...
        const data = this.filterTasks((task) => {
            return isWithinInterval(task.creationDate, {
                start: startOfYesterday(),
                end: new Date()
            });
        });
        PubSub.publish('filterTodos', data); 
    }
    
    upcomingClickHandler() {
        console.log('upcoming clicked');
        const data = this.filterTasks((task) => {
            return isThisWeek(task.dueDate);
        });
        PubSub.publish('filterTodos', data);     
    }

    todayClickHandler() {
        const data = this.filterTasks((task) => {
            return isToday(task.dueDate);
        });
        PubSub.publish('filterTodos', data);
    }
    
    urgentClickHandler() {
        console.log('urgent clicked, inop');
    }
    
    editProjectHandler(msg, data) {
        console.log(`Clicked on edit project. Editing ${data.id}`);
        this.projects[data.id].title = data.title;
        this.projects[data.id].description = data.description;
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectsUpdated', this.projects);
    }

    deleteProjectHandler(msg, data) {
        console.log(`Clicked on delete project. Deleting ${data.id}`);
        this.projects.splice(Number(data.id), 1);

        const container = document.getElementById("content");
        renderMainContent(container);
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectsUpdated', this.projects);
    }

    deleteTaskHandler(msg, data) {
        const project = this.projects[data.projectId];
        if (data.subtaskId) {
            project.getTask(data.taskId).deleteSubtask(data.subtaskId);
        } else {
            project.deleteTask(data.taskId);
        }
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectUpdated', {id: data.projectId, project: project});
    }

    editTaskHandler(msg, data) {
        const project = this.projects[Number(data.projectId)];
        if (project.hasTaskId(data.taskId)) {
            const task = project.getTask(data.taskId);
            const subtask = task.getSubtask(data.subtaskId);
            if (subtask) {
                subtask.title = data.txt;
                subtask.dueDate = (data.due ? parseISO(data.due) : null);
            } else {
                task.title = data.txt;
            }
        }
        DataStore.saveTodoData(this.projects);
        PubSub.publish('projectUpdated', {id: data.projectId, project: project});   
    }
}

function generateProjects(count) {
    let projects = [];
    for (let i = 1; i <= count; i++) {
        let proj = new Project(`Project ${i}`, `This is a placeholder project description for project #${i}`);
        const tasks = generateTasks(3, 4);
        tasks.forEach(item => proj.addTask(item));
        projects.push(proj);
    }
    return projects;
}

function generateTasks(mainTaskCount, subTaskCount) {
    let data = [];
    for (let i = 1; i <= mainTaskCount; i++) {
        const task = new Task(`Main task #${i}`);
        for (let j = 1; j <= subTaskCount; j++) {
            let subtask = new Task(`a subtask #${j}`, new Date());
            if (Math.round(Math.random()) == 1) {
                subtask.isDone = true;
            }
            task.addSubtask(subtask);
        }
        data.push(task);
    }
    data.push(new Task('A random task without subtasks'));
    return data;
}

function init() {
    const container = document.getElementById("content");
    let projects;

    if (DataStore.isDatastoreEmpty()) {
        projects = generateProjects(4);
        //DataStore.saveTodoData(projects);
    } else {
        projects = DataStore.getTodoData();
    }

    const app = new App(projects);

    renderSideNav(container, projects);
    renderMainContent(container);
    renderModal();

    PubSub.subscribe('newProject', (msg, data) => app.addNewProject(msg, data));
    PubSub.subscribe('newTask', (msg, data) => app.addNewTask(msg, data));
    PubSub.subscribe('newSubtask', (msg, data) => app.addNewSubtask(msg, data));
    PubSub.subscribe('getProject', (msg, data) => app.getProject(msg, data));

    PubSub.subscribe('inboxNavClick', () => app.inboxClickHandler());
    PubSub.subscribe('upcomingNavClick', () => app.upcomingClickHandler());
    PubSub.subscribe('todayNavClick', () => app.todayClickHandler());
    PubSub.subscribe('urgentNavClick', () => app.urgentClickHandler());

    PubSub.subscribe('editProjectClick', (msg, data) => app.editProjectHandler(msg, data));
    PubSub.subscribe('deleteProject', (msg, data) => app.deleteProjectHandler(msg, data));

    PubSub.subscribe('completeTask', (msg, data) => app.completeTaskHandler(msg, data));
    PubSub.subscribe('deleteTask', (msg, data) => app.deleteTaskHandler(msg, data));
    PubSub.subscribe('editTask', (msg, data) => app.editTaskHandler(msg, data));
}

export { init };