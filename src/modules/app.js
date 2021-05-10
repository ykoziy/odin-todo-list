import Task from './Task';
import Project from './Project';
import { isToday, parseISO, format} from 'date-fns';
import { nanoid } from 'nanoid';

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
        PubSub.publish('projectsUpdated', this.projects);
    }
    
    // TODO: finish, adding task without project.
    addNewTask(msg, data) {
        console.log(`Adding task to the ${data.projectTitle} project`);
        const task = new Task(data.title, parseISO(data.duedate));
    
        if (data.projectTitle == null) {
            console.log('project was null, add to the inbox?!?');
            return;
        }
    
        let project = null;

        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].title == data.projectTitle) {
                this.projects[i].addTask(task);
                project = this.projects[i];
                break;
            }
        }
        PubSub.publish('projectUpdated', project);
    }

    getProject(msg, idx) {
        const data = {id:idx, project:this.projects[idx]};
        PubSub.publish('returnProject', data);
    }
    
    inboxClickHandler() {
        console.log('inbox clicked');
    }
    
    upcomingClickHandler() {
        console.log('upcoming clicked');
    }
    
    todayClickHandler() {
        console.log('today clicked');
    }
    
    urgentClickHandler() {
        console.log('urgent clicked');
    }
    
    editProjectHandler(msg, data) {
        console.log(`Clicked on edit project. Editing ${data}`);
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
            let subtask = new Task(`a subtask #${j}`)
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
    let container = document.getElementById("content");
    const projects = generateProjects(4);

    const app = new App(projects);

    renderSideNav(container, projects);
    renderMainContent(container);
    renderModal();

    PubSub.subscribe('newProject', (msg, data) => app.addNewProject(msg, data));
    PubSub.subscribe('newTask', (msg, data) => app.addNewTask(msg, data));
    PubSub.subscribe('getProject', (msg, data) => app.getProject(msg, data));

    PubSub.subscribe('inboxNavClick', app.inboxClickHandler);
    PubSub.subscribe('upcomingNavClick', app.upcomingClickHandler);
    PubSub.subscribe('todayNavClick', app.todayClickHandler);
    PubSub.subscribe('urgentNavClick', app.urgentClickHandler);
    PubSub.subscribe('editProjectClick', (msg, data) => app.editProjectHandler(msg, data));
}

export { init };