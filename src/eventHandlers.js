import * as storage from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';
import { da } from 'date-fns/locale';

export const init = () => {
  addProjectListSelectEvent();

  addCreateProjectHandler();
  
  // form submit handlers
  addEditProjectSubmitHandler();
  addEditTodoSubmitHandler();
  addEditChecklistItemSubmitHandler();
  addCreateProjectSubmitHandler()
  addCreateTodoSubmitHandler();

  // add close modal event handlers
  addCloseModalHandler();

  const selectedProject = document.querySelector('.selected');
  if (selectedProject) {
    addMainEventHandlers();
  }
};

const addProjectListSelectEvent = () => {
  const projectList = document.querySelector('.projects-container');
  for (const project of projectList.children) {
    project.addEventListener('click', handleProjectSelect);
  }
};

function handleProjectSelect() {
  const prevSelectedButton = document.querySelector('.selected');

  if (prevSelectedButton) {
    prevSelectedButton.classList.remove('selected');
  }

  htmlHandler.clearMain();
  this.classList.add('selected');
  const newSelectedProjectKey = this.dataset.key;

  const project = storage.getProject(newSelectedProjectKey);
  htmlHandler.createProjectSection(project);
  storage.setSelectedProject(newSelectedProjectKey);
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
  addEditTodoHandler();
  addEditProjectHandler();

  // create handlers 
  addCreateTodoHandler();
};

const addButtonListHandler = (query, handler) => {
  const buttonList = document.querySelectorAll(query);
  for (const button of buttonList) {
    button.addEventListener('click', () => handler(button));
  }
};

// delete handlers
const addProjectDeleteHandler = () => {
  function handleDeleteProject() {
    // get selected project key 
    const selectedProjectKey = getSelectedProjectKey();
    
    // update local storage
    storage.removeProject(selectedProjectKey);
    storage.deleteSelectedProject();
  
    // update frontend
    htmlHandler.deleteProject(storage.getProjectTitles());
  
    // re-add project event listeners
    addProjectListSelectEvent();
  };

  const deleteProjectButton = document.querySelector('.project-title button.delete');
  deleteProjectButton.addEventListener('click', handleDeleteProject);
};

const addTodoDeleteHandler = (key=null) => {
  const handleDeleteTodo = (todoDeleteButton) => {
    // get HTML elements with data keys
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

  let query;

  if (key) {
    query = `.todo[data-key="${key}"] > .todo-title button.delete`;
  } else {
    query = '.todo-title button.delete';
  }

  addButtonListHandler(query, handleDeleteTodo);
};

// refactor to use named parameters
const addChecklistItemDeleteHandler = (query='.checklist-item button.delete') => {
  const handleDeleteChecklistItem = (checklistItemDeleteButton) => {
    // get all keys
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItemDeleteButton);
  
    // update local storage
    storage.removeChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
  
    // update frontend with updated local storage
    const checklist = storage.getChecklist(selectedProjectKey, todoKey);
    htmlHandler.updateChecklist(todoKey, checklist);
  
    // re-add event handlers to delete buttons for checklist items
    const query = `.todo[data-key="${todoKey}"] > .checklist button.delete`;
    addChecklistItemDeleteHandler(query);
  };
  
  addButtonListHandler(query, handleDeleteChecklistItem);
};

// edit handlers
const addCheckboxHandler = (query='input[type="checkbox"]') => {
  const handleCheckboxChange = (checkbox) => {
    const checklistItem = checkbox.closest('.checklist-item');
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItem);
    storage.updateChecklistItemIsDone(selectedProjectKey, todoKey, checklistItemKey);
  };

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
  function handleEditChecklistItemSubmit() {
    const data = new FormData(this);
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
    addChecklistItemDeleteHandler('.editing button.delete');
    addCheckboxHandler('.editing input[type="checkbox"]');
    
    form.reset();
    removeEditingClass();
  };

  const form = document.querySelector('.edit-checklist-item form');
  form.addEventListener('submit', handleEditChecklistItemSubmit);
};

const addEditTodoHandler = (key=null) => {
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

  let query;
  if (key) {
    query = `.todo[data-key="${key}"] > .todo-title button.edit`;
  } else {
    query = '.todo-title button.edit';
  }

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

    const textInputElem = document.querySelector('#project-title');
    textInputElem.value = projObj.title;

    const textareaElem = document.querySelector('#project-desc');
    textareaElem.value = projObj.desc;

    const projectModal = document.querySelector('dialog.edit-project');
    projectModal.showModal();
  }

  const editProjectButton = document.querySelector('.project-title button.edit');
  editProjectButton.addEventListener('click', handleEditProject);
};

const addEditProjectSubmitHandler = () => {
  function handleEditProjectSubmit() {
    const data = new FormData(this);
    const title = data.get('title');
    const desc = (data.get('desc')) ? data.get('desc') : null;
    const selectedProjectKey = getSelectedProjectKey();

    storage.updateProjectTitle(selectedProjectKey, title);
    storage.updateProjectDesc(selectedProjectKey, desc);
    htmlHandler.updateSelectedProject(storage.getProject(selectedProjectKey));

    form.reset();
  }

  const form = document.querySelector('dialog.edit-project form');
  form.addEventListener('submit', handleEditProjectSubmit);
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

// create handlers 
const addCreateProjectHandler = () => {
  function handleCreateProject() {
    const addProjectModal = document.querySelector('dialog.add-project');
    addProjectModal.showModal();
  }

  const createProjectButton = document.querySelector('button.add-project');
  createProjectButton.addEventListener('click', handleCreateProject);
};

const addCreateProjectSubmitHandler = () => {
  function handleAddProjectSubmit() {
    const data = new FormData(this);
    const title = data.get('title');
    const desc = (data.get('desc')) ? data.get('desc') : null;

    storage.createProject(title, desc);
    const lastProj = storage.getLastProject();
    const projBtn = htmlHandler.appendProjectButton(lastProj.title, storage.getLastProjectIndex());
    projBtn.addEventListener('click', handleProjectSelect);
    this.reset();
  }

  const form = document.querySelector('dialog.add-project form');
  form.addEventListener('submit', handleAddProjectSubmit);
};

const addCreateTodoHandler = () => {
  function handleAddTodo() {
    const addTodoModal = document.querySelector('dialog.add-todo');
    addTodoModal.showModal();
  }

  const addTodoBtn = document.querySelector('button.add-todo');
  addTodoBtn.addEventListener('click', handleAddTodo);
};

const addCreateTodoSubmitHandler = () => {
  const handleAddTodoSubmit = () => {
    const data = new FormData(form);
    const title = data.get('title');

    const selectedProjectKey = getSelectedProjectKey();
    storage.createTodo(selectedProjectKey, title);
    const lastTodo = storage.getLastTodo(selectedProjectKey);
    const todoElem = htmlHandler.appendTodo(lastTodo, storage.getLastTodoIndex(selectedProjectKey));
    addEditTodoHandler(todoElem.dataset.key);
    addTodoDeleteHandler(todoElem.dataset.key);

    form.reset();
  };

  const form = document.querySelector('dialog.add-todo form');
  form.addEventListener('submit', handleAddTodoSubmit);
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

const getSelectedProjectKey = () => {
  const selectedProject = document.querySelector('button.selected');
  return selectedProject.dataset.key;
};

const removeEditingClass = () => {
  const editingElem = document.querySelector('.editing');
  if (editingElem) {
    editingElem.classList.remove('editing');
  }
};