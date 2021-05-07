import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';

const markup = `
    ${renderTodos()}
    ${renderAside()}
`;
//edit-task-btn
function handleTodoClick(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li') return;
    event.srcElement.classList.toggle('done');
}

function editTaskHandler(event) {
    console.log('Clicked edit task');
}

function editProjectHandler(event) {
    console.log('Clicked on edit project');  
}

function addTaskHandler(event) {
    console.log('Clicked on add task');  
}

function renderHTML(parentElement) {
    const div = document.createElement('div');

    div.setAttribute('id', 'main-content');
    div.innerHTML = markup;

    const todos = div.querySelector('.task-todos');
    todos.addEventListener('click', handleTodoClick);

    const editBtns = div.querySelectorAll('.edit-task-btn');
    editBtns.forEach(item => item.addEventListener('click', editTaskHandler));

    div.querySelector('#edit-project-btn').addEventListener('click', editProjectHandler);
    div.querySelector('#add-todo-btn').addEventListener('click', addTaskHandler);

    parentElement.appendChild(div);
}

export { renderHTML };