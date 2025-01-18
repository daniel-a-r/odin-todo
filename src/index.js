import './main.css'
import { Project, Todo, ChecklistItem } from './objs.js'

const proj = new Project('hello');
proj.title = 'world';
console.log(proj.title);

// if key 'projects' does not exist, create default item
// else, print to console
if (!localStorage.getItem('projects')) {
  localStorage.setItem('projects', JSON.stringify(['project1', 'project2', 'project3']));
} else {
  const projects = JSON.parse(localStorage.getItem('projects'));
  console.log(projects);
  projects.forEach((project) => {
    console.log(project);
  });
}