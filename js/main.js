(()=>{"use strict";class t{constructor(t,e=null){this._title=t,this._dueDate=e,this._isDone=!1}set title(t){this._title=t}get title(){return this._title}set dueDate(t){this._dueDate=t}get dueDate(){return this._dueDate}set isDone(t){this._isDone=t}get isDone(){return this._isDone}}let e=new t("Finish the Task class.","2021-05-05"),s=new t("Finish date formatting function."),i=new t("Need unit tests...");e.tasks=[s,i],console.log(e.title)})();