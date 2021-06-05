import { showAddSubtaskModal, showDeleteConfirmationModal, showErrorModal } from './Modal';
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
    const urgent = task.isUrgent ? '<div class="urgent-task"></div>' : '';
    return `<li data-projectid="${projectID}" data-taskid="${taskID}" ${subtaskDataID} >
            <input type="checkbox" id="isdone" ${task.isDone ? 'checked' : ''}>
            <span ${htmlClass}>${task.title}</span>${urgent}<span class='task-due-date'>${dueDate}</span>
            <div class="edit-btns"></div>
            <div class="edit-task-btn">...</div>
            </li>`;
}

function generateTaskListItem(id, task) {
    const htmlClass = `${task.isDone ? 'class="task-txt done"' : 'class="task-txt"'}`;
    const dueDate = task.dueDate ? format(task.dueDate, 'MM-dd-yyyy') : '';
    const urgent = task.isUrgent ? '<div class="urgent-task"></div>' : '';
    return `<li data-id="${id}" class="subtask"><input type="checkbox" id="isdone" ${task.isDone ? 'checked' : ''}>
            <span ${htmlClass}>${task.title}</span>${urgent}<span class='task-due-date'>${dueDate}</span><div class="edit-btns"></div></li>`;
}

function taskMarkup(id, task) {
    const classDone = `${task.isDone ? 'class="done"' : ''}`;
    const dueDate = task.dueDate ? format(task.dueDate, 'MM-dd-yyyy') : '';
    const urgent = task.isUrgent ? '<div class="urgent-task"></div>' : '';
    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <div class="title" data-duedate=${dueDate}><h2 ${classDone}>${task.title}</h2>${urgent}<div class="edit-btns"></div></div>
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
    const urgent = task.isUrgent ? '<div class="urgent-task"></div>' : '';
    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <div class="title"><h2 ${classDone}>${task.title}</h2>${urgent}<div class="edit-btns"></div></div>
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
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.id == 'isdone' || nodeName == 'span') {
        if (targetNode.id == 'isdone') {
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
    let urgentDiv = parent.querySelector('.urgent-task');

    const txtInput = document.createElement('input');
    txtInput.setAttribute('type', 'text');
    txtInput.setAttribute('id', 'tasktxt');
    txtInput.required = true;

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('id', 'taskdate');

    const urgentCheckbox = document.createElement('input');
    urgentCheckbox.setAttribute('type', 'checkbox');
    urgentCheckbox.setAttribute('id', 'isurgent');
    if (urgentDiv) {
        urgentCheckbox.checked = true;
        urgentDiv.style.display = 'none';
    }

    const label = document.createElement('label')
    label.htmlFor = 'isurgent';
    label.setAttribute('id', 'isurgent-label');
    label.appendChild(document.createTextNode('Urgent?'));

    
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-task-btn');
    submitButton.innerHTML = '<i class="fas fa-check-square"></i>';

    const addSubtaskBtn = document.createElement('button');
    addSubtaskBtn.classList.add('add-subtask-btn');
    addSubtaskBtn.innerHTML = '<i class="fas fa-plus-square"></i>';

    if (checkBox) {
        // a subtask
        const taskText = parent.querySelector('.task-txt');
        const taskDate = parent.querySelector('.task-due-date');
        checkBox.style.display = 'none';
        taskText.style.display = 'none';
        taskDate.style.display = 'none';
        txtInput.value = taskText.textContent;
        if (taskDate.textContent) {
            dateInput.value = format(new Date(taskDate.textContent), 'yyyy-MM-dd');
        }

    } else {
        // a task
        parent.childNodes[0].style.display = 'none';
        txtInput.value = parent.textContent;
        const dueDate = parent.dataset.duedate;
        const taskTodos = parent.closest('.task-todos');

        if (taskTodos) {
            dateInput.disabled = true;
        }

        if (dueDate) {
            dateInput.value = format(new Date(dueDate), 'yyyy-MM-dd');
        }
    }

    txtInput.addEventListener('keyup', (event) => {
        if (event.target.value.trim() != "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
    const editBtns = parent.querySelector('.edit-btns');
    let beforeNode = editBtns.childNodes[editBtns.childNodes.length - 2];
    editBtns.insertBefore(txtInput, beforeNode);
    editBtns.insertBefore(txtInput, beforeNode);
    editBtns.insertBefore(txtInput, beforeNode);
    editBtns.insertBefore(urgentCheckbox, beforeNode);
    editBtns.insertBefore(label, beforeNode);
    editBtns.insertBefore(dateInput, beforeNode);
    editBtns.insertBefore(submitButton, beforeNode);
    editBtns.insertBefore(addSubtaskBtn, beforeNode);
}

function clearEditFields() {
    const editFields = document.querySelectorAll('#tasktxt, #taskdate, #isurgent, #isurgent-label');
    if (editFields.length == 0) {
        return;
    }
    const parent = editFields[0].parentNode.parentNode;
    const mainTask = parent.querySelector('h2');
    let urgentDiv = parent.querySelector('.urgent-task');
    if (urgentDiv) {
        urgentDiv.style.removeProperty('display');
    }

    if (mainTask) {
        mainTask.style.display = 'block';
    } else {
        parent.querySelector('input[type="checkbox"]').style.removeProperty('display');
        parent.querySelector('.task-txt').style.removeProperty('display');
        parent.querySelector('.task-due-date').style.removeProperty('display');
    }

    editFields.forEach(item => {
        item.remove();
    });
    document.querySelector('.submit-task-btn').remove();
    document.querySelector('.add-subtask-btn').remove();
}

function editButtonHandler(event) {
    const parentElement = event.currentTarget.parentNode.parentNode;
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

    clearEditFields();
    createEditFields(listItem);

    const submitTaskBtn = listItem.querySelector('.submit-task-btn');
    const addSubtaskBtn = listItem.querySelector('.add-subtask-btn');
    

    submitTaskBtn.addEventListener('click', () => {
        const taskTxt = document.querySelector('#tasktxt');
        const taskDate = document.querySelector('#taskdate');
        const urgent = document.querySelector('#isurgent');
        if (taskTxt.validity.valid) {
            PubSub.publish('editTask', {projectID: Number(projectID), taskID: taskID, subtaskID: subtaskID, 
                                        txt: taskTxt.value, due: taskDate.value, filter: filterType, urgent: urgent.checked});
        } else {
            showErrorModal('Task title cannot be empty.');
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
        subtaskID = event.currentTarget.parentElement.parentElement.dataset.id;  
    }    
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

    const editBtns = parent.querySelector('.edit-btns');

    editBtns.appendChild(editButton);
    editBtns.appendChild(deleteButton);
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

function handleFilteredTodoClick(event) {
    let targetNode = event.target;
    const nodeName = targetNode.nodeName.toLowerCase();
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.id == 'isdone' || nodeName == 'span') {
        if (targetNode.id == 'isdone') {
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