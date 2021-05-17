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
    const htmlClass = `${task.isDone ? 'class="subtask done"' : 'class="subtask"'}`;
    const dueDate = task.dueDate ? format(task.dueDate, 'MM-dd-yyyy') : '';
    return `<li data-id="${id}" ${htmlClass}><input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>
            <span class='task-txt'>${task.title}</span><span class='task-due-date'>${dueDate}</span></li>`;
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
    if (checkBox) {
        parent.querySelector('input[type="checkbox"]').style.display = 'none';
    }
    const txtInput = document.createElement('input');
    txtInput.setAttribute('type', 'text');
    txtInput.setAttribute('id', 'tasktxt');
    txtInput.required = true;
    txtInput.value = parent.textContent;

    if (checkBox) {
        parent.childNodes[1].remove();
    } else {
        parent.childNodes[0].style.display = 'none';
    }

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('id', 'taskdate');

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-task-btn');
    submitButton.innerHTML = '<i class="fas fa-check-square"></i>';

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
}

function clearEditFields() {
    const editFields = document.querySelectorAll('#tasktxt, #taskdate');

    if (editFields.length == 0) {
        return;
    }

    const mainTask = editFields[0].parentNode.querySelector('h2');
    if (mainTask) {
        mainTask.style.display = 'block';
    } else {
        editFields[0].parentNode.querySelector('input[type="checkbox"]').style.display = 'initial';
    }

    editFields.forEach(item => {
        if (item.type == 'text' && !mainTask) {
            const txt = document.createTextNode(item.value);
            item.parentNode.insertBefore(txt, item.nextSibling);
        } else if (item.type == 'text' && mainTask) {
            mainTask.textContent = item.value;
        }
        item.remove();
    });
    document.querySelector('.submit-task-btn').remove();
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
    

    submitTaskBtn.addEventListener('click', (event) => {
        const taskTxt = document.querySelector('#tasktxt');
        if (taskTxt.validity.valid) {
            console.log('Submitting ' + subtaskId || taskId);
            PubSub.publish('editTask', {projectId: projectId, taskId: taskId, subtaskId: subtaskId, txt: taskTxt.value});
            clearEditFields();
        } else {
            console.log('task title cannot be empty');
        }
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