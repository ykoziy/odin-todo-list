import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';
import { showAddTaskModal } from './Modal';
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

    const deleteProjectBtn = document.getElementById('delete-project-btn');

    if (editFields.length == 0) {
        return;
    }

    if (!editFields[0].isContentEditable) {
        deleteProjectBtn.style.display = 'block';
        editFields[0].contentEditable = 'true';
        editFields[1].contentEditable = 'true';
    } else {
        const title = editFields[0].textContent;
        // title cannot be empty, show error modal?
        if (title.length == 0) {
            console.log('error, title cannot be blank');
            return;
        }
        deleteProjectBtn.style.display = 'none';
        editFields[0].contentEditable = 'false';
        editFields[1].contentEditable = 'false';
        const description = editFields[1].textContent;
        const data = {id: projectID, title: title, description: description};
        PubSub.publish('editProjectClick', data);
    }
}

function deleteProjectHandler(event) {
    const projectID = getProjectID();
    const deleteProjectBtn = document.getElementById('delete-project-btn');
    const editFields = document.querySelectorAll('.project-title, .project-description');

    const data = {id: projectID};

    deleteProjectBtn.style.display = 'none';
    editFields[0].contentEditable = 'false';
    editFields[1].contentEditable = 'false';

    PubSub.publish('deleteProjectClick', data);
}

function addTaskHandler(event) {
    const projectID = getProjectID();
    showAddTaskModal(projectID);
}

function renderHTML(parentElement) {
    let div = document.querySelector('#main-content');

    if (!div) {
        div = document.createElement('div');
        div.setAttribute('id', 'main-content');
        div.innerHTML = markup;
    } else {
        div.innerHTML = markup;
    }


    div.querySelector('#edit-project-btn').addEventListener('click', editProjectHandler);
    div.querySelector('#delete-project-btn').addEventListener('click', deleteProjectHandler);
    div.querySelector('#add-todo-btn').addEventListener('click', addTaskHandler);

    parentElement.appendChild(div);
}

export { renderHTML };