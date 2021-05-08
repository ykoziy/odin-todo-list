import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';
import PubSub from 'pubsub-js';

const markup = `
    ${renderTodos()}
    ${renderAside()}
`;

function editProjectHandler(event) {
    const titleH1 = document.querySelector('.project-title');
    if (!titleH1) return; 
    const projectTitle = titleH1.dataset.title;
    PubSub.publish('editProjectClick', projectTitle);
}

function addTaskHandler(event) {
    console.log('Clicked on add task');  
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