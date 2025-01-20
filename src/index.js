import './main.css'
import { Project, Todo, ChecklistItem, projectList } from './objHandler.js'
import * as ls from './localStorageHandler.js';
import * as htmlHelper from './htmlHelper.js';

const page = (function () {
  const addProjectButton = document.querySelector('.add-project');

  const projContainer = document.querySelector('.projects-container');
  // ls.createProject('new project');
  // console.log(projectList.at(-1).todoList);
  const button = htmlHelper.createProjectButton(0, 'my project button');
  console.log(button);
  projContainer.appendChild(button);
})();