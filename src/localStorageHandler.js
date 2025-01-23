import { Project, Todo, ChecklistItem } from './objDef.js';

let projectList = [];

export const getProjectList = () => projectList;

export const init = () => {
  // if key 'projects' does not exist, create default item
  if (!localStorage.getItem('projects')) {
    const proj = new Project('My Project');
    projectList.push(proj);
    localStorage.setItem('projects', JSON.stringify(projectList));
  } else {
    projectList = JSON.parse(localStorage.getItem('projects'));
  }
}

const updateLocalStorage = () => {
  localStorage.setItem('projects', JSON.stringify(projectList));
}

export const getProjectTitles = () => {
  const projList = JSON.parse(localStorage.getItem('projects'));
  return projList.map((project) => project.title );
}

export const getLastProjectTitle = () => getProjectTitles().at(-1);

export const getLastProjectIndex = () => projectList.length - 1;

export const getProject = (index) => projectList[index];

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