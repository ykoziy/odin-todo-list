(()=>{"use strict";class t{constructor(t,i=null){this._title=t,this._dueDate=i,this._isDone=!1}set title(t){this._title=t}get title(){return this._title}set dueDate(t){this._dueDate=t}get dueDate(){return this._dueDate}set isDone(t){this._isDone=t}get isDone(){return this._isDone}}class i{constructor(t,i=null){this._title=t,this._description=i,this._tasks=[],this._isDone=!1}set title(t){this._title=t}get title(){return this._title}set description(t){this._description=t}get description(){return this._description}set tasks(t){this._tasks=t}get tasks(){return this._tasks}set isDone(t){this._isDone=t}get isDone(){return this._isDone}}const n=[];var e;!function(t){for(let t=1;t<=4;t++){let e=new i(`Project ${t}`);n.push(e)}}();const s=`\n    <div id="side-nav">\n    \n    <div id="navigation">\n    <div id="search">\n        <input type="text" name="search-query" size="15"> \n    </div>\n    <nav>\n        <ul>\n            <li>Inbox</li>\n            <li>Upcoming</li>\n            <li>Due Today</li>\n            <li>Urgent</li>\n        </ul>\n    </nav>\n    </div>\n\n    \n    <div id="projects">\n    <ul>\n    ${e=n,`${e.map((t=>`<li><div class="circle-status"></div>${t.title}</li>`)).join("")}`}\n    </ul>\n    </div>\n\n    <div id="add-project">\n        + New Project\n    </div>\n    </div>\n`;let d=new t("Finish the Task class.","2021-05-05"),o=new t("Finish date formatting function."),a=new t("Need unit tests...");d.tasks=[o,a],console.log(d.title);let l=document.getElementById("content");l.insertAdjacentHTML("afterbegin",s),l.insertAdjacentHTML("beforeend",'\n    <div id="main-content">\n    \n    <div id="main-todos">\n    <div class="project-details">\n        <h1 class="project-title">Project Title</h1>\n        <p class="project-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed.</p>\n    </div>\n    <div class="project-todos">\n        <div class="task">\n            <div class="task-title">\n                <h2>A task</h2>\n                <div class="edit-task-btn">...</div>\n            </div>\n            <div class="task-todos">\n                <ul>\n                    <li><input type="checkbox" value="done"> todo item 1</li>\n                    <li><input type="checkbox" value="done"> todo item 2</li>\n                    <li><input type="checkbox" value="done"> todo item 3</li>\n                    <li class="done"><input type="checkbox" value="done" checked> todo item 4</li>                                                             \n                </ul>\n            </div>                            \n        </div>\n        <div class="task">\n            <div class="task-title">\n                <h2>A task without todos, checkbox</h2></span>\n                <div class="edit-task-btn">...</div>\n            </div>                           \n        </div>                        \n    </div>\n    </div>\n\n    \n    <div id="main-aside">\n    <div id="main-aside-top">\n        <div id="edit-project-btn">\n        -\n        </div>\n    </div>\n    <div id="main-aside-bottom">\n        <div id="add-todo-btn">\n            +\n        </div>\n    </div>\n    </div>\n\n    </div>\n')})();