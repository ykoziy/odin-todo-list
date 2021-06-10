import {renderHTML as renderNav} from './Nav';
import {renderHTML as renderProjects} from './Projects';
import { showAddProjectModal } from './Modal';
import PubSub from 'pubsub-js';

function generateMarkup(projects) {
    return `
        ${renderNav()}
        ${renderProjects(projects)}
        <div id="add-project">
            <div id="add-project-btn">+ Add Project</div>
        </div>
    `;
}


function newProjectHandler(event) {
    showAddProjectModal();
}

function navHandler(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li' && node !== 'p' && node !== 'i') return;
    let menuButton = event.target.closest('li').dataset.name;
    switch (menuButton) {
        case 'inbox':
            PubSub.publish('inboxNavClick', null);
            break;
        case 'upcoming':
            PubSub.publish('upcomingNavClick', null);
            break;
        case 'today':
            PubSub.publish('todayNavClick', null);
            break;
        case 'urgent':
            PubSub.publish('urgentNavClick', null);
            break;
    }
}

function projectHandler(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li' && node !== 'p') return;
    let targetId = event.target.dataset.idx;
    if (node === 'p') {
        targetId = event.target.parentElement.dataset.idx;
    }
    PubSub.publish('getProject', targetId);
}

function searchTaskHandler(event) {
    if (event.keyCode == 13) {
        const searchQuery = event.target.value;
        if (searchQuery) {
            PubSub.publish('searchTasks', {query: searchQuery});
        }
    }
}

function renderHTML(parentElement, projects) {
    const div = document.createElement('div');

    div.setAttribute('id', 'side-nav');
    div.innerHTML = generateMarkup(projects);

    div.querySelector('#add-project-btn').addEventListener('click', newProjectHandler);

    const searchInput = div.querySelector('#search input');
    searchInput.addEventListener('keydown', searchTaskHandler);    

    const navMenu = div.querySelector('nav ul');
    navMenu.addEventListener('click', navHandler);

    const projecstList = div.querySelector('#projects ul');
    projecstList.addEventListener('click', projectHandler);    

    parentElement.appendChild(div);
}

export { renderHTML };