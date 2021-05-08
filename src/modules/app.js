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
        let proj = new Project(`Project ${i}`);
        projects.push(proj);
    }
}

function init() {
    let container = document.getElementById("content");
    generateProjects(4);

    renderSideNav(container, projects);
    renderMainContent(container);
    renderModal();

    PubSub.subscribe('newProject', (msg, data) => addNewProject(msg, data));
    PubSub.subscribe('getProject', (msg, data) => getProject(msg, data));
}

export { init };