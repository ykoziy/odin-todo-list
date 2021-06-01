import PubSub from 'pubsub-js';
import { format } from 'date-fns';

function markup(title, type) {
    const modalTypeClass = type ? type+'-modal' : '';
    const markup = `
        <div class="modal-content ${modalTypeClass}">
            <div class="modal-content-header"><h1>${title}</h1></div>
            <div class="modal-content-body">
                <form>
                </form>
            </div>
        </div>    
    `;
    return markup;
}

function addNewProjectHandler(event) {
    event.preventDefault();
    const name = event.target.querySelector("#name").value;
    const description = event.target.querySelector("#description").value;
    const data = {name: name, description: description};
    PubSub.publish('newProject', data);
    hideModal();
}

function addNewTaskHandler(event, projectID) {
    event.preventDefault();
    const title = event.target.querySelector("#title").value;
    const duedate = event.target.querySelector("#duedate").value;
    const data = {title: title, duedate: duedate, projectID: projectID};
    PubSub.publish('newTask', data);
    hideModal();
}

function addNewSubtaskHandler(event, projectID, taskID) {
    event.preventDefault();
    const title = event.target.querySelector("#title").value;
    const duedate = event.target.querySelector("#duedate").value;
    const data = {title: title, duedate: duedate, projectID: projectID, taskID: taskID};
    PubSub.publish('newSubtask', data);
    hideModal();
}

function clickOutsideModalHandler(event) {
    const modalContent = document.querySelector(".modal-content");
    let target = event.target;
    do {
        if (target == modalContent) {
            return;
        }
        target = target.parentNode;
    } while (target);
    hideModal();   
}

function createAndAppendLabel(forAttrib, text, parent) {
    const label = document.createElement('label');
    label.textContent = text;
    label.setAttribute('for', forAttrib);
    parent.appendChild(label);
}

function createAndAppendInput(type, id, isRequired, parent, value) {
    const input = document.createElement('input');
    input.type = type;
    input.setAttribute('id', id);
    if (isRequired) {
        input.setAttribute('required', '');
    }
    if (value) {
        input.setAttribute('value', value);
    }
    parent.appendChild(input);
}

function createAndAppendChoicesDiv(parent) {
    const div = document.createElement('div');
    div.setAttribute('id', 'modal-choice');
    createAndAppendInput('submit', 'submit-modal', null, div, 'OK');
    createAndAppendInput('button', 'submit-modal', null, div, 'Cancel');
    div.querySelector('input[type="button"]').addEventListener('click', hideModal);
    parent.appendChild(div);   
}

function showAddProjectModal() {
    const modal = document.querySelector('.modal');
    modal.innerHTML = markup('Add Project');

    const modalForm = modal.querySelector('form');
    modalForm.setAttribute('id', 'add-project');

    createAndAppendLabel('name', 'Project name:', modalForm);
    createAndAppendInput('text', 'name', true, modalForm);
    createAndAppendLabel('description', 'Project description:', modalForm);
    createAndAppendInput('text', 'description', false, modalForm);
    createAndAppendChoicesDiv(modalForm);

    modalForm.addEventListener('submit', addNewProjectHandler);

    modal.style.display = 'flex';
}

function showAddTaskModal(projectID) {
    const modal = document.querySelector('.modal');
    modal.innerHTML = markup('Add Task');

    const modalForm = modal.querySelector('form');
    modalForm.setAttribute('id', 'add-task');

    createAndAppendLabel('title', 'Task title:', modalForm);
    createAndAppendInput('text', 'title', true, modalForm);
    createAndAppendLabel('duedate', 'Due date:', modalForm);
    createAndAppendInput('date', 'duedate', false, modalForm);
    createAndAppendChoicesDiv(modalForm);

    modalForm.addEventListener('submit', (event) => (addNewTaskHandler(event, projectID)));

    modal.style.display = 'flex';
}

function showAddSubtaskModal(projectID, taskID) {
    const modal = document.querySelector('.modal');
    modal.innerHTML = markup('Add Subtask');

    const modalForm = modal.querySelector('form');
    modalForm.setAttribute('id', 'add-task');

    createAndAppendLabel('title', 'Task title:', modalForm);
    createAndAppendInput('text', 'title', true, modalForm);
    createAndAppendLabel('duedate', 'Due date:', modalForm);
    createAndAppendInput('date', 'duedate', false, modalForm);
    createAndAppendChoicesDiv(modalForm);

    modalForm.querySelector('#duedate').value = format(new Date(), 'yyyy-MM-dd');

    modalForm.addEventListener('submit', (event) => (addNewSubtaskHandler(event, projectID, taskID)));

    modal.style.display = 'flex';  
}

function showDeleteConfirmationModal(data, type) {
    const modal = document.querySelector('.modal');
    modal.innerHTML = markup('Are you sure you want to delete?', 'warning');
    modal.querySelector('form').remove();

    const modalBody = modal.querySelector('.modal-content-body');

    const yesButton = document.createElement('button');
    yesButton.textContent = "Yes";

    yesButton.addEventListener('click', () => {
        if (type === 'deleteTask') {
            PubSub.publish('deleteTask', data);
        } else if (type === 'deleteProject') {
            PubSub.publish('deleteProject', data);    
        }
        hideModal();
    });


    const noButton = document.createElement('button');
    noButton.textContent = "No";
    noButton.addEventListener('click', hideModal);

    modalBody.appendChild(yesButton);
    modalBody.appendChild(noButton);

    modal.style.display = 'flex';  
}

function showErrorModal(text) {
    let modal = document.querySelector('.modal');
    modal.innerHTML = markup('Error', 'error');
    modal.querySelector('form').remove();
    let p = document.createElement('p');
    p.textContent = text;
    modal.querySelector('.modal-content-body').appendChild(p);
    modal.style.display = 'flex';
}

function hideModal() {
    let modal = document.querySelector('.modal');
    modal.innerHTML = '';
    modal.style.display = 'none';
}

function renderHTML() {
    const div = document.createElement('div');
    div.setAttribute('class', 'modal');

    div.addEventListener('mousedown', clickOutsideModalHandler);

    document.querySelector('body').appendChild(div);
}

export { renderHTML, showAddSubtaskModal, showAddTaskModal, showAddProjectModal, showDeleteConfirmationModal, showErrorModal };