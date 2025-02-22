import { format } from 'date-fns';

export const init = (projectTitleList, indx = null, projObj = null) => {
  const projectsContainer = document.querySelector('.projects-container');
  const projectButtons = createProjectButtonList(projectTitleList);
  projectsContainer.append(...projectButtons);

  if (indx) {
    const selectedProject = projectsContainer.children[indx];
    selectedProject.classList.add('selected');
    createProjectSection(projObj);
  }
};

const createSVG = (pathDrawn) => {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
  const path = document.createElementNS(namespace, 'path');
  path.setAttributeNS(null, 'fill-rule', 'evenodd');
  path.setAttributeNS(null, 'd', pathDrawn);
  svg.appendChild(path);
  return svg;
};

const createPlusCircle = () => {
  const pathDrawn =
    'M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
  return createSVG(pathDrawn);
};

const createInbox = () => {
  const pathDrawn =
    'M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z';
  return createSVG(pathDrawn);
};

const createDotsHorizontal = () => {
  const pathDrawn =
    'M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z';
  return createSVG(pathDrawn);
};

export const createProjectButtonList = (projectList) => {
  const projectButtons = [];

  projectList.forEach((projectTitle, indx) => {
    projectButtons.push(createProjectButton(projectTitle, indx));
  });

  return projectButtons;
};

export const createProjectButton = (projectTitle, indx) => {
  const button = document.createElement('button');
  button.classList.add('button-container', 'project');
  button.dataset.key = indx;
  const p = document.createElement('p');
  // p.classList.add('project-title');
  p.textContent = projectTitle;
  button.append(createInbox(), p);

  return button;
};

export const appendProjectButton = (projectTitle, indx) => {
  const projectButton = createProjectButton(projectTitle, indx);
  const projectsContainer = document.querySelector('.projects-container');
  projectsContainer.appendChild(projectButton);
  return projectButton;
};

export const createProjectSection = (project) => {
  const main = document.querySelector('main');
  const projectHeader = createProjectHeader(project.title, project.desc);
  const todoContainer = createTodoContainter(project.todoList);
  const addTodoButton = createAddTodoButton();

  main.append(projectHeader, todoContainer, addTodoButton);
};

const createProjectHeader = (projecTitle, projectDesc) => {
  const div = document.createElement('div');
  div.classList.add('project-header');

  const projectTitleElem = createProjectTitle(projecTitle);
  div.appendChild(projectTitleElem);

  const projectDescElem = createprojectDesc(projectDesc);
  div.appendChild(projectDescElem);

  return div;
};

const createProjectTitle = (projectTitle) => {
  const div = document.createElement('div');
  div.classList.add('project-title');

  const h1 = document.createElement('h1');
  h1.textContent = projectTitle;

  const dropdown = createDropdown();

  div.append(h1, dropdown);

  return div;
};

const createDropdown = () => {
  const div = document.createElement('div');
  div.classList.add('dropdown');

  const optionsButton = createOptionsButton();
  const dropdownOptions = createDropdownOptions();

  div.append(optionsButton, dropdownOptions);

  return div;
};

const createOptionsButton = () => {
  const button = document.createElement('button');
  button.classList.add('options-button');

  const dotsHorizontal = createDotsHorizontal();
  button.appendChild(dotsHorizontal);

  return button;
};

const createDropdownOptions = () => {
  const div = document.createElement('div');
  div.classList.add('dropdown-options');

  const ul = document.createElement('ul');
  const editButton = createEditButton();
  const deleteButton = createDeleteButton();

  ul.append(editButton, deleteButton);
  div.appendChild(ul);

  return div;
};

const createDropdownListButton = (name) => {
  const li = document.createElement('li');
  const button = document.createElement('button');
  const nameCapitalized = name[0].toUpperCase() + name.slice(1);

  button.classList.add(name);
  button.textContent = nameCapitalized;

  li.appendChild(button);

  return li;
};

const createEditButton = () => {
  return createDropdownListButton('edit');
};

const createDeleteButton = () => {
  return createDropdownListButton('delete');
};

const createprojectDesc = (projectDesc) => {
  const div = document.createElement('div');
  div.classList.add('project-desc');

  const p = document.createElement('p');
  p.textContent = projectDesc;

  div.appendChild(p);

  return div;
};

const createTodoContainter = (todoList) => {
  const todoContainer = document.createElement('div');
  todoContainer.classList.add('todo-container');

  todoList.forEach((todo, indx) => {
    const todoElem = createTodo(todo, indx);
    todoContainer.appendChild(todoElem);
  });

  return todoContainer;
};

const createTodo = (todo, indx) => {
  const todoElem = document.createElement('div');
  todoElem.classList.add('todo');
  todoElem.dataset.key = indx;

  const todoTitle = createTodoTitle(todo.title);
  const checklist = createChecklist(todo.checklist);
  const addToChecklistButton = createAddToChecklistButton();

  todoElem.append(todoTitle, checklist, addToChecklistButton);

  return todoElem;
};

export const appendTodo = (todo, indx) => {
  const todoContainer = document.querySelector('.todo-container');
  const todoElem = createTodo(todo, indx);
  todoContainer.appendChild(todoElem);
  return todoElem;
};

const createTodoTitle = (todoTitle) => {
  const todoTitleDiv = document.createElement('div');
  todoTitleDiv.classList.add('todo-title');

  const todoTitleH1 = document.createElement('h3');
  todoTitleH1.textContent = todoTitle;

  const dropdown = createDropdown();

  todoTitleDiv.append(todoTitleH1, dropdown);

  return todoTitleDiv;
};

const createChecklist = (todoChecklist) => {
  const checklistDiv = document.createElement('div');
  checklistDiv.classList.add('checklist');

  todoChecklist.forEach((checklistItem, indx) => {
    const checklistItemDiv = createChecklistItem(checklistItem, indx);
    checklistDiv.appendChild(checklistItemDiv);
  });

  return checklistDiv;
};

export const appendChecklistItem = (todoKey, checklistItemObj, indx) => {
  const checklistDiv = document.querySelector(`.todo[data-key="${todoKey}"] > .checklist`);
  const checklistItemDiv = createChecklistItem(checklistItemObj, indx);
  checklistDiv.appendChild(checklistItemDiv);
  return checklistItemDiv;
};

const createChecklistItem = (checklistItemObj, indx) => {
  const checklistItemDiv = document.createElement('div');
  checklistItemDiv.classList.add('checklist-item');
  checklistItemDiv.dataset.key = indx;

  appendChecklistItemComponents(checklistItemDiv, checklistItemObj);

  return checklistItemDiv;
};

const appendChecklistItemComponents = (checklistItemDiv, checklistItemObj) => {
  const checkbox = createCheckbox(checklistItemObj.isDone);
  const text = createChecklistItemText(checklistItemObj.text);
  const dropdown = createDropdown();

  checklistItemDiv.append(checkbox, text);

  if (checklistItemObj.dueDate) {
    const dueDate = createDueDateTag(checklistItemObj.dueDate);
    checklistItemDiv.appendChild(dueDate);
  }
  if (checklistItemObj.priority) {
    const priority = createPriorityTag(checklistItemObj.priority);
    checklistItemDiv.appendChild(priority);
  }

  checklistItemDiv.appendChild(dropdown);
};

const createCheckbox = (isDone) => {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');

  if (isDone) {
    checkbox.checked = true;
  }

  return checkbox;
};

const createChecklistItemText = (text) => {
  const para = document.createElement('p');
  para.textContent = text;

  return para;
};

const createDueDateTag = (dueDate) => {
  // format date
  let dateList = dueDate.split('-');
  dateList = dateList.map((e) => Number(e));
  dateList[1] = dateList[1] - 1;
  const date = new Date(dateList[0], dateList[1], dateList[2]);
  const currentYear = new Date().getFullYear();

  let formattedDate;

  if (currentYear === dateList[0]) {
    formattedDate = format(date, 'MMM d');
  } else {
    formattedDate = format(date, 'MMM d, y');
  }

  // create elements
  const dueDateTag = document.createElement('div');
  dueDateTag.classList.add('due-date');

  const para = document.createElement('p');
  para.textContent = formattedDate;

  dueDateTag.appendChild(para);

  return dueDateTag;
};

const createPriorityTag = (priority) => {
  const priorityTag = document.createElement('div');
  priorityTag.classList.add('priority', priority);

  const para = document.createElement('p');
  para.textContent = priority[0].toUpperCase() + priority.slice(1);

  priorityTag.appendChild(para);

  return priorityTag;
};

const createAddToChecklistButton = () => {
  const button = document.createElement('button');
  button.classList.add('add-button', 'add-checklist-item', 'button-container');

  const plusCircle = createPlusCircle();
  const para = document.createElement('p');
  para.textContent = 'Add to checklist';

  button.append(plusCircle, para);

  return button;
};

const createAddTodoButton = () => {
  const button = document.createElement('button');
  button.classList.add('add-button', 'add-todo', 'button-container');

  const plusCircle = createPlusCircle();
  const para = document.createElement('p');
  para.textContent = 'Add Todo';

  button.append(plusCircle, para);

  return button;
};

const clearElem = (elem) => {
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild);
  }
};

export const clearMain = () => {
  const main = document.querySelector('main');
  clearElem(main);
};

const clearProjectsContainer = () => {
  const projectsContainer = document.querySelector('.projects-container');
  clearElem(projectsContainer);
};

export const updateChecklist = (todoKey, checklist) => {
  const checklistElem = document.querySelector(`.todo[data-key="${todoKey}"] > .checklist`);
  clearElem(checklistElem);

  checklist.forEach((checklistItem, indx) => {
    const checklistItemDiv = createChecklistItem(checklistItem, indx);
    checklistElem.appendChild(checklistItemDiv);
  });
};

export const updateMain = (project) => {
  clearMain();
  createProjectSection(project);
};

export const deleteProject = (projectTitleList) => {
  clearMain();
  clearProjectsContainer();
  init(projectTitleList);
};

export const updateChecklistItem = (checklistItemDiv, checklistItemObj) => {
  clearElem(checklistItemDiv);
  appendChecklistItemComponents(checklistItemDiv, checklistItemObj);
};

export const updateTodoTitle = (todoObj, todoKey) => {
  const todoTitleElem = document.querySelector(`.todo[data-key="${todoKey}"] > .todo-title > h3`);
  todoTitleElem.textContent = todoObj.title;
};

export const updateSelectedProject = (projObj) => {
  const selectedProject = document.querySelector('.selected p');
  selectedProject.textContent = projObj.title;

  updateProjectHeader(projObj);
};

const updateProjectHeader = (projObj) => {
  const projTitle = document.querySelector('.project-title h1');
  const projDesc = document.querySelector('.project-desc p');

  projTitle.textContent = projObj.title;
  projDesc.textContent = projObj.desc;
};
