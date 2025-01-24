import * as storage from './storageHandlers';
import * as htmlBuilder from './htmlBuilder';

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
  const projectButton = htmlBuilder.createProjectButton(projTitle, lastIndx);
  projectButton.addEventListener('click', () => handleProjectSelect(projectButton));
  projContainer.appendChild(projectButton);
};

const handleProjectSelect = (newSelectedButton) => {
  const prevSelectedButton = document.querySelector('.selected');

  if (prevSelectedButton !== null) {
    prevSelectedButton.classList.remove('selected');
  }

  htmlBuilder.clearMain();
  newSelectedButton.classList.add('selected');

  const project = storage.getProject(newSelectedButton.dataset.key);
  htmlBuilder.createProjectSection(project);
  addMainEventHandlers();
};

const addMainEventHandlers = () => {
  const selectedProject = document.querySelector('.selected');
  const selectedProjectKey = selectedProject.dataset.key;

  const deleteProjectButton = document.querySelector('.project-title button.delete');
  console.log(deleteProjectButton);

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
};

const handleDeleteProject = (indx) => {
  const project = storage.getProjectList()[indx];
  console.log(project);
};