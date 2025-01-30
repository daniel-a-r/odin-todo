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
  addProjectDeleteHandler();
  addChecklistItemDeleteHandler();
  addTodoDeleteHandler();
  addEditChecklistItemHandler();
  addCloseModalHandler();
  addEditChecklistItemSubmitHandler();
};

const addButtonListHandler = (query, handler) => {
  const buttonList = document.querySelectorAll(query);
  for (const button of buttonList) {
    button.addEventListener('click', () => handler(button));
  }
};

const addChecklistItemDeleteHandler = (query='.checklist-item button.delete') => {
  addButtonListHandler(query, handleDeleteChecklistItem);
};

const addEditChecklistItemHandler = (query='.checklist-item button.edit') => {
  addButtonListHandler(query, handleEditChecklistItem);
};

const handleEditChecklistItem = (checklistItemEditButton) => {
  const checklistItem = checklistItemEditButton.closest('.checklist-item');
  checklistItem.classList.add('editing');

  const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItem);

  const checklistItemObj = storage.getChecklistItem(selectedProjectKey, todoKey, checklistItemKey);

  const currentText = checklistItemObj.text;
  const textInputElem = document.querySelector('#checklist-item-title');
  textInputElem.value = currentText;

  const currentPriority = checklistItemObj.priority;
  if (currentPriority) {
    const selectElem = document.querySelector('#priority-select');
    selectElem.value = currentPriority;
  }

  const editChecklistItemModal = document.querySelector('dialog.edit-checklist-item');
  editChecklistItemModal.showModal();
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
  addButtonListHandler(query, handleDeleteTodo);
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

const addProjectDeleteHandler = () => {
  const selectedProject = document.querySelector('.selected');
  const selectedProjectKey = selectedProject.dataset.key;

  const deleteProjectButton = document.querySelector('.project-title button.delete');

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
};

const handleDeleteProject = (projectIndx) => {
  // update local storage
  storage.removeProject(projectIndx);

  // update frontend
  htmlHandler.deleteProject(storage.getProjectTitles());

  // re-add project event listeners
  addProjectListSelectEvent();
};

const addCloseModalHandler = () => {
  const handleCloseModal = () => {
    removeEditingClass();

    const modal = document.querySelector('dialog[open]');
    modal.close();
  };

  const query = 'button.close-modal';
  addButtonListHandler(query, handleCloseModal);
};

const addEditChecklistItemSubmitHandler = () => {
  const form = document.querySelector('.edit-checklist-item form');
  form.addEventListener('submit', () => handleEditChecklistItemSubmit(form));
};

const handleEditChecklistItemSubmit = (form) => {
  const data = new FormData(form);
  const title = data.get('title');
  const dueDate = (data.get('due-date')) ? data.get('due-date') : null;
  const priority = (data.get('priority')) ? data.get('priority') : null;
  
  if (dueDate) {
    console.log(dueDate);
    let dateList = dueDate.split('-');
    dateList = dateList.map((e) => Number(e));
    dateList[1] = --dateList[1];
    console.log(dateList);
    const date = new Date(dateList[0], dateList[1], dateList[2]);
    console.log(date);
  }

  const editingChecklistItem = document.querySelector('.editing');
  const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(editingChecklistItem);

  storage.updateChecklistItemText(selectedProjectKey, todoKey, checklistItemKey, title);
  storage.updateChecklistItemPriority(selectedProjectKey, todoKey, checklistItemKey, priority);

  const checklistItemObj = storage.getChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
  htmlHandler.updateChecklistItem(editingChecklistItem, checklistItemObj);

  addEditChecklistItemHandler('.editing button.edit');
  
  form.reset();
  removeEditingClass();
};

const getAllKeys = (elem) => {
  // get HTML elements with data keys
  const checklistItemElem = elem.closest('.checklist-item');
  const todoElem = checklistItemElem.closest('.todo');
  const selectedProject = document.querySelector('button.selected');

  // store keys in variables
  const checklistItemKey = checklistItemElem.dataset.key;
  const todoKey = todoElem.dataset.key;
  const selectedProjectKey = selectedProject.dataset.key;

  return { selectedProjectKey, todoKey, checklistItemKey };
}

const removeEditingClass = () => {
  const editingElem = document.querySelector('.editing');
  editingElem.classList.remove('editing');
};