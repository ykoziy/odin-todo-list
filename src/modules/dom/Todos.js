const markup = `
    <div id="main-todos">
    </div>
`;

function renderProjectDetails(id, title, description) {
    return `
        <div class="project-details">
        <h1 class="project-title" data-idx="${id}">${title}</h1>
        <p class="project-description">${description}</p>
        </div>
    `;
}

function generateTaskListItem(id, task) {
    return `<li data-id="${id}"><input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>${task.title}</li>`;
}

function taskMarkup(id, task) {
    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <h2>${task.title}</h2></span>
                <div class="edit-task-btn">...</div>
            </div>                           
        </div>
    `;
}

function subtasksMarkup(id, task) {
    const subtasks = [];

    task.subTasks.forEach((task, key) => {
        subtasks.push({id: key, task: task})
    })

    return `
        <div class="task" data-id="${id}">
            <div class="task-title">
                <h2>${task.title}</h2>
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

function handleTodoClick(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li') return;
    event.srcElement.classList.toggle('done');
}

function editTaskHandler(event) {
    console.log('Clicked edit task');
}

function renderProjectItem(msg, data) {
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
    todos.addEventListener('click', handleTodoClick);

    const editBtns = div.querySelectorAll('.edit-task-btn');
    editBtns.forEach(item => item.addEventListener('click', editTaskHandler));    
}

function renderHTML(parentElement) {
    PubSub.subscribe('returnProject', (msg, data) => renderProjectItem(msg, data));
    PubSub.subscribe('projectUpdated', (msg, data) => renderProjectItem(msg, data));
    return markup;
}

export { renderHTML };