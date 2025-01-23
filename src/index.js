import './main.css'
import * as ls from './localStorageHandler.js';
import * as htmlBuilder from './htmlBuilder.js';

const page = (function () {
  const init = () => {
    const projContainer = document.querySelector('.projects-container');
    const projList = ls.getProjectList();
    const projButtonList = htmlBuilder.createProjectButtonList(projList);
    projContainer.append(...projButtonList);
    // addProjectButtonEventListeners();
  };

  const handleAddProject = () => {
    const projContainer = document.querySelector('.projects-container');
    ls.createProject('New Project');
    const projTitle = ls.getProjectTitles().at(-1);
    const lastIndx = ls.getProjectList.length - 1;
    const projectButton = htmlBuilder.createProjectButton(projTitle, lastIndx);
    projContainer.appendChild(projectButton);
  };

  const addProjectButton = document.querySelector('.add-project');

  addProjectButton.addEventListener('click', () => handleAddProject());

  ls.init();
  init();
})();