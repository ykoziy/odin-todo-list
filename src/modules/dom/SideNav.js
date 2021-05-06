import {renderHTML as renderNav} from './Nav';
import {renderHTML as renderProjects} from './Projects';

const markup = `
    <div id="side-nav">
    ${renderNav()}
    ${renderProjects()}
    <div id="add-project">
        + New Project
    </div>
    </div>
`;

function renderHTML(parentElement) {
    // ! not final.....
    parentElement.insertAdjacentHTML('afterbegin', markup);
}

export { renderHTML };