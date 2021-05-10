import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';
import PubSub from 'pubsub-js';

const markup = `
    ${renderTodos()}
    ${renderAside()}
`;

function getProjectID() {
    const titleH1 = document.querySelector('.project-title');
    if (!titleH1) return null;
    return titleH1.dataset.idx;
}

function editProjectHandler(event) {
    const projectID = getProjectID();
    PubSub.publish('editProjectClick', projectID);
}

function addTaskHandler(event) {
    const projectID = getProjectID();
    PubSub.publish('addTaskClick', projectID);
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