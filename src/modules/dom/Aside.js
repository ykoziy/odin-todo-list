const markup = `
    <div id="main-aside">
    <div id="main-aside-top">
        <div id="edit-project-btn">
        -
        </div>
        <div id="delete-project-btn">
            <i class="fas fa-trash-alt"></i>
        </div>
    </div>
    <div id="main-aside-bottom">
        <div id="add-todo-btn">
            +
        </div>
    </div>
    </div>
`;

function renderHTML() {
    return markup;
}

export { renderHTML };