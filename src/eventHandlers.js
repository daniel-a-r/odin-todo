import * as ls from './localStorageHandler';
import * as htmlBuilder from './htmlBuilder';

export const init = () => {
    const projContainer = document.querySelector('.projects-container');
    const projList = ls.getProjectList();
    const projButtonList = htmlBuilder.createProjectButtonList(projList);
    projContainer.append(...projButtonList);
    // addProjectButtonEventListeners();
    const addProjectButton = document.querySelector('.add-project');
    addProjectButton.addEventListener('click', () => handleAddProject());
  };

const handleAddProject = () => {
  const projContainer = document.querySelector('.projects-container');
  ls.createProject('New Project');
  const projTitle = ls.getProjectTitles().at(-1);
  const lastIndx = ls.getProjectList.length - 1;
  const projectButton = htmlBuilder.createProjectButton(projTitle, lastIndx);
  projContainer.appendChild(projectButton);
};

const handleProjectSelect = (newSelectedButton) => {
  const prevSelectedButton = document.querySelector('.selected');
  if (prevSelectedButton !== null) {
    prevSelectedButton.classList.toggle('selected');
  }
  newSelectedButton.classList.toggle('selected');
};