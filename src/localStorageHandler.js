import * as todo from './objHandler.js';

let projectList = null;

const init = () => {
  // if key 'projects' does not exist, create default item
  // else, print to console
  if (!localStorage.getItem('projects')) {
    const proj = new todo.Project('My Project');
    projList.push(proj);
    localStorage.setItem('projects', JSON.stringify(projList));
  } else {
    projectList = JSON.parse(localStorage.getItem('projects'));
    console.log(projectList);
    projectList.forEach((project) => {
      console.log(project);
    });
  }
}

export const createProject = (title) => {
  const project = new Project(title);
  projectList.push(project);
};

export const createTodo = (i, title) => {
  const todo = new Todo(title);
  projectList[i].pushTodoList(todo);
};

export const createChecklistItem = (i, j, text) => {
  const checklistItem = new ChecklistItem(text);
  projectList[i].todoList[j].pushToChecklist(checklistItem);
};

export const updateProjectTitle = (i, newTitle) => { projectList[i].title = newTitle; };

export const updateProjectDesc = (i, newDesc) => { projectList[i].desc = newDesc; };

export const updateTodoTitle = (i, j, newTitle) => { projectList[i].todoList[j].title = newTitle; };

const updateChecklistItem = (i, j, k, prop, newValue) => { 
  projectList[i].todoList[j].checklist[k][prop] = newValue; 
};

export const updateChecklistItemText = (i, j, k, newText) => { 
  updateChecklistItem(i, j, k, 'text', newText); 
};

export const updateChecklistItemDueDate = (i, j, k, newDueDate) => { 
  updateChecklistItem(i, j, k, 'dueDate', newDueDate);
};

export const updateChecklistItemPriority = (i, j, k, newPriority) => {
  updateChecklistItem(i, j, k, 'priority', newPriority);
};

export const updateChecklistItemIsDone = (i, j, k) => {
  const checklistItem = projectList[i].todoList[j].checklist[k];
  checklistItem.isDone = (checklistItem.isDone) ? false : true;
};

export const removeProject = (i) => { projectList.splice(i, 1); };

export const removeTodo = (i, j) => { projectList[i].removeAtIndex(j); };

export const removeChecklistItem = (i, j, k) => { projectList[i].todoList[j].removeAtIndex(k); };

init();