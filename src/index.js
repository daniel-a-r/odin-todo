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