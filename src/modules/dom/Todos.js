const markup = `
    <div id="main-todos">
    </div>
`;

let EDITING_ID = null;
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
    const classDone = `${task.isDone ? 'class="done"' : ''}`;
    return `<li data-id="${id}" ${classDone}><input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>${task.title}</li>`;
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
    if (nodeName == 'li' || nodeName == 'h2' || targetNode.type == 'checkbox') {
        if (targetNode.type == 'checkbox') {
            targetNode = event.target.parentElement;
        }
        const subtaskId = targetNode.dataset.id;
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
    const txtInput = document.createElement('input');
    txtInput.setAttribute('type', 'text');
    txtInput.setAttribute('id', 'tasktxt');
    txtInput.required = true;
    txtInput.value = parent.textContent;

    //parent.childNodes[1].textContent = '';

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('id', 'taskdate');
    parent.insertBefore(txtInput, parent.childNodes[2]);
    parent.insertBefore(dateInput, parent.childNodes[3]);
}

function clearEditFields() {
    const editFields = document.querySelectorAll('#tasktxt, #taskdate');
    editFields.forEach(item => {
        item.remove();
    });
}

function editButtonHandler(event) {
    const projectId = document.querySelector('.project-title').dataset.idx;
    const taskId = event.currentTarget.closest('.task').dataset.id;
    const subtaskId = event.currentTarget.parentElement.dataset.id;
    console.log(`Editing Project id: ${projectId}, Task id: ${taskId}, Subtask id: ${subtaskId}`);

    const listItem = event.currentTarget.parentElement;

    if (EDITING_ID == null) {
        createEditFields(listItem);
        EDITING_ID = subtaskId;
    } else if (EDITING_ID !== subtaskId) {
        clearEditFields();
        createEditFields(listItem);
        EDITING_ID = subtaskId;
    } else if (EDITING_ID === subtaskId) {
        if (document.querySelector('#tasktxt').validity.valid) {
            console.log('Submitting ' + subtaskId);
            clearEditFields();
            EDITING_ID = null;
        } else {
            console.log('Task title cannot be empty');
        }
    }

}

function deleteButtonHandler(event) {
    const projectId = document.querySelector('.project-title').dataset.idx;
    const taskId = event.currentTarget.closest('.task').dataset.id;
    const subtaskId = event.currentTarget.parentElement.dataset.id;
    console.log(`Deleteing Project id: ${projectId}, Task id: ${taskId}, Subtask id: ${subtaskId}`);
    PubSub.publish('deleteTask', {projectId: projectId, taskId: taskId, subtaskId: subtaskId});
}

function createEditElements(parent) {
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', editButtonHandler); 

    const deleteButton = document.createElement('button');
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
        clearButtons();
        clearEditFields();
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
    EDITING_ID = null;
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