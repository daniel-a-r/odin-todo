import * as storage from './storageHandlers.js';
import * as htmlHandler from './htmlHandlers.js';

export const init = () => {
  addProjectListSelectEvent();

  addCreateProjectHandler();
  
  // form submit handlers
  addEditProjectSubmitHandler();
  addEditTodoSubmitHandler();
  addEditChecklistItemSubmitHandler();
  addCreateProjectSubmitHandler()
  addCreateTodoSubmitHandler();
  addCreateChecklistItemSubmitHandler();

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
  addDeleteChecklistItemHandler();

  // edit handlers
  addCheckboxHandler();
  addEditChecklistItemHandler();
  addEditTodoHandler();
  addEditProjectHandler();

  // create handlers 
  addCreateTodoHandler();
  addCreateChecklistItemHandler();
};

const addButtonListHandler = (query, handler) => {
  const buttonList = document.querySelectorAll(query);
  for (const button of buttonList) {
    button.addEventListener('click', handler);
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
  function handleDeleteTodo() {
    // get HTML elements with data keys
    const todoElem = this.closest('.todo');
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

const addDeleteChecklistItemHandler = (todoKey=null, checklistItemKey=null) => {
  function handleDeleteChecklistItem() {
    // get all keys
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(this);
  
    // update local storage
    storage.removeChecklistItem(selectedProjectKey, todoKey, checklistItemKey);
  
    // update frontend with updated local storage
    const checklist = storage.getChecklist(selectedProjectKey, todoKey);
    htmlHandler.updateChecklist(todoKey, checklist);
  
    // re-add event handlers to delete/edit buttons for checklist items
    const baseQuery = `.todo[data-key="${todoKey}"] > .checklist button.`;
    const deleteBtnQuery = `${baseQuery}delete`;
    const editBtnQuery = `${baseQuery}edit`;

    addDeleteChecklistItemHandler(deleteBtnQuery);
    addEditChecklistItemHandler(editBtnQuery);
  };

  let query;

  if (todoKey && checklistItemKey) {
    query = `.todo[data-key="${todoKey}"] .checklist-item[data-key="${checklistItemKey}"] button.delete`;
  } else {
    query = '.checklist-item button.delete';
  }
  
  addButtonListHandler(query, handleDeleteChecklistItem);
};

// edit handlers
const addCheckboxHandler = (todoKey=null, checklistItemKey=null) => {
  function handleCheckboxChange() {
    const checklistItem = this.closest('.checklist-item');
    const { selectedProjectKey, todoKey, checklistItemKey } = getAllKeys(checklistItem);
    storage.updateChecklistItemIsDone(selectedProjectKey, todoKey, checklistItemKey);
  };

  let query;

  if (todoKey && checklistItemKey) {
    query = `.todo[data-key="${todoKey}"] .checklist-item[data-key="${checklistItemKey}"] input[type="checkbox"]`;
  } else {
    query = 'input[type="checkbox"]';
  }

  const checkboxList = document.querySelectorAll(query);
  for (const checkbox of checkboxList) {
    checkbox.addEventListener('change', handleCheckboxChange);
  }
};

const addEditChecklistItemHandler = (todoKey=null, checklistItemKey=null) => {
  function handleEditChecklistItem() {
    const checklistItem = this.closest('.checklist-item');
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

  let query;

  if (todoKey && checklistItemKey) {
    query = `.todo[data-key="${todoKey}"] .checklist-item[data-key="${checklistItemKey}"] button.edit`;
  } else {
    query = '.checklist-item button.edit';
  }

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
    addDeleteChecklistItemHandler('.editing button.delete');
    addCheckboxHandler('.editing input[type="checkbox"]');
    
    form.reset();
    removeEditingClass();
  };

  const form = document.querySelector('.edit-checklist-item form');
  form.addEventListener('submit', handleEditChecklistItemSubmit);
};

const addEditTodoHandler = (key=null) => {
  function handleEditTodo() {
    const todoElem = this.closest('.todo')
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
    const todoKey = todoElem.dataset.key;
    addEditTodoHandler(todoKey);
    addTodoDeleteHandler(todoKey);
    addCreateChecklistItemHandler(todoKey);

    form.reset();
  };

  const form = document.querySelector('dialog.add-todo form');
  form.addEventListener('submit', handleAddTodoSubmit);
};

const addCreateChecklistItemHandler = (todoKey=null) => {
  function handleCreateChecklistItem() {
    const todoElem = this.closest('.todo');
    const todoKey = todoElem.dataset.key;
    const addChecklistItemModal = document.querySelector('dialog.add-checklist-item');

    addChecklistItemModal.dataset.todoKey = todoKey;
    addChecklistItemModal.showModal();
  }

  let query;
  if (todoKey) {
    query = `.todo[data-key="${todoKey}"] button.add-checklist-item`;
  } else {
    query = 'button.add-checklist-item';
  }
  
  addButtonListHandler(query, handleCreateChecklistItem);
};

const addCreateChecklistItemSubmitHandler = () => {
  function handleAddChecklistItemSubmit() {
    const data = new FormData(form);
    const title = data.get('title');
    const dueDate = data.get('due-date');
    const priority = data.get('priority');

    const addChecklistItemModal = document.querySelector('dialog.add-checklist-item');
    const todoKey = addChecklistItemModal.dataset.todoKey;
    const selectedProjectKey = getSelectedProjectKey();

    storage.createChecklistItem(selectedProjectKey, todoKey, title, dueDate, priority);
    const lastChecklistItem = storage.getLastChecklistItem(selectedProjectKey, todoKey);
    const lastChecklistItemIndx = storage.getLastChecklistItemIndex(selectedProjectKey, todoKey);
    const checklistItemElem = htmlHandler.appendChecklistItem(todoKey, lastChecklistItem, lastChecklistItemIndx);
    const checklistItemKey = checklistItemElem.dataset.key;

    // add checkbox, edit, and delete handlers
    addCheckboxHandler(todoKey, checklistItemKey);
    addDeleteChecklistItemHandler(todoKey, checklistItemKey);
    addEditChecklistItemHandler(todoKey, checklistItemKey);

    form.reset();
  };

  const form = document.querySelector('dialog.add-checklist-item form');
  form.addEventListener('submit', handleAddChecklistItemSubmit);
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