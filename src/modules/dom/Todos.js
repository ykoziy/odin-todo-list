import { showAddSubtaskModal, showDeleteConfirmationModal } from './Modal';
import { format } from 'date-fns';

const markup = `
    <div id="main-todos">
    </div>
`;
let EDIT = false;

function renderProjectDetails(id, title, description) {
    return `
        <div class="project-details">
        <h1 class="project-title" data-idx="${id}">${title}</h1>
        <p class="project-description">${description}</p>
        </div>
    `;
}

function generateFilterListItem(projectID, taskID, subtaskID, task) {
    const htmlClass = `${task.isDone ? 'class="task-txt done"' : 'class="task-txt"'}`;
    const subtaskDataID = subtaskID ? `data-subtaskid="${subtaskID}"` : '';
    const dueDate = task.dueDate ? format(task.dueDate, 'MM-dd-yyyy') : '';
    return `<li data-projectid="${projectID}" data-taskid="${taskID}" ${subtaskDataID} >
            <input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>
            <span ${htmlClass}>${task.title}</span><span class='task-due-date'>${dueDate}</span>
            <div class="edit-task-btn">...</div>
            </li>`;
}

function generateTaskListItem(id, task) {
    const htmlClass = `${task.isDone ? 'class="task-txt done"' : 'class="task-txt"'}`;
    const dueDate = task.dueDate ? format(task.dueDate, 'MM-dd-yyyy') : '';
    return `<li data-id="${id}" class="subtask"><input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>
            <span ${htmlClass}>${task.title}</span><span class='task-due-date'>${dueDate}</span></li>`;
}

function taskMarkup(id, task) {
    const classDone = `${task.isDone ? 'class="done"' : ''}`;
    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <div class="title"><h2 ${classDone}>${task.title}</h2></div>
                <div class="edit-task-btn">...</div>
            </div>                           
        </div>
    `;
}

function subtasksMarkup(id, task) {
    const subtasks = [];

    task.subTasks.forEach((task, key) => {
        subtasks.push({id: key, task: task})
    });
    const classDone = `${task.areSubtasksDone() ? 'class="done"' : ''}`;
    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <div class="title"><h2 ${classDone}>${task.title}</h2></div>
                <div class="edit-task-btn">...</div>
            </div>
            <div class="task-todos">
                <ul>
                ${subtasks.map(item => generateTaskListItem(item.id, item.task)).join('')}                                                       
                </ul>
            </div>                            
        </div>
    `;
}

function renderProjectTasks(tasks) {
    let div = document.createElement('div');
    div.classList.add('project-todos');

    let html = '';

    for (const [id, task] of tasks) {
        if (task.hasSubtasks()) {
            html += subtasksMarkup(id, task);
        } else {
            html += taskMarkup(id, task);
        }
    }
    return html;
}

function handleTodoClick(event, projectID) {
    let targetNode = event.target;
    const nodeName = targetNode.nodeName.toLowerCase();
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.type == 'checkbox' || nodeName == 'span') {
        if (targetNode.type == 'checkbox') {
            targetNode = event.target.parentElement;
        }
        const subtaskElement = targetNode.closest('.subtask');
        let subtaskID = null;
        if (subtaskElement) {
            subtaskID = subtaskElement.dataset.id;
        }
        const taskID = targetNode.closest('.task').dataset.id;
        PubSub.publish('completeTask', {taskID: taskID, subtaskID: subtaskID, projectID: projectID});
    }
}

function clearButtons() {
    const element = document.querySelector('.project-todos') || document.querySelector('#filter-todos');
    const icons = element.querySelectorAll('button');
    icons.forEach(item => {
        item.remove();
    });
}

function createEditFields(parent) {
    let checkBox = parent.querySelector('input[type="checkbox"]');

    const txtInput = document.createElement('input');
    txtInput.setAttribute('type', 'text');
    txtInput.setAttribute('id', 'tasktxt');
    txtInput.required = true;

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('id', 'taskdate');

    
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-task-btn');
    submitButton.innerHTML = '<i class="fas fa-check-square"></i>';

    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.classList.add('add-subtask-btn');
    addSubtaskBtn.innerHTML = '<i class="fas fa-plus-square"></i>';

    if (checkBox) {
        parent.querySelector('input[type="checkbox"]').style.display = 'none';
    }

    if (checkBox) {
        const taskText = parent.querySelector('.task-txt');
        const taskDate = parent.querySelector('.task-due-date');
        taskText.style.display = 'none';
        taskDate.style.display = 'none';
        txtInput.value = taskText.textContent;
        if (taskDate.textContent) {
            dateInput.value = format(new Date(taskDate.textContent),  'yyyy-MM-dd');
        }

    } else {
        parent.childNodes[0].style.display = 'none';
        txtInput.value = parent.textContent;
    }

    txtInput.addEventListener('keyup', (event) => {
        if (event.target.value.trim() != "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    })
    parent.insertBefore(txtInput, parent.childNodes[1]);
    parent.insertBefore(dateInput, parent.childNodes[2]);
    parent.insertBefore(submitButton, parent.childNodes[3]);
    parent.insertBefore(addSubtaskBtn, parent.childNodes[4]);
}

function clearEditFields() {
    const editFields = document.querySelectorAll('#tasktxt, #taskdate');

    if (editFields.length == 0) {
        return;
    }
    const parent = editFields[0].parentNode;

    const mainTask = parent.querySelector('h2');
    if (mainTask) {
        mainTask.style.display = 'block';
    } else {
        parent.querySelector('input[type="checkbox"]').style.display = 'initial';
        parent.querySelector('.task-txt').style.display = 'initial';
        parent.querySelector('.task-due-date').style.display = 'initial';
    }

    editFields.forEach(item => {
        item.remove();
    });
    document.querySelector('.submit-task-btn').remove();
    document.querySelector('.add-subtask-btn').remove();
}

function editButtonHandler(event) {
    const parentElement = event.currentTarget.parentNode;
    const filter = document.getElementById('filter-todos');
    let filterType = null;
    let projectID, taskID, subtaskID;
    if (filter) {
        projectID = parentElement.dataset.projectid;
        taskID = parentElement.dataset.taskid;
        subtaskID = parentElement.dataset.subtaskid;
        filterType = filter.dataset.filter;
    } else {
        projectID = document.querySelector('.project-title').dataset.idx;
        taskID = parentElement.closest('.task').dataset.id;
        subtaskID = parentElement.dataset.id;        
    }
    const listItem = parentElement;
    
    console.log(`Editing Project id: ${projectID}, Task id: ${taskID}, Subtask id: ${subtaskID}`);

    clearEditFields();
    createEditFields(listItem);

    const submitTaskBtn = listItem.querySelector('.submit-task-btn');
    const addSubtaskBtn = listItem.querySelector('.add-subtask-btn');
    

    submitTaskBtn.addEventListener('click', () => {
        const taskTxt = document.querySelector('#tasktxt');
        const taskDate = document.querySelector('#taskdate');
        if (taskTxt.validity.valid) {
            PubSub.publish('editTask', {projectID: Number(projectID), taskID: taskID, subtaskID: subtaskID, txt: taskTxt.value, due: taskDate.value, filter: filterType});
        } else {
            console.log('task title cannot be empty');
        }
    });

    addSubtaskBtn.addEventListener('click', () => {
        showAddSubtaskModal(projectID, taskID);
    });
}

function deleteButtonHandler(event) {
    const filter = document.getElementById('filter-todos');
    let projectID, taskID, subtaskID;
    let filterType = null;
    if (filter) {
        let li = event.currentTarget.closest('li');
        projectID = li.dataset.projectid;
        taskID = li.dataset.taskid;
        subtaskID = li.dataset.subtaskid;
        filterType = filter.dataset.filter;
    } else {
        projectID = document.querySelector('.project-title').dataset.idx;
        taskID = event.currentTarget.closest('.task').dataset.id;
        subtaskID = event.currentTarget.parentElement.dataset.id;     
    }    
    console.log(`Deleteing Project id: ${projectID}, Task id: ${taskID}, Subtask id: ${subtaskID}`);
    showDeleteConfirmationModal({projectID: projectID, taskID: taskID, subtaskID: subtaskID, filter: filterType}, 'deleteTask');
}

function createEditElements(parent) {
    const editButton = document.createElement('button');
    editButton.classList.add('change-task-btn');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', editButtonHandler); 

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-task-btn');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', deleteButtonHandler); 

    const title = parent.querySelector('.title');

    if (title) {
        title.appendChild(editButton);
        title.appendChild(deleteButton);
    } else {
        parent.insertBefore(editButton, parent.childNodes[5]);
        parent.insertBefore(deleteButton, parent.childNodes[6]);
    }
}


function editTaskHandler(event) {
    const taskElement = event.target.closest('.task');
    const subTasks = taskElement.querySelectorAll('li');

    if (EDIT) {
        clearEditFields();
        clearButtons();
        EDIT = false;
        return;
    }

    createEditElements(taskElement.querySelector('.task-title'));

    subTasks.forEach(item => {
        createEditElements(item);
    });
    EDIT = true;
}

function renderProjectItem(msg, data) {
    EDIT = false;
    let projectItem = data.project;
    let div = document.querySelector('#main-todos');
    let html = `
        ${renderProjectDetails(data.projectID, projectItem.title, projectItem.description)}
        <div class="project-todos">
        ${renderProjectTasks(projectItem.tasks)}
        </div>
    `;

    div.innerHTML = html;

    const todos = div.querySelector('.project-todos');
    todos.addEventListener('click', event => handleTodoClick(event, data.projectID));

    const editBtns = div.querySelectorAll('.edit-task-btn');
    editBtns.forEach(item => item.addEventListener('click', editTaskHandler));
}

function editFilterTaskHandler(event) {
    const task = event.target.parentElement;

    if (EDIT) {
        clearEditFields();
        clearButtons();
        EDIT = false;
        return;
    }

    createEditElements(task);

    EDIT = true;
}

// ! Bug: after clicking project is displayed....
function handleFilteredTodoClick(event) {
    let targetNode = event.target;
    const nodeName = targetNode.nodeName.toLowerCase();
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.type == 'checkbox' || nodeName == 'span') {
        if (targetNode.type == 'checkbox') {
            targetNode = event.target.parentElement;
        }
        const li = targetNode.closest('li');
        const filter = document.getElementById('filter-todos');
        PubSub.publish('completeTask', {taskID: li.dataset.taskid, subtaskID: li.dataset.subtaskid, projectID: Number(li.dataset.projectid), filter: filter.dataset.filter});
    }
}

function renderFilteredTasks(msg, data) {
    EDIT = false;
    let div = document.querySelector('#main-todos');
    div.innerHTML = '';

    const mainDivMarkup = `
        <div id="filter-todos" data-filter="${data.filter}">
            <ul>
            ${data.dt.map(item => generateFilterListItem(item.projectID, item.taskID, item.subtaskID, item.task)).join('')}                             
            </ul>
        </div>                   
    `;

    div.innerHTML = mainDivMarkup;

    const todos = div.querySelector('#filter-todos');
    todos.addEventListener('click', event => handleFilteredTodoClick(event));

    const editBtns = div.querySelectorAll('.edit-task-btn');
    editBtns.forEach(item => item.addEventListener('click', editFilterTaskHandler));    
}

function renderHTML() {
    PubSub.subscribe('returnProject', (msg, data) => renderProjectItem(msg, data));
    PubSub.subscribe('projectUpdated', (msg, data) => renderProjectItem(msg, data));
    PubSub.subscribe('filterTodos', (msg, data) => renderFilteredTasks(msg, data));
    return markup;
}

export { renderHTML };