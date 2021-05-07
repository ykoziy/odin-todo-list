import Task from './Task';
import TaskList from './TaskList';
import { isToday, parseISO, format} from 'date-fns';

import {renderHTML as renderSideNav} from './dom/SideNav';
import {renderHTML as renderMainContent} from './dom/MainContent';

function abra() {

}

function init() {
    let ta = new TaskList("Finish the Task class.", '2021-05-05');
    let ta1 = new Task("Finish date formatting function.");
    let ta2 = new Task("Need unit tests...");
    ta.tasks = [ta1, ta2];

    console.log(ta.title);


    let container = document.getElementById("content");

    renderSideNav(container);
    renderMainContent(container);
}

export { init };