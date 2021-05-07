import {renderHTML as renderNav} from './Nav';
import {renderHTML as renderProjects} from './Projects';

const markup = `
    ${renderNav()}
    ${renderProjects()}
    <div id="add-project">
        <div id="add-project-btn">+ New Project</div>
    </div>
`;

function newProjectHandler(event) {
    console.log('+ New Project button clicked');
}

function navHandler(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li') return;
    console.log(`Clicked on ${event.target.textContent}`);
}

function projectHandler(event) {
    const node = event.target.nodeName.toLowerCase();
    if (node !== 'li') return;
    console.log(`Clicked on ${event.target.textContent}`);
}

function renderHTML(parentElement) {
    const div = document.createElement('div');

    div.setAttribute('id', 'side-nav');
    div.innerHTML = markup;

    div.querySelector('#add-project-btn').addEventListener('click', newProjectHandler);

    const navMenu = div.querySelector('nav ul');
    navMenu .addEventListener('click', navHandler);

    const projecstList = div.querySelector('#projects ul');
    projecstList.addEventListener('click', projectHandler);    

    parentElement.appendChild(div);
}

export { renderHTML };