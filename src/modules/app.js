import Task from './Task';
import TaskList from './TaskList';
import Project from './Project';
import { isToday, parseISO, format} from 'date-fns';

import {renderHTML as renderSideNav} from './dom/SideNav';
import {renderHTML as renderMainContent} from './dom/MainContent';
import {renderHTML as renderModal} from './dom/Modal';
import PubSub from 'pubsub-js';

const projects = [];

function addNewProject(msg, data) {
    console.log('New project added.');
    const proj = new Project(data.name, data.description);
    projects.push(proj);
    PubSub.publish('projectsUpdated', projects);
}

function getProject(msg, data) {
    PubSub.publish('returnProject', projects[data]);
}

function generateProjects(count) {
    for (let i = 1; i <= count; i++) {
        let proj = new Project(`Project ${i}`, `This is a placeholder project description for project #${i}`);
        proj.tasks = generateTasks(3, 4);
        projects.push(proj);
    }
}

function inboxClickHandler() {
    console.log('inbox clicked');
}

function upcomingClickHandler() {
    console.log('upcoming clicked');
}

function todayClickHandler() {
    console.log('today clicked');
}

function urgentClickHandler() {
    console.log('urgent clicked');
}

function editProjectHandler(msg, data) {
    console.log(`Clicked on edit project. Editing ${data}`);
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
    generateProjects(4);

    renderSideNav(container, projects);
    renderMainContent(container);
    renderModal();

    PubSub.subscribe('newProject', (msg, data) => addNewProject(msg, data));
    PubSub.subscribe('getProject', (msg, data) => getProject(msg, data));

    PubSub.subscribe('inboxNavClick', inboxClickHandler);
    PubSub.subscribe('upcomingNavClick', upcomingClickHandler);
    PubSub.subscribe('todayNavClick', todayClickHandler);
    PubSub.subscribe('urgentNavClick', urgentClickHandler);
    PubSub.subscribe('editProjectClick', (msg, data) => editProjectHandler(msg, data));
}

export { init };