import PubSub from 'pubsub-js';

function updateProjects(msg, data) {
    const ul = document.querySelector('#projects ul');
    ul.innerHTML = renderProjects(data);
}

function updateProjectProgress(msg, data) {
    const div = document.querySelector(`li[data-idx="${data.projectID}"] div`);
    div.style.cssText = setProgress(data.project.getPercentComplete());
}

function renderProjects(projects) {
    const listItem = document.createElement('div');
    listItem.classList.add('cicrle-status');
    let html = '<div id="projects-title"><h3>Projects</h3></div>';
    html += `${
        projects.map((proj, idx) => {
            const style = setProgress(proj.getPercentComplete());
            return `<li data-idx="${idx}"><div class="circle-status" style="${style}"></div><p>${proj.title}</p></li>`
        }).join('')
    }`;
    return html;
}

function setProgress(percent) {
  let angle = percent * 3.6;
  let secondGradient = 'linear-gradient(-90deg, #db4c3f 50%, transparent 50%';
  let style = 'background-image: ';
  if (percent > 100) {
      percent = 100;
  }
  if (percent <= 50) {
        style += `linear-gradient(${angle - 90}deg, white 50%, transparent 50%), ${secondGradient})`;
  } else {
        style += `linear-gradient(${angle - 270}deg, #db4c3f 50%, transparent 50%), ${secondGradient})`;
  }
  return style;
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
    PubSub.subscribe('projectUpdateProgress', (msg, data) => updateProjectProgress(msg, data));    
    return generateMarkup(projects);
}

export { renderHTML };