import * as ls from './localStorageHandler';
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
  ls.createProject('New Project');
  const projTitle = ls.getLastProjectTitle();
  const lastIndx = ls.getLastProjectIndex();
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
  
  const project = ls.getProject(newSelectedButton.dataset.key);
  htmlBuilder.createProjectSection(project);
};