import PubSub from 'pubsub-js';

function markup(title) {
    let markup = `
        <div class="modal-content">
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

function addNewTaskHandler(event, idx) {
    event.preventDefault();
    const title = event.target.querySelector("#title").value;
    const duedate = event.target.querySelector("#duedate").value;
    const data = {title: title, duedate: duedate, id: idx};
    PubSub.publish('newTask', data);
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
    let label = document.createElement('label');
    label.textContent = text;
    label.setAttribute('for', forAttrib);
    parent.appendChild(label);
}

function createAndAppendInput(type, id, isRequired, parent) {
    let input = document.createElement('input');
    input.type = type;
    input.setAttribute('id', id);
    if (isRequired) {
        input.setAttribute('required', '');
    }
    parent.appendChild(input);
}

function createAndAppendSubmit(value, parent) {
    let submit = document.createElement('input');
    submit.type = 'submit';
    submit.setAttribute('value', value);
    parent.appendChild(submit);
}

function showAddProjectModal() {
    let modal = document.querySelector('.modal');
    modal.innerHTML = markup('Add Project');

    let modalForm = modal.querySelector('form');
    modalForm.setAttribute('id', 'add-project');

    createAndAppendLabel('name', 'Project name:', modalForm);
    createAndAppendInput('text', 'name', true, modalForm);
    createAndAppendLabel('description', 'Project description:', modalForm);
    createAndAppendInput('text', 'description', false, modalForm);
    createAndAppendSubmit('Ok', modalForm);

    modalForm.addEventListener('submit', addNewProjectHandler);

    modal.style.display = 'flex';
}

function showAddTaskModal(msg, data) {
    let modal = document.querySelector('.modal');
    modal.innerHTML = markup('Add Task');

    let modalForm = modal.querySelector('form');
    modalForm.setAttribute('id', 'add-task');

    createAndAppendLabel('title', 'Task title:', modalForm);
    createAndAppendInput('text', 'title', true, modalForm);
    createAndAppendLabel('duedate', 'Due date:', modalForm);
    createAndAppendInput('date', 'duedate', false, modalForm);
    createAndAppendSubmit('Ok', modalForm);

    modalForm.addEventListener('submit', (event) => (addNewTaskHandler(event, data)));

    modal.style.display = 'flex';
}

function showDeleteConfirmationModal(msg, data) {
    let modal = document.querySelector('.modal');
    modal.innerHTML = markup('Are you sure you want to delete?');
    modal.querySelector('form').remove();

    const modalBody = modal.querySelector('.modal-content-body');

    const yesButton = document.createElement('button');
    yesButton.textContent = "Yes";
    yesButton.addEventListener('click', () => {
        PubSub.publish('deleteTask', data);
        hideModal();
    });


    const noButton = document.createElement('button');
    noButton.textContent = "No";
    noButton.addEventListener('click', hideModal);

    modalBody.appendChild(yesButton);
    modalBody.appendChild(noButton);

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

    PubSub.subscribe('addProjectClick', showAddProjectModal);
    PubSub.subscribe('deleteTaskClick', (msg, data) => showDeleteConfirmationModal(msg, data));

    PubSub.subscribe('addTaskClick', (msg, data) => showAddTaskModal(msg, data));
}

export { renderHTML };