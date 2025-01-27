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
  // DELETE
  // console.log(deleteProjectButton);

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
  addChecklistItemDeleteHandler();
};

const handleDeleteProject = (indx) => {
  const project = storage.getProjectList()[indx];
  // DELETE
  // console.log(project);
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

  // update backend
  storage.removeChecklistItem(selectedProjectKey, todoKey, checklistItemKey);

  // update frontend with updated backend
  const checklist = storage.getChecklist(selectedProjectKey, todoKey);
  htmlHandler.UpdateChecklist(todoKey, checklist);

  const query = `.todo[data-key="${todoElem.dataset.key}"] > .checklist button.delete`;
  addChecklistItemDeleteHandler(query);
};