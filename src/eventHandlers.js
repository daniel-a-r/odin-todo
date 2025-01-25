import * as storage from './storageHandlers';
import * as htmlHandler from './htmlHandlers';

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
  console.log(deleteProjectButton);

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
  addChecklistItemDeleteHandler();
};

const handleDeleteProject = (indx) => {
  const project = storage.getProjectList()[indx];
  console.log(project);
};

const addChecklistItemDeleteHandler = () => {
  const checklistItemDeleteButtonList = document.querySelectorAll('.checklist-item button.delete');
  for (const checklistItemDeleteButton of checklistItemDeleteButtonList) {
    checklistItemDeleteButton.addEventListener('click', () => handleDeleteChecklistItem(checklistItemDeleteButton));
  }
};

const handleDeleteChecklistItem = (checklistItemDeleteButton) => {
  const checklistItemElem = checklistItemDeleteButton.closest('.checklist-item');
  const todoElem = checklistItemElem.closest('.todo');
  const selectedProject = document.querySelector('button.selected');
  console.log(checklistItemElem);
  console.log(todoElem);
  console.log(selectedProject);

  htmlHandler.clearChecklist(todoElem.dataset.key);
  const checklist = storage.getChecklist(selectedProject.dataset.key, todoElem.dataset.key);
  console.log(checklist);
};