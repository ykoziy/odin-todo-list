const markup = `
    <div id="main-todos">
    </div>
`;

function renderProjectDetails(title, description) {
    return `
        <div class="project-details">
        <h1 class="project-title">${title}</h1>
        <p class="project-description">${description}</p>
        </div>
    `;
}

function generateTaskListItem(task) {
    return `<li><input type="checkbox" value="done" ${task.isDone ? 'checked' : ''}>${task.title}</li>`;
}

function taskMarkup(task) {
    return `
        <div class="task">
            <div class="task-title">
                <h2>${task.title}</h2></span>
                <div class="edit-task-btn">...</div>
            </div>                           
        </div>
    `;
}

function subtasksMarkup(task) {
    return `
        <div class="task">
            <div class="task-title">
                <h2>${task.title}</h2>
                <div class="edit-task-btn">...</div>
            </div>
            <div class="task-todos">
                <ul>
                ${task.tasks.map(item => generateTaskListItem(item)).join('')}                                                       
                </ul>
            </div>                            
        </div>
    `;
}

function renderProjectTasks(tasks) {
    let div = document.createElement('div');
    div.classList.add('project-todos');

    let html = '';

    for (const task of tasks) {
        if (task.constructor.name === 'TaskList') {
            html += subtasksMarkup(task);
        } else if (task.constructor.name === 'Task') {
            html += taskMarkup(task);
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
    let div = document.querySelector('#main-todos');
    let html = `
        ${renderProjectDetails(data.title, data.description)}
        <div class="project-todos">
        ${renderProjectTasks(data.tasks)}
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
    return markup;
}

export { renderHTML };