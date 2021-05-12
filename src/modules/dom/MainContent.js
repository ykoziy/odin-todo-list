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

    const editFields = document.querySelectorAll('.project-title, .project-description');

    if (!editFields[0].isContentEditable) {
        editFields[0].contentEditable = 'true';
        editFields[1].contentEditable = 'true';
    } else {
        editFields[0].contentEditable = 'false';
        editFields[1].contentEditable = 'false';
        const title = editFields[0].textContent;
        const description = editFields[1].textContent;
        const data = {id: projectID, title: title, description: description};
        PubSub.publish('editProjectClick', data);
    }
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