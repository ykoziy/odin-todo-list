const markup = `
    <div id="main-todos">
    <div class="project-details">
        <h1 class="project-title">Project Title</h1>
        <p class="project-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed.</p>
    </div>
    <div class="project-todos">
        <div class="task">
            <div class="task-title">
                <h2>A task</h2>
                <div class="edit-task-btn">...</div>
            </div>
            <div class="task-todos">
                <ul>
                    <li><input type="checkbox" value="done"> todo item 1</li>
                    <li><input type="checkbox" value="done"> todo item 2</li>
                    <li><input type="checkbox" value="done"> todo item 3</li>
                    <li class="done"><input type="checkbox" value="done" checked> todo item 4</li>                                                             
                </ul>
            </div>                            
        </div>
        <div class="task">
            <div class="task-title">
                <h2>A task without todos, checkbox</h2></span>
                <div class="edit-task-btn">...</div>
            </div>                           
        </div>                        
    </div>
    </div>
`;

function renderHTML(parentElement) {
    return markup;
}

export { renderHTML };