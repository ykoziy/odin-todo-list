import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';

const markup = `
    ${renderTodos()}
    ${renderAside()}
`;

function editProjectHandler(event) {
    console.log('Clicked on edit project');  
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