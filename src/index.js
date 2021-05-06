import Task from './modules/Task';
import TaskList from './modules/Task';
import { isToday, parseISO, format} from 'date-fns';


let ta = new TaskList("Finish the Task class.", '2021-05-05');
let ta1 = new Task("Finish date formatting function.");
let ta2 = new Task("Need unit tests...");
ta.tasks = [ta1, ta2];

console.log(ta.title);