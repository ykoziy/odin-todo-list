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

function handleTodoClick(event, projectId) {
    let targetNode = event.target;
    const nodeName = targetNode.nodeName.toLowerCase();
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.type == 'checkbox' || nodeName == 'span') {
        if (targetNode.type == 'checkbox') {
            targetNode = event.target.parentElement;
        }
        const subtaskId = targetNode.closest('.subtask').dataset.id;
        const taskId = targetNode.closest('.task').dataset.id;
        PubSub.publish('completeTask', {taskId: taskId, subtaskId: subtaskId, projectId: projectId});
    }
}

function clearButtons() {
    const icons = document.querySelector('.project-todos').querySelectorAll('button');
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
        dateInput.value = format(new Date(taskDate.textContent), 'yyyy-MM-dd');
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
    const projectId = document.querySelector('.project-title').dataset.idx;
    const taskId = parentElement.closest('.task').dataset.id;
    const subtaskId = parentElement.dataset.id;
    const listItem = parentElement;
    
    console.log(`Editing Project id: ${projectId}, Task id: ${taskId}, Subtask id: ${subtaskId}`);

    clearEditFields();
    createEditFields(listItem);

    const submitTaskBtn = listItem.querySelector('.submit-task-btn');
    const addSubtaskBtn = listItem.querySelector('.add-subtask-btn');
    

    submitTaskBtn.addEventListener('click', (event) => {
        const taskTxt = document.querySelector('#tasktxt');
        const taskDate = document.querySelector('#taskdate');
        if (taskTxt.validity.valid) {
            console.log('Submitting ' + subtaskId || taskId);
            PubSub.publish('editTask', {projectId: projectId, taskId: taskId, subtaskId: subtaskId, txt: taskTxt.value, due: taskDate.value});
        } else {
            console.log('task title cannot be empty');
        }
    });

    addSubtaskBtn.addEventListener('click', (event) => {
        console.log('adding subtask');
    });
}

function deleteButtonHandler(event) {
    const projectId = document.querySelector('.project-title').dataset.idx;
    const taskId = event.currentTarget.closest('.task').dataset.id;
    const subtaskId = event.currentTarget.parentElement.dataset.id;
    console.log(`Deleteing Project id: ${projectId}, Task id: ${taskId}, Subtask id: ${subtaskId}`);
    PubSub.publish('deleteTaskClick', {projectId: projectId, taskId: taskId, subtaskId: subtaskId});
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
        parent.appendChild(editButton);
        parent.appendChild(deleteButton);
    }
}


function editTaskHandler(event) {
    const taskElement = event.target.closest('.task');
    const subTasks = taskElement.querySelectorAll('li');
    const taskId = taskElement.dataset.id;

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
        ${renderProjectDetails(data.id, projectItem.title, projectItem.description)}
        <div class="project-todos">
        ${renderProjectTasks(projectItem.tasks)}
        </div>
    `;

    div.innerHTML = html;

    const todos = div.querySelector('.project-todos');
    todos.addEventListener('click', event => handleTodoClick(event, data.id));

    const editBtns = div.querySelectorAll('.edit-task-btn');
    editBtns.forEach(item => item.addEventListener('click', editTaskHandler));
}

function renderHTML(parentElement) {
    PubSub.subscribe('returnProject', (msg, data) => renderProjectItem(msg, data));
    PubSub.subscribe('projectUpdated', (msg, data) => renderProjectItem(msg, data));
    return markup;
}

export { renderHTML };