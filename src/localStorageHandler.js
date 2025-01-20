import { Project, Todo, ChecklistItem, projectList } from './todo.js';

// const proj = new Project('hello');
// proj.title = 'world';
// console.log(proj.title);

const checklistItem = new ChecklistItem('my first checklist item!');
console.log(checklistItem);
console.log(JSON.stringify(checklistItem));

localStorage.setItem('test', JSON.stringify(checklistItem));
const retrievedItem = localStorage.getItem('test');
console.log(retrievedItem);
console.log(JSON.parse(retrievedItem));


// if key 'projects' does not exist, create default item
// else, print to console
// if (!localStorage.getItem('projects')) {
//   localStorage.setItem('projects', JSON.stringify(['project1', 'project2', 'project3']));
// } else {
//   const projects = JSON.parse(localStorage.getItem('projects'));
//   console.log(projects);
//   projects.forEach((project) => {
//     console.log(project);
//   });
// }