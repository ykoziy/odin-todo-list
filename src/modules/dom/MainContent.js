import {renderHTML as renderTodos} from './Todos';
import {renderHTML as renderAside} from './Aside';

const markup = `
    <div id="main-content">
    ${renderTodos()}
    ${renderAside()}
    </div>
`;

function renderHTML(parentElement) {
    // ! not final.....
    parentElement.insertAdjacentHTML('beforeend', markup);
}

export { renderHTML };