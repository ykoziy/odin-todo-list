import {renderHTML as renderNav} from './Nav';
import {renderHTML as renderProjects} from './Projects';
import PubSub from 'pubsub-js';

function generateMarkup(projects) {
    return `
        ${renderNav()}
        ${renderProjects(projects)}
        <div id="add-project">
            <div id="add-project-btn">+ New Project</div>
        </div>
    `;
}


function newProjectHandler(event) {
    PubSub.publish('addProjectClick', null);
}

function navHandler(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li') return;
    let menuButton = event.target.dataset.name;
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
    if (node !== 'li') return;
    console.log(`Clicked on ${event.target.textContent}`);
    PubSub.publish('getProject', event.target.dataset.idx);
}

function renderHTML(parentElement, projects) {
    const div = document.createElement('div');

    div.setAttribute('id', 'side-nav');
    div.innerHTML = generateMarkup(projects);

    div.querySelector('#add-project-btn').addEventListener('click', newProjectHandler);

    const navMenu = div.querySelector('nav ul');
    navMenu .addEventListener('click', navHandler);

    const projecstList = div.querySelector('#projects ul');
    projecstList.addEventListener('click', projectHandler);    

    parentElement.appendChild(div);
}

export { renderHTML };