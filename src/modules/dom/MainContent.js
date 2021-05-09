import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';
import PubSub from 'pubsub-js';

const markup = `
    ${renderTodos()}
    ${renderAside()}
`;

function getProjectTitle() {
    const titleH1 = document.querySelector('.project-title');
    if (!titleH1) return null; 
    return titleH1.dataset.title;
}

function editProjectHandler(event) {
    const projectTitle = getProjectTitle();
    PubSub.publish('editProjectClick', projectTitle);
}

function addTaskHandler(event) {
    const projectTitle = getProjectTitle();
    PubSub.publish('addTaskClick', projectTitle);
}

function renderHTML(parentElement) {
    const div = document.createElement('div');
    div.setAttribute('id', 'main-content');
    div.innerHTML = markup;

    div.querySelector('#edit-project-btn').addEventListener('click', editProjectHandler);
    div.querySelector('#add-todo-btn').addEventListener('click', addTaskHandler);

    parentElement.appendChild(div);
}

export { renderHTML };