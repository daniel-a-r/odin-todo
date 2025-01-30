import * as storage from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';

export const init = () => {
  const addProjectButton = document.querySelector('.add-project');
  addProjectButton.addEventListener('click', () => handleAddProject());
  addProjectListSelectEvent();
};

const addProjectListSelectEvent = () => {
  const projectList = document.querySelector('.projects-container');
  for (const project of projectList.children) {
    project.addEventListener('click', () => handleProjectSelect(project));
  }
};

const handleAddProject = () => {
  const projContainer = document.querySelector('.projects-container');
  storage.createProject('New Project');
  const projTitle = storage.getLastProjectTitle();
  const lastIndx = storage.getLastProjectIndex();
  const projectButton = htmlHandler.createProjectButton(projTitle, lastIndx);
  projectButton.addEventListener('click', () => handleProjectSelect(projectButton));
  projContainer.appendChild(projectButton);
};

const handleProjectSelect = (newSelectedButton) => {
  const prevSelectedButton = document.querySelector('.selected');

  if (prevSelectedButton !== null) {
    prevSelectedButton.classList.remove('selected');
  }

  htmlHandler.clearMain();
  newSelectedButton.classList.add('selected');

  const project = storage.getProject(newSelectedButton.dataset.key);
  htmlHandler.createProjectSection(project);
  addMainEventHandlers();
};

const addMainEventHandlers = () => {
  const selectedProject = document.querySelector('.selected');
  const selectedProjectKey = selectedProject.dataset.key;

  const deleteProjectButton = document.querySelector('.project-title button.delete');

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
  addChecklistItemDeleteHandler();
  addTodoDeleteHandler();
  // addProjectDeleteHandler();
};

const addChecklistItemDeleteHandler = (query='.checklist-item button.delete') => {
  const checklistItemDeleteButtonList = document.querySelectorAll(query);
  for (const checklistItemDeleteButton of checklistItemDeleteButtonList) {
    checklistItemDeleteButton.addEventListener('click', () => handleDeleteChecklistItem(checklistItemDeleteButton));
  }
};

const handleDeleteChecklistItem = (checklistItemDeleteButton) => {
  // get HTML elements with data keys
  const checklistItemElem = checklistItemDeleteButton.closest('.checklist-item');
  const todoElem = checklistItemElem.closest('.todo');
  const selectedProject = document.querySelector('button.selected');

  // store keys in variables
  const checklistItemKey = checklistItemElem.dataset.key;
  const todoKey = todoElem.dataset.key;
  const selectedProjectKey = selectedProject.dataset.key;

  // update local storage
  storage.removeChecklistItem(selectedProjectKey, todoKey, checklistItemKey);

  // update frontend with updated local storage
  const checklist = storage.getChecklist(selectedProjectKey, todoKey);
  htmlHandler.UpdateChecklist(todoKey, checklist);

  // re-add event handlers to delete buttons for checklist items
  const query = `.todo[data-key="${todoElem.dataset.key}"] > .checklist button.delete`;
  addChecklistItemDeleteHandler(query);
};

const addTodoDeleteHandler = (query='.todo-title button.delete') => {
  const todoDeleteButtonList = document.querySelectorAll(query);
  for (const todoDeleteButton of todoDeleteButtonList) {
    todoDeleteButton.addEventListener('click', () => handleDeleteTodo(todoDeleteButton));
  }
};

const handleDeleteTodo = (todoDeleteButton) => {
  // gwet HTML elements with data keys
  const todoElem = todoDeleteButton.closest('.todo');
  const selectedProject = document.querySelector('button.selected');

  // store keys in variables
  const todoKey = todoElem.dataset.key;
  const selectedProjectKey = selectedProject.dataset.key;
  const projectObj = storage.getProject(selectedProjectKey);

  // update local storage
  storage.removeTodo(selectedProjectKey, todoKey);

  // update frontend
  htmlHandler.updateMain(projectObj);

  // re-add event handlers
  addMainEventHandlers();
};

const handleDeleteProject = (projIndx) => {
  // update local storage
  storage.removeProject(projIndx);

  // update frontend
  htmlHandler.deleteProject(storage.getProjectTitles());

  // re-add project event listeners
  addProjectListSelectEvent();
};