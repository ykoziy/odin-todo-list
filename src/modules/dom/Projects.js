import Project from '../Project';
import PubSub from 'pubsub-js';

function updateProjects(msg, data) {
    console.log('projects changed, need to refresh.');
    const ul = document.querySelector('#projects ul');
    ul.innerHTML = renderProjects(data);
}

function renderProjects(projects) {
    return `${projects.map(proj => `<li><div class="circle-status"></div>${proj.title}</li>`).join('')}`;
}

function setProgress(percent, circleElement) {
  let angle = percent * 3.6;
  let secondGradient = 'linear-gradient(-90deg, green 50%, transparent 50%';
  if (percent > 100) {
      percent = 100;
  }
  if (percent <= 50) {
        circleElement.style.backgroundImage = `linear-gradient(${angle - 90}deg, white 50%, transparent 50%), ${secondGradient})`;
  } else {
        circleElement.style.backgroundImage = `linear-gradient(${angle - 270}deg, green 50%, transparent 50%), ${secondGradient})`;
  }
}

function generateMarkup(projects) {
    return `
    <div id="projects">
    <ul>
    ${renderProjects(projects)}
    </ul>
    </div>`;    
}


function renderHTML(projects) {

    PubSub.subscribe('projectsUpdated', (msg, data) => updateProjects(msg, data));   
    return generateMarkup(projects);
}

export { renderHTML };