import './main.css'
import * as ls from './localStorageHandler.js';
import * as htmlHelper from './htmlHelper.js';

const page = (function () {
  const init = () => {
    const projContainer = document.querySelector('.projects-container');
    const projList = ls.getProjectList();
    const projButtonList = htmlHelper.createProjectButtonList(projList);
    projContainer.append(...projButtonList);
    // addProjectButtonEventListeners();
  };

  const handleAddProject = () => {
    const projContainer = document.querySelector('.projects-container');
    ls.createProject('New Project');
    const projTitle = ls.getProjectTitles().at(-1);
    const lastIndx = ls.getProjectList.length - 1;
    const projectButton = htmlHelper.createProjectButton(projTitle, lastIndx);
    projContainer.appendChild(projectButton);
  };

  const addProjectButton = document.querySelector('.add-project');

  addProjectButton.addEventListener('click', () => handleAddProject());

  ls.init();
  init();
})();