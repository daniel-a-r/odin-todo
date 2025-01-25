import { Project, Todo, ChecklistItem } from './objDef.js';

let projectList = [];

export const getProjectList = () => projectList;

export const init = () => {
  // if key 'projects' does not exist, create default item
  if (!localStorage.getItem('projects')) {
    let projDesc = 'Lorem ipsum odor amet, consectetuer adipiscing elit. Curabitur ut mattis porta ultricies sapien leo ex. Ligula montes maximus himenaeos quisque urna nec.';
    const proj1 = new Project('My Project 1', projDesc);
    const todo1 = new Todo('Todo1');
    const checklistItem1 = new ChecklistItem('first thing to do', null, 'low');
    const checklistItem2 = new ChecklistItem('second thing to do', null, 'important');
    const checklistItem3 = new ChecklistItem('third thing to do', null, 'urgent');
    const checklistItem4 = new ChecklistItem('fourth thing');

    todo1.pushToChecklist(checklistItem1);
    todo1.pushToChecklist(checklistItem2);
    todo1.pushToChecklist(checklistItem3);
    todo1.pushToChecklist(checklistItem4);

    proj1.pushTodoList(todo1);

    const todo2 = new Todo('Todo2');
    const checklistItem5 = new ChecklistItem('first thing to do', null, 'low');
    const checklistItem6 = new ChecklistItem('second thing to do', null, 'important');
    const checklistItem7 = new ChecklistItem('third thing to do', null, 'urgent');
    const checklistItem8 = new ChecklistItem('fourth thing');

    todo2.pushToChecklist(checklistItem5);
    todo2.pushToChecklist(checklistItem6);
    todo2.pushToChecklist(checklistItem7);
    todo2.pushToChecklist(checklistItem8);

    proj1.pushTodoList(todo2);

    projectList.push(proj1);

    projDesc = 'Lorem ipsum odor amet, consectetuer adipiscing elit. Nostra consectetur fermentum velit duis sit lacus dolor id. Penatibus condimentum nascetur laoreet rutrum tempor nisi tempus mollis.';
    const proj2 = new Project('My Project 2', projDesc);
    const todo3 = new Todo('Todo3');
    const checklistItem9 = new ChecklistItem('first thing to do', null, 'low');
    const checklistItem10 = new ChecklistItem('second thing to do', null, 'important');
    const checklistItem11 = new ChecklistItem('third thing to do', null, 'urgent');
    const checklistItem12 = new ChecklistItem('fourth thing');

    todo3.pushToChecklist(checklistItem9);
    todo3.pushToChecklist(checklistItem10);
    todo3.pushToChecklist(checklistItem11);
    todo3.pushToChecklist(checklistItem12);

    proj2.pushTodoList(todo3);

    projectList.push(proj2);
    
    localStorage.setItem('projects', JSON.stringify(projectList));
  } else {
    projectList = JSON.parse(localStorage.getItem('projects'));
  }
};

const updateLocalStorage = () => {
  localStorage.setItem('projects', JSON.stringify(projectList));
};

export const createProject = (title) => {
  const project = new Project(title);
  projectList.push(project);
  updateLocalStorage();
};

export const createTodo = (i, title) => {
  const todo = new Todo(title);
  projectList[i].pushTodoList(todo);
  updateLocalStorage();
};

export const createChecklistItem = (i, j, text) => {
  const checklistItem = new ChecklistItem(text);
  projectList[i].todoList[j].pushToChecklist(checklistItem);
  updateLocalStorage();
};

export const getProjectTitles = () => {
  const projList = JSON.parse(localStorage.getItem('projects'));
  return projList.map((project) => project.title );
};

export const getLastProjectTitle = () => getProjectTitles().at(-1);

export const getLastProjectIndex = () => projectList.length - 1;

export const getProject = (index) => projectList[index];

export const getTodo = (i, j) => projectList[i].todoList[j];

export const getChecklist = (i, j) => projectList[i].todoList[j].checklist;

export const getChecklistItem = (i, j, k) => projectList[i].todoList[j].checklist[k];

export const updateProjectTitle = (i, newTitle) => { 
  projectList[i].title = newTitle;
  updateLocalStorage();
};

export const updateProjectDesc = (i, newDesc) => {
  projectList[i].desc = newDesc;
  updateLocalStorage();
};

export const updateTodoTitle = (i, j, newTitle) => { 
  projectList[i].todoList[j].title = newTitle;
  updateLocalStorage();
};

const updateChecklistItem = (i, j, k, prop, newValue) => { 
  projectList[i].todoList[j].checklist[k][prop] = newValue;
  updateLocalStorage();
};

export const updateChecklistItemText = (i, j, k, newText) => { 
  updateChecklistItem(i, j, k, 'text', newText);
  updateLocalStorage();
};

export const updateChecklistItemDueDate = (i, j, k, newDueDate) => { 
  updateChecklistItem(i, j, k, 'dueDate', newDueDate);
  updateLocalStorage();
};

export const updateChecklistItemPriority = (i, j, k, newPriority) => {
  updateChecklistItem(i, j, k, 'priority', newPriority);
  updateLocalStorage();
};

export const updateChecklistItemIsDone = (i, j, k) => {
  const checklistItem = projectList[i].todoList[j].checklist[k];
  checklistItem.isDone = (checklistItem.isDone) ? false : true;
  updateLocalStorage();
};

export const removeProject = (i) => { 
  projectList.splice(i, 1);
  updateLocalStorage();
};

export const removeTodo = (i, j) => { 
  projectList[i].removeAtIndex(j);
  updateLocalStorage();
};

export const removeChecklistItem = (i, j, k) => { 
  projectList[i].todoList[j].removeAtIndex(k);
  updateLocalStorage();
};