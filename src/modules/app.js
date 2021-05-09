import Task from './Task';
import TaskList from './TaskList';
import Project from './Project';
import { isToday, parseISO, format} from 'date-fns';

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
        projects.push(proj);
        PubSub.publish('projectsUpdated', projects);
    }
    
    // TODO: finish, adding task without project.
    addNewTask(msg, data) {
        console.log(`Adding task to the ${data.projectTitle} project`);
        const task = new Task(data.title, parseISO(data.duedate));
    
        if (data.projectTitle == null) {
            console.log('project was null, add to the inbox?!?');
            return;
        }
    
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].title == data.projectTitle) {
                projects[i].addTask(task);
            }
        }
    }

    getProject(msg, data) {
        PubSub.publish('returnProject', projects[data]);
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
        proj.tasks = generateTasks(3, 4);
        projects.push(proj);
    }
    return projects;
}

function generateTasks(mainTaskCount, subTaskCount) {
    let data = [];
    for (let i = 1; i <= mainTaskCount; i++) {
        const tasklist = new TaskList(`Main task #${i}`);
        let subtasks = [];
        for (let j = 1; j <= subTaskCount; j++) {
            let task = new Task(`a subtask #${j}`)
            if (Math.round(Math.random()) == 1) {
                task.isDone = true;
            }
            subtasks.push(task);
        }
        tasklist.tasks = subtasks;
        data.push(tasklist);
    }
    data.push(new Task('A random task without subtasks'));
    return data;
}

function init() {
    let container = document.getElementById("content");
    let projects = generateProjects(4);

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