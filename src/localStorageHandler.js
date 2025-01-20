import * as todo from './objHandler.js';

const init = () => {
  // if key 'projects' does not exist, create default item
  // else, print to console
  if (!localStorage.getItem('projects')) {
    const projList = [];
    const proj = new todo.Project('My Project');
    projList.push(proj);
    localStorage.setItem('projects', JSON.stringify(projList));
  } else {
    const projects = JSON.parse(localStorage.getItem('projects'));
    console.log(projects);
    projects.forEach((project) => {
      console.log(project);
    });
  }
}

init();

todo.createProject('first project');
todo.createTodo(0, 'first todo');
todo.createChecklistItem(0, 0, 'first checklist item');
todo.createChecklistItem(0, 0, 'second checklist item');
todo.createChecklistItem(0, 0, 'third checklist item');

// console.log(todo.projectList);

// const proj = new Project('hello');
// proj.title = 'world';
// console.log(proj.title);