import * as storage from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';
// import { format } from 'date-fns';

export const init = () => {
  const addProjectButton = document.querySelector('.add-project');
  addProjectButton.addEventListener('click', () => handleAddProject());
  addProjectListSelectEvent();

  const selectedProject = document.querySelector('.selected');
  if (selectedProject) {
    addMainEventHandlers();
  }
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
  storage.setSelectedProject(newSelectedButton.dataset.key);
  addMainEventHandlers();
};

const addMainEventHandlers = () => {
  // delete handlers
  addProjectDeleteHandler();
  addTodoDeleteHandler();
  addChecklistItemDeleteHandler();

  // edit handlers
  addCheckboxHandler();
  addEditChecklistItemHandler();
  addEditChecklistItemSubmitHandler();
  addEditTodoHandler();
  addEditTodoSubmitHandler();

  addCloseModalHandler();
};

const addButtonListHandler = (query, handler) => {
  const buttonList = document.querySelectorAll(query);
  for (const button of buttonList) {
    button.addEventListener('click', () => handler(button));
  }
};

// delete handlers
const addProjectDeleteHandler = () => {
  const handleDeleteProject = (projectIndx) => {
    // update local storage
    storage.removeProject(projectIndx);
    storage.deleteSelectedProject();
  
    // update frontend
    htmlHandler.deleteProject(storage.getProjectTitles());
  
    // re-add project event listeners
    addProjectListSelectEvent();
  };

  const selectedProjectKey = getSelectedProjectKey();
  const deleteProjectButton = document.querySelector('.project-title button.delete');

  deleteProjectButton.addEventListener('click', () => handleDeleteProject(selectedProjectKey));
};

const addTodoDeleteHandler = (query='.todo-title button.delete') => {
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

  addButtonListHandler(query, handleDeleteTodo);
};

const addChecklistItemDeleteHandler = (query='.checklist-item button.delete') => {
  const handleDeleteChecklistItem = (checklistItemDeleteButton) => {
    // get all keys
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItemDeleteButton);
  
    // update local storage
    storage.removeChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
  
    // update frontend with updated local storage
    const checklist = storage.getChecklist(selectedProjectKey, todoKey);
    htmlHandler.UpdateChecklist(todoKey, checklist);
  
    // re-add event handlers to delete buttons for checklist items
    const query = `.todo[data-key="${todoKey}"] > .checklist button.delete`;
    addChecklistItemDeleteHandler(query);
  };

  addButtonListHandler(query, handleDeleteChecklistItem);
};

// edit handlers
const addCheckboxHandler = () => {
  const handleCheckboxChange = (checkbox) => {
    const checklistItem = checkbox.closest('.checklist-item');
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItem);
    storage.updateChecklistItemIsDone(selectedProjectKey, todoKey, checklistItemKey);
  };

  const query='input[type="checkbox"]';
  const checkboxList = document.querySelectorAll(query);
  for (const checkbox of checkboxList) {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
  }
};

const addEditChecklistItemHandler = (query='.checklist-item button.edit') => {
  const handleEditChecklistItem = (checklistItemEditButton) => {
    const checklistItem = checklistItemEditButton.closest('.checklist-item');
    checklistItem.classList.add('editing');
  
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItem);
  
    const checklistItemObj = storage.getChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
  
    const textInputElem = document.querySelector('#checklist-item-title');
    textInputElem.value = checklistItemObj.text;
  
    const currentDueDate = checklistItemObj.dueDate;
    if (currentDueDate) {
      const dateElem = document.querySelector('#due-date');
      dateElem.value = currentDueDate;
    }
  
    const currentPriority = checklistItemObj.priority;
    if (currentPriority) {
      const selectElem = document.querySelector('#priority-select');
      selectElem.value = currentPriority;
    }
  
    const editChecklistItemModal = document.querySelector('dialog.edit-checklist-item');
    editChecklistItemModal.showModal();
  };

  addButtonListHandler(query, handleEditChecklistItem);
};

const addEditChecklistItemSubmitHandler = () => {
  const handleEditChecklistItemSubmit = (form) => {
    const data = new FormData(form);
    const title = data.get('title');
    const dueDate = (data.get('due-date')) ? data.get('due-date') : null;
    const priority = (data.get('priority')) ? data.get('priority') : null;
  
    const editingChecklistItem = document.querySelector('.editing');
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(editingChecklistItem);
  
    storage.updateChecklistItemText(selectedProjectKey, todoKey, checklistItemKey, title);
    storage.updateChecklistItemPriority(selectedProjectKey, todoKey, checklistItemKey, priority);
    storage.updateChecklistItemDueDate(selectedProjectKey, todoKey, checklistItemKey, dueDate);
  
    const checklistItemObj = storage.getChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
    htmlHandler.updateChecklistItem(editingChecklistItem, checklistItemObj);
  
    addEditChecklistItemHandler('.editing button.edit');
    
    form.reset();
    removeEditingClass();
  };

  const form = document.querySelector('.edit-checklist-item form');
  form.addEventListener('submit', () => handleEditChecklistItemSubmit(form));
};

const addEditTodoHandler = () => {
  const handleEditTodo = (todoEditButton) => {
    const todoElem = todoEditButton.closest('.todo')
    todoElem.classList.add('editing');
  
    const todoKey = todoElem.dataset.key;
    const selectedProjectKey = getSelectedProjectKey();
  
    const todoObj = storage.getTodo(selectedProjectKey, todoKey);
  
    const textInputElem = document.querySelector('#todo-title');
    textInputElem.value = todoObj.title;
  
    const editTodoModal = document.querySelector('dialog.edit-todo');
    editTodoModal.showModal();
  };

  const query = '.todo-title button.edit';
  addButtonListHandler(query, handleEditTodo);
};

const addEditTodoSubmitHandler = () => {
  const handleEditTodoSubmit = (form) => {
    const data = new FormData(form);
    const title = data.get('title');

    const editingTodo = document.querySelector('.editing');
    const todoKey = editingTodo.dataset.key;
    const selectedProjectKey = getSelectedProjectKey();

    storage.updateTodoTitle(selectedProjectKey, todoKey, title);
    htmlHandler.updateTodoTitle(storage.getTodo(selectedProjectKey, todoKey), todoKey);

    form.reset();
    removeEditingClass();
  };

  const form = document.querySelector('.edit-todo form');
  form.addEventListener('submit', () => handleEditTodoSubmit(form));
};

const addEditProjectHandler = () => {
  function handleEditProject() {
    const selectedProjectKey = getSelectedProjectKey();
    const projObj = storage.getProject(selectedProjectKey);
  }

  const editProjectButton = document.querySelector('.project-title button.edit');
  editProjectButton.addEventListener('click', handleEditProject);
}

const addCloseModalHandler = () => {
  const handleCloseModal = () => {
    removeEditingClass();

    const modal = document.querySelector('dialog[open]');
    modal.close();
  };

  const query = 'button.close-modal';
  addButtonListHandler(query, handleCloseModal);
};

// helper functions

const getAllKeys = (elem) => {
  // get HTML elements with data keys
  const checklistItemElem = elem.closest('.checklist-item');
  const todoElem = checklistItemElem.closest('.todo');
  const selectedProjectElem = document.querySelector('button.selected');

  // store keys in variables
  const checklistItemKey = checklistItemElem.dataset.key;
  const todoKey = todoElem.dataset.key;
  const selectedProjectKey = selectedProjectElem.dataset.key;

  return { selectedProjectKey, todoKey, checklistItemKey };
};

const getTodoKey = (elem) => {
  const todoElem = elem.closest('.todo');
  return todoElem.dataset.key;
};

const getSelectedProjectKey = () => {
  const selectedProject = document.querySelector('button.selected');
  return selectedProject.dataset.key;
};

const removeEditingClass = () => {
  const editingElem = document.querySelector('.editing');
  editingElem.classList.remove('editing');
};